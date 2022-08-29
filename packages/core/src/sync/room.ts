import { Api } from 'api';
import { IResourceOpsCollect } from 'command_manager/command_manager';
import { ConfigConstant, StatusCode } from 'config';
import { NodeTypeReg } from 'config/constant';
import dayjs from 'dayjs';
import { Engine, ILocalChangeset, IOperation, IRemoteChangeset } from 'engine';
import { BufferStorage, ILocalForage, ILsStore } from 'engine/buffer_storage';
import { Strings, t } from 'i18n';
import { IO } from 'io';
import { keyBy, throttle } from 'lodash';
import { Events, Player } from 'player';
import { AnyAction, Store } from 'redux';
import 'socket.io-client';
import { DEFAULT_FIELD_PERMISSION, IResourceRevision, Selectors, StoreActions } from 'store';
import {
  changeResourceSyncingStatus, resetFieldPermissionMap, roomInfoSync, setResourceConnect, updateFieldPermissionMap, updateFieldPermissionSetting,
} from 'store/actions';
import { ICollaborator, IReduxState } from 'store/interface';
import { EnhanceError } from 'sync/enhance_error';
import { ErrorCode, IError, ModalType, OnOkType, ResourceType } from 'types';
import { errorCapture, numbersBetween } from 'utils';
import { socketGuard } from 'utils/socket_guard';
import {
  BroadcastTypes, IClientRoomMessage, IEngagementCursorData, IFieldPermissionMessage, INewChangesData, INodeShareDisabledData, ISocketResponseData,
  IWatchResponse, OtErrorCode, SyncRequestTypes,
} from './types';

// 数据重发 action 数量最大上线，超过此数值不进行超时重试操作
const MAX_RETRY_LENGTH = 5000;
const VIKA_OP_BACKUP = 'VIKA_OP_BACKUP';

interface IRoomEvent {
  onError?(error: IError): void;
  destroy?: () => void;
  getRoomIOClear: () => boolean;
  setRoomIOClear: (status: boolean) => void;
  getRoomLastSendTime: () => number | undefined;
  setRoomLastSendTime: () => void;
}

/**
 * Room 模块，负责协作房间内的数据同步，重试、收发消息能力
 * 与资源实体不进行耦合，交由 CollaEngine 处理数据实体的操作
 * 1 个 Room 可以管理多个 CollaEngine
 */
export class RoomService {
  collaEngineMap = new Map<string, Engine>();
  event: IRoomEvent;
  private io = new IO(this.roomId, this.socket);
  private sendingWatcherTimer?: any;
  private connected = false;
  backupDB: ILocalForage;

  /**
   * 根据资源主资源Id 创建一个 roomId
   * 什么是 resource 资源，资源是数据实体的概括，比如一个数表，一个小组件，一个仪表盘。他们的数据统称为资源
   * 主资源 ID 一般指的是当前用户主要访问的节点页面，比如数表、仪表盘等
   * 而主资源可能附带多个其他资源，比如一张表的关联表，一个 dashboard 上面的 widget
   * @param resourceId 资源 ID，可以是 datasheetId, DashboardId, WidgetId 等实体资源的 Id
   */
  static createRoomId(resourceId: string) {
    return `${resourceId}`;
  }

  constructor(
    public roomId: string,
    private socket: SocketIOClient.Socket,
    private isConnect: () => boolean,
    private store: Store<IReduxState, AnyAction>,
    collaEngineMap: Map<string, Engine> | undefined,
    event: IRoomEvent,
    private fetchResource: (resourceId: string, resourceType: ResourceType) => Promise<any>,
    public lsStore: ILsStore,
    public localForage: ILocalForage
  ) {
    this.event = event;
    this.backupDB = localForage.createInstance({ name: VIKA_OP_BACKUP });
    if (!collaEngineMap) {
      return;
    }
    collaEngineMap.forEach(engine => {
      this.addCollaEngine(engine);
    });
  }

  /**
   * 添加负责对资源进行实时协作协作的 OT 引擎。
   */
  addCollaEngine(collaEngine: Engine) {
    if (collaEngine.cancelQuit) {
      collaEngine.cancelQuit();
      return;
    }

    // await collaEngine.prepare();
    if (this.collaEngineMap.has(collaEngine.resourceId)) {
      console.error('请勿重复增加 CollaEngine');
    }
    this.collaEngineMap.set(collaEngine.resourceId, collaEngine);
  }

