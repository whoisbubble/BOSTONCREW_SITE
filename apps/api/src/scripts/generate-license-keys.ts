import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import { generateLicenseKey } from '../common/tokens';

function loadEnv() {
  const candidates = Array.from(
    new Set([
      resolve(process.cwd(), '.env'),
      resolve(process.cwd(), '..', '..', '.env'),
      resolve(__dirname, '..', '..', '.env'),
      resolve(__dirname, '..', '..', '..', '..', '.env'),
    ]),
  );

  for (const envPath of candidates) {
    if (existsSync(envPath)) {
      config({ path: envPath, override: false, quiet: true });
    }
  }
}

loadEnv();

const prisma = new PrismaClient();

function printUsage() {
  console.error('Usage: npm run licenses:generate -- <count>');
  console.error('Example: npm run licenses:generate -- 10');
}

function parseCount(rawCount: string | undefined) {
  if (!rawCount) {
    printUsage();
    process.exit(1);
  }

  const count = Number(rawCount);

  if (!Number.isInteger(count) || count < 1) {
    console.error('Count must be a positive integer.');
    printUsage();
    process.exit(1);
  }

  return count;
}

async function createUniqueLicenseKey() {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const key = generateLicenseKey();
    const existingLicense = await prisma.license.findUnique({
      where: { key },
      select: { id: true },
    });

    if (!existingLicense) {
      return key;
    }
  }

  throw new Error('Could not generate a unique license key after several attempts.');
}

async function main() {
  const count = parseCount(process.argv[2]);

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set. Put it in .env or pass it through PM2 env.');
  }

  const createdKeys: string[] = [];

  for (let index = 0; index < count; index += 1) {
    const key = await createUniqueLicenseKey();
    const license = await prisma.license.create({
      data: { key },
      select: { key: true },
    });

    createdKeys.push(license.key);
  }

  console.log(`Generated ${createdKeys.length} license key(s):`);
  for (const key of createdKeys) {
    console.log(key);
  }
}

main()
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : 'Unknown error.';

    console.error(`Failed to generate license keys: ${message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
