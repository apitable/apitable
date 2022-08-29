/**
 * 功能： 用于补偿每一帧渲染时主线程和worker之间的差异
 * 在生成action的时候记录需要补偿的信息
 * 接收到worker post消息后，清除补偿信息
 * 改变视图时也清除补偿信息
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