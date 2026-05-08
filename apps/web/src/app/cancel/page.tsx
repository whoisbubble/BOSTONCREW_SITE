import { CircleX } from 'lucide-react';
import Link from 'next/link';

export default function CancelPage() {
  return (
    <main className="status-page">
      <Link className="brand status-brand" href="/">
        <span className="brand-mark" aria-hidden="true">
          <img src="/brand/pnglogo.png" alt="" />
        </span>
        <span className="brand-text">
          <strong>BOSTONCREW</strong>
          <span>SAMPLER</span>
        </span>
      </Link>
      <section className="status-panel">
        <CircleX size={34} />
        <h1>Платеж не завершен</h1>
        <p>Оплата была отменена или не прошла. Ключ создается только после подтверждения Platega.</p>
        <Link className="primary-link status-link" href="/#license">
          Попробовать снова
        </Link>
      </section>
    </main>
  );
}
