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

import { IResourceOpsCollect, resourceOpsToChangesets } from 'command_manager';
import { IDataStorageProvider, ILoadDatasheetPackResult, ISaveOpsOptions } from '../providers';
import { IBaseDatasheetPack, Selectors, StoreActions } from 'exports/store';
import { mockDatasheetMap } from './mock.datasheets';
import { ResourceType } from '../../types';

export class MockDataStorageProvider implements IDataStorageProvider {
  datasheets!: Record<string, IBaseDatasheetPack>;

  constructor() {
    this.reset();
  }

  reset() {
    this.datasheets = JSON.parse(JSON.stringify(mockDatasheetMap));
  }

  loadDatasheetPack(dstId: string): Promise<ILoadDatasheetPackResult> {
    if (this.datasheets.hasOwnProperty(dstId)) {
      return Promise.resolve({ datasheetPack: this.datasheets[dstId]! });
    }
    return Promise.resolve({ datasheetPack: null });
  }

  saveOps(ops: IResourceOpsCollect[], options: ISaveOpsOptions): Promise<any> {
    const { store } = options;
    const changesets = resourceOpsToChangesets(ops, store.getState());
    changesets.forEach(cs => {
      store.dispatch(StoreActions.applyJOTOperations(cs.operations, cs.resourceType, cs.resourceId));
      if (cs.baseRevision !== undefined) {
        store.dispatch(StoreActions.updateRevision(cs.baseRevision + 1, cs.resourceId, ResourceType.Datasheet));
      }
      this.datasheets[cs.resourceId] = {
        datasheet: Selectors.getDatasheet(store.getState())!,
        snapshot: Selectors.getSnapshot(store.getState())!,
      };
    });

    return Promise.resolve(changesets);
  }
}
