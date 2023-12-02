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

import { IBaseException } from './base.exception';

/**
 * Datasheet Exception
 *
 * @export
 * @class DatasheetException
 * @implements {IBaseException}
 */
export class DatasheetException implements IBaseException {
  private static AllValues: { [name: string]: DatasheetException } = {};

  // Exception Type --------------------------------
  static readonly NOT_EXIST = new DatasheetException(301, 'datasheet not found');
  static readonly VERSION_ERROR = new DatasheetException(301, 'version error');
  static readonly DATASHEET_NOT_EXIST = new DatasheetException(302, 'reference datasheet not found');
  static readonly VIEW_NOT_EXIST = new DatasheetException(302, 'view not found');
  static readonly FOREIGN_DATASHEET_NOT_EXIST = new DatasheetException(302, 'related datasheet not found');
  static readonly SHOW_RECORD_HISTORY_NOT_PERMISSION = new DatasheetException(303, 'record history is not allowed to display');
  static readonly VIEW_ADD_LIMIT = new DatasheetException(304, 'the usage of this function exceed the 30 views limit of beta version');
  static readonly FIELD_ADD_LIMIT = new DatasheetException(304, 'the usage of this function exceed the 200 fields limit of beta version');
  static readonly RECORD_ADD_LIMIT = new DatasheetException(304, 'the usage of this function exceed the 50000 records limit of beta version');
  static readonly FIELD_NOT_EXIST = new DatasheetException(440, 'field does not exist');
  static readonly BUTTON_FIELD_AUTOMATION_NOT_CONFIGURED = new DatasheetException(444, 'button field automation not configured');
  static readonly BUTTON_FIELD_AUTOMATION_TRIGGER_NOT_CONFIGURED = new DatasheetException(445, 'button field automation trigger not configured');
  static readonly RECORD_ADD_LIMIT_PER_DATASHEET = new DatasheetException(
    305,
    'the usage of this function exceed the 50000 records limit of beta version',
  );
  static readonly RECORD_ARCHIVE_LIMIT_PER_DATASHEET = new DatasheetException(
    305,
    'the usage of this function exceed the 10000 records limit of beta version',
  );
  static readonly RECORD_ADD_LIMIT_WITHIN_SPACE = new DatasheetException(
    309,
    'the usage of this function exceed the 50000 records limit of beta version',
  );
  static readonly VIEW_ADD_LIMIT_FOR_GANTT = new DatasheetException(307, 'the usage of this function exceed the 50000 records limit of beta version');
  static readonly VIEW_ADD_LIMIT_FOR_CALENDAR = new DatasheetException(
    308,
    'the usage of this function exceed the 50000 records limit of beta version',
  );
  static readonly SUBSCRIPTION_RECORD_LIMIT = new DatasheetException(951, 'exceed the records limit, please upgrade your subscription plan');

  static getRECORD_ADD_LIMIT_PER_DATASHEETMsg(specification: number, usage: number) {
    // return new DatasheetException(305, t(Strings.max_rows_per_sheet, { specification, usage }));
    return new DatasheetException(305, JSON.stringify({ key: 'max_rows_per_sheet', specification, usage }));
  }

  static getRECORD_ARCHIVE_LIMIT_PER_DATASHEETMsg(specification: number, usage: number) {
    // return new DatasheetException(305, t(Strings.max_archived_rows_per_sheet, { specification, usage }));
    return new DatasheetException(305, JSON.stringify({ key: 'max_archived_rows_per_sheet', specification, usage }));
  }

  static getRECORD_ADD_LIMIT_WITHIN_SPACEMsg(specification: number, usage: number) {
    // return new DatasheetException(309, t(Strings.max_rows_in_space, { specification, usage }));
    return new DatasheetException(309, JSON.stringify({ key: 'max_rows_in_space', specification, usage }));
  }

  static getVIEW_ADD_LIMIT_FOR_GANTTMsg(specification: number, usage: number) {
    // return new DatasheetException(307, t(Strings.max_gantt_views_in_space, { specification, usage }));
    return new DatasheetException(307, JSON.stringify({ key: 'max_gantt_views_in_space', specification, usage }));
  }

  static getVIEW_ADD_LIMIT_FOR_CALENDARMsg(specification: number, usage: number) {
    // return new DatasheetException(308, t(Strings.max_calendar_views_in_space, { specification, usage }));
    return new DatasheetException(308, JSON.stringify({ key: 'max_calendar_views_in_space', specification, usage }));
  }

  // Exception Type --------------------------------

  private constructor(
    public readonly code: number,
    public readonly message: string,
  ) {
    DatasheetException.AllValues[message] = this;
  }

  getCode() {
    return this.code;
  }

  getMessage() {
    return this.message;
  }
}
