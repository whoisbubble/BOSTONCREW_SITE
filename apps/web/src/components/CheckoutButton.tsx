'use client';

import { ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { createCheckout } from '../lib/api';

export function CheckoutButton() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const checkout = await createCheckout(email.trim());
      window.location.href = checkout.checkoutUrl;
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'Ошибка оплаты.');
      setLoading(false);
    }
  }

  return (
    <form className="checkout" onSubmit={handleSubmit}>
      <label className="checkout-label" htmlFor="email">
        Email для поддержки
      </label>
      <div className="checkout-row">
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? <Loader2 className="spin" size={18} /> : <ShieldCheck size={18} />}
          <span>Купить ключ</span>
          {!loading && <ArrowRight size={18} />}
        </button>
      </div>
      <p className="checkout-note">500 RUB, один ключ привязывается к одному устройству.</p>
      {error && <p className="checkout-error">{error}</p>}
    </form>
  );
}
