import { Body, Controller, Get, Headers, HttpCode, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { PlategaWebhookDto } from './dto/platega-webhook.dto';
import { PaymentsService } from './payments.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('checkout')
  @ApiOperation({ summary: 'Создать заказ и ссылку Platega на оплату ключа' })
  createCheckout(@Body() dto: CreateCheckoutDto) {
    return this.paymentsService.createCheckout(dto);
  }

  @Get('orders/:publicId')
  @ApiOperation({ summary: 'Получить статус заказа и ключ после успешной оплаты' })
  @ApiQuery({ name: 'token', required: true })
  getOrder(@Param('publicId') publicId: string, @Query('token') token: string) {
    return this.paymentsService.getOrder(publicId, token);
  }

  @Post('platega/webhook')
  @HttpCode(200)
  @ApiOperation({ summary: 'Webhook Platega. Указать URL в личном кабинете Platega.' })
  handleWebhook(@Headers() headers: Record<string, string | string[] | undefined>, @Body() body: PlategaWebhookDto) {
    return this.paymentsService.handlePlategaWebhook(headers, body);
  }
}
