import { useState, useCallback, useEffect, useRef } from 'react';

export function useHeroSlider(slideCount: number, interval = 5000) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slideCount);
  }, [slideCount]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slideCount) % slideCount);
  }, [slideCount]);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  const pause = useCallback(() => setPaused(true), []);
  const resume = useCallback(() => setPaused(false), []);

  useEffect(() => {
    if (paused || slideCount <= 1) return;
    timerRef.current = setInterval(next, interval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, next, interval, slideCount]);

  return { current, next, prev, goTo, pause, resume };
}
