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

import { ErrorCode, ErrorType, IError } from 'types/error_types';
import { COLLA_COMMAND_MAP, ICollaCommandOptions } from '../commands';
import { CollaCommandName } from '../commands/enum';
import { CollaCommand, ICollaCommandDef, ICollaCommandDefExecuteResult, ICollaCommandDefExecuteSuccessResult } from './command';
import {
  ExecuteFailReason,
  ExecuteResult,
  ExecuteType,
  ICollaCommandExecuteContext,
  ICollaCommandExecuteResult,
  ICollaCommandOptionsBase,
} from './types';
import { IOperation } from 'engine/ot/interface';
import { IReduxState } from '../exports/store/interfaces';
import { getActiveDatasheetId } from 'modules/database/store/selectors/resource/datasheet/base';

import { AnyAction, Store } from 'redux';
import { LinkedDataConformanceMaintainer } from 'model/linked_data_conformance_maintainer';
import { MemberFieldMaintainer } from 'model/member_maintainer';
import { FieldType, ResourceType } from 'types';
import { CellFormatChecker } from 'cell_format_checker';
import { LinkIntegrityChecker } from 'link_integrity_checker/link_integrity_checker';
import { Events, Player } from '../modules/shared/player';

export type IResourceOpsCollect = {
  resourceId: string;
  resourceType: ResourceType;
  operations: IOperation[];
  fieldTypeMap?: {
    [fieldId: string]: FieldType;
  };
};

export interface ICollaCommandManagerListener {
  handleCommandExecuted?(resourceOpsCollects: IResourceOpsCollect[]): void;
  handleCommandExecuteError?(error: IError, type?: 'message' | 'modal' | 'subscribeUsage'): void;
}

export class CollaCommandManager {
  private readonly _commands: { [name: string]: CollaCommand } = {};
  private readonly cellFormatChecker!: CellFormatChecker;
  private readonly linkIntegrityChecker!: LinkIntegrityChecker;

  addUndoStack?(cmd: CollaCommandName, commandResult: ICollaCommandDefExecuteSuccessResult, executeType: ExecuteType): void;

  constructor(private _listener: ICollaCommandManagerListener = {}, private store: Store<IReduxState, AnyAction>) {
    const commandNames = Object.keys(COLLA_COMMAND_MAP);
    commandNames.forEach(commandName => {
      this.register(commandName, COLLA_COMMAND_MAP[commandName]!);
    });
    this.cellFormatChecker = new CellFormatChecker(store);
    this.linkIntegrityChecker = new LinkIntegrityChecker(store);
  }

  register(name: string, commandDef: ICollaCommandDef) {
    if (this._commands[name]) {
      console.warn(`the command name ${name} is registered and will be unregistered`, this._commands[name]);
      this.unregister(name);
    }
    this._commands[name] = new CollaCommand(commandDef, name);
  }

  unregister(name: string) {
    if (this._commands[name]) {
      delete this._commands[name];
    }
  }

  hasCommand(name: string): boolean {
    return !!this._commands[name];
  }

  /**
   * passes the final generated op into the callback function that executes the op
   */
  private didExecutedHook(datasheetOpsCollects: IResourceOpsCollect[]): void {
    this._listener.handleCommandExecuted && this._listener.handleCommandExecuted(datasheetOpsCollects);
  }

  execute<R = {}>(options: ICollaCommandOptions): ICollaCommandExecuteResult<R> {
    const optionsFull = this.fullFillOptions(options);
    let ret = this._execute<R>(optionsFull);
    if (ret === null) {
      ret = {
        resourceId: optionsFull.resourceId,
        resourceType: optionsFull.resourceType,
        result: ExecuteResult.None,
      };
    } else if (ret.result === ExecuteResult.Fail) {
      console.error('ExecuteResult.Fail: ', ret);
    }
    return ret;
  }

  /**
   * @desc tool method, passing in the basic command option and returning structured parameters
   * */
  private fullFillOptions(options: ICollaCommandOptions): ICollaCommandOptionsBase {
    let resourceId: string | undefined = undefined;
    // If you don't fill in resourceType, the default is datasheet
    // TODO: fill in resourceType for global modification
    let resourceType: ResourceType = ResourceType.Datasheet;

    // TODO: Change this to resourceId later;
    if ('datasheetId' in options) {
      resourceId = options.datasheetId;
    }

    if ('resourceId' in options) {
      resourceId = options.resourceId;
      if(options.resourceType) {
        resourceType = options.resourceType;
      }
    }

    if (!resourceId) {
      resourceId = getActiveDatasheetId(this._getContext().state)!;
    }

    return {
      ...options,
      resourceId,
      resourceType,
    };
  }

