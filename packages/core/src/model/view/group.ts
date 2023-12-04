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

import { computeCache } from 'compute_manager/compute_cache_manager';
import { IReduxState, ILinearRow } from '../../exports/store/interfaces';
import { CellType } from 'modules/shared/store/constants';
import { getVisibleRows, getVisibleRowsIndexMap }from 'modules/database/store/selectors/resource/datasheet/rows_calc';
import { IGroupInfo } from 'types';

type GroupTabIds = Map<string, boolean>; // recordId_depth[]
export class Group {
  groupBreakpoint: { [key: string]: number[] };
  groupArray: string[] = [];
  groupTabIdMap: Map<string, boolean> = new Map();
  constructor(groupInfo: IGroupInfo, groupBreakpoint?: { [key: string]: number[] }) {
    this.groupArray = groupInfo.map(f => f.fieldId);
    this.groupBreakpoint = this.groupArray.length && groupBreakpoint ? groupBreakpoint : {};
    if (!groupBreakpoint) {
      groupInfo.forEach(groupItem => {
        this.groupBreakpoint[groupItem.fieldId] = [];
      });
    }
  }

  clearGroupBreakpoint() {
    computeCache.delete('groupBreakpoint');
  }

  cacheGroupBreakpoint() {
    computeCache.set('groupBreakpoint', this.groupBreakpoint);
  }
  addBreakpointAndSetGroupTab(groupFieldId: string, breakIndex: number, fieldId: string, depth: number) {
    if (this.groupBreakpoint[groupFieldId]!.includes(breakIndex)) return;
    this.groupBreakpoint[groupFieldId]!.push(breakIndex);
    if (fieldId) {
      this.groupTabIdMap.set(`${fieldId}_${depth}`, true);
    }
  }

  getAllGroupTabIdsByRecomputed(state: IReduxState): GroupTabIds {
    const map = new Map();
    if (!this.groupArray?.length) return map;
    const rows = getVisibleRows(state);
    this.groupArray.forEach((groupFieldId, depth) => {
      (this.groupBreakpoint[groupFieldId] || []).forEach((recordIndex) => {
        const row = rows[recordIndex];
        if (row) {
          const recordId = row.recordId;
          map.set(`${recordId}_${depth}`, true);
        }
      });
    });
    return map;
  }
  getAllGroupTabIds(): GroupTabIds {
    return this.groupTabIdMap;
  }
  /**
   * Get all breakpoints under the current breakpoint (ie, subgroup headers under the current group)
   * Level 1 group breakpoint 0---------10---------20
   * Level 2 group breakpoint 0--3-5-6--10----15---20
   * 0 => [3,5,6]
   */
  getChildBreakpointIds(state: IReduxState, recordId: string, depth: number) {
    const rowIndexMap = getVisibleRowsIndexMap(state);
    const rows = getVisibleRows(state);
    const startVisibleRowIndex = rowIndexMap.get(recordId);
    const breakPoints = this.groupBreakpoint[this.groupArray[depth]!];
    if (!breakPoints) return [];
    const breakPointIndex = breakPoints.findIndex(i => i === startVisibleRowIndex);
    const endVisibleRowIndex = breakPoints[breakPointIndex + 1];
    const childGroupFieldId = this.groupArray[depth + 1];
    if (childGroupFieldId) {
      const childBreakpoints = this.groupBreakpoint[childGroupFieldId];
      if (childBreakpoints) {
        const startIndex = childBreakpoints.findIndex(i => i === startVisibleRowIndex);
        const endIndex = childBreakpoints.findIndex(i => i === endVisibleRowIndex);
        return childBreakpoints.slice(startIndex, endIndex).map(recordIndex => rows[recordIndex]?.recordId);
      }
    }
    return [];
  }

  // Get all rows under the grouping hierarchy.
  getRecordsInGroupByDepth(state: IReduxState, recordId: string, depth: number) {
    const rowIndexMap = getVisibleRowsIndexMap(state);
    const visibleRows = getVisibleRows(state);
    const startVisibleRowIndex = rowIndexMap.get(recordId);
    const breakPointArray = this.groupBreakpoint[this.groupArray[depth]!];
    if (!breakPointArray) return [];
    const breakPointIndex = breakPointArray.findIndex(i => i === startVisibleRowIndex);
    const endVisibleRowIndex = breakPointArray[breakPointIndex + 1];
    return visibleRows.slice(startVisibleRowIndex, endVisibleRowIndex);
  }

  /**
   * According to the breakpoint, generate the Row of the grouping structure between the breakpoint Records
   * @param breakIndex
   */
  genGroupLinearRows(
    breakIndex: number,
    recordId: string,
    preRecordId: string,
  ) {
    const res: ILinearRow[] = [];
    let breakPointGroupLevel = 0;
    for (const [index, fid] of this.groupArray.entries()) {
      if (this.groupBreakpoint[fid]?.includes(breakIndex)) {
        breakPointGroupLevel = index;
        break;
      }
    }

    // Add row at the end of the previous group.
    if (preRecordId) {
      const depth = this.groupArray.length;
      res.push({
        type: CellType.Add, depth,
        recordId: preRecordId,
      });
    }

    const addBlankLength = this.groupArray.length - breakPointGroupLevel;
    // Empty rows from the last grouping.
    for (const i of [...Array(addBlankLength).keys()]) {
      if (i == addBlankLength - 1) {
        if (recordId) {
          const depth = this.groupArray.length - 1 - i;
          res.push({
            type: CellType.Blank, depth,
            recordId: recordId,
          });
        }
      } else if (preRecordId) {
        const depth = this.groupArray.length - 1 - i;
        res.push({
          type: CellType.Blank, depth,
          recordId: preRecordId,
        });
      }
    }
    // tab of the current group
    for (const i of [...Array(this.groupArray.length - breakPointGroupLevel).keys()].reverse()) {
      if (recordId) {
        const depth = this.groupArray.length - 1 - i;
        res.push({
          type: CellType.GroupTab,
          depth,
          recordId,
        });
      }
    }
    return res;
  }

  /**
   * Get the breakpoint of the deepest grouping
   */
  getDepthGroupBreakPoints() {
    const groupLength = this.groupArray.length;
    const depthGroupId = this.groupArray[groupLength - 1]!;
    return this.groupBreakpoint[depthGroupId]!;
  }
}