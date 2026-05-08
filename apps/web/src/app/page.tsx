import {
  BadgeCheck,
  Check,
  Download,
  MonitorPlay,
  MousePointer2,
  Network,
  RadioTower,
  ShieldCheck,
  SlidersHorizontal,
  Volume2,
  Zap,
} from 'lucide-react';
import { CheckoutButton } from '../components/CheckoutButton';
import { InteractiveDeck } from '../components/InteractiveDeck';
import { LegalTabs } from '../components/LegalTabs';
import { ScrollFX } from '../components/ScrollFX';

const features = [
  {
    icon: <Zap size={18} />,
    title: 'Мгновенный запуск',
    text: 'Сэмплы, fixed-кнопки, пауза и остановка всех звуков работают как рабочий пульт для живого события.',
  },
  {
    icon: <MonitorPlay size={18} />,
    title: 'Сценическое окно',
    text: 'Отдельный viewer выводит изображения и видео на второй монитор или на основной экран без лишнего интерфейса.',
  },
  {
    icon: <SlidersHorizontal size={18} />,
    title: 'Слайды и cue',
    text: 'Собирайте медиапапки, назначайте cue-звуки, включайте repeat и запускайте нужный кадр из сетки.',
  },
  {
    icon: <Network size={18} />,
    title: 'WebSocket host',
    text: 'Подключайтесь к внешнему host по ws://ip:port и отправляйте команды RIGHT, WRONG, HOST и HSFALSE.',
  },
];

const interfaceCards = [
  {
    src: '/product/main_wind.png',
    title: 'Главный пульт',
    text: 'Быстрые слоты, preview текущего медиа, сэмплы, статус подключения и переключение LIVE / EDIT.',
  },
  {
    src: '/product/slides_manager.png',
    title: 'Менеджер слайдов',
    text: 'Папки, изображения, видео, cue-звуки и repeat для роликов собираются в одном рабочем окне.',
  },
  {
    src: '/product/slide_cue.png',
    title: 'Cue-выбор',
    text: 'Мини-сетка для точного запуска конкретного медиа из активного слайда во время шоу.',
  },
  {
    src: '/product/edit_sample.png',
    title: 'Редактор сэмпла',
    text: 'Название, громкость, цвет кнопки и Stop other sounds настраиваются для каждого аудио.',
  },
  {
    src: '/product/remote_wind.png',
    title: 'Remote',
    text: 'Локальное управление видео: пауза, рестарт, повтор и удержание последнего кадра.',
  },
  {
    src: '/product/host_wind.png',
    title: 'Host',
    text: 'Окно подключения к внешнему host с сохранением адреса в SaveData/host.txt.',
  },
];

const workflow = [
  {
    number: '01',
    title: 'Соберите сцену',
    text: 'Назначьте до 8 быстрых слайдов, добавьте медиа и подготовьте cue-звуки для нужных моментов.',
  },
  {
    number: '02',
    title: 'Запустите live',
    text: 'Откройте сценическое окно, переключайтесь между текущим и следующим медиа, управляйте видео и звуком.',
  },
  {
    number: '03',
    title: 'Подключите host',
    text: 'Введите адрес внешнего host, сохраните подключение и отправляйте команды прямо из приложения.',
  },
];

const faq = [
  {
    question: 'На сколько устройств действует ключ?',
    answer:
      'Один ключ активируется на одном устройстве. При первой активации API сохраняет deviceFingerprint, после этого другой компьютер с тем же ключом доступ не получит.',
  },
  {
    question: 'Можно ли пользоваться приложением без интернета?',
    answer:
      'Интернет нужен для первой активации ключа. После успешной активации приложение сохраняет локальную лицензию и может работать офлайн на этом же устройстве.',
  },
  {
    question: 'Что делает BOSTONCREW SAMPLER?',
    answer:
      'Это рабочий пульт для живых шоу, квизов и презентаций: аудио-сэмплы, слайды, видео, сценическое окно, cue-выбор и управление внешним host.',
  },
  {
    question: 'Где приложение хранит рабочие данные?',
    answer:
      'Рядом с exe используются папки SaveData, Samples и Content. В SaveData лежат JSON-конфиги, host.txt и backup-копии.',
  },
  {
    question: 'Нужен ли второй монитор?',
    answer:
      'Нет. Если второй монитор есть, сценическое окно откроется на нем; если нет, сцена запустится на основном экране.',
  },
  {
    question: 'Host-подключение работает через wss?',
    answer: 'Нет, приложение использует обычный ws:// и формат адреса ip:port, например 192.168.0.10:81.',
  },
];

const tickerItems = [
  'LIVE / EDIT',
  'Cue launch',
  'Video remote',
  'Fixed samples',
  'WebSocket host',
  'Stage window',
  'Device license',
  'Slide manager',
];

