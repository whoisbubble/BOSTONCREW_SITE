# BOSTONCREW SAMPLER Site

Монорепозиторий для продажи ключей BOSTONCREW SAMPLER:

- `apps/web` - Next.js сайт на домене `bostoncrew.ru`;
- `apps/api` - Nest API для Platega webhook, выдачи ключей и активации desktop-приложения;
- база по умолчанию - Prisma + SQLite, чтобы проект можно было быстро поднять на VPS.

Стоимость ключа задается переменной `PRODUCT_PRICE_RUB`, по умолчанию `500`.

## Сценарий

1. Пользователь нажимает оплату на сайте.
2. Next вызывает `POST /api/payments/checkout`.
3. Nest создает локальный заказ, отправляет запрос в Platega `/transaction/process` и возвращает `checkoutUrl`.
4. Пользователь оплачивает на стороне Platega.
5. Platega отправляет webhook на `https://bostoncrew.ru/api/payments/platega/webhook`.
6. Nest проверяет `X-MerchantId` и `X-Secret`, подтверждает сумму, создает ключ вида `BCS-XXXX-XXXX-XXXX-XXXX`.
7. Страница `/success` показывает ключ.
8. Приложение отправляет ключ и `deviceFingerprint` в `POST /api/licenses/activate`.
9. API переводит ключ из `new` в `activated`, сохраняет fingerprint и возвращает offline-token.

## Переменные окружения

Скопируйте `.env.example` в `.env` в корне проекта или в `apps/api/.env`.

```env
PUBLIC_SITE_URL="https://bostoncrew.ru"
API_PUBLIC_URL="https://bostoncrew.ru"
NEXT_PUBLIC_API_URL="https://bostoncrew.ru/api"

API_PORT=4000
CORS_ORIGIN="https://bostoncrew.ru,http://localhost:3000"
DATABASE_URL="file:./dev.db"
PRODUCT_PRICE_RUB=500
LICENSE_SIGNING_SECRET="replace-with-a-long-random-secret"

PLATEGA_BASE_URL="https://app.platega.io"
PLATEGA_MERCHANT_ID=""
PLATEGA_SECRET=""
PLATEGA_PAYMENT_METHOD=2
PLATEGA_CALLBACK_URL="https://bostoncrew.ru/api/payments/platega/webhook"
PLATEGA_RETURN_URL="https://bostoncrew.ru/success"
PLATEGA_FAILED_URL="https://bostoncrew.ru/cancel"
```

В личном кабинете Platega в Callback URLs укажите:

```text
https://bostoncrew.ru/api/payments/platega/webhook
```

Platega требует публичный HTTPS-домен и корректный SSL-сертификат.

## Локальный запуск

```bash
npm install
npm run prisma:generate
npm run prisma:migrate -w apps/api
npm run dev:api
npm run dev:web
```

Если на Windows в пути с кириллицей `prisma migrate dev` падает с коротким `Schema engine error`, примените уже созданную миграцию SQL напрямую:

```powershell
$env:DATABASE_URL='file:./dev.db'
npx prisma db execute --schema apps/api/prisma/schema.prisma --file apps/api/prisma/migrations/20260507000000_init/migration.sql
```

Локально:

- Web: `http://localhost:3000`
- API: `http://localhost:4000/api`
- Swagger: `http://localhost:4000/api/docs`

Для локальной разработки укажите:

```env
PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
CORS_ORIGIN="http://localhost:3000"
```

Webhook Platega локально не придет без публичного туннеля. На VPS используйте `bostoncrew.ru`.

## API для сайта

### Создать оплату

```http
POST /api/payments/checkout
Content-Type: application/json

{
  "customerEmail": "client@example.com"
}
```

Ответ:

```json
{
  "orderId": "uuid",
  "checkoutUrl": "https://pay.platega.io...",
  "statusUrl": "https://bostoncrew.ru/success?orderId=...&token=...",
  "transactionId": "platega-transaction-id",
  "status": "PENDING",
  "amount": 500,
  "currency": "RUB"
}
```

### Получить заказ после оплаты

```http
GET /api/payments/orders/:orderId?token=:token
```

Если Platega уже подтвердила оплату:

```json
{
  "status": "CONFIRMED",
  "licenseKey": "BCS-ABCD-EFGH-2345-JKLM",
  "licenseStatus": "NEW"
}
```

