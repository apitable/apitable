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

import { getComputeRefManager } from 'compute_manager';
import { testPath } from 'event_manager/helper';
import { Field } from 'model/field';
import { IReduxState } from '../../../exports/store/interfaces';
import {
  getSnapshot,
  getField,
} from 'modules/database/store/selectors/resource/datasheet/base';
import { getFieldMap } from 'modules/database/store/selectors/resource/datasheet/calc';
import { getCellValue } from 'modules/database/store/selectors/resource/datasheet/cell_calc';
import { FieldType, ILinkField } from 'types';
import { ResourceType } from 'types/resource_types';
import { IAtomEventType, ICellUpdatedContext } from '../interface';
import { EventAtomTypeEnums, EventRealTypeEnums, EventSourceTypeEnums, OPEventNameEnums } from './../../enum';
import { IEventInstance, IOPBaseContext, IOPEvent, IVirtualAtomEvent } from './../../interface/event.interface';
import { CacheManager } from 'cache_manager';

// @EventMeta(OPEventNameEnums.CellUpdated)
export class OPEventCellUpdated extends IAtomEventType<ICellUpdatedContext> {
  eventName = OPEventNameEnums.CellUpdated;
  realType = EventRealTypeEnums.REAL;
  scope = ResourceType.Datasheet;
  test(opContext: IOPBaseContext) {
    const { op, action, resourceId, resourceType } = opContext;
    if (resourceType !== ResourceType.Datasheet) {
      return {
        pass: false,
        context: null,
      };
    }
    const { pass, recordId, fieldId } = testPath(action.p, ['recordMap', ':recordId', 'data', ':fieldId']);
    return {
      pass,
      context: {
        recordId,
        fieldId,
        datasheetId: resourceId,
        action,
        linkDatasheetId: op.mainLinkDstId,
        change: {
          from: action['od'],
          to: action['oi'],
        }
      }
    };
  }