  private async nextTick() {
    await new Promise(resolve => {
      setTimeout(resolve, 10);
    });
  }

  async init(firstRoomInit = false) {
    // 保证 协同引擎 已经完成初始化
    const hasCollaEngine = () => {
      return this.collaEngineMap.has(this.roomId);
    };
    do {
      await this.nextTick();
    } while (!hasCollaEngine());
    firstRoomInit && this.sendLocalChangesetWithInit();
    // 先对协作引擎进行初始化
    await Promise.all(Array.from(this.collaEngineMap.keys()).map(resourceId => {
      const collaEngine = this.collaEngineMap.get(resourceId)!;
      return collaEngine.waitPrepareComplete();
    }));

    await this.watch();
  }

  // 初始化的时候，需要将缓存在本地的 localPendingChangeset  (如果有的话)发送到服务端
  @errorCapture<RoomService>()
  async sendLocalChangesetWithInit() {
    const localPendingChangesetStorage = this.lsStore.namespace(BufferStorage.pendingChangesetsNamespace);
    const opBufferStorage = this.lsStore.namespace(BufferStorage.bufferStorageNamespace);

    const changesetMap = localPendingChangesetStorage.getAll();
    const opBufferMap = opBufferStorage.getAll();

    if (!Object.keys(changesetMap).length && !Object.keys(opBufferMap).length) {
      return;
    }
    this.event.setRoomIOClear(false);
    opBufferStorage.clearAll();
    localPendingChangesetStorage.clearAll();

    this.clearAllStorage();
    try {
      await this.applyLocalData(changesetMap, opBufferMap);
    } catch (e) {
      try {
        await this.backupDB.setItem(String(Date.now()), {
          changesetMap,
          opBufferMap
        });
      } catch (e) {
        if (e.name === 'QuotaExceededError') {
          await this.backupDB.clear();
          this.backupDB.setItem(String(Date.now()), { changesetMap, opBufferMap });
        }
      }

      const timestamps = await this.backupDB.keys();
      timestamps.map(timestamp => {
        // 对备份时间大于两周的数据做清理
        if (dayjs().diff(Date.now(), 'day') > 14) {
          this.backupDB.removeItem(timestamp);
        }
      });

      Player.doTrigger(Events.app_error_logger, {
        error: new Error(`初始化 applyChangeset 失败：${e.message}`),
        metaData: {
          roomId: this.roomId,
          changesetMap: JSON.stringify(changesetMap),
          opBufferMap: JSON.stringify(opBufferMap)
        },
      });

      throw new EnhanceError({
        code: ErrorCode.CollaModalError,
        message: t(Strings.initialization_failed_message),
        modalType: ModalType.Warning
      });

    }

    this.event.setRoomIOClear(true);
  }

  async applyLocalData(changesetMap: Record<string, ILocalChangeset>, opBufferMap: Record<string, IOperation[]>) {
    if (Object.keys(changesetMap).length) {
      const res = await Api.applyResourceChangesets(Object.values(changesetMap), this.roomId);
      const { success, message, code } = res.data;
      if (!success && code !== 4001) {
        throw new Error(`changesetMap: ${message}`);
      }
    }

    if (Object.keys(opBufferMap).length) {
      const changesets: ILocalChangeset[] = [];
      for (const resourceId in opBufferMap) {
        if (changesetMap[resourceId]) {
          const changeset = BufferStorage.ops2Changeset(
            opBufferMap[resourceId],
            changesetMap[resourceId].baseRevision + 1,
            resourceId,
            changesetMap[resourceId].resourceType
          );
          changesets.push(changeset);
          continue;
        }
        const opBuffer = opBufferMap[resourceId];
        const revision = opBuffer[0].revision;
        const resourceType = opBuffer[0].resourceType;
        const changeset = BufferStorage.ops2Changeset(opBuffer, revision as number, resourceId, resourceType as ResourceType);

        if (opBuffer.every(operation => !operation.mainLinkDstId)) {
          const res = await Api.applyResourceChangesets([changeset], this.roomId);
          const { success, message } = res.data;
          if (!success) {
            throw new Error(`single changesets: ${message}`);
          }
          delete opBufferMap[resourceId];
          continue;
        }

        changesets.push(changeset);
      }

      if (!changesets.length) {
        return;
      }

      const res = await Api.applyResourceChangesets(Object.values(changesets), this.roomId);
      const { success, message } = res.data;
      if (!success) {
        throw new Error(`opBufferMap: ${message}`);
      }
    }
  }

