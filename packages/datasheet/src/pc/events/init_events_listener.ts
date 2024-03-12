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

import produce, { current } from 'immer';
import { debounce, difference } from 'lodash';
import {
  ActionConstants,
  CacheManager,
  EventAtomTypeEnums,
  EventRealTypeEnums,
  EventSourceTypeEnums,
  ExpCache,
  Field,
  FieldType,
  JOTApply,
  NO_CACHE,
  OPEventNameEnums,
  ResourceType,
  Selectors,
  StoreActions,
  WhyRecordMoveType,
} from '@apitable/core';
import { ResourceService } from '@apitable/widget-sdk';
import { expandRecordIdNavigate } from 'pc/components/expand_record/utils';
import { store } from 'pc/store';
import { comlinkStore } from 'pc/worker';
import { dispatch } from 'pc/worker/store';
import { createRemindKey, remindAggregation } from './events';

const { DATASHEET_JOT_ACTION } = ActionConstants;

const makeVEvent = (datasheetId: string, fieldId: string, recordId: string) => {
  return {
    eventName: OPEventNameEnums.CellUpdated,
    scope: ResourceType.Datasheet,
    realType: EventRealTypeEnums.REAL,
    atomType: EventAtomTypeEnums.ATOM,
    sourceType: EventSourceTypeEnums.LOCAL,
    context: {
      datasheetId,
      recordId,
      fieldId,
    },
  };
};

const debounceRefreshSnapshot = debounce((datasheetId) => {
  dispatch(StoreActions.refreshSnapshot(datasheetId));
}, 500);

const removeAndUpdateCacheIfNeed = (datasheetId: string, fieldId?: string, recordId?: string) => {
  const cellValue = CacheManager.getCellCache(datasheetId, fieldId!, recordId!);
  const isNoCache = cellValue === NO_CACHE;

  if (!fieldId) {
    CacheManager.removeCellCacheByRecord(datasheetId, recordId!);
  } else {
    CacheManager.removeCellCache(datasheetId, fieldId, recordId);
  }
  // TODO: No need to process the form separately, migrate it over first and delete it later
  if (store) {
    const state = store.getState();
    let nextCache;
    const remotePayload = [datasheetId, fieldId, recordId];
    if (fieldId && recordId) {
      const snapshot = Selectors.getSnapshot(state, datasheetId);

      if (snapshot && !isNoCache) {
        nextCache = Selectors.calcCellValueAndString({
          state,
          snapshot,
          recordId,
          fieldId,
          withError: false,
          datasheetId,
          ignoreFieldPermission: true,
        });
      }
    }
    if (nextCache && !nextCache.ignoreCache) {
      CacheManager.setCellCache(datasheetId, fieldId!, recordId!, nextCache);
      // console.log('setCellCache', datasheetId, fieldId!, recordId!, nextCache);
      remotePayload.push(nextCache!);
    }
    debounceRefreshSnapshot(datasheetId);
    comlinkStore?.proxy?.removeCache(remotePayload);
  }
};

/**
 * Initialize the event listener and listen to it only once. After converting the op to an event stream,
 * the business is managed here uniformly back off. The listeners here are not to be removed
 */
