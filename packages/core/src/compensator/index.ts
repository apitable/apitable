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