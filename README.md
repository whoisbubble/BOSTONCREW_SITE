# BOSTONCREW SAMPLER Site

Монорепозиторий для продажи ключей BOSTONCREW SAMPLER:

- `apps/web` - Next.js сайт для `bostoncrew.ru`;
- `apps/api` - Nest API для оплаты Platega, webhook, выдачи ключей и активации приложения;
- база по умолчанию - Prisma + SQLite.

Цена ключа берется из `PRODUCT_PRICE_RUB` и активируется на одном устройстве.

## Сценарий оплаты

1. Пользователь нажимает `Купить ключ` на сайте.
2. Next вызывает `POST /api/payments/checkout`.
3. Nest создает заказ и получает ссылку оплаты через Platega.
4. Пользователь оплачивает заказ на стороне Platega.
5. Platega отправляет webhook на `https://bostoncrew.ru/api/payments/platega/webhook`.
6. Nest проверяет webhook, сверяет сумму и создает ключ вида `BCS-XXXX-XXXX-XXXX-XXXX`.
7. Пользователь возвращается на `/success`, где сайт показывает ключ.
8. Пользователь вставляет ключ в desktop-приложение.
9. Приложение отправляет ключ и `deviceFingerprint` в `POST /api/licenses/activate`.
10. API сохраняет устройство и переводит ключ из `new` в `activated`.

## Переменные окружения

Скопируйте `.env.example` в `.env` и заполните значения Platega.

```env
PUBLIC_SITE_URL="https://bostoncrew.ru"
API_PUBLIC_URL="https://bostoncrew.ru"
NEXT_PUBLIC_API_URL="/api"
DOWNLOAD_ARCHIVE_NAME="bostoncrew-sampler.zip"

API_PORT=4000
CORS_ORIGIN="https://bostoncrew.ru,http://localhost:3000"
DATABASE_URL="file:./dev.db"
PRODUCT_PRICE_RUB=500
LICENSE_TOKEN_SECRET="replace-with-a-long-random-secret"

PLATEGA_BASE_URL="https://app.platega.io"
PLATEGA_MERCHANT_ID=""
PLATEGA_SECRET=""
PLATEGA_PAYMENT_METHOD=2
PLATEGA_CALLBACK_URL="https://bostoncrew.ru/api/payments/platega/webhook"
PLATEGA_RETURN_URL="https://bostoncrew.ru/success"
PLATEGA_FAILED_URL="https://bostoncrew.ru/cancel"
```

В Platega укажите callback:

```text
https://bostoncrew.ru/api/payments/platega/webhook
```

## Архив приложения для скачивания

Кнопка `Скачать архив` на сайте ведет на `/download`. По умолчанию Next ищет архив в корне проекта:

```text
bostoncrew-sampler.zip
```

Если файл называется иначе, поменяйте переменную:

```env
DOWNLOAD_ARCHIVE_NAME="BOSTONCREW_SAMPLER.zip"
```

Можно указать и абсолютный путь:

```env
DOWNLOAD_ARCHIVE_PATH="/var/www/bostoncrew/BOSTONCREW_SAMPLER.zip"
```

Поддерживаемые форматы: `.zip`, `.rar`, `.7z`, `.tar`, `.gz`.

## Локальный запуск

```bash
npm install
npm run prisma:generate
npm run prisma:migrate -w apps/api
npm run dev:api
npm run dev:web
```

Локально:

- Web: `http://localhost:3000`
- API: `http://localhost:4000/api`
- Swagger: `http://localhost:4000/api/docs`

Для локальной разработки:

```env
PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
CORS_ORIGIN="http://localhost:3000"
PLATEGA_RETURN_URL="http://localhost:3000/success"
PLATEGA_FAILED_URL="http://localhost:3000/cancel"
```

На production лучше держать `NEXT_PUBLIC_API_URL="/api"` и проксировать `/api/` через nginx на Nest. Так браузер не будет обращаться к `localhost:4000`.

Если на Windows в пути с кириллицей `prisma migrate dev` падает с коротким `Schema engine error`, примените миграцию SQL напрямую:

