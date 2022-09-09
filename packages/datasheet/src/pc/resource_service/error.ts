import * as Sentry from '@sentry/react';
import { ISubscription, Navigation, OnOkType, OtErrorCode, StatusCode, Strings, t } from '@vikadata/core';
import { IServiceError } from '@vikadata/widget-sdk';
import { triggerUsageAlert } from 'pc/common/billing';
import { Message } from 'pc/components/common/message';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { QRCodeModalContent } from 'pc/components/common/modal/qr_code_modal_content';
import { Method, navigatePath } from 'pc/components/route_manager/use_navigation';

export const onError: IServiceError = (error, type) => {
  console.log('error', error, type);
  if (type === 'modal') {
    Sentry.captureMessage(error.message, {
      extra: error as any,
    });

    let modalType = error.modalType || 'error';
    let contentMessage = error.message + `(${error.code})`;
    // TODO: 临时方案，表单及数表无权限插入或编辑需要报不同的错误以及不同错误码报错需要不同文案
    if(error.code as string | number === StatusCode.NOT_PERMISSION || error.code as string | number === StatusCode.NODE_NOT_EXIST) {
      modalType = 'warning';
      contentMessage = /fom\w+/.test(window.location.href) ?
        t(Strings.no_datasheet_editing_right) :
        t(Strings.no_file_permission_message) + `(${error.code})`;
    }
    if(error.code as string | number === OtErrorCode.REVISION_OVER_LIMIT) {
      modalType = 'info';
    }
    const modalOnOk = () => {
      if(modal.destroy()) {
        modal.destroy();
      }
      if(error.onOkType && error.onOkType === OnOkType.BackWorkBench) {
        navigatePath({
          path: Navigation.WORKBENCH,
          method: Method.Redirect,
        });
      } else {
        window.location.reload();
      }
    };
    const isShowQrcode = error.isShowQrcode || error.isShowQrcode === undefined ? true : error.isShowQrcode;
    const modalConfig = isShowQrcode ? {
      title: error.title ? error.title : t(Strings.kindly_reminder),
      content: QRCodeModalContent({
        content: contentMessage,
        onOk: modalOnOk,
        okText: error.okText || t(Strings.refresh),
        modalButtonType: modalType
      }) ,
      footer: null,
      maskClosable: false,
    } : {
      title: error.title ? error.title : t(Strings.kindly_reminder),
      content: contentMessage,
      okText: error.okText || t(Strings.refresh),
      onOk: modalOnOk,
      maskClosable: false,
    };
    const modal = Modal[modalType](modalConfig);
    return;
  }

  if (type === 'message') {
    Message.warning({ content: error.message });
    return;
  }

  if (type === 'subscribeUsage') {
    triggerUsageAlert(error.message as keyof ISubscription, (error as any).extra);
    return;
  }
};
