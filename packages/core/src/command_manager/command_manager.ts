import { ErrorCode, ErrorType, IError } from 'types/error_types';
import { COLLA_COMMAND_MAP, CollaCommandName, ICollaCommandOptions } from '../commands';
import { CollaCommand, ICollaCommandDef, ICollaCommandDefExecuteResult, ICollaCommandDefExecuteSuccessResult } from './command';
import { ExecuteFailReason, ExecuteResult, ExecuteType, ICollaCommandExecuteResult, ICollaCommandOptionsBase } from './types';
import { IOperation } from 'engine/ot/interface';
import { IReduxState, ISubscription, Selectors } from 'store';
import { AnyAction, Store } from 'redux';
import { LinkedDataConformanceMaintainer, MemberFieldMaintainer } from 'model';
import { FieldType, ResourceType } from 'types';
import { CellFormatChecker } from 'cell_format_checker';
import { LinkIntegrityChecker } from 'link_integrity_checker/link_integrity_checker';
import { Events, Player } from 'player';
import { SubscribeUsageCheck } from 'subscribe_usage_check';
import { EnhanceError } from 'sync/enhance_error';

export type IResourceOpsCollect = {
  resourceId: string;
  resourceType: ResourceType;
  operations: IOperation[];
  fieldTypeMap?: {
    [fieldId: string]: FieldType
  }
};

export interface ICollaCommandManagerListener {
  handleCommandExecuted?(resourceOpsCollects: IResourceOpsCollect[]);
  getRoomId?(): string;
  handleCommandExecuteError?(error: IError, type?: 'message' | 'modal' | 'subscribeUsage');
}

export class CollaCommandManager {
  private _commands: { [name: string]: CollaCommand } = {};
  private cellFormatChecker!: CellFormatChecker;
  private linkIntegrityChecker!: LinkIntegrityChecker;
  private subscribeUsageCheck!: SubscribeUsageCheck;

  addUndoStack?(cmd: CollaCommandName, commandResult: ICollaCommandDefExecuteSuccessResult, executeType: ExecuteType): void;

  constructor(
    private _listener: ICollaCommandManagerListener = {},
    private store: Store<IReduxState, AnyAction>,
  ) {
    const commandNames = Object.keys(COLLA_COMMAND_MAP);
    commandNames.forEach(commandName => {
      this.register(commandName, COLLA_COMMAND_MAP[commandName]);
    });
    this.cellFormatChecker = new CellFormatChecker(store);
    this.linkIntegrityChecker = new LinkIntegrityChecker(store);
    this.subscribeUsageCheck = new SubscribeUsageCheck(store);
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
   * @desc 将最终产生的 op 传入执行 op 的回调函数中
   * @param datasheetOpsCollects
   */
  didExecutedHook(datasheetOpsCollects: IResourceOpsCollect[]) {
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
   * @desc 工具方法，传入基础的 command option ，返回结构化的参数
   * */
  private fullFillOptions(options: ICollaCommandOptions): ICollaCommandOptionsBase {
    let resourceId: string | undefined = undefined;
    // 不填 resourceType 默认是 datasheet
    // TODO: 全局修改要填上 resourceType
    let resourceType: ResourceType = ResourceType.Datasheet;

    // TODO: 后面把这个改成 resourceId;
    if ('datasheetId' in options) {
      resourceId = options.datasheetId;
    }

    if ('resourceId' in options) {
      resourceId = options.resourceId;
      resourceType = options.resourceType;
    }

    if (!resourceId) {
      resourceId = Selectors.getActiveDatasheetId(this._getContext().model)!;
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
        error: new Error(`command 执行出现错误：${e.message}`),
        metaData: {
          resourceId: options.resourceId,
          resourceType: options.resourceType,
        },
      });
      this._listener.handleCommandExecuteError && this._listener.handleCommandExecuteError({
        type: ErrorType.CollaError,
        code: ErrorCode.CommandExecuteFailed,
        message: e.message,
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
      console.error(`Execute "${name}" Error`, { error: ret, options });
      return ret;
    }

    const flushedActions = context.ldcMaintainer.flushLinkedActions(context.model);
    const memberFieldAction = context.memberFieldMaintainer.flushMemberAction(context.model);

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

  private _getContext() {
    // 每次 context 执行，初始化一个新的 maintainer，用于维护关联字段单元格数据一致性
    return {
      model: this.store.getState(),
      ldcMaintainer: new LinkedDataConformanceMaintainer(),
      memberFieldMaintainer: new MemberFieldMaintainer(),
      fieldMapSnapshot: {},
      subscribeUsageCheck: (functionName: keyof ISubscription, value: any) => {
        const checkResult = this.subscribeUsageCheck.underUsageLimit(functionName, value);
        if (checkResult) {
          return;
        }
        if (this._listener.handleCommandExecuteError && !checkResult) {
          return this._listener.handleCommandExecuteError(
            new EnhanceError({ message: functionName, extra: { usage: value }}) as any, 'subscribeUsage',
          );
        }
        throw new Error('subscribeUsage error');
      },
    };
  }

  // TODO: 执行失败需要 toast 告知
  _executeActions<R = any>(
    cmd: CollaCommandName,
    ret: ICollaCommandDefExecuteSuccessResult<R>,
    executeType: ExecuteType,
  ): ICollaCommandExecuteResult<R> | null {
    const { actions, resourceId, resourceType, linkedActions, fieldMapSnapshot } = ret;
    const command = this._commands[cmd];
    const context = this._getContext();

    if (!command || !resourceId) {
      console.error('can\'t find command or resource', command, resourceId);
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
      // 这里调整成对所有涉及到单元格写入的 op 进行检查，一种是判断类型，如果类型一致则检查格式
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
        const field = _fieldMapSnapshot[id];
        fieldTypeMap[id] = field.type;
      }

      operation.fieldTypeMap = fieldTypeMap;
    }

    // 将 cmd 产生的 op; 收集起来，一次性派发出去
    const datasheetOpsCollects: IResourceOpsCollect[] = [];

    datasheetOpsCollects.push({
      resourceId, resourceType, operations: [
        linkedActions?.length ?
          { ...operation, mainLinkDstId: resourceId } : operation
      ]
    });

    if (linkedActions) {
      linkedActions.forEach(lCmd => {
        if (!lCmd.actions.length) {
          return;
        }
        const op = { cmd: _cmd, actions: lCmd.actions, mainLinkDstId: resourceId };
        datasheetOpsCollects.push({ resourceId: lCmd.datasheetId, resourceType, operations: [op] });
      });
    }

    // op 应用后，执行一些 hook 操作。
    this.didExecutedHook(datasheetOpsCollects);
    return {
      result: ExecuteResult.Success,
      resourceId,
      resourceType,
      data: ret.data,
      operation,
      executeType,
      linkedActions,
    };
  }
}
