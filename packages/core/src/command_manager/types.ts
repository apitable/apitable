import { IOperation } from 'engine';
import { IFieldMap, IReduxState, ISubscription } from 'store/interface';
import { ILinkedActions } from './command';
import { LinkedDataConformanceMaintainer, MemberFieldMaintainer } from 'model';
import { ResourceType } from 'types';
import { CollaCommandName } from 'commands';

export interface ICollaCommandExecuteContext {
  model: IReduxState;
  ldcMaintainer: LinkedDataConformanceMaintainer;
  memberFieldMaintainer: MemberFieldMaintainer;
  fieldMapSnapshot: IFieldMap;
  subscribeUsageCheck: (functionName: keyof ISubscription, value: any) => any
}

export enum ExecuteType {
  Execute,
  Undo,
  Redo,
}

export enum ExecuteResult {
  /** 无需执行 */
  None = 'None',
  Fail = 'Fail',
  Success = 'Success',
}

export enum ExecuteFailReason {
  /** 也不知道哪里出错了 */
  Unknown = 'Unknown',

  /** action 校验失败 */
  ActionError = 'ActionError',

  /** 对不支持的 field, view 进行操作 */
  NotSupport = 'NotSupport',

  /** table, view 名字重复 */
  NameRepeat = 'NameRepeat',

  /** 最后一个，无法删除 */
  LastOne = 'LastOne',

  /** 字段类型不匹配 */
  FieldTypeNotMatch = 'FieldTypeNotMatch',

  /** 传递的参数问题 */
  WrongOptions = 'WrongOptions',
}

export interface ICollaCommandExecuteResultBase {
  resourceId: string;
  resourceType: ResourceType;
}

export interface ICollaCommandOptionsBase extends ICollaCommandExecuteResultBase {
  cmd: CollaCommandName;
}

export interface ICollaCommandExecuteSuccessResult<T = any> extends ICollaCommandExecuteResultBase {
  result: ExecuteResult.Success;
  data?: T;
  operation: IOperation;
  linkedActions?: ILinkedActions[];
  executeType: ExecuteType;
  fieldMapSnapshot?: IFieldMap
}

export interface ICollaCommandExecuteFailResult extends ICollaCommandExecuteResultBase {
  result: ExecuteResult.Fail;
  reason: ExecuteFailReason;
}

export interface ICollaCommandExecuteNoneResult extends ICollaCommandExecuteResultBase {
  result: ExecuteResult.None;
}

export type ICollaCommandExecuteResult<T = any> = ICollaCommandExecuteSuccessResult<T> |
  ICollaCommandExecuteFailResult | ICollaCommandExecuteNoneResult;