```powershell
$env:DATABASE_URL='file:./dev.db'
npx prisma db execute --schema apps/api/prisma/schema.prisma --file apps/api/prisma/migrations/20260507000000_init/migration.sql
```

## API сайта

### Создать оплату

```http
POST /api/payments/checkout
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

### Получить ключ после оплаты

```http
GET /api/payments/orders/:orderId?token=:token
```

Ответ после подтверждения Platega:

```json
{
  "status": "CONFIRMED",
  "licenseKey": "BCS-ABCD-EFGH-2345-JKLM",
  "licenseStatus": "NEW"
}
```

## API приложения

### Первая активация

Приложение вызывает маршрут только при наличии интернета.

```http
POST /api/licenses/activate
Content-Type: application/json

{
  "licenseKey": "BCS-ABCD-EFGH-2345-JKLM",
  "deviceFingerprint": "sha256:stable-device-hash",
  "appVersion": "1.0.0"
}
```

Ответ:

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
    "token": "server-issued-token",
    "issuedAt": "2026-05-07T00:00:00.000Z"
  }
}
```

Если ключ уже активирован на другом устройстве, API вернет `409 DEVICE_MISMATCH`.

### Онлайн-проверка

```http
POST /api/licenses/check
Content-Type: application/json

{
  "licenseKey": "BCS-ABCD-EFGH-2345-JKLM",
  "deviceFingerprint": "sha256:stable-device-hash"
}
```

Маршрут обновляет `lastCheckAt` и позволяет приложению узнать, что ключ не был отключен.

## Как связать с Qt/C++ приложением

1. При первом запуске без локальной лицензии заблокируйте рабочий интерфейс и покажите поле ввода ключа.
2. Перед отправкой ключа проверьте, что есть интернет.
3. Сформируйте стабильный fingerprint устройства. Не отправляйте серийные номера в сыром виде.

```text
deviceFingerprint = "sha256:" + SHA256(machineGuid + cpuId + appSalt)
```

4. Отправьте `licenseKey`, `deviceFingerprint`, `appVersion` в `POST https://bostoncrew.ru/api/licenses/activate`.
5. Если `allowed: true`, сохраните рядом с приложением `SaveData/license.json`.

```json
{
  "licenseKey": "BCS-ABCD-EFGH-2345-JKLM",
  "deviceFingerprint": "sha256:stable-device-hash",
  "token": "server-issued-token",
  "activatedAt": "2026-05-07T00:00:00.000Z"
}
```

6. При оффлайн-запуске пересчитайте fingerprint текущего компьютера и сравните его с сохраненным `deviceFingerprint`.
7. Если fingerprint не совпал, заблокируйте приложение и покажите сообщение о покупке нового ключа на `bostoncrew.ru`.
8. При онлайн-запуске можно дополнительно вызывать `POST /api/licenses/check`.

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
- `CONFIRMED` - ключ готов;
- `CANCELED`, `FAILED`, `EXPIRED` - ключ не создается;
- `CHARGEBACKED` - ключ переводится в `refunded`.

## Как пользоваться BOSTONCREW SAMPLER

### Главное окно

Главное окно - рабочий пульт. В нем есть:

- 8 быстрых слотов слайдов;
- preview текущего или следующего медиа;
- нижняя область пользовательских сэмплов;
- строка состояния с подключением к host, текущим статусом и режимом `LIVE` / `EDIT`.

Верхняя панель открывает host-настройки, remote-окно, сворачивание, разворачивание и закрытие приложения. При закрытии данные сохраняются.

### Быстрые слоты

В левом верхнем блоке расположены 8 быстрых слотов.

- Левый клик по заполненному слоту открывает назначенный слайд на сцене.
- Правый клик открывает выбор слайда для слота.
- В режиме `EDIT` клик по слоту тоже открывает назначение.
- Активный слот подсвечивается.
- Пустой слот показывает свой номер.

### Фиксированные кнопки

Под быстрыми слотами находятся фиксированные сэмплы:

