import { ThemeProvider } from '@vikadata/components';
import { Modal } from 'antd-mobile';
import { Action } from 'antd-mobile/lib/modal/PropsType';
import closest from 'antd-mobile/lib/_util/closest';
import { useState } from 'react';
import * as React from 'react';
import ReactDOM from 'react-dom';

interface IPromptInnerProps {
  title: React.ReactNode;
  callbackOrActions: Action<React.CSSProperties>[];
  defaultValue: string;
  placeholder?: string;
}
const prefixCls = 'am-modal';

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
            type="text"
            defaultValue={defaultValue}
            ref={input => input?.focus()}
            onChange={onChange}
            placeholder={placeholder}
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
      onPress: () => {
        return handleConfirm(item.onPress);
      },
    };
  });

  const footer = actions.map(button => {
    const originPress = button.onPress || (() => { });
    button.onPress = () => {
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

  function onWrapTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    // exclude input element for focus
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }
    const pNode = closest(e.target as Element, `.${prefixCls}-content`);
    if (!pNode) {
      e.preventDefault();
    }
  }

  return (
    <Modal
      visible
      transparent
      prefixCls={prefixCls}
      title={title}
      closable={false}
      maskClosable={false}
      transitionName="am-zoom"
      footer={footer}
      maskTransitionName="am-fade"
      platform='ios'
      wrapProps={{ onTouchStart: onWrapTouchStart }}
    >
      <div className={`${prefixCls}-propmt-content`}>{content}</div>
    </Modal>
  );
};

export default function promptFunc(
  props: IPromptInnerProps,
) {

  const div = document.createElement('div');
  document.body.appendChild(div);

  function close() {
    ReactDOM.unmountComponentAtNode(div);
    if (div && div.parentNode) {
      div.parentNode.removeChild(div);
    }
  }

  ReactDOM.render(
    <ThemeProvider>
      <PromptInner
        {...props}
        close={close}
      />
    </ThemeProvider>,
    div,
  );

  return {
    close,
  };
}