import { Strings, t } from '@vikadata/core';
import classNames from 'classnames';
import parser from 'html-react-parser';
import { getBillingInfo } from 'pc/common/billing/get_billing_info';
import { ContextName } from 'pc/common/shortcut_key/enum';
import { ShortcutContext } from 'pc/common/shortcut_key/shortcut_key';
import { FooterBtnInModal } from 'pc/components/common/modal/components/footer_btn';
import { confirm, danger, info, success, warning } from 'pc/components/common/modal/modal/modal.function';
import { IModalFuncProps, IModalProps, IModalReturn } from 'pc/components/common/modal/modal/modal.interface';
import { ModalWithTheme } from 'pc/components/common/modal/modal/modal_with_theme';
import { IDingTalkModalType, showModalInDingTalk } from 'pc/components/economy/upgrade_modal';
import { isSocialDingTalk } from 'pc/components/home/social_platform/utils';
import { store } from 'pc/store';
import React, { FC, useEffect } from 'react';
import { Provider } from 'react-redux';
import CloseIcon from 'static/icon/common/common_icon_close_large.svg';
import styles from './style.module.less';

export const destroyFns: Array<() => void> = [];

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