export default function Home() {
  return (
    <main className="site-shell">
      <ScrollFX />

      <header className="site-header">
        <a className="brand" href="#top" aria-label="BOSTONCREW SAMPLER">
          <span className="brand-mark" aria-hidden="true">
            <img src="/brand/pnglogo.png" alt="" />
          </span>
          <span className="brand-text">
            <strong>BOSTONCREW</strong>
            <span>SAMPLER</span>
          </span>
        </a>
        <nav>
          <a href="#features">Возможности</a>
          <a href="#interfaces">Интерфейс</a>
          <a href="#license">Ключ</a>
          <a href="#legal">Документы</a>
        </nav>
      </header>

      <section id="top" className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Desktop app для шоу, квизов и эфиров</p>
          <h1>BOSTONCREW SAMPLER</h1>
          <p className="hero-lead">
            Живой пульт для сэмплов, слайдов, видео и сценического экрана. Покупаете ключ на сайте, получаете его
            сразу после оплаты и активируете приложение на одном устройстве.
          </p>
          <div className="hero-actions">
            <a className="primary-link" href="#license">
              Купить ключ
            </a>
            <a className="secondary-link" href="/download">
              <Download size={18} />
              Скачать архив
            </a>
            <a className="icon-link" href="#features" aria-label="К возможностям">
              <MousePointer2 size={19} />
            </a>
          </div>
          <div className="hero-facts" aria-label="Ключевые параметры">
            <span>
              <ShieldCheck size={16} /> Ключ на одно устройство
            </span>
            <span>
              <RadioTower size={16} /> WebSocket host
            </span>
            <span>
              <Volume2 size={16} /> Сэмплы и fixed-кнопки
            </span>
          </div>
        </div>

        <div className="hero-visual">
          <InteractiveDeck />
        </div>
      </section>

      <section className="ticker-band" aria-label="Возможности BOSTONCREW SAMPLER">
        <div className="ticker-track">
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </section>

      <section id="features" className="band features-section">
        <div className="section-heading">
          <p className="eyebrow">Все под рукой</p>
          <h2>Не лендинг про приложение, а сам пульт в первом кадре</h2>
        </div>
        <div className="features-grid">
          {features.map((feature) => (
            <article className="feature-card reveal-card" key={feature.title}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="interfaces" className="interfaces-section">
        <div className="section-heading">
          <p className="eyebrow">Рабочие окна</p>
          <h2>Интерфейс выглядит как набор живых панелей</h2>
        </div>
        <div className="interfaces-grid">
          {interfaceCards.map((item) => (
            <figure className="interface-card reveal-card" key={item.title}>
              <img src={item.src} alt={item.title} />
              <figcaption>
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="workflow-section">
        <div className="section-heading">
          <p className="eyebrow">Сценарий работы</p>
          <h2>От подготовки до live-запуска</h2>
        </div>
        <div className="workflow-grid">
          {workflow.map((item) => (
            <article className="workflow-item reveal-card" key={item.number}>
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="license" className="license-section">
        <div className="license-copy">
          <p className="eyebrow">Лицензия</p>
          <h2>Ключ на одно устройство</h2>
          <p>
            После оплаты Platega отправляет webhook на API. Сервер создает ключ, сайт показывает его на странице успеха,
            а приложение активирует ключ через Nest API и сохраняет разрешение для этого компьютера.
          </p>
          <ul className="check-list">
            <li>
              <Check size={16} /> Статусы ключа: new, activated, revoked, refunded.
            </li>
            <li>
              <Check size={16} /> Повторная проверка разрешена только с тем же deviceFingerprint.
            </li>
            <li>
              <Check size={16} /> Возврат платежа переводит ключ в refunded.
            </li>
          </ul>
        </div>
        <div className="license-aside">
          <CheckoutButton />
          <div className="license-note">
            <BadgeCheck size={18} />
            <span>Ключ появляется сразу после подтверждения платежа.</span>
          </div>
        </div>
      </section>

      <LegalTabs />

      <section id="faq" className="faq-section">
        <div className="section-heading">
          <p className="eyebrow">FAQ</p>
          <h2>Частые вопросы</h2>
        </div>
        <div className="faq-list">
          {faq.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <a className="brand" href="#top" aria-label="BOSTONCREW SAMPLER">
          <span className="brand-mark" aria-hidden="true">
            <img src="/brand/pnglogo.png" alt="" />
          </span>
          <span className="brand-text">
            <strong>BOSTONCREW</strong>
            <span>SAMPLER</span>
          </span>
        </a>
        <div className="footer-links">
          <a href="#legal">Пользовательское соглашение</a>
          <a href="#legal">Политика конфиденциальности</a>
        </div>
      </footer>
    </main>
  );
}