  /**
   * 后端主动推送别人提交的 changeset
   * 或者主动补偿缺失版本的 changeset
   */
  @errorCapture<RoomService>()
  handleNewChanges(data: INewChangesData) {
    data.changesets.forEach(cs => {
      const resourceId = cs.resourceId;
      const collaEngine = this.collaEngineMap.get(resourceId);
      if (collaEngine) {
        collaEngine.handleNewChanges(cs);
      } else if (
        resourceId.startsWith(NodeTypeReg.DATASHEET) &&
        !Selectors.getDatasheet(this.store.getState(), resourceId)
      ) {
        // 此时获取到的数据已为最新版本，不需要再应用cs
        this.fetchResource(resourceId, ResourceType.Datasheet);
      }
    });
  }

  /**
   * @description watch 方法主要用于做 3 件事
   * 1. 在 client 端创建房间，并且加入 service 中
   * 2. 注册各种 socket 的监听事件
   * 3. 启动 client 上的事件协同监视器，保证阻塞的消息隔一段时间会被处理
   * 原先考虑在 watch 中对缺失的版本进行补偿，但是补偿行为已经在 init 中，由每一个 engine 自己处理，所以 watch 不需要再关注版本补偿
   * @returns
   */
  @errorCapture<RoomService>()
  async watch() {
    const state = this.store.getState();
    const shareId = state.pageParams.shareId;
    const watchResponse = await this.io.watch<IWatchResponse, any>(this.roomId, shareId).catch(e => {
      throw new EnhanceError(e);
    });

    this.setConnected(true);
    if (!watchResponse) {
      return;
    }
    const { resourceRevisions, collaborators } = watchResponse.data!;
    console.log('resourceRevisions:', resourceRevisions);
    const collaEngine = this.collaEngineMap.get(this.roomId);
    if (!collaEngine) {
      return;
    }
    await this.checkVersion(resourceRevisions);
    const resourceType = collaEngine.resourceType;
    this.store.dispatch(roomInfoSync(this.roomId, resourceType, collaborators || []));
    this.store.dispatch(setResourceConnect(this.roomId, resourceType));
    this.loadFieldPermissionMap();
    this.bindSocketMessage();
    this.setSendingWatcher();

  }

  /**
   * 切换资源或者断网重连，都请求本房间内所有数表的列权限
   */
  loadFieldPermissionMap() {
    const dstIds: string[] = [];
    this.collaEngineMap.forEach(collaEngine => {
      if (collaEngine.resourceType !== ResourceType.Datasheet) {
        return;
      }
      dstIds.push(collaEngine.resourceId);
    });
    dstIds.length && this.store.dispatch(StoreActions.fetchFieldPermission(dstIds) as any);
  }

  @errorCapture<RoomService>()
  async checkVersion(resourceRevisions: IResourceRevision[] | null) {
    const missVersionEngines: { collaEngine: Engine; revision: number }[] = [];

    if (!resourceRevisions || !resourceRevisions.length) {
      console.log('当前资源由于长时间未操作，进行数据的自动更新');
      await this.collaEngineMap.get(this.roomId)?.event.reloadResourceData();
      return;
    }

    for (const { resourceId, revision } of resourceRevisions) {
      const collaEngine = this.collaEngineMap.get(resourceId);

      if (!collaEngine) {
        continue;
      }

      const baseRevision = collaEngine.getRevision();
      const versionDiffs = numbersBetween(baseRevision, revision + 1);
      if (!versionDiffs.length) {
        continue;
      }
      if (versionDiffs.length >= 100) {
        throw new EnhanceError({
          code: StatusCode.FRONT_VERSION_ERROR,
          message: t(Strings.changeset_diff_big_tip),
          modalType: ModalType.Info
        });

      }
      missVersionEngines.push({ collaEngine, revision });
    }

    return await Promise.all(missVersionEngines.map<Promise<any>>(({ collaEngine, revision }) => {
      return collaEngine.prepare(revision + 1);
    }));
  }

