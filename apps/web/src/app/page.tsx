import {
  Check,
  Download,
  Film,
  FolderOpen,
  Gamepad2,
  MonitorUp,
  MousePointerClick,
  Network,
  Play,
  RadioTower,
  ShieldCheck,
  SlidersHorizontal,
  Timer,
  Volume2,
} from 'lucide-react';
import { CheckoutButton } from '../components/CheckoutButton';

const features = [
  {
    icon: <Play size={18} />,
    title: 'Сэмплы под рукой',
    text: 'Запускайте обычные и фиксированные аудио-сэмплы, ставьте все звуки на паузу и останавливайте их одной кнопкой.',
  },
  {
    icon: <MonitorUp size={18} />,
    title: 'Сцена для зрителя',
    text: 'Отдельное сценическое окно выводит изображения и видео на второй монитор или на основной экран.',
  },
  {
    icon: <SlidersHorizontal size={18} />,
    title: 'Слайды и cue',
    text: 'Собирайте слайды из медиафайлов, назначайте cue-звуки и выбирайте конкретное медиа через cue-окно.',
  },
  {
    icon: <Network size={18} />,
    title: 'Host по WebSocket',
    text: 'Подключайтесь к внешнему host-у по ws://ip:port и отправляйте команды RIGHT, WRONG, HOST и HSFALSE.',
  },
];

const gallery = [
  {
    src: '/product/main_wind.png',
    title: 'Главное окно',
    text: 'Быстрые слоты, preview текущего медиа, сэмплы, статус подключения и режим LIVE / EDIT.',
  },
  {
    src: '/product/slides_manager.png',
    title: 'Менеджер слайдов',
    text: 'Создание слайдов, добавление изображений и видео, cue-звуки и repeat для роликов.',
  },
  {
    src: '/product/slide_cue.png',
    title: 'Cue-выбор',
    text: 'Сетка mini-HD ячеек для точного запуска медиа текущего активного слайда.',
  },
  {
    src: '/product/edit_sample.png',
    title: 'Редактор сэмпла',
    text: 'Название, громкость, цвет кнопки и настройка Stop other sounds для нужного аудио.',
  },
  {
    src: '/product/remote_wind.png',
    title: 'Remote',
    text: 'Локальное управление видео: пауза, рестарт, повтор и удержание последнего кадра.',
  },
  {
    src: '/product/host_wind.png',
    title: 'Host',
    text: 'Окно подключения к внешнему host-у с сохранением адреса в SaveData/host.txt.',
  },
];

const guide = [
  {
    icon: <MousePointerClick size={18} />,
    title: 'Запуск шоу',
    text: 'Назначьте до 8 слайдов на быстрые слоты. Левый клик по слоту открывает слайд на сцене, правый клик назначает или меняет слайд.',
  },
  {
    icon: <Volume2 size={18} />,
    title: 'Работа с сэмплами',
    text: 'Добавьте аудиофайл через плюс в нижней области. В EDIT-режиме настройте название, громкость, цвет и остановку других звуков.',
  },
  {
    icon: <Film size={18} />,
    title: 'Медиа и preview',
    text: 'Previous / Next переключают медиа текущего слайда. Переключатель CUR / NEXT меняет preview между текущим и следующим медиа.',
  },
  {
    icon: <FolderOpen size={18} />,
    title: 'Слайды и библиотека',
    text: 'В менеджере слайдов создавайте папки, добавляйте изображения или видео, назначайте cue-звук и включайте repeat для отдельных роликов.',
  },
  {
    icon: <Timer size={18} />,
    title: 'Фиксированные кнопки',
    text: 'Player, OK, NO, Timer, Pause и Stop находятся под быстрыми слотами. Правый клик может запускать звук и сразу двигать медиа вперед.',
  },
  {
    icon: <RadioTower size={18} />,
    title: 'Host-подключение',
    text: 'Откройте host, введите адрес в формате 192.168.0.10:81 и нажмите Connect. После подключения статус станет Host connected.',
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
      'Интернет нужен для первой активации ключа. После успешной активации приложение сохраняет локальную лицензию и может работать оффлайн на этом же устройстве.',
  },
  {
    question: 'Что делает BOSTONCREW SAMPLER?',
    answer:
      'Это рабочий пульт для живых шоу, квизов и презентаций: аудио-сэмплы, слайды, видео, сценическое окно, cue-выбор и управление внешним host-ом.',
  },
  {
    question: 'Где приложение хранит рабочие данные?',
    answer:
      'Рядом с exe используются папки SaveData, Samples и Content. В SaveData лежат JSON-конфиги, host.txt и backup-копии.',
  },
  {
    question: 'Нужен ли второй монитор?',
    answer:
      'Не обязательно. Если второй монитор есть, сценическое окно откроется на нем; если нет, сцена запустится на основном экране.',
  },
  {
    question: 'Host-подключение работает через wss?',
    answer:
      'Нет, приложение использует обычный ws:// и формат адреса ip:port, например 192.168.0.10:81.',
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="BOSTONCREW SAMPLER">
          <span className="brand-mark">BC</span>
          <span>BOSTONCREW SAMPLER</span>
        </a>
        <nav>
          <a href="#features">Функции</a>
          <a href="#guide">Как пользоваться</a>
          <a href="#license">Ключ</a>
          <a href="#faq">FAQ</a>
        </nav>
      </header>

      <section id="top" className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Qt 6 / QML / C++ desktop app</p>
          <h1>BOSTONCREW SAMPLER</h1>
          <p className="hero-lead">
            Пульт для живого управления сэмплами, слайдами, видео и сценическим экраном. Ключ покупается на сайте,
            показывается сразу после оплаты и активируется в приложении на одном устройстве.
          </p>
          <div className="hero-actions">
            <a className="primary-link" href="#license">
              Купить ключ
            </a>
            <a className="secondary-link" href="/download">
              <Download size={18} />
              Скачать архив
            </a>
            <a className="secondary-link" href="#guide">
              Как пользоваться
            </a>
          </div>
          <div className="hero-facts" aria-label="Ключевые параметры">
            <span>
              <ShieldCheck size={16} /> Привязка к устройству
            </span>
            <span>
              <RadioTower size={16} /> WebSocket host
            </span>
            <span>
              <Gamepad2 size={16} /> Live / Edit режимы
            </span>
          </div>
        </div>
        <div className="hero-media" aria-label="Скриншот главного окна приложения">
          <img src="/product/main_wind.png" alt="Главное окно BOSTONCREW SAMPLER" />
        </div>
      </section>

      <section id="features" className="band">
        <div className="section-heading">
          <p className="eyebrow">Для шоу и интерактивов</p>
          <h2>Основные возможности</h2>
        </div>
        <div className="features-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gallery-band">
        <div className="section-heading">
          <p className="eyebrow">Интерфейсы приложения</p>
          <h2>Все рабочие окна</h2>
        </div>
        <div className="gallery-grid">
          {gallery.map((item) => (
            <figure className="gallery-item" key={item.title}>
              <img src={item.src} alt={item.title} />
              <figcaption>
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="guide" className="guide-section">
        <div className="section-heading">
          <p className="eyebrow">Документация</p>
          <h2>Как пользоваться приложением</h2>
        </div>
        <div className="guide-grid">
          {guide.map((item) => (
            <article className="guide-item" key={item.title}>
              <div className="feature-icon">{item.icon}</div>
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
            После оплаты Platega отправляет webhook на API. Сервер создает ключ, а сайт показывает его на странице
            успеха. Приложение активирует ключ через Nest API и сохраняет разрешение для этого компьютера.
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
        <CheckoutButton />
      </section>

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
    </main>
  );
}
