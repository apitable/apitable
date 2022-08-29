import { DatasheetApi } from 'api';
import { CollaCommandName } from 'commands';
import { TrackEvents } from 'config';
import { IJOTAction, ILocalChangeset, IOperation, IRemoteChangeset, jot } from 'engine';
import { Strings, t } from 'i18n';
import { Events, Player } from 'player';
import { IChangesetPack, INetworking } from 'store';
import { updateRevision } from 'store/actions';
import { ResourceType, ModalType } from 'types';
import { ErrorCode, ErrorType, IError } from 'types/error_types';
import { numbersBetween } from 'utils';
import { BufferStorage, ILsStore } from './buffer_storage';
import { getResourcePack } from 'store/selector';
import { UndoManager } from 'command_manager';
import { ViewPropertyFilter } from 'engine/view_property_filter';

export interface IEngineEvent {
  onAcceptSystemOperations: (op: IOperation[]) => void;
  onNewChanges(resourceType: ResourceType, resourceId: string, actions: IJOTAction[]);
  onError?(error: IError);
  getUndoManager(): UndoManager;
  reloadResourceData(): void;
}

/**
 * 实时协同引擎，对任意可序列化的 JSON 结构数据提供实时协同支持
 * TODO: 监听 datasheet loaded 事件，补充检查版本是否已经落后
 */
export class Engine {
  bufferStorage: BufferStorage;
  resourceId: string;
  resourceType: ResourceType;
  getRevision: () => number;
  getNetworking: () => INetworking;
  event: IEngineEvent;
  // 上次出发请求发送的时间。
  latestSendTime = 0;
  cancelQuit: (() => void) | null;
  getState: () => any;
  dispatch: (action: any) => void;
  private prepared = false;
  private readonly viewPropertyFilter: ViewPropertyFilter;

  constructor(params: {
    resourceId: string,
    resourceType: ResourceType,
    event: IEngineEvent,
    getRevision: () => number,
    getNetworking: () => INetworking,
    getState: () => any,
    lsStore: ILsStore,
    dispatch: (action: any) => void,
  }) {
    const { resourceId, resourceType, getRevision, getNetworking, lsStore, event, getState, dispatch } = params;
    this.resourceId = resourceId;
    this.resourceType = resourceType;
    this.getRevision = getRevision;
    this.getNetworking = getNetworking;
    this.bufferStorage = new BufferStorage(resourceId, resourceType, lsStore);
    this.event = event;
    this.cancelQuit = null;
    this.prepare();
    this.getState = getState;
    this.dispatch = dispatch;
    if (resourceType === ResourceType.Datasheet) {
      this.viewPropertyFilter = new ViewPropertyFilter(getState, dispatch, resourceId, { onError: this.event.onError });
    }
  }

  /**
   * 将 operation 推入发送队列，SyncEngine 将保证数据按照版本顺序发送到服务端
   * 并且提供临时性的本地持久化能力，防止用户意外断网和主动刷新的情况下丢失数据
   */
  pushOpBuffer(operation: IOperation) {
    const _actions = this.viewPropertyFilter ?
      this.viewPropertyFilter.parseActions(operation.actions, { commandName: operation.cmd as CollaCommandName }) :
      operation.actions;
    if (_actions.length) {
      this.bufferStorage.pushOpBuffer({
        ...operation,
        actions: _actions,
        revision: this.getRevision(),
        resourceType: this.resourceType
      });
    }
  }

  /**
   * 是否还存在未发送的数据
   */
  isStorageClear(): boolean {
    if (this.bufferStorage.opBuffer.length > 0 || this.bufferStorage.localPendingChangeset) {
      return false;
    }
    return true;
  }

