import { useRef } from 'react';

export function useLatest<T>(value: T): { readonly current: T } {
  const savedValue = useRef<T>(value);
  savedValue.current = value;
  return savedValue;
}
