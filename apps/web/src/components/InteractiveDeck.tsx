import type { CSSProperties } from 'react';

type DeckCard = {
  alt: string;
  badge: string;
  depth: number;
  id: string;
  left: string;
  rotate: number;
  src: string;
  title: string;
  top: string;
  width: string;
};

const cards: DeckCard[] = [
  {
    id: 'main',
    src: '/product/main_wind.png',
    title: 'Главный пульт',
    badge: 'LIVE',
    alt: 'Главное окно BOSTONCREW SAMPLER',
    left: '5%',
    top: '13%',
    width: '60%',
    rotate: -6,
    depth: 5,
  },
  {
    id: 'slides',
    src: '/product/slides_manager.png',
    title: 'Менеджер слайдов',
    badge: 'SLIDES',
    alt: 'Окно менеджера слайдов',
    left: '38%',
    top: '4%',
    width: '53%',
    rotate: 5,
    depth: 4,
  },
  {
    id: 'cue',
    src: '/product/slide_cue.png',
    title: 'Cue-сетка',
    badge: 'CUE',
    alt: 'Окно выбора cue',
    left: '52%',
    top: '45%',
    width: '39%',
    rotate: -3,
    depth: 6,
  },
  {
    id: 'remote',
    src: '/product/remote_wind.png',
    title: 'Remote',
    badge: 'VIDEO',
    alt: 'Окно удаленного управления видео',
    left: '13%',
    top: '57%',
    width: '37%',
    rotate: 7,
    depth: 3,
  },
];

export function InteractiveDeck() {
  return (
    <div className="deck-stage" aria-label="Интерфейсы приложения BOSTONCREW SAMPLER">
      <div className="deck-gridlines" aria-hidden="true" />

      {cards.map((card) => {
        const style = {
          left: card.left,
          top: card.top,
          width: card.width,
          zIndex: card.depth,
          '--rotate': `${card.rotate}deg`,
        } as CSSProperties;

        return (
          <article className="deck-card" key={card.id} style={style}>
            <div className="deck-card-bar">
              <span>{card.badge}</span>
              <strong>{card.title}</strong>
            </div>
            <img draggable={false} src={card.src} alt={card.alt} />
          </article>
        );
      })}
    </div>
  );
}
