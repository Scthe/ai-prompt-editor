import type { RefObject } from 'react';
import { useGlobalEventListener } from './useGlobalEventListener';

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
): void {
  useGlobalEventListener('mousedown', (event) => {
    const target = event.target as Node;

    const isOutside = ref.current && !ref.current.contains(target);

    if (isOutside) {
      handler(event);
    }
  });
}
