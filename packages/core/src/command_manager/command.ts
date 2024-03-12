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

import { ExecuteFailReason, ExecuteResult, ICollaCommandExecuteContext, ICollaCommandExecuteResultBase } from './types';
import { IJOTAction } from 'engine/ot/interface';
import { CollaCommandName } from 'commands/enum';
import { ResourceType } from 'types';
import { IFieldMap } from '../exports/store/interfaces';

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
  fieldMapSnapshot?: IFieldMap;
}

export interface ICollaCommandDefExecuteFailResult extends ICollaCommandExecuteResultBase {
  result: ExecuteResult.Fail;
  reason: ExecuteFailReason;
}

export type ICollaCommandDefExecuteResult<T> = ICollaCommandDefExecuteSuccessResult<T> | ICollaCommandDefExecuteFailResult;

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
  readonly execute: (context: ICollaCommandExecuteContext, options: T) => ICollaCommandDefExecuteResult<R> | null;

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
  constructor(
    private _cmdDef: ICollaCommandDef<T, R>,
    public name: string
  ) {}

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