  /**
   * @description unwatch 不再需要关注协同队列是否清空，这里有两种情况：切换表格和ƒ socket 的完全断开。对于后者的处理需要依赖本地存储的数据，并且这里的 unwatch 事件也并不会触发。
   * 对于前者，service 在处理切换房间中已经做了 engine 数据的转换，保证了即便上一个房间中有未发送的数据，在切换房间后也能协同出去，
   * 所以这里只需要关注通知中间层离开房间
   * @private
   */
  private async unwatch() {
    await this.io.unWatch();
  }

  /**
   * 离开 room
   * 1. 解除长链消息监听
   * 2. 清除数据发送状态监测定时器
   */
  async leaveRoom() {
    this.setConnected(false);
    /**
     * 切换空间后，上一个空间的 socket 被关闭，导致 leave_room 的事件不会触发，所以
     * 可以这里可以检查项 socket 的连接状况
     */
    if (this.socket.connected) {
      await this.unwatch();
    } else {
      console.log('socket has been closed, room needn\'t leave again');
    }
    this.clearSendingWatcher();
    return this.collaEngineMap;
  }

  /**
   * @description 支持单个 Resource 退出当前协同的 Room，而不销毁当前 Room
   * @param {string} resourceId
   * @returns
   */
  quit(resourceId: string) {
    const collaEngine = this.collaEngineMap.get(resourceId);
    if (!collaEngine) {
      return;
    }

    if (collaEngine.isStorageClear()) {
      this.collaEngineMap.delete(resourceId);
      collaEngine.cancelQuit?.();
      this.store.dispatch(StoreActions.resetResource(resourceId, collaEngine.resourceType));
      return;
    }

    if (collaEngine.cancelQuit) {
      return;
    }

    const cancelId = setInterval(() => {
      this.quit(resourceId);
    }, 100);

    collaEngine.cancelQuit = () => {
      clearInterval(cancelId);
    };
  }

  /**
   * 数据发送状态监听器
   * 定时轮询检查用户数据是否已经发送出去并得到了确认
   * 如果过长时间（1 分钟）还未得到确认，就执行重试机制
   * 这种情况通常伴随着报错一起出现
   */
  private setSendingWatcher() {
    this.clearSendingWatcher();
    this.sendingWatcherTimer = setInterval(() => {
      if (!this.isConnect()) {
        return;
      }
      const changesets: ILocalChangeset[] = [];
      for (const key of this.collaEngineMap.keys()) {
        const localChangeset = this.collaEngineMap.get(key)!.bufferStorage.localPendingChangeset;

        if (localChangeset) {
          changesets.push(localChangeset);
        }
      }

      if (changesets.length > 0 && Date.now() - this.event.getRoomLastSendTime()! > 60 * 1000) {
        this.forceSend(changesets);
      }
    }, 10 * 1000);
  }

  private clearSendingWatcher() {
    clearInterval(this.sendingWatcherTimer);
  }

  // 强制发送数据到服务端，避免因为过程问题导致数据卡壳不发送。
  // 只要长连接存在，就会发送数据。
  private forceSend(changesets: ILocalChangeset[]) {
    const actionLength = changesets.reduce((pre, cur) => {
      return pre + cur.operations.reduce((p, c) => {
        return p + c.actions.length;
      }, 0);
    }, 0);

    // 注意：在粘贴超大数据的情况下，服务端可能返回缓慢，此时不进行数据重发。
    if (actionLength > MAX_RETRY_LENGTH) {
      console.error('大批量粘贴数据，将不进行重试操作');
      return;
    }

    Player.doTrigger(Events.app_error_logger, {
      error: new Error('force send userChanges'),
    });
    this.event.setRoomLastSendTime();

    this.sendUserChanges(changesets);
  }

  /**
   * 发送用户产生的 changeset
   */

