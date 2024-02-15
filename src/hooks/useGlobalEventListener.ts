import * as React from 'react';
import { useEffect } from 'react';

export function useGlobalEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (e: WindowEventMap[K]) => void
): void {
  const handlerRef = React.useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const handlerFn: typeof handler = (event) => {
      handlerRef.current?.(event);
    };

    window.addEventListener(eventName, handlerFn);
    return () => {
      window.removeEventListener(eventName, handlerFn);
    };
  }, [eventName]);
}
