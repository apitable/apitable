import classNames from 'classnames';
import { StatusIconFunc } from 'pc/components/common/icon';
import { FooterBtnInModal } from 'pc/components/common/modal/components/footer_btn';
import { store } from 'pc/store';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import CloseIcon from 'static/icon/common/common_icon_close_large.svg';
import { IModalFuncBaseProps } from './modal.interface';
import { ModalWithTheme } from './modal_with_theme';
import styles from './style.module.less';
import { destroyFns } from './utils';

export const FuncModalBase = (config: IModalFuncBaseProps) => {
  const {
    footer, content, icon, className, title, type, hiddenCancelBtn, hiddenIcon,
    onOk, onCancel, okButtonProps, cancelButtonProps, okText, okType, cancelText,
    ...rest
  } = config;
  const div = document.createElement('div');
  document.body.appendChild(div);
  const root = createRoot(div);

  function destroy() {
    root.unmount();
    if (div.parentNode) {
      div.parentNode.removeChild(div);
    }
    for (let index = 0; index < destroyFns.length; index++) {
      const fn = destroyFns[index];
      if (fn === destroy) {
        destroyFns.splice(index, 1);
        break;
      }
    }
  }

  destroyFns.push(destroy);

  // function close() {
  //   setTimeout(() => {
  //     destroy();
  //   }, 0);
  // }
  const finalIcon = icon ||
    (type ? <div className={styles.statusIcon}>{StatusIconFunc({ type, width: 24, height: 24 })}</div> : null);

  const finalOnOk = () => {
    onOk && onOk();
    destroy();
  };
  const finalOnCancel = () => {
    onCancel && onCancel();
    destroy();
  };
  const FooterBtnConfig = {
    onOk: finalOnOk, onCancel: finalOnCancel, okButtonProps: { color: type || 'primary', ...okButtonProps },
    hiddenCancelBtn, cancelButtonProps, okText, okType, cancelText,
  };

  function render() {
    setTimeout(() => {
      root.render(
        (<Provider store={store}>
          <ModalWithTheme
            visible
            onCancel={finalOnCancel}
            footer={footer === undefined ? <FooterBtnInModal {...FooterBtnConfig} /> : footer}
            width={416}
            closable={false}
            centered
            closeIcon={<CloseIcon />}
            className={classNames(styles.funcModal, className)}
            onOk={finalOnOk}
            {...rest}
          >
            <div className={classNames(styles.body, { [styles.noTitle]: !title })}>
              <div className={styles.titleContent}>
                {
                  !hiddenIcon && finalIcon &&
                  <div className={styles.iconWrapper}>
                    {finalIcon}
                  </div>
                }
                {title && <h6 className={styles.title}>{title}</h6>}
              </div>
              <div className={styles.text}>
                {content &&
                  <div className={styles.content}>
                    {content}
                  </div>
                }
              </div>
            </div>
          </ModalWithTheme>
        </Provider>)
      );
    });
  }

  render();
  return {
    destroy: destroy,
  };
};
