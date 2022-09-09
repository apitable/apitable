import { FuncModalBase } from 'pc/components/common/modal/modal/func_modal_base';
import { IModalFuncProps } from 'pc/components/common/modal/modal/modal.interface';

export const confirm = (props?: IModalFuncProps) => {
  return FuncModalBase({ ...props });
};
export const warning = (props?: IModalFuncProps) => {
  return FuncModalBase({
    type: 'warning',
    hiddenCancelBtn: true,
    ...props,
  });
};
export const danger = (props?: IModalFuncProps) => {
  return FuncModalBase({
    type: 'danger',
    hiddenCancelBtn: true,
    ...props,
  });
};
export const info = (props?: IModalFuncProps) => {
  return FuncModalBase({
    type: 'primary',
    hiddenCancelBtn: true,
    ...props,
  });
};
export const success = (props?: IModalFuncProps) => {
  return FuncModalBase({
    type: 'success',
    hiddenCancelBtn: true,
    ...props,
  });
};