  private sendUserChanges = (changesets: ILocalChangeset[]) => {
    console.log('提交数据: ', changesets, changesets.length);
    // 标记发送队列正在等待返回
    this.event.setRoomIOClear(false);
    this.event.setRoomLastSendTime();
    if (!this.connected) {
      console.error('room has been destroy,can\'t send anything');
      return;
    }
    // 500ms 之后再进行 loading, 防止网络较快的情况下图标一闪而过
    const collaEngine = this.collaEngineMap.get(this.roomId);
    const resourceType = collaEngine?.resourceType!;
    const timer = setTimeout(() => {
      this.store.dispatch(changeResourceSyncingStatus(this.roomId, resourceType, true));
    }, 500);
    const state = this.store.getState();
    const shareId = state.pageParams.shareId;
    return this.io.request<ISocketResponseData, IClientRoomMessage>({
      type: SyncRequestTypes.CLIENT_ROOM_CHANGE,
      roomId: this.roomId,
      changesets,
      shareId,
    }).then((data) => {
      clearTimeout(timer);
      this.event.setRoomIOClear(true);
      if (data.success && data.data) {
        this.store.dispatch(changeResourceSyncingStatus(this.roomId, resourceType, false));
        this.handleAcceptCommit(data.data.changesets);
        data.data;
        return Promise.resolve();
      }
      // 未成功的请求，引流到下面的catch
      return Promise.reject(data);
    }).catch(e => {
      this.event.setRoomIOClear(true);
      let errMsg = e;
      clearTimeout(timer);
      if (!('success' in errMsg)) {
        errMsg = {
          success: false,
          code: 0,
          message: t(Strings.exception_network_exception),
        };
      }
      this.handleRejectCommit(errMsg);
      return Promise.reject();
    });
  };

  @errorCapture<RoomService>()
  async handleAcceptCommit(changesets: IRemoteChangeset[]) {
    for (const cs of changesets) {
      const collaEngine = this.collaEngineMap.get(cs.resourceId)!;
      if (!collaEngine) {
        console.log('房间已经切换，collaEngine 更新');
        continue;
      }
      await collaEngine.handleAcceptCommit(cs);
      // TODO: changesets 里面有 cookie 要在中间层去掉
      console.log('数据返回成功: ', cs);
    }

    this.nextSend();
  }

  @errorCapture<RoomService>()
  @socketGuard()
  async handleRejectCommit(data: ISocketResponseData, clearAllStorage = true) {
    // 只是 message 重复了的话，不需要刷新
    if (data.code === OtErrorCode.MSG_ID_DUPLICATE) {
      console.log(data.message);
      this.nextSend();
      return;
    }

    const bufferStorage = this.collaEngineMap.get(this.roomId)?.bufferStorage;

    Player.doTrigger(Events.app_error_logger, {
      error: new Error(`错误的 op 信息：${data.message}`),
      metaData: {
        roomId: this.roomId,
        connected: this.connected,
        socketConnected: this.io.socket.connected,
        opBuffer: JSON.stringify(bufferStorage?.opBuffer),
        localPendingChangeset: JSON.stringify(bufferStorage?.localPendingChangeset),
      },
    });

    if (clearAllStorage) {
      // 清空数据之前，对被清空的数据做本地备份
      await this.backupDB.setItem(String(Date.now()), {
        opBufferMap: this.getBufferOperateMap(),
        changesetMap: keyBy(this.getLocalPendingChangesets(), 'resourceId')
      });
      this.clearAllStorage();
    }

    console.trace('错误的 op 信息');
    throw new EnhanceError(data);
  }

  private getBufferOperateMap() {
    const bufferOperateMap: Record<string, IOperation[]> = {};
    for (const resourceId of this.collaEngineMap.keys()) {
      const collaEngine = this.collaEngineMap.get(resourceId)!;
      const operate = collaEngine.getOpBuffer();
      if (operate) {
        bufferOperateMap[resourceId] = operate;
      }
    }
    return bufferOperateMap;
  }

  private getLocalPendingChangesets() {
    const localPendingChangeset: ILocalChangeset[] = [];
    for (const resourceId of this.collaEngineMap.keys()) {
      const collaEngine = this.collaEngineMap.get(resourceId)!;
      const cs = collaEngine.getLocalPendingChangeset();
      if (cs) {
        localPendingChangeset.push(cs);
      }
    }
    return localPendingChangeset;
  }

  // 清除所有待发送的 op 和待确认的 changeset
  private clearAllStorage() {
    for (const resourceId of this.collaEngineMap.keys()) {
      const collaEngine = this.collaEngineMap.get(resourceId)!;
      collaEngine.clearLocalPendingChangeset();
      collaEngine.clearOpBuffer();
    }
  }