  getNextChangeset(): ILocalChangeset | null {
    const revision = this.getRevision();
    if (revision == null) {
      const error = new Error(t(Strings.error_revision_does_not_exist));
      Player.doTrigger(Events.app_error_logger, {
        error,
        metaData: JSON.stringify({
          resourceId: this.resourceId,
          resourceType: this.resourceType,
          engine: this,
          resourceExist: Boolean(getResourcePack(this.getState(), this.resourceId, this.resourceType)),
        }),
      });
      throw error;
    }

    this.bufferStorage.deOpBuffer(revision);

    if (!this.bufferStorage.localPendingChangeset) {
      return null;
    }

    this.latestSendTime = Date.now();

    return this.bufferStorage.localPendingChangeset;
  }

  getLocalPendingChangeset() {
    return this.bufferStorage.localPendingChangeset;
  }

  getOpBuffer() {
    return this.bufferStorage.opBuffer;
  }

  // 清除等待确认的 changeset
  clearLocalPendingChangeset() {
    this.bufferStorage.clearLocalPendingChangeset();
  }

  // 清除等待被发送的 op
  clearOpBuffer() {
    this.bufferStorage.clearOpBuffer();
  }

  /**
   * 初始化准备事项
   * 1. 检查是否有缺失的版本，有的话进行补充。
   * 2. 检查本地是否有未同步的 changeset，如果有，则进行必要的 transform 保持 revision 和快照对齐
   * 3. 每个 engine 会在第一次实例化和 watch 的时候 prepare
   *
   * 实例化时 checkVersion 不存在
   */
  async prepare(checkVersion?: number) {
    try {
      await this.checkLocalDiffChanges(checkVersion);
      this.prepared = true;
    } catch (error) {
      Player.doTrigger(Events.app_error_logger, {
        error,
        metaData: {
          localPendingChangeset: this.bufferStorage.localPendingChangeset,
          opBuffer: this.bufferStorage.opBuffer,
        },
      });

      // 清除本地缓存以免再次发生问题
      this.bufferStorage.clearLocalPendingChangeset();
      this.bufferStorage.clearOpBuffer();

      this.event.onError && this.event.onError({
        type: ErrorType.CollaError,
        code: ErrorCode.EngineCreateFailed,
        message: t(Strings.local_data_conflict),
        modalType: ModalType.Info
      });
    }
  }

  /**
   * 完成了对本地资源的版本补充，可以进行协同数据同步操作了
   */
  waitPrepareComplete() {
    return new Promise<boolean>((resolve) => {
      if (this.prepared) {
        return resolve(true);
      }

      const timer = setInterval(() => {
        if (this.prepared) {
          clearInterval(timer);
          return resolve(true);
        }
      }, 30);
    });
  }

  /**
   * 提交的 changeset 被服务接受了
   */
  async handleAcceptCommit(remoteChangeset: IRemoteChangeset) {
    // 检查版本连续性，如果不连续，则先进行补充。
    await this.checkMissChanges(remoteChangeset.revision);
    const revision = this.getRevision();
    // 在首次进入数表的时候可能会出现这种情况。
    // 客户端检测到还有本地内容没法送，所以进行了补发
    if (!this.bufferStorage.localPendingChangeset) {
      Player.doTrigger(Events.app_error_logger, {
        error: new Error('missing localChangeset when receiving ACK'),
      });
      return;
    }
    if (
      revision != null &&
      remoteChangeset?.messageId === this.bufferStorage.localPendingChangeset?.messageId &&
      remoteChangeset?.revision === revision + 1
    ) {
      const filteredOperations = remoteChangeset.operations.filter(op => {
        return (op.cmd === CollaCommandName.SystemSetRecords || op.cmd === CollaCommandName.SystemSetFieldAttr);
      });

      if (filteredOperations.length) {
        this.event.onAcceptSystemOperations(filteredOperations);
      }

      this.dispatch(updateRevision(revision + 1, this.resourceId, this.resourceType));
      return;
    }
    console.error('ACK 数据错误', { revision, ack: remoteChangeset, localChangeset: this.bufferStorage.localPendingChangeset });
    throw new Error('数据返回格式错误, 请刷新重试');
  }

