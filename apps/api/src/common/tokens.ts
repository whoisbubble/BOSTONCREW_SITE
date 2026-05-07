import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

const LICENSE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function randomToken(bytes = 32) {
  return randomBytes(bytes).toString('base64url');
}

export function generateLicenseKey() {
  const group = (length: number) =>
    Array.from({ length }, () => LICENSE_ALPHABET[randomBytes(1)[0] % LICENSE_ALPHABET.length]).join('');

  return `BCS-${group(4)}-${group(4)}-${group(4)}-${group(4)}`;
}

export function safeEqual(left?: string, right?: string) {
  if (!left || !right) {
    return false;
  }

  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function createOfflineLicenseToken(payload: Record<string, unknown>, secret: string) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const digest = createHmac('sha256', secret).update(encodedPayload).digest('base64url');

  return `${encodedPayload}.${digest}`;
}
