import { useLayoutEffect, useState } from 'react';

const testMediaQuery = (
  query: string,
  defaultValue: boolean = false
): boolean => {
  if (typeof window !== 'undefined') {
    return window.matchMedia(query).matches;
  }
  return defaultValue;
};

export function useMediaQuery(
  query: string,
  defaultValue: boolean = false
): boolean {
  const [matches, setMatches] = useState<boolean>(defaultValue);

  useLayoutEffect(() => {
    const matchMedia = window.matchMedia(query);

    function handleChange() {
      setMatches(testMediaQuery(query));
    }

    handleChange();

    matchMedia.addEventListener('change', handleChange);

    return () => {
      matchMedia.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}
