import {
  IModalFuncProps,
  IModalFuncs,
} from './interface';
import { ModalBase } from './components/modal_base';
import {
  confirm,
  withConfirm,
  withDanger,
  withError,
  withInfo,
  withSuccess,
  withWarning
} from './components/confirm';

type ModalType = typeof ModalBase & IModalFuncs & { destroyAll(): void };
export const destroyFns: Array<() => void> = [];

const Modal = ModalBase as ModalType;

Modal.confirm = (props: IModalFuncProps) => {
  return confirm(withConfirm(props));
};

Modal.warning = (props: IModalFuncProps) => {
  return confirm(withWarning(props));
};

Modal.danger = (props: IModalFuncProps) => {
  return confirm(withDanger(props));
};

Modal.error = (props: IModalFuncProps) => {
  return confirm(withError(props));
};

Modal.success = (props: IModalFuncProps) => {
  return confirm(withSuccess(props));
};

Modal.info = (props: IModalFuncProps) => {
  return confirm(withInfo(props));
};

Modal.destroyAll = () => {
  while(destroyFns.length) {
    const close = destroyFns.pop();
    if (close) {
      close();
    }
  }
};

export {
  Modal
};