import { Url } from '@vikadata/core';
import {
  CollaCommandManager, ComputeRefManager, Engine, Events, IError, IJOTAction, IOperation, IReduxState, IResourceOpsCollect, OP2Event, OPEventManager,
  OPEventNameEnums, Player, ResourceStashManager, ResourceType, RoomService, Selectors, StoreActions, Strings, t, TrackEvents, UndoManager
} from 'core';
import { mainWidgetMessage } from 'iframe_message';
import localForage from 'localforage';
import { Store } from 'redux';
import SocketIO from 'socket.io-client';
import lsStore from 'store2';
import { IResourceService, IServiceError } from './interface';

const RECONNECT_DELAY = 2000;

const clientWatchedEvents = [
  OPEventNameEnums.CellUpdated,
  OPEventNameEnums.RecordCreated,
  OPEventNameEnums.RecordCommentUpdated,
  OPEventNameEnums.RecordMetaUpdated,
  OPEventNameEnums.RecordDeleted,
  OPEventNameEnums.RecordUpdated,
  OPEventNameEnums.FieldUpdated
];
// 应用远程同步过来的 op
export const remoteActions2Operation = (actions: IJOTAction[]) => {
  // 通过一个特殊的 operation 来应用 transform 之后的new changes。
  return { cmd: 'REMOTE_NEW_CHANGES', actions };
};

export class ResourceService implements IResourceService {
  socket!: SocketIOClient.Socket;
  roomService!: RoomService;
  commandManager!: CollaCommandManager;
  initialized?: boolean;
  undoManager!: UndoManager;
  resourceStashManager!: ResourceStashManager;
  opEventManager: OPEventManager;
  computeRefManager: ComputeRefManager;
  reportSocketError = true;
  roomIOClear = true;
  roomLastSendTime?: number;
  firstRoomInit = true;

  constructor(public store: Store<IReduxState>, public onError: IServiceError) {
    this.opEventManager = new OPEventManager({
      options: {
        enableVirtualEvent: true,
        // enableCombEvent: true, // client 不需要开启聚合事件
      },
      // eslint-disable-next-line require-await
      getState: () => {
        return store.getState();
      },
      op2Event: new OP2Event(clientWatchedEvents)
    });
    this.computeRefManager = new ComputeRefManager();
  }

  init() {
    if (this.initialized) {
      console.error('请勿重复初始化 datasheet store');
      return;
    }
    this.initialized = true;

    this.bindBeforeUnload();
    this.socket = this.createSocket();
    this.commandManager = this.createCommandManager();
    this.resourceStashManager = new ResourceStashManager(this.store, () => {
      return this.roomService;
    });
  }

  destroy() {
    if (!this.initialized) {
      return;
    }
    this.initialized = false;

    this.roomService && Array.from(this.roomService.collaEngineMap.values()).forEach(engine => {
      this.reset(engine.resourceId);
    });

    this.socket && this.socket.removeAllListeners();
    this.socket && this.socket.close();
    this.unBindBeforeUnload();
    this.store.dispatch(StoreActions.setConnected(false));
    this.resourceStashManager.destroy();
  }

  static getResourceFetchAction(resourceType: ResourceType): any {
    switch (resourceType) {
      case ResourceType.Datasheet: {
        return StoreActions.fetchDatasheet;
      }
      case ResourceType.Dashboard: {
        return StoreActions.fetchDashboardPack;
      }
      case ResourceType.Form: {
        return StoreActions.fetchForm;
      }
      case ResourceType.Mirror: {
        return StoreActions.fetchMirrorPack;
      }
      default: {
        // TODO: 错误处理
        return StoreActions.fetchDatasheet;
      }
    }
  }

  async switchResource(params: { from?: string, to: string, resourceType: ResourceType, extra?: { [key: string]: any } }) {
    console.log('enter datasheet', params);
    const { to, resourceType, extra } = params;
    const allowSwitchRoom = this.allowSwitchRoom();

    allowSwitchRoom && await this.switchRoom(to);

    await this.fetchResource(to, resourceType, false, extra);

    this.createUndoManager(to);
    allowSwitchRoom && await this.roomService.init(this.firstRoomInit);
    this.firstRoomInit = false;
  }

  fetchResource(to: string, resourceType: ResourceType, overWrite = false, extra?: { [key: string]: any }) {
    return new Promise<void>((resolve, reject) => {
      const fetchAction = ResourceService.getResourceFetchAction(resourceType);
      this.store.dispatch(fetchAction(to, () => {
        resolve();
      }, overWrite, extra, () => reject()) as any);
    });
  }

