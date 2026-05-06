import { BadGatewayException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Payment, PaymentStatus, Prisma } from '@prisma/client';
import { generateLicenseKey, randomToken } from '../common/tokens';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { PlategaWebhookDto } from './dto/platega-webhook.dto';
import { PlategaService, PlategaTransactionResponse } from './platega.service';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly plategaService: PlategaService,
  ) {}

  async createCheckout(dto: CreateCheckoutDto) {
    const amount = Number(this.configService.get<string>('PRODUCT_PRICE_RUB') ?? 500);
    const currency = 'RUB';
    const accessToken = randomToken();
    const payment = await this.prisma.payment.create({
      data: {
        accessToken,
        amount,
        currency,
        customerEmail: dto.customerEmail,
        description: 'BOSTONCREW SAMPLER license for one device',
      },
    });
    const urls = this.urls(payment.publicId, accessToken);

    try {
      const plategaPayment = await this.plategaService.createPaymentLink({
        paymentMethod: Number(this.configService.get<string>('PLATEGA_PAYMENT_METHOD') ?? 2),
        paymentDetails: {
          amount,
          currency,
        },
        description: 'Ключ BOSTONCREW SAMPLER на одно устройство',
        return: urls.returnUrl,
        failedUrl: urls.failedUrl,
        payload: JSON.stringify({
          product: 'bostoncrew-sampler',
          orderId: payment.publicId,
        }),
      });

      const updatedPayment = await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          providerTransactionId: plategaPayment.transactionId,
          providerStatus: plategaPayment.status,
        },
      });

      return {
        orderId: updatedPayment.publicId,
        checkoutUrl: plategaPayment.redirect,
        statusUrl: urls.statusUrl,
        transactionId: plategaPayment.transactionId,
        status: updatedPayment.status,
        amount,
        currency,
      };
    } catch (error) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.FAILED },
      });

      if (error instanceof BadGatewayException) {
        throw error;
      }

      throw error;
    }
  }

  async getOrder(publicId: string, token: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { publicId },
      include: { license: true },
    });

    if (!payment) {
      throw new NotFoundException('Order not found');
    }

    if (payment.accessToken !== token) {
      throw new ForbiddenException('Invalid order token');
    }

    const refreshedPayment = await this.refreshPaymentIfPending(payment);

    return {
      orderId: refreshedPayment.publicId,
      status: refreshedPayment.status,
      amount: refreshedPayment.amount,
      currency: refreshedPayment.currency,
      licenseKey: refreshedPayment.license?.key ?? null,
      licenseStatus: refreshedPayment.license?.status ?? null,
      confirmedAt: refreshedPayment.confirmedAt,
      message: this.orderMessage(refreshedPayment.status),
    };
  }

  async handlePlategaWebhook(headers: Record<string, string | string[] | undefined>, body: PlategaWebhookDto) {
    this.plategaService.verifyWebhookHeaders(headers);

    const payment = await this.prisma.payment.findUnique({
      where: { providerTransactionId: body.id },
      include: { license: true },
    });

    await this.prisma.paymentEvent.create({
      data: {
        paymentId: payment?.id,
        providerTransactionId: body.id,
        status: body.status,
        payload: JSON.stringify(body),
        headers: JSON.stringify({
          xMerchantId: this.headerValue(headers, 'x-merchantid') ?? this.headerValue(headers, 'x-merchant-id'),
        }),
      },
    });

    if (!payment) {
      return { ok: true, ignored: true };
    }

    if (body.status === 'CONFIRMED' && (body.amount !== payment.amount || body.currency !== payment.currency)) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.FAILED,
          providerStatus: body.status,
        },
      });

      return { ok: true, rejected: 'amount_or_currency_mismatch' };
    }

    await this.applyProviderStatus(payment.id, body.status);

    return { ok: true };
  }

  private async refreshPaymentIfPending(payment: Payment & { license: { key: string; status: string } | null }) {
    if (payment.status !== PaymentStatus.PENDING || !payment.providerTransactionId) {
      return payment;
    }

    try {
      const transaction = await this.plategaService.getTransaction(payment.providerTransactionId);
      await this.applyProviderStatus(payment.id, transaction.status, transaction);

      const refreshed = await this.prisma.payment.findUniqueOrThrow({
        where: { id: payment.id },
        include: { license: true },
      });

      return refreshed;
    } catch {
      return payment;
    }
  }

  private async applyProviderStatus(paymentId: string, providerStatus: string, payload?: PlategaTransactionResponse) {
    const status = this.mapProviderStatus(providerStatus);

    if (payload) {
      await this.prisma.paymentEvent.create({
        data: {
          paymentId,
          providerTransactionId: payload.id,
          status: payload.status,
          payload: JSON.stringify(payload),
        },
      });
    }

    if (status === PaymentStatus.CONFIRMED) {
      return this.confirmPayment(paymentId, providerStatus);
    }

    if (status === PaymentStatus.CHARGEBACKED) {
      return this.prisma.$transaction(async (tx) => {
        const payment = await tx.payment.update({
          where: { id: paymentId },
          data: {
            status,
            providerStatus,
          },
          include: { license: true },
        });

        if (payment.license) {
          await tx.license.update({
            where: { id: payment.license.id },
            data: { status: 'REFUNDED' },
          });
        }

        return payment;
      });
    }

    return this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status,
        providerStatus,
      },
    });
  }

  private async confirmPayment(paymentId: string, providerStatus: string) {
    return this.prisma.$transaction(async (tx) => {
      const current = await tx.payment.findUniqueOrThrow({
        where: { id: paymentId },
        include: { license: true },
      });

      let license = current.license;

      if (!license) {
        license = await tx.license.create({
          data: {
            key: generateLicenseKey(),
            paymentId: current.id,
          },
        });
      }

      return tx.payment.update({
        where: { id: paymentId },
        data: {
          status: PaymentStatus.CONFIRMED,
          providerStatus,
          confirmedAt: current.confirmedAt ?? new Date(),
        },
        include: { license: true },
      });
    });
  }

  private mapProviderStatus(providerStatus: string): PaymentStatus {
    const normalized = providerStatus.toUpperCase();

    if (normalized === 'CONFIRMED') {
      return PaymentStatus.CONFIRMED;
    }

    if (normalized === 'CHARGEBACK' || normalized === 'CHARGEBACKED') {
      return PaymentStatus.CHARGEBACKED;
    }

    if (normalized === 'EXPIRED') {
      return PaymentStatus.EXPIRED;
    }

    if (normalized === 'FAILED') {
      return PaymentStatus.FAILED;
    }

    if (normalized === 'CANCELED') {
      return PaymentStatus.CANCELED;
    }

    return PaymentStatus.PENDING;
  }

  private urls(orderId: string, token: string) {
    const siteUrl = (this.configService.get<string>('PUBLIC_SITE_URL') ?? 'https://bostoncrew.ru').replace(/\/$/, '');
    const returnBase = (this.configService.get<string>('PLATEGA_RETURN_URL') ?? `${siteUrl}/success`).replace(/\/$/, '');
    const failedBase = (this.configService.get<string>('PLATEGA_FAILED_URL') ?? `${siteUrl}/cancel`).replace(/\/$/, '');

    const params = new URLSearchParams({ orderId, token });

    return {
      returnUrl: `${returnBase}?${params.toString()}`,
      failedUrl: `${failedBase}?${params.toString()}`,
      statusUrl: `${siteUrl}/success?${params.toString()}`,
    };
  }

  private orderMessage(status: PaymentStatus) {
    const messages: Record<PaymentStatus, string> = {
      PENDING: 'Ожидаем подтверждение оплаты от Platega.',
      CONFIRMED: 'Оплата подтверждена. Ключ готов к активации.',
      CANCELED: 'Платеж отменен.',
      CHARGEBACKED: 'Платеж возвращен. Ключ отключен.',
      FAILED: 'Платеж не прошел проверку.',
      EXPIRED: 'Срок оплаты истек.',
    };

    return messages[status];
  }

  private headerValue(headers: Record<string, string | string[] | undefined>, name: string) {
    const value = headers[name] ?? headers[name.toLowerCase()];

    return Array.isArray(value) ? value[0] : value;
  }
}
