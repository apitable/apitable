import { IBaseException } from './base.exception';

/**
 * 数表相关异常组
 *
 * @export
 * @class DatasheetException
 * @implements {IBaseException}
 */
export class DatasheetException implements IBaseException {
  private static AllValues: { [name: string]: DatasheetException } = {};

  // 异常分类定义 Begin
  static readonly NOT_EXIST = new DatasheetException(301, '找不到指定的维格表');
  static readonly VERSION_ERROR = new DatasheetException(301, '版本错误');
  static readonly DATASHEET_NOT_EXIST = new DatasheetException(302, '映射的维格表已不存在');
  static readonly VIEW_NOT_EXIST = new DatasheetException(302, '找不到指定的视图');
  static readonly FOREIGN_DATASHEET_NOT_EXIST = new DatasheetException(302, '关联表不存在');
  static readonly SHOW_RECORD_HISTORY_NOT_PERMISSION = new DatasheetException(303, '不允许展示记录的修改历史');
  static readonly VIEW_ADD_LIMIT = new DatasheetException(304, '您的功能使用量已经超出「公测版」30个视图的限制');
  static readonly FIELD_ADD_LIMIT = new DatasheetException(304, '您的功能使用量已经超出「公测版」200列的限制');
  static readonly RECORD_ADD_LIMIT = new DatasheetException(304, '您的功能使用量已经超出「公测版」50000行的限制');
  static readonly SUBSCRIPTION_RECORD_LIMIT = new DatasheetException(951, '新增记录行数超出限制，请升级订阅计划');
  // 异常分类定义 End

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
