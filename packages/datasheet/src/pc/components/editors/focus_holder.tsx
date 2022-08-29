/**
 * 用来获取 focus 焦点的组件
 * 有些 editor 不需要执行用户键盘输入操作（比如：附件）
 * 为了保证编辑器逻辑的一致性，需要一个 focus holder 来获取用户焦点
 */
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
