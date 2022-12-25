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

import { FuncModalBase } from './func_modal_base';
import { IModalFuncProps } from './modal.interface';

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
