import {
  BadgeCheck,
  Check,
  CheckCircle2,
  Clock3,
  Download,
  Film,
  Gauge,
  Layers3,
  MonitorPlay,
  Play,
  Presentation,
  RadioTower,
  School,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
  Video,
  Volume2,
  Zap,
} from 'lucide-react';
import { CheckoutButton } from '../components/CheckoutButton';
import { InteractiveDeck } from '../components/InteractiveDeck';
import { LegalTabs } from '../components/LegalTabs';

const heroBenefits = [
  {
    icon: <Layers3 size={17} />,
    text: 'Звук, видео и слайды в одном месте',
  },
  {
    icon: <BadgeCheck size={17} />,
    text: 'Бесплатный режим без ключа',
  },
  {
    icon: <Zap size={17} />,
    text: 'Для live-событий и быстрых запусков',
  },
];

const tickerItems = [
  'Сэмплы',
  'Слайды',
  'Видео',
  'Cue-сетка',
  'Сценический экран',
  'Быстрые кнопки',
  'Бесплатный старт',
  'Полный доступ по ключу',
];

const beforeItems = [
  'PowerPoint открыт отдельно',
  'сэмплы в другой программе',
  'видео лежит в папках',
  'плеер надо искать глазами',
  'экран для зрителей живет отдельно',
  'в моменте легко нажать не туда',
];

const afterItems = [
  'один рабочий пульт',
  'быстрые кнопки под рукой',
  'слайды, видео и звук рядом',
  'подготовленные cue-моменты',
  'отдельное сценическое окно',
  'меньше переключений и ошибок',
];

const features = [
  {
    icon: <Volume2 size={20} />,
    title: 'Сэмплы в один клик',
    text: 'Запускайте отбивки, реакции, музыку и звуковые эффекты прямо из пульта, когда пауза уже заметна залу.',
  },
  {
    icon: <Presentation size={20} />,
    title: 'Слайды без PowerPoint-хаоса',
    text: 'Соберите изображения и видео внутри приложения и выводите нужный кадр во время события без охоты за окнами.',
  },
  {
    icon: <MonitorPlay size={20} />,
    title: 'Сценическое окно',
    text: 'Показывайте зрителям только контент: без папок, служебных панелей и случайно открытого интерфейса.',
  },
  {
    icon: <SlidersHorizontal size={20} />,
    title: 'Cue-сетка',
    text: 'Подготовьте нужные моменты заранее и запускайте их быстро во время шоу, квиза или презентации.',
  },
  {
    icon: <Video size={20} />,
    title: 'Управление видео',
    text: 'Пауза, повтор, рестарт и удержание кадра находятся рядом с остальным сценарием, а не в отдельном плеере.',
  },
  {
    icon: <Sparkles size={20} />,
    title: 'Бесплатный старт',
    text: 'Скачайте приложение, проверьте основной сценарий и покупайте ключ только когда понятно, что инструмент подходит.',
  },
];

const audience = [
  {
    icon: <Gauge size={20} />,
    title: 'Для квизов',
    text: 'Быстро запускайте правильные и неправильные ответы, отбивки, видео-вопросы и заставки между раундами.',
  },
  {
    icon: <RadioTower size={20} />,
    title: 'Для ведущих',
    text: 'Держите под рукой музыку, реакции и визуальные вставки, не переключаясь между программами во время подводок.',
  },
  {
    icon: <Users size={20} />,
    title: 'Для event-команд',
    text: 'Соберите медиасценарий заранее и отдайте технику понятный пульт вместо набора папок и устных подсказок.',
  },
  {
    icon: <School size={20} />,
    title: 'Для школ и вузов',
    text: 'Запускайте конкурсы, ролики, заставки и презентационные блоки без сложной аппаратной схемы.',
  },
  {
    icon: <Film size={20} />,
    title: 'Для небольших шоу',
    text: 'Сценические вставки, музыка, видео и быстрые реакции живут в одном месте, даже если команда маленькая.',
  },
  {
    icon: <MonitorPlay size={20} />,
    title: 'Для техников сцены',
    text: 'Меньше ручного поиска, меньше лишних окон, больше контроля над тем, что видит зал прямо сейчас.',
  },
];

const workflow = [
  {
    number: '01',
    title: 'Скачайте приложение',
    text: 'Откройте BOSTONCREW SAMPLER и попробуйте бесплатный режим без ключа.',
  },
  {
    number: '02',
    title: 'Соберите медиа',
    text: 'Добавьте слайды, видео, звуки, быстрые кнопки и cue-моменты под свой сценарий.',
  },
  {
    number: '03',
    title: 'Запустите live-режим',
    text: 'Выведите сценическое окно и управляйте контентом из одного рабочего интерфейса.',
  },
  {
    number: '04',
    title: 'Откройте полный доступ',
    text: 'Когда бесплатного режима станет мало, купите ключ и активируйте полную версию.',
  },
];

