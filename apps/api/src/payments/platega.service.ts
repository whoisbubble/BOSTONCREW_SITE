import { BadGatewayException, Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { safeEqual } from '../common/tokens';

type PlategaCreateRequest = {
  paymentMethod: number;
  paymentDetails: {
    amount: number;
    currency: string;
  };
  description: string;
  return: string;
  failedUrl: string;
  payload: string;
};

export type PlategaCreateResponse = {
  paymentMethod: string;
  transactionId: string;
  redirect: string;
  return: string;
  paymentDetails: string;
  status: string;
  expiresIn: string;
  merchantId: string;
  usdtRate?: number;
};

export type PlategaTransactionResponse = {
  id: string;
  status: string;
  paymentDetails?: {
    amount: number;
    currency: string;
  };
  payload?: string;
};

@Injectable()
export class PlategaService {
  constructor(private readonly configService: ConfigService) {}

  async createPaymentLink(request: PlategaCreateRequest) {
    this.assertConfigured();

    const response = await fetch(`${this.baseUrl}/transaction/process`, {
      method: 'POST',
      headers: this.authHeaders,
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new BadGatewayException(`Platega payment link failed with HTTP ${response.status}`);
    }

    return (await response.json()) as PlategaCreateResponse;
  }

  async getTransaction(transactionId: string) {
    this.assertConfigured();

    const response = await fetch(`${this.baseUrl}/transaction/${transactionId}`, {
      method: 'GET',
      headers: this.authHeaders,
    });

    if (!response.ok) {
      throw new BadGatewayException(`Platega status check failed with HTTP ${response.status}`);
    }

    return (await response.json()) as PlategaTransactionResponse;
  }

  verifyWebhookHeaders(headers: Record<string, string | string[] | undefined>) {
    const merchantId = this.headerValue(headers, 'x-merchantid') ?? this.headerValue(headers, 'x-merchant-id');
    const secret = this.headerValue(headers, 'x-secret');

    if (!safeEqual(merchantId, this.merchantId) || !safeEqual(secret, this.secret)) {
      throw new UnauthorizedException('Invalid Platega webhook headers');
    }
  }

  private get authHeaders() {
    return {
      'Content-Type': 'application/json',
      'X-MerchantId': this.merchantId,
      'X-Secret': this.secret,
    };
  }

  private get baseUrl() {
    return (this.configService.get<string>('PLATEGA_BASE_URL') ?? 'https://app.platega.io').replace(/\/$/, '');
  }

  private get merchantId() {
    return this.configService.get<string>('PLATEGA_MERCHANT_ID') ?? '';
  }

  private get secret() {
    return this.configService.get<string>('PLATEGA_SECRET') ?? '';
  }

  private assertConfigured() {
    if (!this.merchantId || !this.secret) {
      throw new ServiceUnavailableException('Platega credentials are not configured');
    }
  }

  private headerValue(headers: Record<string, string | string[] | undefined>, name: string) {
    const value = headers[name] ?? headers[name.toLowerCase()];

    return Array.isArray(value) ? value[0] : value;
  }
}