  applyOperations(
    store: Store<IReduxState>,
    resourceOpsCollects: IResourceOpsCollect[]
  ) {
    const changesets = resourceOpsCollects;
    const events = this.opEventManager.handleChangesets(changesets);
    this.opEventManager.handleEvents(events, true);
    changesets.forEach(changeset => {
      const { resourceType, operations, resourceId } = changeset;
      if (resourceType === ResourceType.Datasheet || resourceType === ResourceType.Widget) {
        mainWidgetMessage?.enable && mainWidgetMessage.syncOperations(operations, resourceType, resourceId);
      }
      // console.log('================= apply jot start ================');
      store.dispatch(StoreActions.applyJOTOperations(operations, resourceType, resourceId));
      // console.log('================= apply jot end ================');
    });
    // 往小组件同步 operations
    this.opEventManager.handleEvents(events, false);
  }

  /**
   * @description 单纯的处理房间的创建和销毁，以及创建 undoManager
   * 这个方法存在的意义在于，同样是打开一张数表，在「模板」中，是不能存在销毁/创建 room 的概念，所以这个方法更纯粹，
   * 只有在符合 room 这个概念的时候再调用
   * @param {string} to
   * @returns {Promise<void>}
   * @private
   */
  private async switchRoom(to: string) {
    /**
     * 针对 form 的特殊处理，从 form 进入数表，可能不存在 room
     */
    const collaEngineMap = this.roomService ? await this.roomService.leaveRoom() : undefined;
    // 创建一个新的 room
    this.roomService = new RoomService(
      RoomService.createRoomId(to),
      this.socket,
      () => this.socket.connected,
      this.store,
      collaEngineMap,
      {
        onError: (error: IError) => this.onError(error, 'modal'),
        destroy: () => this.destroy(),
        getRoomIOClear: () => {
          return this.roomIOClear;
        },
        setRoomIOClear: (status: boolean) => {
          return this.roomIOClear = status;
        },
        getRoomLastSendTime: () => {
          return this.roomLastSendTime;
        },
        setRoomLastSendTime: () => {
          this.roomLastSendTime = Date.now();
        }
      },
      this.fetchResource,
      lsStore,
      localForage
    );
  }

  /**
   * @description undoManger 和创建房间的主 resource 绑定，在切换 resource 的时候，都需要实例化 undoManager
   * 并且将 undoManger 和 commandManager 绑定
   * @param {string} resourceId
   */
  createUndoManager(resourceId: string) {
    const undoManager = this.resourceStashManager.getUndoManager(resourceId);
    this.undoManager = undoManager;
    undoManager.setCommandManger(this.commandManager);
    this.commandManager.addUndoStack = (cmd, result, executeType) => {
      const collaEngine = this.getCollaEngine(result.resourceId);
      if (!collaEngine) {
        throw new Error(t(Strings.error_not_initialized_datasheet_instance));
      }
      undoManager.addUndoStack({ cmd, result }, executeType);
    };
  }

  /**
   * @description 判断当前的操作是否发生在「末班中」，模板里的任何 resource 都不需要创建/销毁 room
   * @returns {boolean}
   * @private
   */
  private allowSwitchRoom() {
    const state = this.store.getState();
    return !state.pageParams.templateId;
  }

  private createSocket() {
    const state = this.store.getState();
    const spaceId = state.space.activeId || state.share.spaceId;
    const version = window['__initialization_data__'].version;
    const socket = SocketIO(Url.WEBSOCKET_NAMESPACE,
      {
        path: Url.ROOM_PATH,
        transports: ['websocket'],
        secure: true,
        query: {
          version,
          spaceId
        }
      });
    socket.on('disconnect', (reason) => {
      console.warn('! ' + 'socket disconnect from server');
      // Player.doTrigger(Events.app_error_logger, { error: new Error('socket disconnect reason: ' + reason) });

      this.store.dispatch(StoreActions.setReconnecting(true));
      this.roomService.setConnected(false);
      let count = 1;

      const interval = window.setInterval(async() => {
        if (socket.connected) {
          clearInterval(interval);
          await this.roomService.watch();
          this.roomService.setConnected(true);
          this.store.dispatch(StoreActions.setReconnecting(false));
          console.log('connected');
          return;
        }
        if (reason === 'io server disconnect') {
          // the disconnection was initiated by the server, you need to reconnect manually
          socket.connect();
          console.warn('! ' + `room attempt to reconnect ${count++} ...`);
        }
      }, RECONNECT_DELAY);
    });

    socket.on('connect', () => {
      this.reportSocketError = true;
      this.store.dispatch(StoreActions.setConnected(true));
    });

    socket.on('connect_error', (error) => {
      if (!this.reportSocketError) {
        return;
      }
      this.reportSocketError = false;
      // Player.doTrigger(Events.app_error_logger, { error: new Error('socket has happened some error: ' + JSON.stringify(error)) });
    });
    return socket;
  }

  getCollaEngine(resourceId: string) {
    return this.roomService.collaEngineMap.get(resourceId);
  }

