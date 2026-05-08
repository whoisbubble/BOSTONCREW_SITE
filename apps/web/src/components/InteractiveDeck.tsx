'use client';

import { RotateCcw } from 'lucide-react';
import { CSSProperties, PointerEvent, useRef, useState } from 'react';

type Offset = {
  x: number;
  y: number;
};

type DragState = {
  id: string;
  originX: number;
  originY: number;
  startX: number;
  startY: number;
};

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
  const [offsets, setOffsets] = useState<Record<string, Offset>>({});
  const [active, setActive] = useState<string | null>(null);
  const drag = useRef<DragState | null>(null);

  function startDrag(event: PointerEvent<HTMLElement>, id: string) {
    const offset = offsets[id] ?? { x: 0, y: 0 };

    drag.current = {
      id,
      originX: offset.x,
      originY: offset.y,
      startX: event.clientX,
      startY: event.clientY,
    };

    setActive(id);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: PointerEvent<HTMLElement>) {
    if (!drag.current) {
      return;
    }

    const nextOffset = {
      x: drag.current.originX + event.clientX - drag.current.startX,
      y: drag.current.originY + event.clientY - drag.current.startY,
    };

    setOffsets((current) => ({
      ...current,
      [drag.current!.id]: nextOffset,
    }));
  }

  function stopDrag(event: PointerEvent<HTMLElement>) {
    if (!drag.current) {
      return;
    }

    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // The browser may have already released capture after a gesture cancel.
    }

    drag.current = null;
    setActive(null);
  }

  return (
    <div className="deck-stage" aria-label="Интерфейсы приложения BOSTONCREW SAMPLER">
      <button className="deck-reset" type="button" onClick={() => setOffsets({})} title="Сбросить карточки">
        <RotateCcw size={17} />
      </button>

      <div className="deck-gridlines" aria-hidden="true" />

      {cards.map((card) => {
        const offset = offsets[card.id] ?? { x: 0, y: 0 };
        const style = {
          left: card.left,
          top: card.top,
          width: card.width,
          zIndex: active === card.id ? 20 : card.depth,
          '--drag-x': `${offset.x}px`,
          '--drag-y': `${offset.y}px`,
          '--rotate': `${card.rotate}deg`,
        } as CSSProperties;

        return (
          <article
            className={`deck-card${active === card.id ? ' is-active' : ''}`}
            key={card.id}
            onPointerCancel={stopDrag}
            onPointerDown={(event) => startDrag(event, card.id)}
            onPointerMove={moveDrag}
            onPointerUp={stopDrag}
            style={style}
          >
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
