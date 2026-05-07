const fallbackApiUrl = '/api';
const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL;

export function getApiUrl() {
  if (!configuredApiUrl) {
    return fallbackApiUrl;
  }

  if (typeof window !== 'undefined') {
    try {
      const configuredUrl = new URL(configuredApiUrl);
      const pageHost = window.location.hostname;

      if (
        configuredUrl.hostname === 'localhost' &&
        pageHost !== 'localhost' &&
        pageHost !== '127.0.0.1'
      ) {
        return fallbackApiUrl;
      }
    } catch {
      return configuredApiUrl.replace(/\/$/, '');
    }
  }

  return configuredApiUrl.replace(/\/$/, '');
}

export type CheckoutResponse = {
  orderId: string;
  checkoutUrl: string;
  statusUrl: string;
  transactionId: string;
  status: string;
  amount: number;
  currency: string;
};

export type OrderResponse = {
  orderId: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'CHARGEBACKED' | 'FAILED' | 'EXPIRED';
  amount: number;
  currency: string;
  licenseKey: string | null;
  licenseStatus: string | null;
  confirmedAt: string | null;
  message: string;
};

export type PublicConfigResponse = {
  productPriceRub: number;
  currency: 'RUB';
};

export async function createCheckout() {
  const response = await fetch(`${getApiUrl()}/payments/checkout`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Не удалось создать ссылку на оплату.');
  }

  return (await response.json()) as CheckoutResponse;
}

export async function getOrder(orderId: string, token: string) {
  const params = new URLSearchParams({ token });
  const response = await fetch(`${getApiUrl()}/payments/orders/${orderId}?${params.toString()}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Не удалось получить статус заказа.');
  }

  return (await response.json()) as OrderResponse;
}

export async function getPublicConfig() {
  const response = await fetch(`${getApiUrl()}/public/config`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Не удалось получить настройки сайта.');
  }

  return (await response.json()) as PublicConfigResponse;
}
