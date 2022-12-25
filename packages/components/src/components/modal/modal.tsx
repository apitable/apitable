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