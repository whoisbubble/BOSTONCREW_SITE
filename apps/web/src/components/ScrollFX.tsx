'use client';

import { useEffect } from 'react';

export function ScrollFX() {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;

    const applyScroll = () => {
      frame = 0;
      const viewport = Math.max(window.innerHeight, 1);
      const scrollY = window.scrollY;
      const drift = Math.min(180, scrollY * 0.11);
      const progress = Math.min(1, scrollY / viewport);

      root.style.setProperty('--scroll-drift', `${drift.toFixed(1)}px`);
      root.style.setProperty('--scroll-progress', progress.toFixed(3));
    };

    const requestScroll = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(applyScroll);
      }
    };

    const applyPointer = (event: PointerEvent) => {
      const x = (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 28;
      const y = (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 22;

      root.style.setProperty('--pointer-x', `${x.toFixed(1)}px`);
      root.style.setProperty('--pointer-y', `${y.toFixed(1)}px`);
    };

    applyScroll();
    window.addEventListener('scroll', requestScroll, { passive: true });
    window.addEventListener('resize', requestScroll);
    window.addEventListener('pointermove', applyPointer, { passive: true });

    return () => {
      window.removeEventListener('scroll', requestScroll);
      window.removeEventListener('resize', requestScroll);
      window.removeEventListener('pointermove', applyPointer);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  return null;
}
