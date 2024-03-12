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

import classNames from 'classnames';
import parser from 'html-react-parser';
import React, { FC } from 'react';
import { Provider } from 'react-redux';
import { Strings, t } from '@apitable/core';
import { CloseOutlined } from '@apitable/icons';
import { getBillingInfo } from 'modules/billing';
import { FooterBtnInModal } from 'pc/components/common/modal/components/footer_btn';
import { IDingTalkModalType, showModalInDingTalk } from 'pc/components/economy/upgrade_modal';
import { store } from 'pc/store';
import { confirm, danger, info, success, warning } from './modal.function';
import { IModalFuncProps, IModalProps, IModalReturn } from './modal.interface';
import { ModalWithTheme } from './modal_with_theme';
import { destroyFns } from './utils';
// @ts-ignore
import { isSocialDingTalk } from 'enterprise/home/social_platform/utils';
import styles from './style.module.less';

const ModalBase: FC<React.PropsWithChildren<IModalProps>> = (props) => {
  const {
    footer,
    closeIcon,
    okText,
    okType,
    cancelText,
    okButtonProps,
    footerBtnCls,
    cancelButtonProps,
    confirmLoading,
    onOk,
    onCancel,
    className,
    children,
    hiddenCancelBtn,
    ...rest
  } = props;

  // TODO: effect pc/components/editors/container.tsx short key bind
  // useEffect(() => {
  //   ShortcutContext.bind(ContextName.modalVisible, () => true);
  //   return () => {
  //     ShortcutContext.bind(ContextName.modalVisible, () => false);
  //   };
  // });

  const FooterBtnConfig = {
    onOk,
    onCancel,
    okButtonProps: { loading: confirmLoading, ...okButtonProps },
    cancelButtonProps,
    okText,
    okType,
    cancelText,
    hiddenCancelBtn,
  };

  return (
    <Provider store={store}>
      <ModalWithTheme
        className={classNames(styles.modalBase, className)}
        closeIcon={closeIcon || <CloseOutlined />}
        footer={footer === undefined ? <FooterBtnInModal {...FooterBtnConfig} className={footerBtnCls} /> : footer}
        onCancel={onCancel}
        {...rest}
      >
        {children}
      </ModalWithTheme>
    </Provider>
  );
};

export type IModal = FC<React.PropsWithChildren<IModalProps>> & {
  confirm: (props?: IModalFuncProps) => IModalReturn;
  warning: (props?: IModalFuncProps) => IModalReturn;
  danger: (props?: IModalFuncProps) => IModalReturn;
  error: (props?: IModalFuncProps) => IModalReturn;
  success: (props?: IModalFuncProps) => IModalReturn;
  info: (props?: IModalFuncProps) => IModalReturn;
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
  const subscription = state.billing?.subscription;
  const space = state.space.curSpaceInfo;
  const inDDApp = space && isSocialDingTalk?.(space);
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
      ...modalBase,
      content: parser(t(Strings.grades_restriction_prompt, { grade: subscription.productName })),
    });
    return;
  }
  if (!subscription && spaceId) {
    getBillingInfo(spaceId).then((billingInfoReq: any) => {
      if (!billingInfoReq) {
        return;
      }
      billingInfoReq &&
        Modal.warning({
          ...modalBase,
          content: t(Strings.grades_restriction_prompt),
        });
    });
  }
};
