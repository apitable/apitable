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
  FieldType, IField, IFilterCondition,
  IFilterInfo,
} from '@apitable/core';

export interface IFilterValueProps {
  field: IField;
  conditionIndex: number;
  condition: IFilterCondition<FieldType>;
  changeFilter: (cb: ExecuteFilterFn) => void;
  hiddenClientOption?: boolean;
  style?: React.CSSProperties;
}

export interface IFilterOptionProps {
  field: IField;
  condition: IFilterCondition<FieldType>;
  onChange: (value: string | string[] | null) => void;
}

export type IFilterMemberProps = IFilterOptionProps;

export interface IFilterBaseProps {
  field: IField;
  condition: IFilterCondition<FieldType>;
}
export interface IFilterDateProps extends IFilterBaseProps {
  onChange: (value: string | string[] | null) => void;
  conditionIndex: number;
  changeFilter: (cb: ExecuteFilterFn) => void;
}

export interface IFilterNumberProps extends IFilterBaseProps {
  onChange: (value: string | string[] | null) => void;
}

export interface IFilterCheckboxProps extends IFilterBaseProps {
  onChange: (value: boolean | null) => void;
}

export type ExecuteFilterFn = (value: IFilterInfo) => IFilterInfo | null;
