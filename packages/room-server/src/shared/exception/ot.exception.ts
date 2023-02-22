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

import { OtErrorCode } from '@apitable/core';
import { IBaseException } from './base.exception';

/**
 * handle changeset exception
 */
export class OtException implements IBaseException {

  private static AllValues: { [name: string]: OtException } = {};

  // Exception type -------------------------------
  static readonly OPERATION_ABNORMAL = new OtException(OtErrorCode.SERVER_ERROR, 'Operation Abnormal');
  static readonly REVISION_ERROR = new OtException(OtErrorCode.REVISION_ERROR, 'Version Error');
  static readonly MATCH_VERSION_ERROR = new OtException(OtErrorCode.MATCH_VERSION_ERROR, 'Submit Version Do not Match');
  static readonly META_LOST_ERROR = new OtException(OtErrorCode.META_LOST_ERROR, 'Metadata Lost');
  static readonly APPLY_META_ERROR = new OtException(OtErrorCode.APPLY_META_ERROR, 'Transform Metadata Error');
  static readonly REVISION_CONFLICT = new OtException(OtErrorCode.VERSION_CONFLICT, 'Version Conflict');
  static readonly OPERATION_CONFLICT = new OtException(OtErrorCode.OPERATION_CONFLICT, 'Operation Conflict');
  static readonly REVISION_OVER_LIMIT = new OtException(OtErrorCode.REVISION_OVER_LIMIT, 'Discover a new version, please refresh the page');
  static readonly MSG_ID_DUPLICATE = new OtException(OtErrorCode.MSG_ID_DUPLICATE, 'Message Duplicate');
  static readonly SPACE_CAPACITY_OVER_LIMIT = new OtException(OtErrorCode.SPACE_CAPACITY_OVER_LIMIT, 'Exceed the attachment limit of beta version');
  static readonly DATA_FORMAT_ERROR = new OtException(OtErrorCode.DATA_FORMAT_ERROR, 'Data format error');
  // Exception type -------------------------------

  constructor(public readonly code: number, public readonly message: string) {
    OtException.AllValues[message] = this;
  }

  getCode() {
    return this.code;
  }

  getMessage() {
    return this.message;
  }
}
