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

import { ModalType, OnOkType } from 'types';
export class EnhanceError extends Error {
  code: string | undefined;
  extra?: Record<string, any>;
  title?: string;
  okText?: string;
  modalType?: ModalType;
  onOkType?: OnOkType;
  isShowQrcode?: boolean;

  constructor(e: {
    code?: string | number;
    message: string;
    extra?: Record<string, any>;
    title?: string;
    okText?: string;
    modalType?: ModalType;
    onOkType?: OnOkType;
    isShowQrcode?: boolean;
  }) {
    super(e.message);
    this.code = e.code !== undefined ? String(e.code) : undefined;
    this.message = e.message;
    this.extra = e.extra;
    this.title = e.title;
    this.okText = e.okText;
    this.modalType = e.modalType;
    this.onOkType = e.onOkType;
    this.isShowQrcode = e.isShowQrcode;
  }
}
