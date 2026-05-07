const fallbackApiUrl = 'http://localhost:4000/api';

export const apiUrl = (process.env.NEXT_PUBLIC_API_URL ?? fallbackApiUrl).replace(/\/$/, '');

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

export async function createCheckout() {
  const response = await fetch(`${apiUrl}/payments/checkout`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Не удалось создать ссылку на оплату.');
  }

  return (await response.json()) as CheckoutResponse;
}

export async function getOrder(orderId: string, token: string) {
  const params = new URLSearchParams({ token });
  const response = await fetch(`${apiUrl}/payments/orders/${orderId}?${params.toString()}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Не удалось получить статус заказа.');
  }

  return (await response.json()) as OrderResponse;
}
