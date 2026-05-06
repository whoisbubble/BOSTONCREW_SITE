CREATE TABLE "Payment" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "publicId" TEXT NOT NULL,
  "accessToken" TEXT NOT NULL,
  "providerTransactionId" TEXT,
  "providerStatus" TEXT,
  "amount" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'RUB',
  "customerEmail" TEXT,
  "description" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "confirmedAt" DATETIME,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "PaymentEvent" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "paymentId" TEXT,
  "providerTransactionId" TEXT,
  "status" TEXT NOT NULL,
  "payload" TEXT NOT NULL,
  "headers" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PaymentEvent_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "License" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "key" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'NEW',
  "deviceFingerprint" TEXT,
  "activatedAt" DATETIME,
  "lastCheckAt" DATETIME,
  "paymentId" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "License_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "Payment_publicId_key" ON "Payment" ("publicId");
CREATE UNIQUE INDEX "Payment_providerTransactionId_key" ON "Payment" ("providerTransactionId");
CREATE UNIQUE INDEX "License_key_key" ON "License" ("key");
CREATE UNIQUE INDEX "License_paymentId_key" ON "License" ("paymentId");
