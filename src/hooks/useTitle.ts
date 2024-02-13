import { useEffect } from 'react';

export function useTitle(title: string) {
  useEffect(() => {
    if (document.title !== title) document.title = title;
  }, [title]);
}
