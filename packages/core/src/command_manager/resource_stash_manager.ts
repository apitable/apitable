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

import { Store } from 'redux';
import { IReduxState } from '../exports/store/interfaces';
import { getSnapshot,getDatasheetIds } from 'modules/database/store/selectors//resource/datasheet';
import { UndoManager } from './undo_manager';
import LRU from 'lru-cache';
import _ from 'lodash';
import { batchActions } from 'redux-batched-actions';
import { RoomService } from 'sync';
import { ComputeRefManager } from 'compute_manager/compute_reference_manager';
import { resetDashboard } from 'modules/database/store/actions/resource/dashboard/dashboard';
import { resetDatasheet } from 'modules/database/store/actions/resource/datasheet/datasheet';

export class ResourceStashManager {
  private stash: LRU<string, UndoManager>;
  private maxSize = 5;
  private closeClear = true;

  constructor(private store: Store<IReduxState>, private getRoomService: () => RoomService) {
    this.stash = new LRU(this.maxSize);
  }

  calcRefMap(stashResourceIds: string[], activeDstIds: string[]) {
    const state = this.store.getState();
    const computeRefManager = new ComputeRefManager();

    for (const resourceId of stashResourceIds) {
      const currSnapshot = getSnapshot(state, resourceId);
      const fieldMap = currSnapshot?.meta.fieldMap;
      if (!fieldMap) {
        continue;
      }
      computeRefManager.computeRefMap(fieldMap, resourceId, state);
    }

    const reRefMap = computeRefManager.reRefMap;
    if (reRefMap.size === 0) {
      return;
    }

    const _activeDstIds: string[] = [];

    reRefMap.forEach(linkPath => {
      const _linkPath = Array.from(linkPath);
      const linkDstAndField = _linkPath[_linkPath.length - 1];
      if (linkDstAndField == null) {
        return;
      }
      const dstId = linkDstAndField.split('-')[0]!;

      if (activeDstIds.includes(dstId)) {
        return;
      }

      _activeDstIds.push(dstId);
    });

    activeDstIds.push(..._activeDstIds);

    this.calcRefMap(_activeDstIds, activeDstIds);
  }

  static getIdsByResourceType(stashResourceIds: string[]) {
    const stashDatasheetIds: string[] = [];
    const stashDashboardIds: string[] = [];
    const stashFormIds: string[] = [];
    const formIdReg = /(fom\w+)/;
    const datasheetIdReg = /(dst\w+)/;
    const dashboardReg = /(dsb\w+)/;

    for (const id of stashResourceIds) {
      if (datasheetIdReg.test(id)) {
        stashDatasheetIds.push(id);
      }
      if (dashboardReg.test(id)) {
        stashDashboardIds.push(id);
      }
      if (formIdReg.test(id)) {
        stashFormIds.push(id);
      }
    }

    return {
      stashDatasheetIds,
      stashDashboardIds,
      stashFormIds
    };
  }

  private analyseActiveResource() {
    const state = this.store.getState();
    const stashResourceIds = this.stash.dump().map(item => item.k);

    const roomService = this.getRoomService();

    const {
      stashDatasheetIds,
      stashDashboardIds,
    } = ResourceStashManager.getIdsByResourceType(stashResourceIds);

    if (stashDatasheetIds.length) {
      const activeDstIds: string[] = [...stashResourceIds];

      if (Object.keys(state.widgetMap).length) {
        const widgetDependDstIds = Object.values(state.widgetMap).reduce<string[]>((ids, widget) => {
          const id = widget.widget.snapshot.datasheetId;
          if (id && !ids.includes(id)) {
            ids.push(id);
          }
          return ids;
        }, []);
        activeDstIds.push(...widgetDependDstIds);
      }

      this.calcRefMap(stashResourceIds, activeDstIds);

      const dstIdsInRedux = getDatasheetIds(state);
      const unActiveDstIds = _.difference(dstIdsInRedux, activeDstIds);

      const _batchActions: any[] = [];

      unActiveDstIds.map(id => {
        roomService.quit(id);
        _batchActions.push(resetDatasheet(id));
      });

      this.store.dispatch(batchActions(_batchActions));
    }

    if (stashDashboardIds.length) {
      const dashboardIdsInRedux = Object.keys(state.dashboardMap);
      const unActiveDashboardIds = _.difference(dashboardIdsInRedux, stashDashboardIds);

      const _batchActions: any[] = [];

      unActiveDashboardIds.map(id => {
        roomService.quit(id);
        _batchActions.push(resetDashboard(id));
      });

      this.store.dispatch(batchActions(_batchActions));
    }

  }

  setUndoManager(resourceId: string, undoManager: UndoManager) {
    const stashCount = this.stash.length;
    const allowClear = stashCount === this.maxSize;

    this.stash.set(resourceId, undoManager);

    if (!this.closeClear) {
      allowClear && this.analyseActiveResource();
    }
  }

  getUndoManager(resourceId: string): UndoManager {
    let undoManager = this.stash.get(resourceId);
    if (!undoManager) {
      undoManager = new UndoManager(resourceId);
      this.setUndoManager(resourceId, undoManager);
    }
    return undoManager;
  }

  destroy() {
    this.stash.reset();
  }
}
