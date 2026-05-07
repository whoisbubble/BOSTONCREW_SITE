import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LicenseStatus } from '@prisma/client';
import { createOfflineLicenseToken } from '../common/tokens';
import { PrismaService } from '../prisma/prisma.service';
import { LicenseRequestDto } from './dto/license-request.dto';

@Injectable()
export class LicensesService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async activate(dto: LicenseRequestDto) {
    const license = await this.findLicense(dto.licenseKey);
    const deviceFingerprint = this.normalizeFingerprint(dto.deviceFingerprint);
    const now = new Date();

    if (license.status === LicenseStatus.NEW) {
      const activatedLicense = await this.prisma.license.update({
        where: { id: license.id },
        data: {
          status: LicenseStatus.ACTIVATED,
          deviceFingerprint,
          activatedAt: now,
          lastCheckAt: now,
        },
      });

      return this.allowedResponse(activatedLicense);
    }

    this.assertUsableLicense(license.status);

    if (license.deviceFingerprint !== deviceFingerprint) {
      throw new ConflictException({
        allowed: false,
        code: 'DEVICE_MISMATCH',
        message: 'Ключ уже активирован на другом устройстве.',
      });
    }

    const refreshedLicense = await this.prisma.license.update({
      where: { id: license.id },
      data: { lastCheckAt: now },
    });

    return this.allowedResponse(refreshedLicense);
  }

  async check(dto: LicenseRequestDto) {
    const license = await this.findLicense(dto.licenseKey);
    const deviceFingerprint = this.normalizeFingerprint(dto.deviceFingerprint);

    this.assertUsableLicense(license.status);

    if (license.status !== LicenseStatus.ACTIVATED || license.deviceFingerprint !== deviceFingerprint) {
      throw new ForbiddenException({
        allowed: false,
        code: license.status === LicenseStatus.NEW ? 'LICENSE_NOT_ACTIVATED' : 'DEVICE_MISMATCH',
        message: 'Лицензия не активирована на этом устройстве.',
      });
    }

    const refreshedLicense = await this.prisma.license.update({
      where: { id: license.id },
      data: { lastCheckAt: new Date() },
    });

    return this.allowedResponse(refreshedLicense);
  }

  private async findLicense(licenseKey: string) {
    const normalizedKey = this.normalizeKey(licenseKey);
    const license = await this.prisma.license.findUnique({
      where: { key: normalizedKey },
    });

    if (!license) {
      throw new NotFoundException({
        allowed: false,
        code: 'LICENSE_NOT_FOUND',
        message: 'Ключ не найден.',
      });
    }

    return license;
  }

  private allowedResponse(license: {
    key: string;
    status: LicenseStatus;
    deviceFingerprint: string | null;
    activatedAt: Date | null;
    lastCheckAt: Date | null;
  }) {
    const issuedAt = new Date().toISOString();
    const offlinePayload = {
      product: 'BOSTONCREW_SAMPLER',
      licenseKey: license.key,
      status: license.status.toLowerCase(),
      deviceFingerprint: license.deviceFingerprint,
      issuedAt,
      offline: true,
    };

    return {
      allowed: true,
      license: {
        key: license.key,
        status: license.status.toLowerCase(),
        deviceFingerprint: license.deviceFingerprint,
        activatedAt: license.activatedAt,
        lastCheckAt: license.lastCheckAt,
      },
      offline: {
        token: createOfflineLicenseToken(offlinePayload, this.tokenSecret),
        issuedAt,
      },
    };
  }

  private assertUsableLicense(status: LicenseStatus) {
    if (status === LicenseStatus.REVOKED || status === LicenseStatus.REFUNDED) {
      throw new ForbiddenException({
        allowed: false,
        code: status === LicenseStatus.REVOKED ? 'LICENSE_REVOKED' : 'LICENSE_REFUNDED',
        message: 'Ключ отключен.',
      });
    }
  }

  private normalizeKey(licenseKey: string) {
    return licenseKey.trim().toUpperCase();
  }

  private normalizeFingerprint(deviceFingerprint: string) {
    return deviceFingerprint.trim().toLowerCase();
  }

  private get tokenSecret() {
    return this.configService.get<string>('LICENSE_TOKEN_SECRET') ?? 'development-only-change-me';
  }
}
