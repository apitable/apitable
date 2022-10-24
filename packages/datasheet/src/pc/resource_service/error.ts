import * as Sentry from '@sentry/react';
import { ISubscription, Navigation, OnOkType, OtErrorCode, StatusCode, Strings, t } from '@apitable/core';
import { IServiceError } from '@vikadata/widget-sdk';
import { triggerUsageAlert } from 'pc/common/billing';
import { Message } from 'pc/components/common/message';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { getModalConfig } from 'pc/components/common/modal/qr_code_modal_content';
import { Router } from 'pc/components/route_manager/router';

export const onError: IServiceError = (error, type) => {
  const { isShowQrcode, title, code, message: errorMessage } = error;
  const errorCode = code as number;
  if (type === 'modal') {
    Sentry.captureMessage(errorMessage, {
      extra: error as any,
    });

    let modalType = error.modalType || 'error';
    let contentMessage = errorMessage + `(${errorCode})`;
    // TODO: 临时方案，表单及数表无权限插入或编辑需要报不同的错误以及不同错误码报错需要不同文案
    if(errorCode == StatusCode.NOT_PERMISSION || errorCode == StatusCode.NODE_NOT_EXIST) {
      modalType = 'warning';
      contentMessage = /fom\w+/.test(window.location.href) && errorCode == StatusCode.NOT_PERMISSION ?
        t(Strings.no_datasheet_editing_right) :
        t(Strings.no_file_permission_message) + `(${errorCode})`;
    }
    if(errorCode == OtErrorCode.REVISION_OVER_LIMIT) {
      modalType = 'info';
    }
    const modalOnOk = () => {
      if (modal.destroy()) {
        modal.destroy();
      }
      if (error.onOkType && error.onOkType === OnOkType.BackWorkBench) {
        Router.redirect(Navigation.WORKBENCH);
      } else {
        window.location.reload();
      }
    };

    const modalConfig = getModalConfig({
      title: title || t(Strings.kindly_reminder),
      content: contentMessage,
      okText: error.okText || t(Strings.refresh),
      onOk: modalOnOk,
      maskClosable: false,
      modalButtonType: modalType,
      isShowQrcode
    });
    const modal = Modal[modalType](modalConfig);
    return;
  }

  if (type === 'message') {
    Message.warning({ content: errorMessage });
    return;
  }

  if (type === 'subscribeUsage') {
    triggerUsageAlert(errorMessage as keyof ISubscription, (error as any).extra);
    return;
  }
};