- `Player / P1`;
- `Like / OK`;
- `Dislike / NO`;
- `Timer`;
- `Pause / Play` для всех активных аудио;
- `Stop` для всех активных аудио.

Левый клик запускает выбранный фиксированный звук. Правый клик запускает звук и может переключить медиа вперед. Средний клик по `Timer` открывает таймер.

### Пользовательские сэмплы

В нижней области можно добавлять свои аудиофайлы.

1. Нажмите `+`.
2. Выберите аудиофайл.
3. Включите `EDIT`, чтобы настроить кнопку.
4. В редакторе задайте название, громкость, цвет и `Stop other sounds`.
5. В `LIVE`-режиме запускайте сэмпл кликом по кнопке.

Если удерживать `Shift`, сэмплы можно переставлять местами.

### Preview и управление медиа

Preview показывает текущее или следующее медиа активного слайда.

- `Previous` переключает на предыдущее медиа.
- `Next` переключает на следующее медиа.
- Счетчик показывает позицию вида `1/5`.
- `Cue` открывает окно выбора конкретного медиа.
- `CUR / NEXT` меняет режим preview.

Для видео preview работает без звука и ждет готового кадра перед показом.

### Cue-окно

Cue-окно показывает медиа текущего слайда в виде сетки.

- Левый клик открывает выбранное медиа и запускает первый обычный сэмпл.
- Правый клик открывает выбранное медиа и запускает фиксированный сэмпл `OK`.
- Клик колесом открывает только медиа без дополнительного звука.
- Уже выбранные ячейки затемняются и получают зеленую отметку.
- Если медиа много, окно прокручивается.

### Сценическое окно

Сцена показывает активное медиа зрителю.

- Если найден второй монитор, сцена открывается на нем.
- Если второго монитора нет, сцена открывается на основном экране.
- Изображения показываются с сохранением пропорций.
- Видео дожидается первого готового кадра перед показом.
- После завершения видео остается на последнем кадре.
- Repeat для видео включается в менеджере слайдов.

### Менеджер слайдов

Менеджер слайдов нужен для подготовки контента.

1. Откройте менеджер через кнопку слайдов.
2. Нажмите `+`, чтобы создать слайд.
3. Добавьте изображения или видео.
4. При необходимости назначьте cue-звук к отдельному медиа.
5. Для видео включите repeat, если оно должно повторяться.
6. Назначьте готовый слайд на быстрый слот.

При удалении слайда приложение удаляет его папку из `Content/`, если она находится внутри рабочей директории приложения.

### Remote-окно

Remote-окно управляет видео на сцене:

- пауза и продолжение;
- рестарт видео;
- repeat;
- удержание последнего кадра.

### Host и WebSocket

Host-подключение открывается кнопкой host в верхней панели.

Формат адреса:

```text
192.168.0.10:81
```

Приложение подключается как WebSocket-клиент:

```text
ws://192.168.0.10:81
```

После успешного подключения приложение отправляет:

```text
HOST
HSFALSE
```

Во время работы отправляются:

```text
RIGHT
WRONG
```

`RIGHT` отправляется при запуске фиксированного сэмпла `OK`, `WRONG` - при запуске `NO`. Входящие сообщения `Игрок 1` и `Игрок 2` запускают фиксированный сэмпл `P1`.

Host-адрес сохраняется в `SaveData/host.txt`.

### Сохранение данных

Данные сохраняются автоматически после основных действий и при закрытии приложения.

Папки рядом с exe:

```text
SaveData/
Samples/
Content/
```

`SaveData/` хранит:

```text
samples.json
fixedsamples.json
slides.json
eightslides.json
host.txt
```

Для JSON-файлов создаются `.bak`-копии. Если основной JSON поврежден, приложение пробует прочитать backup.

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

После деплоя проверьте:

```bash
curl https://bostoncrew.ru/api/docs
```

## Изображения

Скриншоты из `pngs` перенесены в `apps/web/public/product`, фавикон - в `apps/web/src/app/favicon.ico`.
