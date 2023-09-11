/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import raf from 'rc-util/lib/raf';
import { useRef, useState, useEffect } from 'react';

type SetActionType<T> = Partial<T> | ((state: T) => Partial<T>);

export default function useFrameSetState<T extends object>(initial: T): [T, (newState: SetActionType<T>, immediately?: boolean) => void] {
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
        setState((preState) => {
          let memoState: T = preState;
          queue.current.forEach((queueState) => {
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
