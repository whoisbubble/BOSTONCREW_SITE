import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class LicenseRequestDto {
  @ApiProperty({ example: 'BCS-ABCD-EFGH-2345-JKLM' })
  @IsString()
  @MinLength(12)
  @MaxLength(64)
  licenseKey!: string;

  @ApiProperty({
    description: 'Стабильный SHA-256 fingerprint устройства. Не отправляйте серийники в сыром виде.',
    example: 'sha256:7f6f9c0f5e2a...',
  })
  @IsString()
  @MinLength(16)
  @MaxLength(256)
  deviceFingerprint!: string;

  @ApiPropertyOptional({ example: '1.0.0' })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  appVersion?: string;
}