  /**
   * @description 进行下一轮的发送
   * @private
   * 当目前没有排队请求的时候，可以直接开始发送
   * 否则等待当前请求结束后，opBuffer 会自动被发送
   * 第一次触发时立即调用，间隔时间结束后会再次调用
   */
  private nextSend = throttle(() => {
    if (!this.event.getRoomIOClear()) {
      console.error('throttledNextSend pending reject');
      return;
    }

    const nextChangesets: ILocalChangeset[] = [];
    for (const resourceId of this.collaEngineMap.keys()) {
      const collaEngine = this.collaEngineMap.get(resourceId)!;
      const cs = collaEngine.getNextChangeset();
      if (cs) {
        nextChangesets.push(cs);
      }
    }
    if (nextChangesets.length) {
      this.event.setRoomLastSendTime();
      this.sendUserChanges(nextChangesets);
    }
  }, 500);

  /**
   * 将 operation 推入发送队列，SyncEngine 将保证数据按照版本顺序发送到服务端
   * 并且提供临时性的本地持久化能力，防止用户意外断网和主动刷新的情况下丢失数据
   *
   * Notice: 多个 operation 可能会被合并成一个 changeset 一次性发送到服务端
   *
   */
  @errorCapture<RoomService>()
  syncOperations(localOperations: IResourceOpsCollect[]) {
    localOperations.forEach(lop => {
      const collaEngine = this.collaEngineMap.get(lop.resourceId);
      lop.operations.forEach(op => collaEngine?.pushOpBuffer(op));
    });

    this.nextSend();
  }

  /**
   * 是否可以安全的关闭
   * 当还存在没有成功同步的数据的时候，返回 false，否则返回 true
   */
  isSafeToClose(): boolean {
    for (const resourceId of this.collaEngineMap.keys()) {
      const collaEngine = this.collaEngineMap.get(resourceId)!;
      if (!collaEngine.isStorageClear()) {
        return false;
      }
    }
    return true;
  }

  /**
   * 一个简单的消息发送器，适用于仅需要发送通知而不需要持久化的情况。
   * 消息会发送给 所有在线的
   */
  sendMessages(type: string, data?: Record<string, any>) {
    return this.io.request({
      type,
      ...data,
    });
  }

  getCollaEngine() {
    return this.collaEngineMap.get(this.roomId);
  }

  /**
   * 激活协作者，调用此方法之后，当前用户的头像会显示在所有打开本表的协作者界面上
   */
  handleActiveCollaborator(data: ICollaborator) {
    console.log('active collaborator', data);
    const collaEngine = this.getCollaEngine();
    if (!collaEngine) {
      return;
    }
    this.store.dispatch(StoreActions.activeCollaborator(data, this.roomId, collaEngine.resourceType));
  }

  /**
   * 激活协作者，调用此方法之后，当前用户的头像会显示在所有打开本表的协作者界面上
   */
  handleActiveCollaborators(data: { collaborators: ICollaborator[] }) {
    console.log('active collaborators', data);
    const collaEngine = this.getCollaEngine();
    if (!collaEngine) {
      return;
    }
    data.collaborators.forEach(item => {
      this.store.dispatch(StoreActions.activeCollaborator(item, this.roomId, collaEngine.resourceType));
    });
  }

  /**
   * 取消激活协作者，调用此方法之后，当前用户的头像会离开在所有打开本表的协作者界面上
   */
  handleDeactivateCollaborator(data: ICollaborator) {
    console.log('deactivate collaborator', data);
    const collaEngine = this.getCollaEngine();
    if (!collaEngine) {
      return;
    }
    this.store.dispatch(StoreActions.deactivateCollaborator(data, this.roomId, collaEngine.resourceType));
  }

  handleCursor(data: IEngagementCursorData) {
    console.log('RECEIVED IEngagementCursorData: ', { data });
    const { cursorInfo } = data;
    this.store.dispatch(StoreActions.cursorMove({
      fieldId: cursorInfo.fieldId,
      recordId: cursorInfo.recordId,
      time: cursorInfo.time,
      socketId: data.socketId,
    }, this.roomId));
  }

