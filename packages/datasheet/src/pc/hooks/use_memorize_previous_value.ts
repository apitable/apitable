import { useRef } from 'react';

export const useMemorizePreviousValue = (value: any) => {
  const previousValue = useRef<any>(null);
  const lastValue = value;

  const isSameValue = JSON.stringify(previousValue.current) === JSON.stringify(lastValue);

  if (isSameValue) {
    return previousValue.current;
  }

  previousValue.current = lastValue;
  return lastValue;
};