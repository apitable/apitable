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
  static readonly SUBSCRIPTION_RECORD_LIMIT = new DatasheetException(951, 'exceed the records limit, please upgrade your subscription plan');
  // Exception Type --------------------------------

  private constructor(public readonly code: number, public readonly message: string) {
    DatasheetException.AllValues[message] = this;
  }

  getCode() {
    return this.code;
  }

  getMessage() {
    return this.message;
  }
}
