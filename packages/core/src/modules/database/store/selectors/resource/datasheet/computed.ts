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

import { compensator } from '../../../../../../compensator';

import { CellType } from 'modules/shared/store/constants';

import { ILinearRow, IReduxState } from 'exports/store/interfaces';
import { getDatasheetPack } from './base';
import { getViewByIdWithDefault } from './calc';

export const getComputedInfo = (state: IReduxState, dsId?: string) => {
  const datasheetPack = getDatasheetPack(state, dsId);
  return datasheetPack?.computedInfo;
};

export const getComputedStatus = (state: IReduxState, dsId?: string) => {
  const datasheetPack = getDatasheetPack(state, dsId);
  return datasheetPack?.computedStatus;
};

export const getPureVisibleRowsFormComputed = (state: IReduxState, dsId?: string | void) => {
  const datasheetPack = getDatasheetPack(state, dsId);
  const pureVisibleRows = datasheetPack?.computedInfo?.pureVisibleRows;
  if (!pureVisibleRows) {
    return pureVisibleRows;
  }
  if (!compensator.willRemoveRecords.size) {
    return pureVisibleRows;
  }
  return pureVisibleRows.filter((item) => !compensator.checkWillRemoveRecord(item.recordId));
};

export const getVisibleColumnsFormComputed = (state: IReduxState, dsId?: string) => {
  const datasheetPack = getDatasheetPack(state, dsId);
  return datasheetPack?.computedInfo?.visibleColumns;
};

export const getLinearRowsFormComputed = (state: IReduxState, dsId?: string) => {
  const datasheetPack = getDatasheetPack(state, dsId);
  const linearRows = datasheetPack?.computedInfo?.linearRows;
  if (!linearRows) {
    return null;
  }
  if (!compensator.willRemoveRecords.size && !compensator.lastGroupInfo) {
    return linearRows;
  }
  const filterConditions: ((record: ILinearRow) => boolean)[] = [];
  if (compensator.lastGroupInfo) {
    const _dsId = dsId || state.pageParams.datasheetId;
    if (_dsId) {
      const curGroupInfo = getViewByIdWithDefault(state, _dsId)?.groupInfo;
      const maxDepth = curGroupInfo ? curGroupInfo.length : 0;
      filterConditions.push((record) => {
        record.depth = Math.min(record.depth, maxDepth);
        return record.type !== CellType.GroupTab || record.depth < maxDepth;
      });
    }
  }
  if (compensator.willRemoveRecords.size) {
    filterConditions.push((record) => {
      return !compensator.checkWillRemoveRecord(record.recordId);
    });
  }
  return linearRows.filter((item) => filterConditions.reduce((pass, check) => {
    if (!pass) {
      return pass;
    }
    return check(item);
  }, true));
};
