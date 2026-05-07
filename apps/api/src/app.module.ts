import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LicensesModule } from './licenses/licenses.module';
import { PaymentsModule } from './payments/payments.module';
import { PrismaModule } from './prisma/prisma.module';
import { PublicConfigController } from './public-config.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    PrismaModule,
    PaymentsModule,
    LicensesModule,
  ],
  controllers: [PublicConfigController],
})
export class AppModule {}
