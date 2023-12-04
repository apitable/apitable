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

import { ExecuteType, ICollaCommandExecuteResult } from './types';
import { CollaCommandManager } from './command_manager';
import { IJOTAction, jot } from 'engine/ot';
import { ICollaCommandDefExecuteSuccessResult } from './command';
import { CollaCommandName } from 'commands/enum';

export interface IUndoCommand {
  cmd: CollaCommandName;
  result: ICollaCommandDefExecuteSuccessResult;
}

export class UndoManager {
  private _undoStack: IUndoCommand[] = [];
  private _redoStack: IUndoCommand[] = [];
  private _maxLength = 50;
  private _commandManager: CollaCommandManager | null = null;
  private _transformSquare = 100000;

  constructor(public resourceId: string) {}

  setCommandManager(commandManager: CollaCommandManager) {
    this._commandManager = commandManager;
  }

  undo(): ICollaCommandExecuteResult | null {
    const { _undoStack: undoStack, _commandManager: commandManager } = this;
    if (!undoStack.length) {
      return null;
    }
    const undoAction = undoStack.pop();
    if (undoAction && commandManager && commandManager.hasCommand(undoAction.cmd)) {
      return commandManager._executeActions(undoAction.cmd, undoAction.result, ExecuteType.Undo);
    }
    return null;
  }

  redo(): ICollaCommandExecuteResult<{}> | null {
    const { _redoStack: redoStack, _commandManager: commandManager } = this;
    if (!redoStack.length) {
      return null;
    }
    const redoAction = redoStack.pop();
    if (redoAction && commandManager && commandManager.hasCommand(redoAction.cmd)) {
      return commandManager._executeActions(redoAction.cmd, redoAction.result, ExecuteType.Redo);
    }
    return null;
  }

  private static revertLinkedActions(cmd: IUndoCommand) {
    if (cmd.result.linkedActions) {
      cmd.result.linkedActions = cmd.result.linkedActions.map(lCmd => {
        return {
          ...lCmd,
          actions: jot.invert(lCmd.actions),
        };
      });
    }
  }

  addUndoStack(command: IUndoCommand, executeType: ExecuteType) {
    if (!command || !command.cmd) {
      return;
    }

    /**
     * The conversion of undo & redo stack needs to invert actions
     */
    if (executeType === ExecuteType.Undo) {
      const inverted: IUndoCommand = {
        cmd: command.cmd,
        result: {
          ...command.result,
          actions: jot.invert(command.result.actions),
        },
      };

      UndoManager.revertLinkedActions(inverted);

      this._redoStack.push(inverted);
    } else {
      const { _maxLength: maxLength, _undoStack: undoStack } = this;
      const deleteCount = undoStack.length - maxLength + 1;

      // clear the command that exceeds the stack size
      if (maxLength > 0 && deleteCount > 0) {
        undoStack.splice(0, deleteCount);
      }

      const inverted: IUndoCommand = {
        cmd: command.cmd,
        result: {
          ...command.result,
          actions: jot.invert(command.result.actions),
        },
      };

      UndoManager.revertLinkedActions(inverted);

      undoStack.push(inverted);

      // After executing the command, you need to clear the redo stack
      if (executeType === ExecuteType.Execute) {
        this._redoStack = [];
      }
    }
  }

  getStockLength(type: 'redo' | 'undo') {
    if (type === 'undo') {
      return this._undoStack.length;
    }
    return this._redoStack.length;
  }

  getUndoStack() {
    return this._undoStack;
  }

  getRedoStack() {
    return this._redoStack;
  }

  /**
   * @description Temporary solution to solve the page stuck caused by excessive data volume
   * when transforming locally cached actions and remote collaborative actions
   * The current idea is to give up this transform if the product of the two actions of the transform
   * exceeds the set threshold. And clear all caches this time and later,
   * Subsequent solutions will solve performance problems through workers
   *
   * @param {number} stackActionLen
   * @param {number} remoteActionLen
   * @returns {boolean}
   * @private
   */
  private checkTransformSquareOverLimit(stackActionLen: number, remoteActionLen: number) {
    return Boolean(stackActionLen * remoteActionLen > this._transformSquare);
  }

  private transformStack(stack: IUndoCommand[], remoteActions: IJOTAction[]) {
    const newStack: IUndoCommand[] = [];
    for (let i = stack.length - 1; i >= 0; i--) {
      const stackActions = stack[i]!.result.actions;
      if (this.checkTransformSquareOverLimit(stackActions.length, remoteActions.length)) {
        break;
      }
      const [left, right] = jot.transformX(stackActions, remoteActions);
      newStack.push({
        ...stack[i]!,
        result: {
          ...stack[i]!.result,
          actions: left,
        },
      });
      remoteActions = right;
    }
    return newStack.reverse();
  }

  doTransform(remoteActions: IJOTAction[]) {
    if (!remoteActions || !remoteActions.length) {
      return;
    }

    if (this._redoStack.length) {
      this._redoStack = this.transformStack(this._redoStack, remoteActions);
    }

    if (this._undoStack.length) {
      this._undoStack = this.transformStack(this._undoStack, remoteActions);
    }
  }
}