export const initEventListen = (resourceService: ResourceService) => {
  // console.log('resourceService', resourceService);
  const { opEventManager, computeRefManager } = resourceService;
  // -------- Field cell changes trigger changes in the referenced field --------
  // The record deletion event does not need to be listened to.
  // When the record is deleted, the cellValue of the link field changes and triggers cellUpdate.
  opEventManager.addEventListener(
    OPEventNameEnums.CellUpdated,
    (context) => {
      const { datasheetId, recordId, fieldId } = context;
      removeAndUpdateCacheIfNeed(datasheetId, fieldId, recordId);
    },
    {
      realType: EventRealTypeEnums.ALL,
      sourceType: EventSourceTypeEnums.ALL,
      // beforeApply: true,
    },
  );

  // Both field deletion and field update will trigger this event.
  // Both have the same op characteristics.
  opEventManager.addEventListener(OPEventNameEnums.FieldUpdated, (context) => {
    const { datasheetId, fieldId } = context;
    removeAndUpdateCacheIfNeed(datasheetId, fieldId);
    const state = store.getState();
    const currSnapshot = Selectors.getSnapshot(state, datasheetId);
    const fieldMap = currSnapshot?.meta.fieldMap || {};
    computeRefManager.computeRefMap(fieldMap, datasheetId, state);

    // field updates, the impact is relatively large.
    // Now the robot is not very suitable for updating fields and converting them into cell updates.
    // Currently only the cache on the front end of the clear reference chain.
    const refKey = `${datasheetId}-${fieldId}`;
    const { hasError, effectedKeys } = computeRefManager.getAllEffectKeysByKey(refKey);
    if (!hasError) {
      effectedKeys.forEach((key) => {
        const [dstId, fieldId] = key.split('-');
        const snapshot = Selectors.getSnapshot(state, dstId);
        if (fieldId && snapshot) {
          const field = snapshot.meta.fieldMap[fieldId];
          // There may be residual reference relationships that are not cleaned up in a timely manner
          if (!field) {
            computeRefManager.cleanFieldRef(fieldId, dstId);
          } else if (field.type === FieldType.LookUp) {
            // lookup after the formula calculation.
            // This time you need to clear the formula cache.
            const expr = Field.bindModel(field, state).getExpression();
            if (expr) {
              ExpCache.del(datasheetId, fieldId, expr);
            }
          }
        }
        removeAndUpdateCacheIfNeed(dstId, fieldId);
      });
    }
  });

  opEventManager.addEventListener(OPEventNameEnums.RecordDeleted, (context) => {
    const { datasheetId, recordId } = context;
    removeAndUpdateCacheIfNeed(datasheetId, undefined, recordId);
  });

  opEventManager.addEventListener(OPEventNameEnums.RecordMetaUpdated, ({ datasheetId, recordId, action }) => {
    if (!('oi' in action)) return;
    const state = store.getState();
    const fieldMap = Selectors.getFieldMap(state, datasheetId)!;
    const vEvents: any = [];
    // Created
    if ('oi' in action && !('od' in action)) {
      // The general case is: create record.
      // Special case: delete record => undo operation, in which case LastModifiedTime and LastModifiedBy need to be updated.
      const actionFields = new Set([
        FieldType.CreatedTime,
        FieldType.CreatedBy,
        FieldType.LastModifiedTime,
        FieldType.LastModifiedBy,
        FieldType.AutoNumber,
      ]);

      Object.values(fieldMap)
        .filter((field) => {
          return actionFields.has(field.type);
        })
        .forEach((field) => {
          removeAndUpdateCacheIfNeed(datasheetId, field.id, recordId);
          vEvents.push(makeVEvent(datasheetId, field.id, recordId));
        });
    }
    // Updated
    if ('oi' in action && 'od' in action) {
      const needUpdateField = [FieldType.LastModifiedTime, FieldType.LastModifiedBy, FieldType.AutoNumber];
      Object.values(fieldMap)
        .filter((field) => needUpdateField.includes(field.type))
        .forEach((field) => {
          removeAndUpdateCacheIfNeed(datasheetId, field.id, recordId);
          vEvents.push(makeVEvent(datasheetId, field.id, recordId));
        });
    }
    // Update cells containing CREATED_TIME/LAST_MODIFIED_TIME for the Formula field type
    Object.values(fieldMap)
      .filter((field) => field.type === FieldType.Formula)
      .forEach((field) => {
        const expression = field.property.expression;
        const fExp = ExpCache.get(datasheetId, field.id, expression);
        const needUpdate =
          fExp &&
          !('error' in fExp) &&
          fExp.lexer.matches.some((token) => {
            const fnName = token.value.toLowerCase();
            return token.type === 'Call' && (fnName === 'created_time' || fnName === 'last_modified_time');
          });
        if (needUpdate) {
          removeAndUpdateCacheIfNeed(datasheetId, field.id, recordId);
          vEvents.push(makeVEvent(datasheetId, field.id, recordId));
        }
      });
    const virtualAtomEvents = opEventManager.options.op2Event.makeVirtualEvents(vEvents, state);
    opEventManager.handleEvents(virtualAtomEvents, false);
  });

  // -------- Events triggered by changes in the content of member cells --------
  opEventManager.addEventListener(
    OPEventNameEnums.CellUpdated,
    ({ action, fieldId, recordId, datasheetId }) => {
      const state = store.getState();
      const fieldMap = Selectors.getFieldMap(state, datasheetId);
      if (!fieldMap) return;
      const field = fieldMap[fieldId];
      if (!field) return;
      const activeView = Selectors.getActiveViewId(state)!;
      // Listen only for changes to member fields
      if (field.type !== FieldType.Member) return;
      if (!('oi' in action) || !recordId) return;
      const isNotify = field.property.shouldSendMsg;
      const diffMember = difference<string>(action.oi, 'od' in action ? action.od : []);
      const newUnitIds: string[] = diffMember;
      newUnitIds.forEach((unitId) => {
        const key = createRemindKey({
          isNotify,
          linkId: Selectors.getLinkId(state),
          datasheetId,
          viewId: activeView,
          unitId,
        });
        remindAggregation.addRemindUnit(key, {
          recordId,
          fieldId,
        });
      });
    },
    {
      sourceType: EventSourceTypeEnums.LOCAL,
      realType: EventRealTypeEnums.REAL,
    },
  );

  interface ISendMessageType {
    id: string;
    name: string;
    unitIds: string[];
  }

  opEventManager.addEventListener(
    OPEventNameEnums.RecordCreated,
    ({ recordId, op, datasheetId }) => {
      if (!store) return;
      const state = store.getState();
      const isSideRecordOpen = state.space.isSideRecordOpen;
      const view = Selectors.getCurrentView(state);
      const activeCell = Selectors.getActiveCell(state);
      const client = Selectors.getDatasheetClient(state);
      if (!client || !view || !recordId) return;
      const { newRecordExpectIndex: expectIndex } = client;
      if (expectIndex == null) return;

      produce(state, (draft) => {
        const dstState = Selectors.getDatasheet(draft, datasheetId);
        if (dstState) {
          JOTApply(dstState, {
            datasheetId,
            type: DATASHEET_JOT_ACTION,
            payload: { operations: [op] },
          });
        }
        const _state = current(draft);
        const rowsMap = Selectors.getVisibleRowsIndexMap(_state);
        const newRecordId = recordId;
        const isRecordNotInView = !rowsMap.has(newRecordId);
        const newRecordIndex = rowsMap.get(newRecordId);
        const isRecordIndexMove = expectIndex !== newRecordIndex;
        const newRecordSnapshot = Selectors.getRecordSnapshot(_state, datasheetId, newRecordId);
        if (!newRecordSnapshot) {
          return;
        }

        if (isRecordNotInView || isRecordIndexMove) {
          // After adding a new row activates the cell of the new row.
          // This time the information of activeRowInfo will be refreshed.
          dispatch(
            StoreActions.setActiveCell(datasheetId, {
              recordId: newRecordId,
              fieldId: activeCell ? activeCell.fieldId : view.columns[0].fieldId,
            }),
          );
          if (isSideRecordOpen) {
            expandRecordIdNavigate(newRecordId);
          }
          dispatch(
            StoreActions.setActiveRowInfo(datasheetId, {
              type: WhyRecordMoveType.NewRecord,
              positionInfo: {
                recordId: newRecordId,
                visibleRowIndex: expectIndex,
                isInit: false,
              },
              recordSnapshot: newRecordSnapshot,
            }),
          );
        }
      });
    },
    {
      sourceType: EventSourceTypeEnums.LOCAL, // Listen only to local record creation
      realType: EventRealTypeEnums.REAL,
      beforeApply: true, // Before applying to store
    },
  );

  opEventManager.addEventListener(
    OPEventNameEnums.RecordCreated,
    ({ recordId, datasheetId }) => {
      if (!store || !recordId || !datasheetId) return;
      const state = store.getState();
      const viewId = Selectors.getActiveViewId(state)!;
      const newRecordId = recordId;
      const newRecordSnapshot = Selectors.getRecordSnapshot(state, datasheetId, newRecordId);
      if (!newRecordSnapshot) {
        return;
      }
      // Send notifications for member columns that have notifications turned on
      const memberCell: Array<ISendMessageType> = [];
      const newRecordData = newRecordSnapshot.recordMap[newRecordId].data;
      Object.keys(newRecordSnapshot.meta.fieldMap).forEach((field) => {
        const fieldObj = newRecordSnapshot.meta.fieldMap[field];
        if (fieldObj.type === FieldType.Member && fieldObj.property?.shouldSendMsg && newRecordData[fieldObj.id]) {
          memberCell.push({ id: fieldObj.id, name: fieldObj.name, unitIds: newRecordData[fieldObj.id] as string[] });
        }
      });
      memberCell.forEach((member) => {
        const isNotify = true;
        member.unitIds.forEach((unitId) => {
          const key = createRemindKey({
            isNotify,
            linkId: Selectors.getLinkId(state),
            datasheetId,
            viewId,
            unitId,
          });
          remindAggregation.addRemindUnit(key, {
            recordId,
            fieldId: member.id,
          });
        });
      });
    },
    {
      sourceType: EventSourceTypeEnums.LOCAL, // Listens only for local record creation
      realType: EventRealTypeEnums.REAL,
    },
  );
};
