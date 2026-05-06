import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BOSTONCREW SAMPLER',
  description: 'Ключ для BOSTONCREW SAMPLER на одно устройство.',
  metadataBase: new URL('https://bostoncrew.ru'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