  private async fetchMissVersion(revisions: number[]): Promise<IRemoteChangeset[]> {
    console.log('fetchingMissVersion', this.resourceId, revisions);
    const result = await DatasheetApi.fetchChangesets<IChangesetPack>(this.resourceId, this.resourceType, revisions);
    if (result.data.success) {
      console.log('fetchMissVersion success: ', result.data.data);

      if (revisions.length !== result.data.data.length) {
        throw new Error(t(Strings.error_the_length_of_changeset_is_inconsistent));
      }
      return result.data.data;
    }

    throw new Error(t(Strings.error_occurred_while_requesting_the_missing_version));
  }

  /**
   * 后端主动推送别人提交的 changeset
   * 或者主动补偿缺失版本的 changeset
   */
  async handleNewChanges(data: IRemoteChangeset) {
    console.log('收到远程 Changeset: ', { data });
    const loading = this.getNetworking().loading;
    if (loading) {
      Player.doTrigger(Events.app_error_logger, {
        error: new Error('receive newChanges while datasheet loading, ignored'),
      });
      return;
    }

    await this.checkMissChanges(data.revision);
    this.applyNewChanges(data);
  }

  private applyNewChanges(cs: IRemoteChangeset) {
    // 收到来自自己的 newChanges。这种情况出现是因为，客户端掉线重连，重连的客户端被视为协作者。
    // 这时候会将自己发送的 changeset 再次作为 newChanges 广播给自己。所以我们要先进行 messageId 相等判断
    // 如果 messageId 相等，则视为 ACK。
    if (this.bufferStorage.localPendingChangeset && cs.messageId === this.bufferStorage.localPendingChangeset.messageId) {
      console.error('newChanges 中的 messageId 与 localChangeset 相等，已转换成 ACK');
      this.handleAcceptCommit(cs);
      return;
    }

    const revision = this.getRevision();
    // 必须保证 data.revision 不跳跃进位
    if (cs.revision > revision + 1) {
      console.log('revision 错误', revision, cs.revision);
      throw new Error('miss changes didn\'t well prepared');
    }

    // 小于当前版本的 changeset 直接忽略
    if (cs.revision <= revision) {
      console.warn('older changeset received and ignored');
      return;
    }

    if (revision == null || cs.revision !== +revision + 1) {
      console.error('currentRevision', revision, cs);
      throw new Error('wrong changeset revision');
    }

    const nextRevision = +revision + 1;

    const remoteActions = this.doTransform(cs);

    const _remoteActions = this.viewPropertyFilter ? this.viewPropertyFilter.parseActions(remoteActions, { fromServer: true }) : remoteActions;

    this.dispatch(updateRevision(nextRevision, this.resourceId, this.resourceType));

    this.event.onNewChanges(this.resourceType, this.resourceId, _remoteActions);

    return _remoteActions;
  }

  // 检查远程 changeset 过来中间丢失的版本，有则直接补齐缺失的 changeset 应用到快照上。
  async checkMissChanges(revisionUpgradeTo: number) {
    const revision = this.getRevision();

    /**
     * 远程 newChange 版本需要恰好比等于版本+1才能走正常流程。
     * 如果版本差距大于1，则需要补齐中间版本
     */
    if (revisionUpgradeTo === revision + 1) {
      return;
    }
    if (revisionUpgradeTo <= revision) {
      return;
    }

    const changesetList = await this.fetchMissVersion(numbersBetween(revision, revisionUpgradeTo));
    changesetList.forEach(cs => {
      this.applyNewChanges(cs);
    });
  }