  private _execute<R>(options: ICollaCommandOptionsBase): ICollaCommandExecuteResult<R> | null {
    const name = options.cmd;
    const command = this._commands[name];
    if (!command) {
      return null;
    }

    let ret: ICollaCommandDefExecuteResult<R> | null = null;
    const context = this._getContext();
    try {
      ret = command.execute(context, options);
    } catch (e) {
      Player.doTrigger(Events.app_error_logger, {
        error: new Error(`command execution error: ${(e as any).message}`),
        metaData: {
          resourceId: options.resourceId,
          resourceType: options.resourceType,
        },
      });
      this._listener.handleCommandExecuteError &&
        this._listener.handleCommandExecuteError({
          type: ErrorType.CollaError,
          code: ErrorCode.CommandExecuteFailed,
          message: (e as any).message,
        });
      return {
        resourceId: options.resourceId,
        resourceType: options.resourceType,
        result: ExecuteResult.Fail,
        reason: ExecuteFailReason.ActionError,
      };
    }

    if (!ret) {
      return ret;
    }

    if (ret.result === ExecuteResult.Fail) {
      console.error('Execute "%s" Error', name, { error: ret, options });
      return ret;
    }

    const flushedActions = context.ldcMaintainer.flushLinkedActions(context.state);
    const memberFieldAction = context.memberFieldMaintainer.flushMemberAction(context.state);

    if (memberFieldAction.length) {
      ret.actions.push(...memberFieldAction);
    }

    if (ret.linkedActions) {
      ret.linkedActions.push(...flushedActions);
    } else {
      ret.linkedActions = flushedActions;
    }
    return this._executeActions<R>(name, ret, ExecuteType.Execute);
  }

  private _getContext(): ICollaCommandExecuteContext {
    // Each time the context is executed, a new maintainer is initialized to maintain the data consistency of the associated field cell
    return {
      state: this.store.getState(),
      ldcMaintainer: new LinkedDataConformanceMaintainer(),
      memberFieldMaintainer: new MemberFieldMaintainer(),
      fieldMapSnapshot: {},
    };
  }

  // TODO: Execution failure requires toast notification
  _executeActions<R = any>(
    cmd: CollaCommandName,
    ret: ICollaCommandDefExecuteSuccessResult<R>,
    executeType: ExecuteType,
  ): ICollaCommandExecuteResult<R> | null {
    const { actions, resourceId, resourceType, linkedActions, fieldMapSnapshot } = ret;
    const command = this._commands[cmd];
    const context = this._getContext();

    if (!command || !resourceId) {
      console.error("can't find command or resource", command, resourceId);
      return null;
    }

    if (executeType === ExecuteType.Redo && !command.canRedo(context, actions)) {
      return null;
    }

    if (executeType === ExecuteType.Undo && !command.canUndo(context, actions)) {
      return null;
    }

    if (actions.length === 0) {
      return null;
    }

    if (this.addUndoStack && command.undoable()) {
      this.addUndoStack(cmd, ret, executeType);
    }

    let _actions = actions;
    const _fieldMapSnapshot = fieldMapSnapshot && { ...fieldMapSnapshot };

    if (resourceType === ResourceType.Datasheet) {
      // This is adjusted to check all ops involved in cell writing, one is to judge the type, and if the type is consistent, check the format
      _actions = this.cellFormatChecker.parse(_actions, resourceId, _fieldMapSnapshot);

      if (executeType === ExecuteType.Redo || executeType === ExecuteType.Undo) {
        _actions = _fieldMapSnapshot ? _actions : this.linkIntegrityChecker.parse(_actions, resourceId, linkedActions);
      }
    }

    const _cmd = executeType === ExecuteType.Undo ? `UNDO:${cmd}` : cmd;
    const operation: IOperation = {
      cmd: _cmd,
      actions: _actions,
    };
    const fieldTypeMap = {};

    if (_fieldMapSnapshot && Object.keys(_fieldMapSnapshot).length) {
      for (const id in _fieldMapSnapshot) {
        const field = _fieldMapSnapshot[id]!;
        fieldTypeMap[id] = field.type;
      }

      operation.fieldTypeMap = fieldTypeMap;
    }

    // Collect the op; generated by cmd and send it out at one time
    const datasheetOpsCollects: IResourceOpsCollect[] = [];

    datasheetOpsCollects.push({
      resourceId,
      resourceType,
      operations: [linkedActions?.length ? { ...operation, mainLinkDstId: resourceId } : operation],
    });

    if (linkedActions) {
      linkedActions.forEach(lCmd => {
        if (!lCmd.actions.length) {
          return;
        }
        const op = {
          cmd: _cmd,
          actions: lCmd.actions,
          mainLinkDstId: resourceId,
        };
        datasheetOpsCollects.push({
          resourceId: lCmd.datasheetId,
          resourceType,
          operations: [op],
        });
      });
    }

    // After the op is applied, perform some hook operations.
    this.didExecutedHook(datasheetOpsCollects);
    return {
      result: ExecuteResult.Success,
      resourceId,
      resourceType,
      data: ret.data,
      operation,
      executeType,
      linkedActions,
      resourceOpsCollects: datasheetOpsCollects,
    };
  }
}
