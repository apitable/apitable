import { ThemeProvider } from '@vikadata/components';
import { Modal } from 'antd-mobile';
import type { Action } from 'antd-mobile/es/components/modal';
import * as React from 'react';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';

interface IPromptInnerProps {
  title: React.ReactNode;
  callbackOrActions: Action[];
  defaultValue: string;
  placeholder?: string;
}

const prefixCls = 'adm-modal';

const PromptInner: React.FC<IPromptInnerProps & { close(): void }> = ({
  title,
  callbackOrActions,
  defaultValue,
  placeholder,
  close,
}) => {

  const [value, setValue] = useState(defaultValue);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.target;
    setValue(target.value);
  }

  const content = (
    <div className={`${prefixCls}-input-container`}>
      <div className={`${prefixCls}-input`}>
        <label>
          <input
            type='text'
            defaultValue={defaultValue}
            ref={input => input?.focus()}
            onChange={onChange}
            placeholder={placeholder}
            style={{ border: 'none' }}
          />
        </label>
      </div>
    </div>
  );

  function handleConfirm(callback?: (...args: any[]) => void) {
    if (typeof callback !== 'function') {
      return;
    }

    return callback(value);
  }

  const actions = callbackOrActions.map(item => {
    return {
      text: item.text,
      onClick: () => {
        return handleConfirm(item.onClick);
      },
    };
  });

  const footer = actions.map(button => {
    const originPress = button.onClick || (() => { });
    button.onClick = () => {
      const res: any = originPress();
      if (res && res.then) {
        res
          .then(() => {
            close();
          })
          .catch(() => { });
      } else {
        close();
      }
    };
    return button;
  });

  return (
    <Modal
      visible
      title={title}
      showCloseButton={false}
      closeOnMaskClick={false}
      actions={footer as any}
      content={<div className={`${prefixCls}-propmt-content`}>{content}</div>}
    />
  );
};

export default function promptFunc(
  props: IPromptInnerProps,
) {

  const div = document.createElement('div');
  document.body.appendChild(div);
  const root = createRoot(div);

  function close() {
    root.unmount();
    if (div && div.parentNode) {
      div.parentNode.removeChild(div);
    }
  }

  root.render(
    <ThemeProvider>
      <PromptInner
        {...props}
        close={close}
      />
    </ThemeProvider>,
  );

  return {
    close,
  };
}