## API для desktop-приложения

### Активация ключа

Приложение вызывает этот маршрут только при наличии интернета.

```http
POST /api/licenses/activate
Content-Type: application/json

{
  "licenseKey": "BCS-ABCD-EFGH-2345-JKLM",
  "deviceFingerprint": "sha256:stable-device-hash",
  "appVersion": "1.0.0"
}
```

Ответ при первой успешной активации:

```json
{
  "allowed": true,
  "license": {
    "key": "BCS-ABCD-EFGH-2345-JKLM",
    "status": "activated",
    "deviceFingerprint": "sha256:stable-device-hash",
    "activatedAt": "2026-05-07T00:00:00.000Z",
    "lastCheckAt": "2026-05-07T00:00:00.000Z"
  },
  "offline": {
    "token": "base64urlPayload.hmacSignature",
    "issuedAt": "2026-05-07T00:00:00.000Z",
    "algorithm": "base64url-json.hmac-sha256"
  }
}
```

Если ключ уже активирован на другом устройстве, API вернет `409 DEVICE_MISMATCH`.

### Онлайн-проверка активированного ключа

```http
POST /api/licenses/check
Content-Type: application/json

{
  "licenseKey": "BCS-ABCD-EFGH-2345-JKLM",
  "deviceFingerprint": "sha256:stable-device-hash"
}
```

Этот маршрут обновляет `lastCheckAt` и нужен для периодической проверки при наличии интернета.

## Как связать с Qt/C++ приложением

1. При первом запуске без локальной лицензии блокируйте рабочий интерфейс и показывайте форму ввода ключа.
2. Перед активацией проверьте наличие интернета.
3. Сформируйте стабильный fingerprint устройства. Не отправляйте серийные номера в сыром виде; соберите устойчивые признаки устройства и отправьте SHA-256:

```text
deviceFingerprint = "sha256:" + SHA256(machineGuid + cpuId + appSalt)
```

4. Отправьте `licenseKey`, `deviceFingerprint`, `appVersion` в `POST https://bostoncrew.ru/api/licenses/activate`.
5. Если `allowed: true`, сохраните рядом с приложением, например в `SaveData/license.json`:

```json
{
  "licenseKey": "BCS-ABCD-EFGH-2345-JKLM",
  "deviceFingerprint": "sha256:stable-device-hash",
  "offlineToken": "base64urlPayload.hmacSignature",
  "activatedAt": "2026-05-07T00:00:00.000Z"
}
```

6. При оффлайн-запуске пересчитайте fingerprint текущего компьютера и сравните с `deviceFingerprint` из локальной лицензии. Если не совпадает, блокируйте приложение и показывайте покупку на `bostoncrew.ru`.
7. При онлайн-запуске можно дополнительно вызывать `POST /api/licenses/check`, чтобы узнать, не был ли ключ `revoked` или `refunded`.

Для более сильной защиты offline-token лучше заменить HMAC на асимметричную подпись: private key хранить только на сервере, public key встроить в приложение. Текущая реализация уже привязывает активацию на сервере к одному fingerprint, а offline-token помогает приложению хранить локальное разрешение.

## Статусы

Ключ:

```ts
status: "new" | "activated" | "revoked" | "refunded"
deviceFingerprint: string | null
activatedAt: Date | null
lastCheckAt: Date | null
```

Оплата:

- `PENDING` - ждем оплату;
- `CONFIRMED` - создается ключ;
- `CANCELED`, `FAILED`, `EXPIRED` - ключ не создается;
- `CHARGEBACKED` - ключ переводится в `refunded`.

## VPS и домен

Один из простых вариантов:

1. Запустить Nest на `127.0.0.1:4000`.
2. Запустить Next на `127.0.0.1:3000`.
3. В nginx направить `/api/` на Nest, остальное на Next.

```nginx
server {
  server_name bostoncrew.ru www.bostoncrew.ru;

  location /api/ {
    proxy_pass http://127.0.0.1:4000/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

SSL можно выпустить через certbot. После деплоя проверьте:

```bash
curl https://bostoncrew.ru/api/docs
```

## Изображения

Скриншоты из папки `pngs` перенесены в `apps/web/public/product`, фавикон - в `apps/web/src/app/favicon.ico`.
