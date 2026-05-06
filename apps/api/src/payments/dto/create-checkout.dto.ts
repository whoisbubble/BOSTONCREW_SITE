import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, MaxLength } from 'class-validator';

export class CreateCheckoutDto {
  @ApiPropertyOptional({
    description: 'Email покупателя. Нужен только для ручной поддержки, ключ возвращается на странице успеха.',
    example: 'client@example.com',
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(180)
  customerEmail?: string;
}
