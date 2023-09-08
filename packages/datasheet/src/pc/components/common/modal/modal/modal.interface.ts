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

import { ModalFuncProps as AntdModalFuncProps, ModalProps } from 'antd/lib/modal';
import React from 'react';
import { IButtonProps, IButtonType, ITextButtonProps } from '@apitable/components';

export interface IModalFuncProps extends Omit<AntdModalFuncProps, 'okButtonProps' | 'cancelButtonProps' | 'okType' | 'type'> {
  okButtonProps?: IButtonProps;
  cancelButtonProps?: ITextButtonProps;
  okType?: IButtonType;
  type?: IButtonType | 'success' | undefined;
  icon?: React.ReactElement | null;
  hiddenIcon?: boolean;
  closable?: boolean;
  footer?: React.ReactNode;
  hiddenCancelBtn?: boolean;
}

export interface IModalFuncBaseProps extends IModalFuncProps {
  hiddenCancelBtn?: boolean;
}

export interface IModalProps extends Omit<ModalProps, 'okButtonProps' | 'cancelButtonProps' | 'okType'> {
  okButtonProps?: IButtonProps;
  cancelButtonProps?: ITextButtonProps;
  okType?: IButtonType;
  footerBtnCls?: string;
  hiddenCancelBtn?: boolean;
}

export interface IModalReturn {
  destroy: () => void;
}
