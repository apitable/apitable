import { useImperativeHandle, forwardRef, useRef } from 'react';

import * as React from 'react';
import style from './style.module.less';

const noop = () => { };

export const FocusHolderBase: React.ForwardRefRenderFunction<{ focus(): void }> = (_, ref) => {
  const focusRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => { focusRef.current && focusRef.current.focus(); },
    setValue: noop,
    saveValue: noop,
  }));

  return <input style={{ height: 0 }} ref={focusRef} className={style.focusHolder} />;
};

export const FocusHolder = forwardRef(FocusHolderBase);
