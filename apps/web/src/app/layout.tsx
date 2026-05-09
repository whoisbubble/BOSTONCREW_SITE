import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BOSTONCREW SAMPLER - один пульт для live-мероприятий',
  description:
    'Запускайте сэмплы, слайды и видео из одного приложения. Бесплатный режим без ключа и полный доступ для live-событий.',
  metadataBase: new URL('https://bostoncrew.ru'),
  icons: {
    icon: [{ url: '/favicon.ico' }],
    shortcut: ['/favicon.ico'],
    apple: [{ url: '/brand/pnglogo.png' }],
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width',
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
