import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('public')
@Controller('public')
export class PublicConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get('config')
  @ApiOperation({ summary: 'Публичные настройки сайта: цена и валюта' })
  getConfig() {
    return {
      productPriceRub: Number(this.configService.get<string>('PRODUCT_PRICE_RUB') ?? 500),
      currency: 'RUB',
    };
  }
}