  /**
   * Entity events generate virtual events, deduplication.
   * This relies on meta and recordMap , so you need to pass in state.
   */
  computeEvent(eventBuffer: IEventInstance<IOPEvent>[], state: IReduxState): IEventInstance<IVirtualAtomEvent>[] {
    const computeRefManager = getComputeRefManager(state);
    const computeEventContextQueue: string[] = [];
    const finalComputeEventContextQueue: string[] = [];

    const enqueueChecker = (key: string) => {
      if (!computeEventContextQueue.includes(key)) {
        computeEventContextQueue.push(key);
        finalComputeEventContextQueue.push(key);
      }
    };

    const addComputeEventContext = (context: string, state: IReduxState) => {
      const [datasheetId, recordId, fieldId] = context.split('-') as [string, string, string];
      // 1. A cell is updated, this cell corresponds to the field
      const updateCellField = getField(state, fieldId, datasheetId);
      if (!updateCellField) {
        return;
      }
      // 2. All fields that depend on this field (these fields are all calculated fields)
      const fieldRefs = computeRefManager.refMap.get(`${datasheetId}-${fieldId}`);
      if (!fieldRefs?.size) {
        return;
      }
      fieldRefs.forEach(refId => {
        const [_datasheetId, _fieldId] = refId.split('-') as [string, string];
        const fieldMap = getFieldMap(state, _datasheetId)!;
        // 3. Depends on one of the fields of this field
        const field = fieldMap[_fieldId];
        // FIXME: There is a fieldId that does not exist in fieldMap,
        // the field has been deleted, and the reference relationship of refMap has not been updated in time.
        if (!field) return;
        const isEventInSameDatasheet = _datasheetId === datasheetId;
        const snapshot = getSnapshot(state, datasheetId)!;
        // 4. The table that triggers the event and the table that depends on this event are different tables,
        // which can generate cross-table dependencies, which must be the lookup or link fields.
        switch (field.type) {
          case FieldType.LookUp:
            // 1. The link field that the lookup field depends on
            const relatedLinkField = Field.bindContext(field, state).getRelatedLinkField();
            if (!relatedLinkField) {
              return;
            }
            // https://github.com/vikadata/vikadata/issues/9875
            // if relate field type is OneWayLink. clear old lookup field values
            if (relatedLinkField.type === FieldType.OneWayLink) {
              CacheManager.removeCellCache(_datasheetId, field.id);
            }
            let triggerRecIds: string[] = [];
            // 2. The same table triggers a lookup update, which must be associated with the table.
            // The sibling field of the associated link field is itself
            if (isEventInSameDatasheet) {
              // Cause the lookup field to change, either the link field or the entity field being looked.
              if (updateCellField.id === relatedLinkField.id) {
                enqueueChecker(`${_datasheetId}-${recordId}-${_fieldId}`);
              } else {
                // Since the entity field of the table association look changes.
                // The lookup fields of all records that reference this record are updated.
                triggerRecIds = Object.keys(snapshot.recordMap).reduce((prev, _recordId) => {
                  const linkCellValue = getCellValue(state, snapshot, _recordId, relatedLinkField.id);
                  if (linkCellValue && (linkCellValue as string[]).includes(recordId)) {
                    prev.push(_recordId);
                  }
                  return prev;
                }, [] as string[]);
              }
            } else {
              const brotherFieldId = (relatedLinkField as ILinkField).property?.brotherFieldId!;
              // 3. The recordIds affected by this cell update
              triggerRecIds = getCellValue(state, snapshot, recordId, brotherFieldId);
              if (relatedLinkField.type === FieldType.OneWayLink) {
                const _snapshot = getSnapshot(state, _datasheetId)!;
                const _records = Object.values(_snapshot.recordMap);
                const filterRecords = _records.filter(record => {
                  const recordData = record?.data[relatedLinkField.id] as string[] | undefined;
                  return recordData && recordData.includes(recordId);
                });
                triggerRecIds = filterRecords.map(record => record.id);
              }
            }
            // TODO: The value of the link field cell must be null or an array.
            // Due to the existence of dirty data, we first judge whether it is an array type before processing it. Delete data after cleaning?
            if (triggerRecIds && Array.isArray(triggerRecIds)) {
              (triggerRecIds as string[]).forEach(recId => {
                enqueueChecker(`${_datasheetId}-${recId}-${_fieldId}`);
              });
            }
            break;
          case FieldType.Formula:
            enqueueChecker(`${_datasheetId}-${recordId}-${_fieldId}`);
            break;
          case FieldType.Link:
            // The LINK field is not a strictly calculated field,
            // and the title of the link field needs to be updated here. Temporarily treated as a calculated field
            // The link field in the update table this time
            const thisLinkFieldId = field.property.brotherFieldId;
            if (!thisLinkFieldId) return;
            // Which records of the foreign key table depend on this record
            const linkRecIds = getCellValue(state, snapshot, recordId, thisLinkFieldId);
            // FIXME: There may be a non-empty cv that is not an array here. Causes the following code to have problems, first compatible.
            if (linkRecIds && Array.isArray(linkRecIds)) {
              linkRecIds.forEach(recId => {
                enqueueChecker(`${_datasheetId}-${recId}-${_fieldId}`);
              });
            }
            break;
          default:
            // TODO: Include creation time, creator, update time, update person,
            // and auto-increment numbers into event management. 10.13 Modifications after launch
            console.warn('! ' + `Unknown computed field type: ${field.type}`);
          // throw new Error(`unsupported field type: ${field.type}`);
        }
      });
    };
    // The context from which the entity event came
    eventBuffer.forEach(({ context }) => {
      const { datasheetId, recordId, fieldId } = context;
      const key = `${datasheetId}-${recordId}-${fieldId}`;
      addComputeEventContext(key, state);
    });

    // The context from which the virtual event came
    while (computeEventContextQueue.length) {
      const context = computeEventContextQueue[0]!;
      computeEventContextQueue.shift();
      addComputeEventContext(context, state);
    }

    // After set deduplication. Inside the computeRef is the update of the calculation cell that will be triggered by the update of the entity cell.
    /**
     * !!! The collection continues to push new elements into the collection during the loop. New elements also appear in this cycle.
     * const aset = new Set([1,2,3])
     * aset.forEach(i=> {
     *   console.log(i);
     *   if(i====3){
     *     aset.add(4)
     *   }
     * })
     * output: 1 2 3 4
     * Here, when the signal is calculated in a loop, the event will be triggered recursively,
     * and the event will push the signal into the collection. until the signal is empty.
     * In theory, in the absence of circular references, there will be no infinite loop.
     */
    const res: IEventInstance<IVirtualAtomEvent>[] = [];
    finalComputeEventContextQueue.forEach(context => {
      const [datasheetId, recordId, fieldId] = context.split('-');
      res.push({
        eventName: OPEventNameEnums.CellUpdated,
        context: {
          datasheetId, recordId, fieldId,
        },
        atomType: EventAtomTypeEnums.ATOM,
        realType: EventRealTypeEnums.VIRTUAL,
        sourceType: EventSourceTypeEnums.ALL,
        scope: this.scope,
      });
    });
    return res;
  }
}
