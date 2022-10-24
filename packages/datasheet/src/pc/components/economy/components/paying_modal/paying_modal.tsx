import { Button, IconButton } from '@vikadata/components';
import { CloseLargeOutlined } from '@vikadata/icons';
import classNames from 'classnames';
import * as React from 'react';
import { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';

interface IPayingModal {
  visible?: boolean,
  onOk?: React.MouseEventHandler,
  onCancel?: React.MouseEventHandler,
  closeOnClickMask?: boolean,
  container: Element,
  header: React.ReactNode | null,
  footer?: React.ReactNode | null,
  maxHeight?: string,
}

interface IShowPayingModalBase extends Omit<IPayingModal, 'container'> {
  main: React.ReactNode;
}

function scopeClassMaker(prefix: string) {
  return function(name ?: string) {
    return [prefix, name].filter(Boolean).join('-');
  };
}

const scopedClass = scopeClassMaker('paying-modal');
const sc = scopedClass;

const isNull = (exp: any) => {
  return Boolean(!exp && typeof (exp) !== 'undefined' && exp !== 0);
};

const PayingModal: React.FunctionComponent<IPayingModal> = (props) => {
  const { visible, closeOnClickMask, container, onCancel, onOk, header, footer, maxHeight = 'calc(100vh - 40px)' } = props;

  const close = (e) => {
    props.container.classList.add(sc('out'));
    setTimeout(() => {
      onCancel && onCancel(e);
    }, 400);
  };
  const onClickClose: React.MouseEventHandler = (e) => {
    close(e);
  };
  const onClickMask: React.MouseEventHandler = (e) => {
    if (closeOnClickMask) {
      close(e);
    }
  };
  const x = visible ?
    <Fragment>
      <div className={classNames(sc('mask'))} onClick={onClickMask} />
      <div className={classNames(sc('body'))}>
        <div className={classNames(sc('content'))} style={{ width: '888px', maxHeight }}>
          <div className={sc('close')}>
            <IconButton icon={CloseLargeOutlined} variant='blur' onClick={onClickClose} />
          </div>
          {!isNull(header) && <header className={sc('header')}>{header}</header>}
          <main className={sc('main')}>
            {props.children}
          </main>
          {!isNull(footer) && <footer className={sc('footer')}>
            {
              footer ||
              <div><Button onClick={onClickClose}>取消</Button><Button onClick={onOk}>确定</Button></div>
            }
          </footer>
          }
        </div>
      </div>
    </Fragment>
    :
    null;
  container.classList.add(sc());
  return (
    ReactDOM.createPortal(x, container)
  );
};

export const showPayingModalBase = (data: IShowPayingModalBase) => {
  const { visible = true, main, onCancel, ...rest } = data;
  const div = document.createElement('div');
  const root = createRoot(div);
  const close = (e?: any) => {
    root.render(React.cloneElement(component, { visible: false }));
    root.unmount();
    div.remove();
    onCancel && onCancel(e);
  };
  const component =
    <PayingModal
      visible={visible}
      onCancel={close}
      container={div}
      closeOnClickMask
      {...rest}
    >
      {main}
    </PayingModal>;

  document.body.append(div);
  root.render(component);
  return close;
};

