import { IButtonProps, IButtonType, ITextButtonProps, ThemeProvider } from '@vikadata/components';
import { Selectors, Strings, t } from '@vikadata/core';
import { Modal as AntdModal } from 'antd';
import { ModalFuncProps as AntdModalFuncProps, ModalProps } from 'antd/lib/modal';
import classNames from 'classnames';
import parser from 'html-react-parser';
import { getBillingInfo } from 'pc/common/billing/get_billing_info';
import { ContextName } from 'pc/common/shortcut_key/enum';
import { ShortcutContext } from 'pc/common/shortcut_key/shortcut_key';
import { StatusIconFunc } from 'pc/components/common/icon/icon';
import { FooterBtnInModal } from 'pc/components/common/modal/components/footer_btn';
import { IDingTalkModalType, showModalInDingTalk } from 'pc/components/economy/upgrade_modal';
import { isSocialDingTalk } from 'pc/components/home/social_platform/utils';
import { store } from 'pc/store';
import React, { FC, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Provider, useSelector } from 'react-redux';
import CloseIcon from 'static/icon/common/common_icon_close_large.svg';
import styles from './style.module.less';

export interface IModalFuncProps extends Omit<AntdModalFuncProps, 'okButtonProps' | 'cancelButtonProps' | 'okType' | 'type'> {
  okButtonProps?: IButtonProps;
  cancelButtonProps?: ITextButtonProps;
  okType?: IButtonType;
  type?: IButtonType | 'success' | undefined;
  icon?: React.ReactElement | null;
  hiddenIcon?: boolean;
  closable?: boolean;
  footer?: React.ReactNode;
  hiddenCancelBtn?: boolean;
}

export interface IModalFuncBaseProps extends IModalFuncProps {
  hiddenCancelBtn?: boolean;
}

export interface IModalProps extends Omit<ModalProps, 'okButtonProps' | 'cancelButtonProps' | 'okType'> {
  okButtonProps?: IButtonProps;
  cancelButtonProps?: ITextButtonProps;
  okType?: IButtonType;
  footerBtnCls?: string;
  hiddenCancelBtn?: boolean;
}

export const destroyFns: Array<() => void> = [];

const ModalWithTheme = (props) => {
  const cacheTheme = useSelector(Selectors.getTheme);
  return (
    <ThemeProvider theme={cacheTheme}>
      <AntdModal {...props} />
    </ThemeProvider>
  );
};

const ModalBase: FC<IModalProps> = (props) => {
  const {
    footer, closeIcon, okText, okType, cancelText, okButtonProps, footerBtnCls,
    cancelButtonProps, confirmLoading, onOk, onCancel, className, children, hiddenCancelBtn, ...rest
  } = props;

  useEffect(() => {
    ShortcutContext.bind(ContextName.modalVisible, () => true);
    return () => {
      ShortcutContext.unbind(ContextName.modalVisible);
    };
  });

  const FooterBtnConfig = {
    onOk, onCancel,
    okButtonProps: { loading: confirmLoading, ...okButtonProps },
    cancelButtonProps, okText, okType, cancelText,
    hiddenCancelBtn,
  };

  return (
    <Provider store={store}>
      <ModalWithTheme
        className={classNames(styles.modalBase, className)}
        closeIcon={closeIcon || <CloseIcon />}
        footer={footer === undefined ? <FooterBtnInModal {...FooterBtnConfig} className={footerBtnCls} /> : footer}
        onCancel={onCancel}
        {...rest}
      >
        {children}
      </ModalWithTheme>
    </Provider>
  );
};

const FuncModalBase = (config: IModalFuncBaseProps) => {
  const {
    footer, content, icon, className, title, type, hiddenCancelBtn, hiddenIcon,
    onOk, onCancel, okButtonProps, cancelButtonProps, okText, okType, cancelText,
    ...rest
  } = config;
  const div = document.createElement('div');
  document.body.appendChild(div);

  function destroy() {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
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
      ReactDOM.render(
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
        </Provider>),
        div,
      );
    });
  }

  render();
  return {
    destroy: destroy,
  };
};

const confirm = (props?: IModalFuncProps) => {
  return FuncModalBase({ ...props });
};

const warning = (props?: IModalFuncProps) => {
  return FuncModalBase({
    type: 'warning',
    hiddenCancelBtn: true,
    ...props,
  });
};

const danger = (props?: IModalFuncProps) => {
  return FuncModalBase({
    type: 'danger',
    hiddenCancelBtn: true,
    ...props,
  });
};

const info = (props?: IModalFuncProps) => {
  return FuncModalBase({
    type: 'primary',
    hiddenCancelBtn: true,
    ...props,
  });
};

const success = (props?: IModalFuncProps) => {
  return FuncModalBase({
    type: 'success',
    hiddenCancelBtn: true,
    ...props,
  });
};

interface IModalReturn {
  destroy: () => void;
}

export type IModal = FC<IModalProps> & {
  confirm: (props?: IModalFuncProps) => IModalReturn,
  warning: (props?: IModalFuncProps) => IModalReturn,
  danger: (props?: IModalFuncProps) => IModalReturn,
  error: (props?: IModalFuncProps) => IModalReturn,
  success: (props?: IModalFuncProps) => IModalReturn,
  info: (props?: IModalFuncProps) => IModalReturn,
};

export const Modal = ModalBase as IModal & { destroyAll(): void };
Modal.confirm = confirm;
Modal.warning = warning;
Modal.danger = danger;
Modal.error = danger;
Modal.success = success;
Modal.info = info;

Modal.destroyAll = () => {
  while (destroyFns.length) {
    const close = destroyFns.pop();
    if (close) {
      close();
    }
  }
};

export const BillingModal = (props?: IModalFuncProps) => {
  const state = store.getState();
  const spaceId = state.space.activeId || '';
  const subscription = state.billing.subscription;
  const space = state.space.curSpaceInfo;
  const inDDApp = space && isSocialDingTalk(space);
  const finalOnOk = () => {
    if (inDDApp) {
      showModalInDingTalk(IDingTalkModalType.Upgrade);
    }
    props?.onOk && props.onOk();
  };
  const modalBase = {
    ...props,
    title: props?.title || t(Strings.please_note),
    okText: props?.okText || (inDDApp ? t(Strings.upgrade_pure) : t(Strings.okay)),
    onOk: finalOnOk,
  };
  if (props?.content) {
    Modal.warning({ ...modalBase, content: props.content });
    return;
  }
  if (subscription) {
    Modal.warning({
      ...modalBase, content: parser(t(Strings.grades_restriction_prompt, { grade: subscription.productName })),
    });
    return;
  }
  if (!subscription && spaceId) {
    getBillingInfo(spaceId).then(billingInfoReq => {
      if (!billingInfoReq) {
        return;
      }
      billingInfoReq && Modal.warning({
        ...modalBase,
        content: t(Strings.grades_restriction_prompt),
      });
    });
  }
};
