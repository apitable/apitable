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

import { DatasheetApi, StoreActions, Selectors, IJOTAction, OTActionName, ResourceType } from '@apitable/core';
import { remoteActions2Operation } from '@apitable/widget-sdk';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';

export async function loadRecords(datasheetId: string, recordIds: string[]) {
  const state = store.getState();
  const client = Selectors.getDatasheetClient(state, datasheetId)!;
  const snapshot = Selectors.getSnapshot(state, datasheetId);

  // Filter out those that are already loading
  // Loaded ones should also be filtered out
  recordIds = recordIds.filter((recordId) => {
    return !client?.loadingRecord?.[recordId] && !snapshot?.recordMap[recordId];
  });

  if (!recordIds.length) {
    return;
  }

  store.dispatch(StoreActions.setLoadingRecord({ recordIds, loading: true }, datasheetId));
  const res = await DatasheetApi.fetchRecords(datasheetId, recordIds);
  const revision = Selectors.getResourceRevision(store.getState(), datasheetId, ResourceType.Datasheet);
  if (res.data.success) {
    const recordRevision = res.data.data.revision;
    const recordMap = res.data.data.recordMap || {};

    // TODO: Handling version gaps
    if (recordRevision !== revision) {
      console.warn('! ' + `records version: ${recordRevision} don't match datasheet version: ${revision}`);
    }

    const loadedRecordIds = recordIds.filter((recordId) => {
      return recordMap[recordId];
    });
    const failRecordIds = recordIds.filter((recordId) => {
      return !recordMap[recordId];
    });

    const actions: IJOTAction[] = loadedRecordIds.map((recordId) => {
      const record = recordMap[recordId];
      return {
        n: OTActionName.ObjectInsert,
        p: ['recordMap', record.id],
        oi: record,
      };
    });
    store.dispatch(StoreActions.setLoadingRecord({ recordIds: loadedRecordIds, loading: false }, datasheetId));
    store.dispatch(StoreActions.setLoadingRecord({ recordIds: failRecordIds, loading: 'error' }, datasheetId));

    resourceService.instance?.applyOperations(store, [
      {
        resourceType: ResourceType.Datasheet,
        resourceId: datasheetId,
        operations: [remoteActions2Operation(actions)],
      },
    ]);
    return;
  }

  throw new Error('getRecords fail');
}
