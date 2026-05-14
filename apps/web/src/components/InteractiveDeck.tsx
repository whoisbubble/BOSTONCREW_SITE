type DeckCard = {
  alt: string;
  badge: string;
  id: string;
  src: string;
  title: string;
};

const cards: DeckCard[] = [
  {
    id: 'main',
    src: '/product/main_wind.png',
    title: 'Главный пульт',
    badge: 'LIVE',
    alt: 'Главное окно BOSTONCREW SAMPLER',
  },
  {
    id: 'slides',
    src: '/product/slides_manager.png',
    title: 'Слайды и медиа',
    badge: 'MEDIA',
    alt: 'Окно менеджера слайдов',
  },
  {
    id: 'cue',
    src: '/product/slide_cue.png',
    title: 'Cue-сетка',
    badge: 'CUE',
    alt: 'Окно выбора cue',
  },
  {
    id: 'remote',
    src: '/product/remote_wind.png',
    title: 'Видео-контроль',
    badge: 'VIDEO',
    alt: 'Окно удаленного управления видео',
  },
];

export function InteractiveDeck() {
  const [mainCard, ...sideCards] = cards;

  return (
    <div className="deck-stage" aria-label="Интерфейсы приложения BOSTONCREW SAMPLER">
      <article className="deck-card deck-card-main">
        <div className="deck-card-bar">
          <span>{mainCard.badge}</span>
          <strong>{mainCard.title}</strong>
        </div>
        <img draggable={false} src={mainCard.src} alt={mainCard.alt} />
      </article>

      <div className="deck-side">
        <div className="deck-caption">
          <span>Live-пульт</span>
          <strong>Звук, слайды, видео и сцена рядом</strong>
        </div>

        {sideCards.map((card) => (
          <article className="deck-card deck-card-mini" key={card.id}>
            <div className="deck-card-bar">
              <span>{card.badge}</span>
              <strong>{card.title}</strong>
            </div>
            <img draggable={false} src={card.src} alt={card.alt} />
          </article>
        ))}
      </div>
    </div>
  );
}
