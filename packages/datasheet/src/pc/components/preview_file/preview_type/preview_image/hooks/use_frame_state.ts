import { useRef, useState, useEffect } from 'react';
import raf from 'rc-util/lib/raf';

type SetActionType<T> = Partial<T> | ((state: T) => Partial<T>);

export default function useFrameSetState<T extends object>(
  initial: T,
): [T, (newState: SetActionType<T>, immediately?: boolean) => void] {
  const frame = useRef<number | null>(null);
  const [state, setState] = useState(initial);

  const queue = useRef<SetActionType<T>[]>([]);

  const setFrameState = (newState: SetActionType<T>, immediately?: boolean) => {
    const _newState = typeof newState === 'function' ? newState(state) : newState;

    if (immediately) {
      setState(_newState as any);
      return;
    }
    if (frame.current === null) {
      queue.current = [];
      frame.current = raf(() => {
        setState(preState => {
          let memoState: T = preState;
          queue.current.forEach(queueState => {
            memoState = { ...memoState, ...queueState };
          });
          frame.current = null;
          return memoState;
        });
      });
    }

    queue.current.push(_newState);
  };

  useEffect(() => {
    return () => {
      frame.current && raf.cancel(frame.current);
    };
  }, []);

  return [state, setFrameState];
}