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
import without from 'lodash/without';
import {
  ExpCache, Field, FieldType, LookUpField, ResourceType, Selectors, StoreActions,
  IDatasheetMap, IFieldMap, ILinkField, ILookUpField, IReduxState,
} from 'core';
import { IResourceService } from '../resource/interface';

export function eqSet<T>(as: Set<T>, bs: Set<T>): boolean {
  if (as.size !== bs.size) {
    return false;
  }
  for (const a of as) if (!bs.has(a)) {
    return false;
  }
  return true;
}

export const subscribeDatasheetMap = (store: Store<IReduxState>, datasheetService: { instance: IResourceService | null }) => {
  let datasheetIdSet: Set<string> = new Set();
  let datasheetMap: IDatasheetMap = {};

  function linkLookUpField(datasheetId: string, visitedDst?: Set<string>) {
    const _visitedDst = visitedDst || new Set();
    if (_visitedDst.has(datasheetId)) {
      return;
    }
    const state = store.getState();
    const datasheet = Selectors.getDatasheet(state, datasheetId);
    const shareId = state.pageParams.shareId;
    const formId = state.pageParams.formId;
    if (shareId && formId) {
      return;
    }
    _visitedDst.add(datasheetId);
    if (!datasheet) {
      console.log(`go go go load the data of (${datasheetId})`);
      return store.dispatch(StoreActions.fetchDatasheet(datasheetId) as any);
    }
    const fieldMap = Selectors.getFieldMap(state, datasheetId)!;
    const lookUpFields = Object.values(fieldMap).filter(field => field.type === FieldType.LookUp) as ILookUpField[];
    let index = 1;

    const findNextLookUpField = (field: ILookUpField, fieldMap: IFieldMap, visitedField?: Set<string>) => {
      const _visitedField = visitedField || new Set();
      if (_visitedField.has(field.id)) {
        return;
      }
      _visitedField.add(field.id);
      // The actual fields of this table lookup query.
      const lookUpTargetField = (Field.bindModel(field) as LookUpField).getLookUpTargetField();
      if (!lookUpTargetField) {
        // The foreign key data for this table is not loaded.
        const foreignField = fieldMap[field.property.relatedLinkFieldId] as ILinkField;
        if (foreignField && (foreignField.type === FieldType.Link || foreignField.type === FieldType.OneWayLink)) {
          console.log(`2.${index}.1 "${field.name}" the data of the queried table (${foreignField.property.foreignDatasheetId}) is not loaded`);
          linkLookUpField(foreignField.property.foreignDatasheetId, _visitedDst);
        }
      } else {
        console.log(`2.${index}.1 "${field.name}" the actual field of the query is: 「${lookUpTargetField.name}」`, { lookUpTargetField });
      }
      // lookup lookup le lookup
      // The lookup of this table looks up another lookup field of the foreign key table.
      if (lookUpTargetField && lookUpTargetField.type === FieldType.LookUp) {
        console.log(`2.${index}.2 "${lookUpTargetField.name}" is also a lookup field`);
        findNextLookUpField(lookUpTargetField, fieldMap, _visitedField);
      }
    };

    for (const field of lookUpFields) {
      findNextLookUpField(field, fieldMap);
      index++;
    }
  }

  return store.subscribe(function datasheetMapChange() {
    const state = store.getState();
    if (!datasheetService.instance?.checkRoomExist()) {
      return;
    }
    const previousDatasheetMap = datasheetMap;
    datasheetMap = state.datasheetMap;
    const previousDatasheetIdSet = datasheetIdSet;

    if (previousDatasheetMap === datasheetMap) {
      return;
    }

    datasheetIdSet = new Set(Object.keys(datasheetMap).filter(id => {
      return Boolean(datasheetMap![id]!.datasheet) && !datasheetMap![id]!.datasheet?.preview;
    }));
    if (eqSet(previousDatasheetIdSet, datasheetIdSet)) {
      return;
    }

    // Check if new datasheet data is loaded, and if so, establish a socket via resourceService.
    const currentDatasheetIds = Array.from(datasheetIdSet);
    const collaEngineKeys = datasheetService.instance.getCollaEngineKeys();
    const entityDatasheetIds = [...collaEngineKeys];
    const diff = without(currentDatasheetIds, ...entityDatasheetIds);
    // console.log('create datasheetService', diff);
    diff.forEach(id => {
      datasheetService.instance!.createCollaEngine(id, ResourceType.Datasheet);
    });
    const computeRefManager = datasheetService.instance!.computeRefManager;
    const newList = diff.reduce((p: string[], c) => {
      return p.concat(
        c,
        ...computeRefManager.getToComputeDsts(c)
      );
    }, []);
    const uniqueList = Array.from(new Set(newList).values());
    // Why should I clear the cache of formula parsing? See also:
    // https://www.notion.so/Debug-2021-03-29-a5a756dc2c9640e2957103c9bb5eeebd#bd1ef9866f504b8c85be4c27088f9ada.
    ExpCache.clearAll();
    uniqueList.forEach(id => {
      linkLookUpField(id);
      const fieldMap = datasheetMap[id]!.datasheet!.snapshot.meta.fieldMap;
      datasheetService.instance!.computeRefManager.computeRefMap(fieldMap, id, state);
    });

    diff.forEach(item =>
      computeRefManager.setDstComputed(item)
    );
  });
};