const comparisonRows = [
  ['Запуск приложения', 'Да', 'Да'],
  ['Базовое знакомство с интерфейсом', 'Да', 'Да'],
  ['Подготовка простого сценария', 'Да, с ограничениями', 'Да'],
  ['Полный live-пульт', 'Ограничен', 'Да'],
  ['Все рабочие возможности', 'Нет', 'Да'],
  ['Использование на мероприятиях без ограничений', 'Нет', 'Да'],
  ['Активация на устройстве', 'Не нужна', 'По ключу'],
];

const trustItems = [
  {
    icon: <CheckCircle2 size={19} />,
    title: 'Сделано под live-сценарии',
    text: 'Фокус на быстрых запусках, сценическом экране и работе в моменте.',
  },
  {
    icon: <Download size={19} />,
    title: 'Можно начать бесплатно',
    text: 'Скачайте приложение и проверьте логику пульта до покупки.',
  },
  {
    icon: <ShieldCheck size={19} />,
    title: 'Ключ приходит после оплаты',
    text: 'После подтверждения платежа ключ появляется на сайте.',
  },
  {
    icon: <BadgeCheck size={19} />,
    title: 'Карты не хранятся на сайте',
    text: 'Оплата проходит через платежного провайдера, сайт работает с результатом заказа.',
  },
];

const faq = [
  {
    question: 'Можно ли попробовать без покупки?',
    answer:
      'Да. В приложении есть бесплатный режим без ключа, но с ограничениями. Он нужен, чтобы проверить интерфейс и понять, подходит ли приложение под ваш сценарий.',
  },
  {
    question: 'Что даёт ключ?',
    answer: 'Ключ открывает полный доступ BOSTONCREW SAMPLER на одном устройстве.',
  },
  {
    question: 'На сколько устройств действует ключ?',
    answer: 'Один ключ - одно устройство. После активации тот же ключ нельзя перенести на другой компьютер.',
  },
  {
    question: 'Когда я получу ключ?',
    answer: 'После подтверждения оплаты ключ появляется на сайте на странице успешного заказа.',
  },
  {
    question: 'Нужен ли интернет?',
    answer:
      'Интернет нужен для первой активации ключа. После успешной активации приложение получает локальное разрешение и может работать на этом же устройстве без постоянного подключения.',
  },
  {
    question: 'Это замена PowerPoint?',
    answer:
      'Не совсем. Это не офисная презентация, а live-пульт для мероприятий, где кроме слайдов нужны звуки, видео, быстрые запуски и сценический экран.',
  },
  {
    question: 'Что делать, если я не понимаю, подойдёт ли мне приложение?',
    answer: 'Скачайте бесплатную версию и проверьте свой сценарий без покупки.',
  },
  {
    question: 'Где технические детали?',
    answer:
      'Технические детали по активации, устройству ключа и служебным статусам оставлены в документах и техническом FAQ ниже основного лендинга.',
  },
];

