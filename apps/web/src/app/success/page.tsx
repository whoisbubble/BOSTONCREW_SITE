'use client';

import { CheckCircle2, Clipboard, Loader2, RotateCw } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { getOrder, OrderResponse } from '../../lib/api';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') ?? '';
  const token = searchParams.get('token') ?? '';
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!orderId || !token) {
      setError('Не найден номер заказа. Вернитесь на главную и создайте оплату заново.');
      return;
    }

    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;

    async function load() {
      try {
        const nextOrder = await getOrder(orderId, token);
        if (stopped) {
          return;
        }

        setOrder(nextOrder);
        if (nextOrder.status === 'PENDING') {
          timer = setTimeout(load, 4000);
        }
      } catch (loadError) {
        if (!stopped) {
          setError(loadError instanceof Error ? loadError.message : 'Не удалось получить заказ.');
        }
      }
    }

    void load();

    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [orderId, token]);

  async function copyKey() {
    if (!order?.licenseKey) {
      return;
    }

    await navigator.clipboard.writeText(order.licenseKey);
    setCopied(true);
  }

  return (
    <main className="status-page">
      <Link className="brand status-brand" href="/">
        <span className="brand-mark">BC</span>
        <span>BOSTONCREW SAMPLER</span>
      </Link>
      <section className="status-panel">
        {order?.status === 'CONFIRMED' ? <CheckCircle2 size={34} /> : <Loader2 className="spin" size={34} />}
        <h1>{order?.status === 'CONFIRMED' ? 'Ключ готов' : 'Ждем подтверждение оплаты'}</h1>
        <p>{error || order?.message || 'Platega обрабатывает платеж. Обычно это занимает несколько секунд.'}</p>

        {order?.licenseKey && (
          <div className="key-box">
            <span>{order.licenseKey}</span>
            <button type="button" onClick={copyKey}>
              <Clipboard size={17} />
              {copied ? 'Скопировано' : 'Скопировать'}
            </button>
          </div>
        )}

        {order?.status === 'PENDING' && (
          <div className="pending-line">
            <RotateCw className="spin" size={16} />
            Страница обновляет статус автоматически.
          </div>
        )}

        <Link className="secondary-link status-link" href="/">
          На главную
        </Link>
      </section>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
