import { useRef, useEffect } from 'react';

export function usePrevious<T = any>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function useMemoPrevious<T = any>(value: T) {
  const ref = useRef<T>();
  const prev = ref.current;
  if (prev !== value) {
    ref.current = value;
  }
  return prev;
}
