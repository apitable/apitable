import { LS_DATASHEET_NAMESPACE } from 'config/constant';
import { ILocalChangeset, IOperation, composeOperations } from './ot';
import { generateRandomString } from 'utils';
import { ResourceType } from 'types';
import { Events, Player } from 'player';
import { TrackEvents } from 'config';

// 本地缓存处理接口
export interface IStoredData {
  [key: string]: any;
}

export interface ILsStore {
  clear(): ILsStore;
  clearAll(): ILsStore;
  each(callback: (key: any, data: any) => false | any): ILsStore;
  get(key: any, alt?: any): any;
  getAll(fillObj?: IStoredData): IStoredData;
  has(key: any): boolean;
  isFake(): boolean;
  keys(fillList?: string[]): string[];
  namespace(namespace: string, noSession?: true): ILsStore;
  remove(key: any, alt?: any): any;
  set(key: any, data: any, overwrite?: boolean): any;
  setAll(data: Object, overwrite?: boolean): IStoredData;
  add(key: any, data: any): any;
  size(): number;
  transact(key: any, fn: (data: any) => any, alt?: any): ILsStore;
}

interface LocalForageDbInstanceOptions {
  name?: string;

  storeName?: string;
}

interface LocalForageOptions extends LocalForageDbInstanceOptions {
  driver?: string | string[];

  size?: number;

  version?: number;

  description?: string;
}

interface LocalForageDbMethodsCore {
  getItem<T>(key: string, callback?: (err: any, value: T | null) => void): Promise<T | null>;

  setItem<T>(key: string, value: T, callback?: (err: any, value: T) => void): Promise<T>;

  removeItem(key: string, callback?: (err: any) => void): Promise<void>;

  clear(callback?: (err: any) => void): Promise<void>;

  length(callback?: (err: any, numberOfKeys: number) => void): Promise<number>;

  key(keyIndex: number, callback?: (err: any, key: string) => void): Promise<string>;

  keys(callback?: (err: any, keys: string[]) => void): Promise<string[]>;

  iterate<T, U>(iteratee: (value: T, key: string, iterationNumber: number) => U,
                callback?: (err: any, result: U) => void): Promise<U>;
}

export interface ILocalForage extends LocalForageDbMethodsCore {
  LOCALSTORAGE: string;
  WEBSQL: string;
  INDEXEDDB: string;

  /**
   * Set and persist localForage options. This must be called before any other calls to localForage are made, but can be called after localForage is loaded.
   * If you set any config values with this method they will persist after driver changes, so you can call config() then setDriver()
   * @param {LocalForageOptions} options?
   */
  config(options: LocalForageOptions): boolean;
  config(options: string): any;
  config(): LocalForageOptions;

  /**
   * Create a new instance of localForage to point to a different store.
   * All the configuration options used by config are supported.
   * @param {LocalForageOptions} options
   */
  createInstance(options: LocalForageOptions): ILocalForage;

  driver(): string;

  /**
   * Force usage of a particular driver or drivers, if available.
   * @param {string} driver
   */
  setDriver(driver: string | string[], callback?: () => void, errorCallback?: (error: any) => void): Promise<void>;

  supports(driverName: string): boolean;

  ready(callback?: (error: any) => void): Promise<void>;
}

/**
 * 用于将 opBuffer 和 localChangeset 缓存在本地 localStorage 中
 * 以供网络状况差/意外关闭的时候也可以从本地恢复未保存的数据
 */
export class BufferStorage {
  static bufferStorageNamespace = `${LS_DATASHEET_NAMESPACE}.opBuffer`;
  static pendingChangesetsNamespace = `${LS_DATASHEET_NAMESPACE}.localChangeset`;

  // localStorage 封装实例，提前绑定 namespace
  // https://github.com/nbubna/store
  private opBufferStorage = this.lsStore.namespace(BufferStorage.bufferStorageNamespace);
  private _opBuffer: IOperation[] = [];

  private localPendingChangesetStorage = this.lsStore.namespace(BufferStorage.pendingChangesetsNamespace);
  private _localPendingChangeset: ILocalChangeset | undefined;

  constructor(public resourceId: string, public resourceType: ResourceType, public lsStore: ILsStore) {
    this.resumeLocalState();
  }

  // 缓存刚刚产生，但是还在排队没有发送出去的 Operation
  // 发送出去之后，opBuffer 里面的 op 就会组装成 localPendingChangeset
  get opBuffer(): IOperation[] {
    return this._opBuffer;
  }

