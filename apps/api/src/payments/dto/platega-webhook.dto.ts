import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class PlategaWebhookDto {
  @ApiProperty({ example: '497f6eca-6276-4993-bfeb-53cbbbba6f08' })
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({ example: 500 })
  @IsInt()
  amount!: number;

  @ApiProperty({ example: 'RUB' })
  @IsString()
  currency!: string;

  @ApiProperty({ example: 'CONFIRMED' })
  @IsString()
  @IsIn(['PENDING', 'CONFIRMED', 'CANCELED', 'FAILED', 'EXPIRED', 'CHARGEBACK', 'CHARGEBACKED'])
  status!: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  paymentMethod!: number;
}
