'use client';

import { ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { createCheckout, getPublicConfig } from '../lib/api';

export function CheckoutButton() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    async function loadConfig() {
      try {
        const config = await getPublicConfig();

        if (active) {
          setPrice(config.productPriceRub);
        }
      } catch {
        if (active) {
          setPrice(null);
        }
      }
    }

    void loadConfig();

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const checkout = await createCheckout();
      window.location.href = checkout.checkoutUrl;
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'Ошибка оплаты.');
      setLoading(false);
    }
  }

  return (
    <form className="checkout" onSubmit={handleSubmit}>
      <div className="checkout-head">
        <span>Доступ на одно устройство</span>
        <strong>{price === null ? '...' : `${new Intl.NumberFormat('ru-RU').format(price)} RUB`}</strong>
      </div>
      <div className="checkout-row single">
        <button type="submit" disabled={loading}>
          {loading ? <Loader2 className="spin" size={18} /> : <ShieldCheck size={18} />}
          <span>Купить ключ</span>
          {!loading && <ArrowRight size={18} />}
        </button>
      </div>
      <p className="checkout-note">После подтверждения Platega ключ появится прямо на сайте.</p>
      {error && <p className="checkout-error">{error}</p>}
    </form>
  );
}
