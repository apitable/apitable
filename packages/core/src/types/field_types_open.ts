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

import type { IAttachmentValue } from './field_types';

export interface ISelectFieldBaseOpenValue {
  id: string;
  name: string;
  color: {
    name: string;
    value: string;
  };
}

export interface IMemberFieldOpenValue {
  id: string;
  name: string;
  type: 'Team' | 'Member';

  /**
   * Member avatar / user picture
   */
  avatar?: string;
}

export interface ILinkFieldOpenValue {
  /**
   * record's ID
   */
  recordId: string,

  /**
   * record's title
   */
  title: string
}

export interface IAttachmentFieldOpenValue extends IAttachmentValue {
  /**
   * attachment full url
   */
  url: string;
  /**
   * attachment preview url
   */
  previewUrl?: string;
}

export type BasicOpenValueTypeBase =
  string | number | boolean | IMemberFieldOpenValue | ISelectFieldBaseOpenValue | ISelectFieldBaseOpenValue[] | ILinkFieldOpenValue[] |
  IAttachmentFieldOpenValue[];

export type ILookUpOpenValue = BasicOpenValueTypeBase[];

export type BasicOpenValueType = ILookUpOpenValue | BasicOpenValueTypeBase;