  // 应用 command 产生的 operations，也就是说，是本地产生的 op
  // 如果一个 command 操作了多个数表的数据（关联字段），这个会被调用多次
  localOperationDispatch = (resourceOpsCollects: IResourceOpsCollect[]) => {
    resourceOpsCollects.forEach((resourceOpsCollect) => {
      const { resourceId, operations } = resourceOpsCollect;
      const collaEngine = this.getCollaEngine(resourceId);
      if (!collaEngine) {
        throw new Error(t(Strings.error_not_initialized_datasheet_instance));
      }
      operations.forEach((operation) => {
        Player.doTrigger(Events.app_tracker, {
          name: TrackEvents.Operation,
          props: {
            cmd: operation.cmd,
            actionsLength: operation.actions.length,
          },
        });
      });
    });
    this.applyOperations(this.store, resourceOpsCollects);
  };

  /**
   * @desc 应用 command 产生 op 的方法，该方法在 CommandManager 初始化时作为回调函数传入。
   * 该方法只负责两件事
   * 1. 将 command 产生的 op 应用到本地
   * 2. 将 op 通过长链发送给中间层
   * @param resourceOpsCollects
   */
  operationExecuted = (resourceOpsCollects: IResourceOpsCollect[]) => {
    this.localOperationDispatch(resourceOpsCollects);
    // 将 operations 协同到远程
    this.roomService.syncOperations(resourceOpsCollects);

    // 给 opEvent 发送这次 command 产生的所有 datasheet 的 op
    // this.opEventManager.handleOperations(resourceOpsCollects
    //   .filter(v => v.resourceType === ResourceType.Datasheet) // 只有数表相关 op 才需要
    //   .map(v => ({ resourceId: v.resourceId, resourceType: v.resourceType, operations: [v.operation] })), this.store);
  };

  private createCommandManager() {
    return new CollaCommandManager({
      handleCommandExecuted: this.operationExecuted,
      handleCommandExecuteError: (error: IError, type?: 'message' | 'modal' | 'subscribeUsage') => {
        this.onError?.(error, type || 'message');
      },
      getRoomId: () => {
        return this.roomService.roomId;
      }
    }, this.store);
  }

  private beforeUnload = (event: BeforeUnloadEvent): string | void => {
    // 当还有用户数据没有发送到服务端的时候，要阻止页面关闭
    if (this.roomService && !this.roomService.isSafeToClose()) {
      if (event) {
        event.returnValue = 'o/';
      }
      return 'o/';
    }
    return;
  };

  private bindBeforeUnload() {
    window.addEventListener('beforeunload', this.beforeUnload);
  }

  private unBindBeforeUnload() {
    window.removeEventListener('beforeunload', this.beforeUnload);
  }

  /**
   * @description 1. 删除 store 上的资源数据；2. 在 engine 发完 op 的前提下，从 collaEngineMap 中删除 resource
   * @param {string} resourceId
   */
  reset(resourceId: string) {
    this.roomService.quit(resourceId);
  }

  onNewChanges(resourceType: ResourceType, resourceId: string, actions: IJOTAction[]) {
    console.log('================= change from remote ================');
    return this.applyOperations(this.store, [{
      resourceType,
      resourceId,
      operations: [remoteActions2Operation(actions)]
    }]);
  }

  /**
   * @description 为每一个资源创建一个协同引擎（collaEngine）
   * @param {string} resourceId
   * @param {ResourceType} resourceType
   * @returns
   */
  createCollaEngine(resourceId: string, resourceType: ResourceType) {
    const collaEngineMap = this.roomService.collaEngineMap;
    if (collaEngineMap.has(resourceId)) {
      return false;
    }
    const engine = new Engine({
      resourceId,
      resourceType,
      getRevision: () => Selectors.getResourceRevision(this.store.getState(), resourceId, resourceType)!,
      getNetworking: () => Selectors.getResourceNetworking(this.store.getState(), resourceId, resourceType)!,
      dispatch: this.store.dispatch,
      getState: this.store.getState,
      lsStore: lsStore,
      event: {
        onError: (error: IError) => {
          this.onError?.(error, 'modal');
        },
        onNewChanges: this.onNewChanges.bind(this),
        onAcceptSystemOperations: (ops: IOperation[]) => this.applyOperations(this.store, [{
          resourceType,
          resourceId,
          operations: ops
        }]),
        getUndoManager: () => {
          return this.undoManager;
        },
        reloadResourceData: () => {
          return this.fetchResource(resourceId, resourceType, true);
        },
      },
    });
    this.roomService.addCollaEngine(engine);
    return true;
  }

  public getCollaEngineKeys() {
    return this.roomService.collaEngineMap.keys();
  }

  checkRoomExist() {
    return Boolean(this.roomService);
  }
}
