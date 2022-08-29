import { ExecuteType, ICollaCommandExecuteResult } from './types';
import { CollaCommandManager } from './command_manager';
import { IJOTAction, jot } from 'engine/ot';
import { ICollaCommandDefExecuteSuccessResult } from './command';
import { CollaCommandName } from 'commands';

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

  constructor(public resourceId: string) { }

  setCommandManger(commandManager: CollaCommandManager) {
    this._commandManager = commandManager;
  }

  undo(): ICollaCommandExecuteResult | null {
    const { _undoStack: undoStack, _commandManager: commandManager } = this;
    if (!undoStack.length) {
      return null;
    }
    const undoAction = undoStack.pop();
    if (undoAction && commandManager && commandManager.hasCommand(undoAction.cmd)) {
      return commandManager._executeActions(
        undoAction.cmd,
        undoAction.result,
        ExecuteType.Undo,
      );
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
      return commandManager._executeActions(
        redoAction.cmd,
        redoAction.result,
        ExecuteType.Redo,
      );
    }
    return null;
  }

  addUndoStack(command: IUndoCommand, executeType: ExecuteType) {
    if (!command || !command.cmd) {
      return;
    }

    /**
     * undo & redo 栈的转换需要将 actions 进行 invert 反转
     */
    if (executeType === ExecuteType.Undo) {
      const inverted: IUndoCommand = {
        cmd: command.cmd,
        result: {
          ...command.result,
          actions: jot.invert(command.result.actions),
        }
      };

      if (inverted.result.linkedActions) {
        inverted.result.linkedActions = inverted.result.linkedActions.map(lCmd => {
          return {
            ...lCmd,
            actions: jot.invert(lCmd.actions),
          };
        });
      }

      this._redoStack.push(inverted);
    } else {
      const { _maxLength: maxLength, _undoStack: undoStack } = this;
      const deleteCount = undoStack.length - maxLength + 1;

      // 清除超出栈大小的command
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

      if (inverted.result.linkedActions) {
        inverted.result.linkedActions = inverted.result.linkedActions.map(lCmd => {
          return {
            ...lCmd,
            actions: jot.invert(lCmd.actions),
          };
        });
      }

      undoStack.push(inverted);

      // 执行command后，需要清空redo栈
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
   * @description 临时解决方案，解决对本地缓存的 actions 和远程协同的 actions 做 transform 时，数据量过大造成的页面卡死
   * 目前的思路是做 transform 的两个 action 数量的乘积超过设定的阈值，则放弃此次的 transform。并且清空本次及之后的所有缓存，
   * 后续的方案会通过 worker 解决性能问题
   * @param {number} stackActionLen
   * @param {number} remoteActionLen
   * @returns {boolean}
   * @private
   */
  private checkTransformSquareOverLimit(stackActionLen: number, remoteActionLen: number) {
    return Boolean((stackActionLen * remoteActionLen) > this._transformSquare);
  }

  private transformStack(stack: IUndoCommand[], remoteActions: IJOTAction[]) {
    const newStack: IUndoCommand[] = [];
    for (let i = stack.length - 1; i >= 0; i--) {
      const stackActions = stack[i].result.actions;
      if (this.checkTransformSquareOverLimit(stackActions.length, remoteActions.length)) {
        break;
      }
      const [left, right] = jot.transformX(stackActions, remoteActions);
      newStack.push(
        {
          ...stack[i],
          result: {
            ...stack[i].result,
            actions: left
          }
        }
      );
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
