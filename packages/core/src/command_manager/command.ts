import { ExecuteFailReason, ExecuteResult, ICollaCommandExecuteContext, ICollaCommandExecuteResultBase } from './types';
import { IJOTAction } from 'engine/ot/interface';
import { CollaCommandName } from 'commands';
import { ResourceType } from 'types';
import { IFieldMap } from 'store';

export interface ILinkedActions {
  datasheetId: string;
  actions: IJOTAction[];
}

export interface ICollaCommandDefExecuteSuccessResult<T = any> extends ICollaCommandExecuteResultBase {
  result: ExecuteResult.Success;
  data?: T;
  actions: IJOTAction[];
  linkedActions?: ILinkedActions[];

  /**
   * @description 如果当前 command 的 action 中包含对于单元格数据的修改，会存在此属性
   */
  fieldMapSnapshot?: IFieldMap
}

export interface ICollaCommandDefExecuteFailResult extends ICollaCommandExecuteResultBase {
  result: ExecuteResult.Fail;
  reason: ExecuteFailReason;
}

export type ICollaCommandDefExecuteResult<T> = ICollaCommandDefExecuteSuccessResult<T> |
  ICollaCommandDefExecuteFailResult;

/**
 * 协同 Command 定义
 */
export interface ICollaCommandDef<T = any, R = {}> {
  /**
   * 声明该 command 是否支持 undo
   */
  readonly undoable: boolean;

  /**
   * 执行成功产生 actions，失败返回原因。不用处理返回 null。
   */
  readonly execute: (context: ICollaCommandExecuteContext, options: T) =>
    ICollaCommandDefExecuteResult<R> | null;

  /**
   * 判断当前能否undo，不实现则默认可以undo
   */
  readonly canUndo?: (context: ICollaCommandExecuteContext, actions: IJOTAction[]) => boolean;

  /**
   * 判断当前能否redo，不实现则默认可以redo
   */
  readonly canRedo?: (context: ICollaCommandExecuteContext, actions: IJOTAction[]) => boolean;
}

export interface ICommandOptionBase {
  cmd: CollaCommandName;
  resourceId: string;
  resourceType: ResourceType;
}

export class CollaCommand<T extends ICommandOptionBase = any, R = any> {

  constructor(private _cmdDef: ICollaCommandDef<T, R>, public name: string) {
  }

  undoable(): boolean {
    return this._cmdDef.undoable;
  }

  canUndo(context: ICollaCommandExecuteContext, actions: IJOTAction[]): boolean {
    if (!this.undoable()) {
      return false;
    }

    return this._cmdDef.canUndo ? this._cmdDef.canUndo(context, actions) : true;
  }

  canRedo(context: ICollaCommandExecuteContext, actions: IJOTAction[]): boolean {
    if (!this.undoable()) {
      return false;
    }

    return this._cmdDef.canRedo ? this._cmdDef.canRedo(context, actions) : true;
  }

  /**
   * @returns {boolean} 返回 true，表示执行的结果可以放入
   */
  execute(context: ICollaCommandExecuteContext, options: T): ICollaCommandDefExecuteResult<R> | null {
    return this._cmdDef.execute(context, options);
  }
}
