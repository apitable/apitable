import { useCallback, useState } from 'react';

export function useSetState<T extends object>(
  initialState: T = {} as T
): [T, (patch: Partial<T> | ((prevState: T) => Partial<T>)) => void] {
  const [state, setState] = useState<T>(initialState);

  const setMergeState = useCallback((patch) => {
    setState((prevState) => {
      const newState = isFunction(patch) ? patch(prevState) : patch;
      return { ...prevState, ...newState };
    });
  }, []);

  return [state, setMergeState];
}

function isFunction(obj: any): obj is Function {
  return typeof obj === 'function';
}
