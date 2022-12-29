/**
 * Function: used to compensate for the difference between the main thread and the worker when each frame is rendered
 * Record the information that needs to be compensated when the action is generated
 * After receiving the worker post message, clear the compensation information
 * also clear compensation information when changing view
 */
import { IGroupInfo } from 'types';

const usedWorker = () => !!(global as any).useWorkerCompute;

const wrapValueToArray = <T>(v: T | T[]): T[] => {
  if (Array.isArray(v)) {
    return v;
  }
  return [v];
};

type TChangeOptionsData = { origin: number, target: number } | boolean;

type TLastGroupInfo = IGroupInfo | null | undefined;

interface IChangeOptions {
  ids: string[];
  data?: TChangeOptionsData;
}

class Compensator {

  willRemoveRecords: Map<string, boolean>;
  willMoveRecords: Map<string, { origin: number, target: number }>;
  lastGroupInfo: TLastGroupInfo;

  constructor() {
    this.willRemoveRecords = new Map();
    this.willMoveRecords = new Map();
    this.lastGroupInfo = null;
  }

  private handleAddChange = (key: string, changeData: IChangeOptions) => {
    if (!usedWorker()) {
      return;
    }
    const { ids, data } = changeData;
    ids.forEach((record) => {
      this[key].set(record, data);
    });
  };

  // private handleDelChange = (key: string, delIds) => {
  //   if (!useWorker) {
  //     return;
  //   }
  //   delIds.forEach((record) => {
  //     this[key].delete(record);
  //   });
  // };

  addWillRemoveRecords = (records: string[]) => {
    this.handleAddChange('willRemoveRecords', { ids: wrapValueToArray(records), data: true });
  };

  checkWillRemoveRecord = (record: string) => {
    return this.willRemoveRecords.has(record);
  };

  setLastGroupInfoIfNull = (groupInfo: TLastGroupInfo) => {
    if (!usedWorker()) {
      return;
    }
    if (!this.lastGroupInfo) {
      this.lastGroupInfo = groupInfo;
    }
  };

  getLastGroupInfo = () => {
    return this.lastGroupInfo;
  };

  clearAll = () => {
    this.willMoveRecords.clear();
    this.willRemoveRecords.clear();
    this.lastGroupInfo = null;
  };
}

export const compensator = new Compensator();