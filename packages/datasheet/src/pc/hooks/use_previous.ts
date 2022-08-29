import { useRef, useEffect, useMemo } from 'react';

export function usePrevious<T = any>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function useMemoPrevious<T = any>(value: T) {
  const ref = useRef<T>();
  useMemo(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