  set opBuffer(value: IOperation[]) {
    this._opBuffer = value;
    if (value == null || value.length === 0) {
      this.opBufferStorage.remove(this.resourceId);
      return;
    }
    try {
      this.opBufferStorage.set(this.resourceId, value);
    } catch (e) {
      console.error(e);
    }
  }

  // 已经发送出去，正在等待 ACK 的 changeset
  get localPendingChangeset(): ILocalChangeset | undefined {
    return this._localPendingChangeset;
  }

  set localPendingChangeset(value: ILocalChangeset | undefined) {
    this._localPendingChangeset = value;
    if (value == null) {
      this.localPendingChangesetStorage.remove(this.resourceId);
      return;
    }
    try {
      this.localPendingChangesetStorage.set(this.resourceId, value);
    } catch (e) {
      // 设置 localStorage 失败的时候，要清空掉原有值。
      this.localPendingChangesetStorage.remove(this.resourceId);
      console.error(e);
    }
  }

  /**
   * @description 读取 opBuffer 的数据，并清空 opBuffer，
   * 考虑到网络层延时的问题，前端无法及时收到 ack ，这里会将 opsBuffer 的数据在 storage 中保存一份
   * @param {number} revision
   * @returns
   * @memberof Engine
   */
  deOpBuffer(revision: number) {
    const ops = this.opBuffer;
    // reset opBuffer
    this.opBuffer = [];

    // set localChangeset
    if (!ops.length) {
      this.localPendingChangeset = undefined;
      return;
    }
    this.localPendingChangeset = BufferStorage.ops2Changeset(ops, revision, this.resourceId, this.resourceType);
  }

  static ops2Changeset(ops: IOperation[], revision: number, resourceId: string, resourceType: ResourceType): ILocalChangeset {
    return {
      messageId: generateRandomString(),
      baseRevision: revision,
      resourceId,
      resourceType,
      operations: composeOperations(ops),
    };
  }

  // 清空opBuffer，会丢失掉未同步的数据
  clearOpBuffer() {
    this.opBuffer = [];
  }

  /**
   * @description 将 operation 加入到 buffer 发送队列。
   */
  pushOpBuffer(operation: IOperation) {
    // 为了触发 setter，不通过 push 而是直接赋值
    const opBuffer = this.opBuffer;
    this.opBuffer = [...opBuffer, operation];
  }

  clearLocalPendingChangeset() {
    // 清空本地暂存的 changeset
    this.localPendingChangeset = undefined;
    // this.status = EngineStatus.Clear;
    // // 进行新一轮的发送
    // this.send();
  }

  /**
   * 从 localStorage 中恢复应用状态。
   * 主要涉及两个状态，localChangeset 和 opBuffer。
   * 这两个变量保存了还未得到服务端确认的 op。并且实时的在 localStorage 中持有备份。
   * 当页面刷新 or 数表重新初始化的时候，内存中的 localChangeset 和 opBuffer 的值丢失
   * 此时就要从 localStorage 中进行恢复。
   */
  resumeLocalState() {
    this.localPendingChangeset = this.compatibleLocalChangeset(this.localPendingChangesetStorage.get(this.resourceId) || undefined);
    this.opBuffer = this.opBufferStorage.get(this.resourceId) || [];
  }

  /**
   * @description 针对线上缓存的协同数据结构的一次处理
   * 这里只考虑 localChangeset 即可，opbufferstorage 中记录的是淡村的 op 结构，不需要兼容
   * @param changeset
   * 目前是 0.6.2 ，可以在两三个版本后删除这段兼容处理
   * @private
   */
  private compatibleLocalChangeset(changeset: ILocalChangeset | undefined): ILocalChangeset | undefined {
    if (!changeset) {
      return;
    }
    if (changeset['datasheetId']) {
      // 属性中存在 datasheetId 的可以认为是旧的数据结构，并且旧的结构中还存在 userId，可以丢弃
      const newLocalChangeset = {
        baseRevision: changeset.baseRevision,
        resourceId: changeset['datasheetId'],
        resourceType: ResourceType.Datasheet,
        operations: changeset.operations,
        messageId: changeset.messageId,
      };
      Player.doTrigger(Events.app_tracker, {
        name: TrackEvents.OldLocalChangeset,
        props: {
          oldLocalChangeset: changeset,
          newLocalChangeset: newLocalChangeset,
        },
      });
      return newLocalChangeset;
    }
    return changeset;
  }
}
