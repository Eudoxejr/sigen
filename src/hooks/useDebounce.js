import { useCallback, useEffect } from 'react';

export const useDebounce = (
  fn = () => {},
  delay = 0,
  deps = [],
) => {
  const callback = useCallback(fn, deps);

  useEffect(() => {
    const handler = setTimeout(() => callback(), delay);

    return () => {
      clearTimeout(handler);
    };
  }, [callback]);
};
