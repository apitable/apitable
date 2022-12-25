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

import { difference } from 'lodash';

/**
 * 1. The getCellValue process finds data that needs to be remedied
 * 2. Collect the data to be acquired into the helper for management.
 * 3. Timed batch remediation data in UI
 */
class DataSelfHelper {
  // dstId-fieldId: Set(recordId1, recordId2, ....)
  dataMap: Map<string, Set<string>>;
  constructor() {
    this.dataMap = new Map<string, Set<string>>();
  }

  clear() {
    this.dataMap.clear();
  }

  addRecord(dstId: string, recordId: string, fieldId: string) {
    const key = `${dstId}-${fieldId}`;
    if (!this.dataMap.has(key)) {
      this.dataMap.set(key, new Set([recordId]));
    } else {
      const dstRecordIdSet = this.dataMap.get(key);
      dstRecordIdSet?.add(recordId);
    }
  }

  // Confirm after the recovery data is successful
  confirm(key: string, recordIds: string[]) {
    const dstRecordIdSet = this.dataMap.get(key);
    if (dstRecordIdSet) {
      // During the remediation process, new records that need remediation may be added, and the difference is calculated.
      const restRecordIds = difference(Array.from(dstRecordIdSet), recordIds);
      if (restRecordIds.length) {
        this.dataMap.set(key, new Set(restRecordIds));
      } else {
        this.dataMap.delete(key);
      }
    }
  }

  get needHelper() {
    return this.dataMap.size > 0;
  }
}

// Implement self-rescue measures for data loss caused by dirty data. Ensure that the data can be displayed normally on the UI.
export const dataSelfHelper = new DataSelfHelper();

// Map used to store the calculation cache
export const computeCache = new Map<string, any>();