  @errorCapture<RoomService>()
  handleNodeShareDisabled(data: INodeShareDisabledData) {
    console.log('RECEIVED INodeShareDisabledData: ', { data });
    const state = this.store.getState();
    const shareId = state.pageParams.shareId;
    if (shareId && data.shareIds.includes(shareId)) {
      this.event.destroy?.();
      throw new EnhanceError({
        code: StatusCode.NODE_NOT_EXIST,
        message: t(Strings.error_please_close_sharing_page),
        okText: t(Strings.okay),
        modalType: ModalType.Warning,
        onOkType: OnOkType.BackWorkBench
      });
    }
  }

  generateStdFieldPermission(data: IFieldPermissionMessage, manageable = false) {
    return {
      [data.fieldId]: {
        role: data.role || ConfigConstant.Role.None,
        setting: data.setting || {
          formSheetAccessible: false,
        },
        permission: data.permission || DEFAULT_FIELD_PERMISSION,
        manageable,
      },
    };
  }

  // 开启列权限
  handleFieldPermissionEnabled(data: IFieldPermissionMessage) {
    console.log('RECEIVED handleFieldPermissionEnabled: ', { data });
    const fieldPermission = this.generateStdFieldPermission(data, true);
    this.store.dispatch(updateFieldPermissionMap(fieldPermission, data.datasheetId));

  }

  // 变更列权限
  handleFieldPermissionChange(data: IFieldPermissionMessage) {
    console.log('RECEIVED handleFieldPermissionChange: ', { data });
    const fieldPermission = this.generateStdFieldPermission(data);
    this.store.dispatch(updateFieldPermissionMap(fieldPermission, data.datasheetId));
  }

  // 关闭列权限
  handleFieldPermissionDisabled(data: IFieldPermissionMessage) {
    console.log('RECEIVED handleFieldPermissionDisabled: ', { data });
    this.store.dispatch(resetFieldPermissionMap(data.fieldId, data.datasheetId));
  }

  // 修改列权限的配置
  // 0.7 不处理该事件
  handleFieldPermissionSetting(data: IFieldPermissionMessage) {
    console.log('RECEIVED IFieldPermissionMessage: ', { data });
    if (!data.setting) {
      return;
    }
    this.store.dispatch(updateFieldPermissionSetting(data.fieldId, data.setting, data.datasheetId));
  }

  /**
   * 处理 io 主动推送的消息
   */
  private bindSocketMessage = () => {
    if (!this.io.socket) {
      throw new Error(t(Strings.error_please_bind_message_after_connected));
    }
    this.io.offAll();

    this.io.on<INewChangesData>(BroadcastTypes.SERVER_ROOM_CHANGE, (data) => {
      this.handleNewChanges(data);
    });

    this.io.on<IEngagementCursorData & { datasheetId: string }>(BroadcastTypes.ENGAGEMENT_CURSOR, (data) => {
      this.handleCursor(data);
    });

    this.io.on<ICollaborator>(BroadcastTypes.ACTIVATE_COLLABORATOR, data => {
      this.handleActiveCollaborator(data);
    });

    this.io.on<{ collaborators: ICollaborator[] }>(BroadcastTypes.ACTIVATE_COLLABORATORS, data => {
      this.handleActiveCollaborators(data);
    });

    this.io.on<ICollaborator>(BroadcastTypes.DEACTIVATE_COLLABORATOR, data => {
      this.handleDeactivateCollaborator(data);
    });

    this.io.on<INodeShareDisabledData>(BroadcastTypes.NODE_SHARE_DISABLED, data => {
      this.handleNodeShareDisabled(data);
    });

    this.io.on<IFieldPermissionMessage>(BroadcastTypes.FIELD_PERMISSION_ENABLE, data => {
      this.handleFieldPermissionEnabled(data);
    });

    this.io.on<IFieldPermissionMessage>(BroadcastTypes.FIELD_PERMISSION_CHANGE, data => {
      this.handleFieldPermissionChange(data);
    });

    this.io.on<IFieldPermissionMessage>(BroadcastTypes.FIELD_PERMISSION_DISABLE, data => {
      this.handleFieldPermissionDisabled(data);
    });

    this.io.on<IFieldPermissionMessage>(BroadcastTypes.FIELD_PERMISSION_SETTING_CHANGE, data => {
      this.handleFieldPermissionSetting(data);
    });
  };

  setConnected(status: boolean) {
    this.connected = status;
  }

  getStatus() {
    return this.event.getRoomIOClear();
  }
}