  // 检查本地快照和本地 changeset 之间的版本差距。
  // 如果有差距，则将 localChangeset 进行 transform rebase 操作。
  async checkLocalDiffChanges(checkVersion?: number) {
    if (!this.bufferStorage.localPendingChangeset) {
      checkVersion != null && this.checkMissChanges(checkVersion);
      return;
    }

    Player.doTrigger(Events.app_error_logger, {
      error: new Error(t(Strings.error_an_unsynchronized_changeset_is_detected)),
      metaData: this.bufferStorage.localPendingChangeset,
    });
    const revision = this.getRevision();
    const baseRevision = this.bufferStorage.localPendingChangeset.baseRevision;

    if (baseRevision > revision) {
      throw new Error('localRevision greater than remoteRevision');
    }

    console.log('checkLocalDiffChanges: ', { baseRevision, revision });

    if (baseRevision < revision) {
      let changesetList = await this.fetchMissVersion(numbersBetween(baseRevision, revision + 1));
      /**
       * 检查 localChangeset 是否已经在 changesetList 中，如果在的话
       * 1. 则说明 localChangeset 已经被应用到快照里, 则本地不需要再发送
       * 2. 这个在这之前的 changeset 才需要进行 transform, 后面的不需要
       */
      const transformEndIndex = changesetList.findIndex(changeset => {
        return changeset.messageId === this.bufferStorage.localPendingChangeset!.messageId;
      });

      changesetList = changesetList.slice(0, transformEndIndex);

      if (transformEndIndex >= 0) {
        // 1. 丢弃掉 localChangeset.
        // 2. opBuffer 成为新的 localChangeset, 并将 baseRevision 设置为 changesetList 中，原 localChangeset 所在位置的 revision。
        console.log('检测到本地 localPendingChangeset 已经被消费，直接删除', this.bufferStorage.localPendingChangeset);
        this.bufferStorage.deOpBuffer(revision);
        console.log('本地 opBuffer 进入 localPendingChangeset', this.bufferStorage.localPendingChangeset);
      }

      changesetList.forEach(changeset => {
        this.doTransform(changeset);
      });
    }
  }

  private doTransform(cs: IRemoteChangeset) {
    let remoteActions = cs.operations.reduce<IJOTAction[]>((pre, op) => {
      pre.push(...op.actions);
      return pre;
    }, []);

    this.event.getUndoManager().doTransform(remoteActions);

    // localChangeset 需要进行 transform 并且更新成最新版本
    if (this.bufferStorage.localPendingChangeset) {
      console.log(
        'localPendingChangeset before transform:',
        { localChangeset: this.bufferStorage.localPendingChangeset, remoteActions },
      );
      const newOperations = this.bufferStorage.localPendingChangeset.operations.map(op => {
        const [leftOp, rightOp] = jot.transformX(op.actions, remoteActions);
        remoteActions = rightOp;
        return {
          cmd: op.cmd,
          actions: leftOp,
        };
      });
      this.bufferStorage.localPendingChangeset = {
        ...this.bufferStorage.localPendingChangeset,
        operations: newOperations,
        baseRevision: cs.revision,
      };
      Player.doTrigger(Events.app_tracker, {
        name: TrackEvents.OpTransform,
        props: {
          opType: 'localChangeset',
        },
      });
      console.log(
        'localChangeset after transformed: ',
        { localChangeset: this.bufferStorage.localPendingChangeset, remoteActions },
      );
    }

    if (this.bufferStorage.opBuffer.length) {
      console.log(
        'opBuffer before transform:',
        { localChangeset: this.bufferStorage.localPendingChangeset, remoteActions },
      );
      this.bufferStorage.opBuffer = this.bufferStorage.opBuffer.map(op => {
        const [leftOp, rightOp] = jot.transformX(op.actions, remoteActions);
        remoteActions = rightOp;
        return {
          cmd: op.cmd,
          actions: leftOp,
        };
      });
      Player.doTrigger(Events.app_tracker, {
        name: TrackEvents.OpTransform,
        props: {
          opType: 'opBuffer',
        },
      });
      console.log(
        'opBuffer after transformed: ',
        { localPendingChangeset: this.bufferStorage.localPendingChangeset, serverOperations: remoteActions },
      );
    }

    return remoteActions;
  }
}