export default function Home() {
  return (
    <main className="site-shell">
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
          <a href="#problem">Зачем</a>
          <a href="#features">Возможности</a>
          <a href="#free">Бесплатно</a>
          <a href="#full-access">Полный доступ</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="header-cta" href="/download">
          <Download size={16} />
          Скачать
        </a>
      </header>

      <section id="top" className="hero">
        <div className="hero-copy">
          <div className="hero-badges" aria-label="Ключевые преимущества">
            <span>Бесплатный режим</span>
            <span>Для live-событий</span>
            <span>Один пульт</span>
          </div>
          <p className="eyebrow">Desktop-приложение для мероприятий, квизов и шоу</p>
          <h1>Один пульт вместо десятка открытых окон</h1>
          <p className="hero-lead">
            Запускайте звук, слайды и видео во время мероприятия из одного приложения. Без хаоса, лишних вкладок
            и ручного поиска файлов в самый неподходящий момент.
          </p>
          <div className="hero-actions">
            <a className="primary-link" href="/download">
              <Download size={18} />
              Скачать бесплатно
            </a>
            <a className="secondary-link" href="#full-access">
              <ShieldCheck size={18} />
              Купить полный доступ
            </a>
          </div>
          <div className="hero-facts">
            {heroBenefits.map((benefit) => (
              <span key={benefit.text}>
                {benefit.icon}
                {benefit.text}
              </span>
            ))}
          </div>
        </div>

        <div className="hero-visual">
          <InteractiveDeck />
        </div>
      </section>

      <section className="ticker-band" aria-label="Что собирает BOSTONCREW SAMPLER">
        <div className="ticker-track">
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </section>

      <section id="problem" className="problem-section section-pad">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">Проблема</p>
            <h2>Когда мероприятие идёт live, лишние окна мешают</h2>
          </div>
          <p>
            PowerPoint открыт отдельно. Сэмплы лежат в другой программе. Видео запускается из папки. Ещё где-то
            открыт экран для вывода. В итоге в самый важный момент приходится искать нужное окно, нужный файл и
            нужную кнопку.
          </p>
        </div>
        <div className="before-after">
          <article className="compare-panel compare-before">
            <span className="compare-kicker">Было</span>
            <h3>Куча программ и ручной поиск</h3>
            <ul>
              {beforeItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="compare-panel compare-after">
            <span className="compare-kicker">Стало</span>
            <h3>Один пульт для события</h3>
            <ul>
              {afterItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section id="features" className="features-section section-pad">
        <div className="section-heading">
          <p className="eyebrow">Что умеет приложение</p>
          <h2>Всё, что нужно запускать в моменте, собрано рядом</h2>
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

      <section id="interfaces" className="interfaces-section section-pad">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">Интерфейс</p>
            <h2>Рабочие окна показывают продукт без лишних обещаний</h2>
          </div>
          <p>
            На сайте используются реальные скриншоты приложения: главный пульт, менеджер слайдов, cue-окно,
            редактор сэмпла и управление видео.
          </p>
        </div>
        <div className="product-showcase">
          <figure className="showcase-main reveal-card">
            <img src="/product/main_wind.png" alt="Главный пульт BOSTONCREW SAMPLER" />
            <figcaption>
              <strong>Главный пульт</strong>
              <span>Быстрые слоты, сэмплы, preview медиа и переключение режима работы.</span>
            </figcaption>
          </figure>
          <div className="showcase-grid">
            <figure className="mini-shot reveal-card">
              <img src="/product/slides_manager.png" alt="Менеджер слайдов" />
              <figcaption>Слайды и медиа</figcaption>
            </figure>
            <figure className="mini-shot reveal-card">
              <img src="/product/slide_cue.png" alt="Cue-сетка" />
              <figcaption>Cue-сетка</figcaption>
            </figure>
            <figure className="mini-shot reveal-card">
              <img src="/product/remote_wind.png" alt="Управление видео" />
              <figcaption>Видео-контроль</figcaption>
            </figure>
            <figure className="mini-shot reveal-card">
              <img src="/product/edit_sample.png" alt="Редактор сэмпла" />
              <figcaption>Сэмплы</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="audience-section section-pad">
        <div className="section-heading">
          <p className="eyebrow">Для кого</p>
          <h2>Для людей, которые отвечают за момент перед зрителями</h2>
        </div>
        <div className="audience-grid">
          {audience.map((item) => (
            <article className="audience-card reveal-card" key={item.title}>
              <div className="feature-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="free" className="free-section section-pad">
        <div className="free-copy">
          <p className="eyebrow">Можно начать бесплатно</p>
          <h2>Сначала попробуйте пульт, потом решайте про ключ</h2>
          <p>
            Скачайте BOSTONCREW SAMPLER и попробуйте приложение без ключа. Бесплатный режим подойдёт, чтобы
            разобраться с пультом, проверить сценарий работы и понять, подходит ли инструмент под ваши мероприятия.
          </p>
          <div className="section-actions">
            <a className="primary-link" href="/download">
              <Download size={18} />
              Скачать бесплатно
            </a>
            <a className="secondary-link" href="#comparison">
              Что даёт полный доступ?
            </a>
          </div>
        </div>
        <div className="free-panel reveal-card">
          <span className="panel-label">Без ключа</span>
          <h3>Можно открыть приложение и понять логику работы</h3>
          <ul className="check-list">
            <li>
              <Check size={16} /> познакомиться с интерфейсом;
            </li>
            <li>
              <Check size={16} /> собрать простой сценарий с ограничениями;
            </li>
            <li>
              <Check size={16} /> проверить, подходит ли пульт под ваш формат.
            </li>
          </ul>
        </div>
      </section>

      <section className="workflow-section section-pad">
        <div className="section-heading">
          <p className="eyebrow">Как это работает</p>
          <h2>От скачивания до live-запуска без лишней магии</h2>
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

      <section id="comparison" className="comparison-section section-pad">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">Бесплатно или полный доступ</p>
            <h2>Понятная разница без технического тумана</h2>
          </div>
          <p>
            В проекте не указаны точные лимиты бесплатного режима, поэтому здесь нет выдуманных цифр. Смысл простой:
            бесплатно можно попробовать, ключ нужен для полноценной работы.
          </p>
        </div>
        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Возможность</th>
                <th>Бесплатно</th>
                <th>Полный доступ</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map(([feature, free, full]) => (
                <tr key={feature}>
                  <td>{feature}</td>
                  <td>{free}</td>
                  <td>{full}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="productivity-section section-pad">
        <div className="productivity-copy">
          <p className="eyebrow">Продуктивность на event</p>
          <h2>Больше контроля во время мероприятия</h2>
          <p>
            Когда все медиа лежат в разных местах, ведущий или техник тратит внимание не на событие, а на поиск
            нужного окна. BOSTONCREW SAMPLER сокращает количество переключений: звук, слайды, видео и экран находятся
            рядом.
          </p>
          <p>Это особенно важно в live-режиме, где каждая пауза заметна.</p>
        </div>
        <div className="productivity-stats reveal-card" aria-label="Преимущества в работе">
          <div>
            <Clock3 size={20} />
            <strong>Быстрее подготовка</strong>
            <span>Медиа собираются заранее в одном сценарии.</span>
          </div>
          <div>
            <Play size={20} />
            <strong>Быстрее запуск</strong>
            <span>Нужные действия лежат на кнопках, а не в папках.</span>
          </div>
          <div>
            <ShieldCheck size={20} />
            <strong>Меньше риска</strong>
            <span>Зритель видит сцену, а не ваши рабочие окна.</span>
          </div>
        </div>
      </section>

      <section id="full-access" className="license-section section-pad">
        <div className="license-copy">
          <p className="eyebrow">Полный доступ по ключу</p>
          <h2>Ключ открывает полную версию на одном устройстве</h2>
          <p>
            Когда бесплатного режима становится мало, купите ключ и активируйте приложение на компьютере, с которого
            будете работать на мероприятии.
          </p>
          <ul className="check-list">
            <li>
              <Check size={16} /> полный live-пульт для звука, слайдов и видео;
            </li>
            <li>
              <Check size={16} /> сценическое окно и cue-сетка;
            </li>
            <li>
              <Check size={16} /> сохранение подготовленных сценариев;
            </li>
            <li>
              <Check size={16} /> локальная работа на этом устройстве после активации.
            </li>
          </ul>
          <div className="buy-steps">
            <span>1. Нажимаете “Купить полный доступ”</span>
            <span>2. Оплачиваете доступ</span>
            <span>3. Получаете ключ после подтверждения оплаты</span>
            <span>4. Вводите ключ в приложении</span>
          </div>
        </div>
        <div className="license-aside">
          <CheckoutButton />
          <div className="license-note">
            <BadgeCheck size={18} />
            <span>Один ключ работает на одном устройстве.</span>
          </div>
        </div>
      </section>

      <section className="trust-section section-pad">
        <div className="section-heading">
          <p className="eyebrow">Доверие без выдуманных отзывов</p>
          <h2>Честные факты вместо фейковых кейсов</h2>
        </div>
        <div className="trust-grid">
          {trustItems.map((item) => (
            <article className="trust-card reveal-card" key={item.title}>
              {item.icon}
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
        <div className="reviews-placeholder">
          <strong>Отзывы появятся здесь</strong>
          <span>Добавьте реальные короткие отзывы или кейсы, когда они будут готовы. На странице нет выдуманных цитат.</span>
        </div>
      </section>

      <section id="faq" className="faq-section section-pad">
        <div className="section-heading">
          <p className="eyebrow">FAQ</p>
          <h2>Вопросы, которые лучше закрыть до покупки</h2>
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

      <section className="final-cta section-pad">
        <div>
          <p className="eyebrow">Финальный запуск</p>
          <h2>Соберите мероприятие в один пульт</h2>
          <p>
            Попробуйте BOSTONCREW SAMPLER бесплатно. Если приложение подходит под ваш сценарий, купите ключ и откройте
            полный доступ.
          </p>
        </div>
        <div className="section-actions">
          <a className="primary-link" href="/download">
            <Download size={18} />
            Скачать бесплатно
          </a>
          <a className="secondary-link" href="#full-access">
            Купить полный доступ
          </a>
        </div>
      </section>

      <LegalTabs />

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

      <div className="mobile-cta" aria-label="Быстрые действия">
        <a className="primary-link" href="/download">
          Скачать бесплатно
        </a>
        <a className="secondary-link" href="#full-access">
          Купить
        </a>
      </div>
    </main>
  );
}
