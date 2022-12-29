import { ExecuteFailReason, ExecuteResult, ICollaCommandExecuteContext, ICollaCommandExecuteResultBase } from './types';
import { IJOTAction } from 'engine/ot/interface';
import { CollaCommandName } from 'commands';
import { ResourceType } from 'types';
import { IFieldMap } from '../exports/store';

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
   * @description This property exists if the action of the current command contains changes to cell data
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
 * Collaborative Command definition
 */
export interface ICollaCommandDef<T = any, R = {}> {
  /**
   * Declare whether the command supports undo
   */
  readonly undoable: boolean;

  /**
   * Actions are generated if the execution is successful, and the reason is returned if it fails. No need to deal with returning null.
   */
  readonly execute: (context: ICollaCommandExecuteContext, options: T) =>
    ICollaCommandDefExecuteResult<R> | null;

  /**
   * Determine whether the current undo can be undone, if not, it can be undo by default
   */
  readonly canUndo?: (context: ICollaCommandExecuteContext, actions: IJOTAction[]) => boolean;

  /**
   * Determine whether redo is currently possible, if not, redo can be done by default
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
   * @returns {boolean} returns true, indicating that the result of execution can be placed in
   */
  execute(context: ICollaCommandExecuteContext, options: T): ICollaCommandDefExecuteResult<R> | null {
    return this._cmdDef.execute(context, options);
  }
}
