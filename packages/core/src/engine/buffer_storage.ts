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

import { LS_DATASHEET_NAMESPACE } from 'config/constant';
import { ResourceType } from 'types';
import { generateRandomString } from 'utils';
import { composeOperations, ILocalChangeset, IOperation } from './ot';

// Local cache processing interface
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
  * used to cache opBuffer and localChangeset in local localStorage
  * Unsaved data can also be recovered locally for poor network conditions/unexpected shutdown
  */
export class BufferStorage {
  static bufferStorageNamespace = `${LS_DATASHEET_NAMESPACE}.opBuffer`;
  static pendingChangesetsNamespace = `${LS_DATASHEET_NAMESPACE}.localChangeset`;

  // localStorage encapsulates the instance and binds the namespace in advance
  // https://github.com/nbubna/store
  private opBufferStorage = this.lsStore.namespace(BufferStorage.bufferStorageNamespace);
  private _opBuffer: IOperation[] = [];

  private localPendingChangesetStorage = this.lsStore.namespace(BufferStorage.pendingChangesetsNamespace);
  private _localPendingChangeset: ILocalChangeset | undefined;

  constructor(public resourceId: string, public resourceType: ResourceType, public lsStore: ILsStore) {
    this.resumeLocalState();
  }

  // The cache has just been created, but it is still queuing operations that have not been sent out
  // After sending, the op in opBuffer will be assembled into localPendingChangeset
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

  // has been sent, waiting for ACK changeset
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
      // When setting localStorage fails, clear the original value.
      this.localPendingChangesetStorage.remove(this.resourceId);
      console.error(e);
    }
  }
  /**
   * @description reads the data of opBuffer and clears the opBuffer,
   * Considering the delay of the network layer, the front end cannot receive the ack in time,
   * here will save a copy of the opsBuffer data in the storage
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

  // Clearing the opBuffer will lose unsynchronized data
  clearOpBuffer() {
    this.opBuffer = [];
  }

  /**
   * @description adds the operation to the buffer send queue.
   */
  pushOpBuffer(operation: IOperation) {
    // To trigger the setter, assign directly instead of push
    const opBuffer = this. opBuffer;
    this.opBuffer = [...opBuffer, operation];
  }

  clearLocalPendingChangeset() {
    // Clear the local temporary changeset
    this.localPendingChangeset = undefined;
    // this.status = EngineStatus.Clear;
    // // Do a new round of sending
    // this.send();
  }

  /**
   * Restore application state from localStorage.
   * Mainly involves two states, localChangeset and opBuffer.
   * These two variables hold the op that has not been confirmed by the server. And keep backups in localStorage in real time.
   * When the page is refreshed or the data table is re-initialized, the values of localChangeset and opBuffer in memory are lost
   * At this point it is time to restore from localStorage.
   */
  resumeLocalState() {
    this.localPendingChangeset = this.compatibleLocalChangeset(this.localPendingChangesetStorage.get(this.resourceId) || undefined);
    this.opBuffer = this.opBufferStorage.get(this.resourceId) || [];
  }

  /**
    * @description A processing of the collaborative data structure for the online cache
    * Only the localChangeset is considered here. The op buffer storage records the op temp structure , which does not need to be compatible.
    * @param changeset
    * Currently 0.6.2 , this compatibility processing can be removed after two or three versions
    * @private
    */
  private compatibleLocalChangeset(changeset: ILocalChangeset | undefined): ILocalChangeset | undefined {
    if (!changeset) {
      return;
    }
    if (changeset['datasheetId']) {
      // The datasheetId in the attribute can be considered as the old data structure,
      // and the userId still exists in the old structure, which can be discarded
      const newLocalChangeset = {
        baseRevision: changeset.baseRevision,
        resourceId: changeset['datasheetId'],
        resourceType: ResourceType.Datasheet,
        operations: changeset.operations,
        messageId: changeset.messageId,
      };
      return newLocalChangeset;
    }
    return changeset;
  }
}
