import { ModalType, OnOkType } from 'types';
export class EnhanceError extends Error {
  code: string | undefined;
  extra: Record<string, any>;
  title?: string;
  okText?: string;
  modalType?: ModalType;
  onOkType?: OnOkType;
  isShowQrcode?: boolean;

  constructor(e) {
    super(e);
    this.code = e.code;
    this.message = e.message;
    this.extra = e.extra;
    this.title = e.title;
    this.okText = e.okText;
    this.modalType = e.modalType;
    this.onOkType = e.onOkType;
    this.isShowQrcode = e.isShowQrcode;
  }
}
