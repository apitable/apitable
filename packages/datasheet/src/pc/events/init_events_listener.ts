import {
  ActionConstants, CacheManager, EventAtomTypeEnums, EventRealTypeEnums, EventSourceTypeEnums, ExpCache, Field, FieldType,
  JOTApply, OPEventNameEnums, ResourceType, Selectors,
  StoreActions, WhyRecordMoveType
} from '@apitable/core';
import { mainWidgetMessage, ResourceService } from '@vikadata/widget-sdk';
import produce, { current } from 'immer';
import { debounce, difference } from 'lodash';
import { expandRecordIdNavigate } from 'pc/components/expand_record';
import { store } from 'pc/store';
import { comlinkStore } from 'pc/worker';
import { dispatch } from 'pc/worker/store';
import { createRemindKey, remindAggregation } from './events';

const { DATASHEET_JOT_ACTION } = ActionConstants;

const makeVEvent = (datasheetId, fieldId, recordId) => {
  return {
    eventName: OPEventNameEnums.CellUpdated,
    scope: ResourceType.Datasheet,
    realType: EventRealTypeEnums.REAL, // 假装是真实的
    atomType: EventAtomTypeEnums.ATOM,
    sourceType: EventSourceTypeEnums.LOCAL,
    context: {
      datasheetId,
      recordId,
      fieldId,
    }
  };
};

const debounceRefreshSnapshot = debounce((datasheetId) => {
  dispatch(StoreActions.refreshSnapshot(datasheetId));
  mainWidgetMessage.refreshSnapshot(datasheetId);
}, 500);

const removeAndUpdateCacheIfNeed = (datasheetId: string, fieldId?: string, recordId?: string) => {
  if (!fieldId) {
    CacheManager.removeCellCacheByRecord(datasheetId, recordId!);
  } else {
    CacheManager.removeCellCache(datasheetId, fieldId, recordId);
  }
  // TODO: 应该不需要对表单单独处理，先迁移过来，后面删掉
  if (store) {
    const state = store.getState();
    let nextCache;
    const remotePayload = [datasheetId, fieldId, recordId];
    if (fieldId && recordId) {
      const snapshot = Selectors.getSnapshot(state, datasheetId);
      if (snapshot) {
        nextCache = Selectors.calcCellValueAndString(
          {
            state,
            snapshot,
            recordId,
            fieldId,
            withError: false,
            datasheetId,
            ignoreFieldPermission: true
          }
        );
      }
    }
    if (nextCache && !nextCache.ignoreCache) {
      CacheManager.setCellCache(datasheetId, fieldId!, recordId!, nextCache);
      // console.log('setCellCache', datasheetId, fieldId!, recordId!, nextCache);
      remotePayload.push(nextCache);
    }
    debounceRefreshSnapshot(datasheetId);
    comlinkStore?.proxy?.removeCache(remotePayload);
  }
};

/**
 * 初始化事件监听，只能监听一遍。将 op 转为事件流后，在这里统一管理业务回掉。这里的监听是不需要移除的
 */
export const initEventListen = (resourceService: ResourceService) => {
  console.log('resourceService', resourceService);
  const { opEventManager, computeRefManager } = resourceService;
  // -------- 字段单元格变化触发引用字段变化 --------
  // record 删除的事件不需要监听，当 record 删除时，link 字段的 cellValue 变化，触发 cellUpdate。
  opEventManager.addEventListener(OPEventNameEnums.CellUpdated, context => {
    const { datasheetId, recordId, fieldId } = context;
    removeAndUpdateCacheIfNeed(datasheetId, fieldId, recordId);
  }, {
    realType: EventRealTypeEnums.ALL,
    sourceType: EventSourceTypeEnums.ALL,
    // beforeApply: true,
  });

  // 字段删除和字段更新都会触发这个事件。二者的 op 特征相同
  opEventManager.addEventListener(OPEventNameEnums.FieldUpdated, context => {
    const { datasheetId, fieldId } = context;
    removeAndUpdateCacheIfNeed(datasheetId, fieldId);
    const state = store.getState();
    const currSnapshot = Selectors.getSnapshot(state, datasheetId);
    const fieldMap = currSnapshot?.meta.fieldMap || {};
    computeRefManager.computeRefMap(fieldMap, datasheetId, state);

    // 字段更新，影响范围比较大。现在机器人不太适合将字段更新，转化为单元格更新。目前只在前端的清引用链上的缓存。
    const refKey = `${datasheetId}-${fieldId}`;
    const { hasError, effectedKeys } = computeRefManager.getAllEffectKeysByKey(refKey);
    if (!hasError) {
      effectedKeys.forEach((key) => {
        const [dstId, fieldId] = key.split('-');
        const snapshot = Selectors.getSnapshot(state, dstId);
        if (fieldId && snapshot) {
          // 列更新
          const field = snapshot.meta.fieldMap[fieldId];
          // 可能存在残留的引用关系，没有及时清理
          if (!field) {
            computeRefManager.cleanFieldRef(fieldId, dstId);
          } else if (field.type === FieldType.LookUp) {
            // lookup 经过了公式计算。这个时候需要清理公式缓存。
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

  // 记录删除
  opEventManager.addEventListener(OPEventNameEnums.RecordDeleted, context => {
    const { datasheetId, recordId } = context;
    removeAndUpdateCacheIfNeed(datasheetId, undefined, recordId);
  });

  // --------------- 更新 record.recordMeta ---------------
  opEventManager.addEventListener(OPEventNameEnums.RecordMetaUpdated, ({ datasheetId, recordId, action }) => {
    if (!('oi' in action)) return;
    const state = store.getState();
    const fieldMap = Selectors.getFieldMap(state, datasheetId)!;
    const vEvents: any = [];
    // Created
    if (('oi' in action) && !('od' in action)) {
      // 一般情况是：创建 record；
      // 特殊情况是：删除 record => 撤销操作，这种情况需要更新 LastModifiedTime 和 LastModifiedBy；
      const actionFields = new Set(
        [FieldType.CreatedTime, FieldType.CreatedBy, FieldType.LastModifiedTime, FieldType.LastModifiedBy, FieldType.AutoNumber]
      );

      Object.values(fieldMap)
        .filter(field => {
          return actionFields.has(field.type);
        }).forEach(field => {
          removeAndUpdateCacheIfNeed(datasheetId, field.id, recordId);
          vEvents.push(makeVEvent(datasheetId, field.id, recordId));
        });
    }
    // Updated
    if (('oi' in action) && ('od' in action)) {
      const needUpdateField = [FieldType.LastModifiedTime, FieldType.LastModifiedBy, FieldType.AutoNumber];
      Object.values(fieldMap)
        .filter(field => needUpdateField.includes(field.type))
        .forEach(field => {
          removeAndUpdateCacheIfNeed(datasheetId, field.id, recordId);
          vEvents.push(makeVEvent(datasheetId, field.id, recordId));
        });
    }
    // 更新包含 CREATED_TIME/LAST_MODIFIED_TIME 的 Formula 字段类型单元格
    Object.values(fieldMap)
      .filter(field => field.type === FieldType.Formula)
      .forEach(field => {
        const expression = field.property.expression;
        const fExp = ExpCache.get(datasheetId, field.id, expression);
        const needUpdate = fExp && !('error' in fExp) && fExp.lexer.matches.some(token => {
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

  // -------- 成员单元格内容变更触发的事件 --------
  opEventManager.addEventListener(OPEventNameEnums.CellUpdated, ({ action, fieldId, recordId, datasheetId }) => {
    const state = store.getState();
    const fieldMap = Selectors.getFieldMap(state, datasheetId);
    if (!fieldMap) return;
    const field = fieldMap[fieldId];
    if (!field) return;
    const activeView = Selectors.getActiveViewId(state)!;
    // 只监听成员字段的变更。
    if (field.type !== FieldType.Member) return;
    if (!('oi' in action) || !recordId) return;
    const isNotify = field.property.shouldSendMsg;
    const diffMember = difference<string>(action.oi, ('od' in action) ? action.od : []);
    const newUnitIds: string[] = diffMember;
    newUnitIds.forEach(unitId => {
      const key = createRemindKey({
        isNotify, linkId: Selectors.getLinkId(state), datasheetId, viewId: activeView, unitId,
      });
      remindAggregation.addRemindUnit(key, {
        recordId,
        fieldId
      });
    });
  }, {
    sourceType: EventSourceTypeEnums.LOCAL,
    realType: EventRealTypeEnums.REAL,
  });

  interface ISendMessageType {
    id: string;
    name: string;
    unitIds: string[];
  }

  opEventManager.addEventListener(OPEventNameEnums.RecordCreated, ({ recordId, op, datasheetId }) => {
    if (!store) return;
    const state = store.getState();
    const isSideRecordOpen = state.space.isSideRecordOpen;
    const view = Selectors.getCurrentView(state);
    const activeCell = Selectors.getActiveCell(state);
    const client = Selectors.getDatasheetClient(state);
    if (!client || !view || !recordId) return;
    const { newRecordExpectIndex: expectIndex } = client;
    if (expectIndex == null) return;

    produce(state, draft => {
      const dstState = Selectors.getDatasheet(draft, datasheetId);
      if (dstState) {
        JOTApply(dstState, {
          datasheetId,
          type: DATASHEET_JOT_ACTION,
          payload: { operations: [op] }
        });
      }
      const _state = current(draft);
      const rowsMap = Selectors.getVisibleRowsIndexMap(_state);
      const newRecordId = recordId;
      const isRecordNotInView = !rowsMap.has(newRecordId);
      const newRecordIndex = rowsMap.get(newRecordId);
      const isRecordIndexMove = expectIndex !== newRecordIndex;
      const newRecordSnapshot = Selectors.getRecordSnapshot(_state, newRecordId);
      if (!newRecordSnapshot) {
        return;
      }

      if (isRecordNotInView || isRecordIndexMove) {
        // 新增行后激活新增行的单元格。这个时候会刷一遍 activeRowInfo 的信息。
        dispatch(
          StoreActions.setActiveCell(datasheetId, {
            recordId: newRecordId,
            fieldId: activeCell ? activeCell.fieldId : view.columns[0].fieldId,
          }),
        );
        if (isSideRecordOpen) {
          expandRecordIdNavigate(newRecordId);
        }
        dispatch(StoreActions.setActiveRowInfo(datasheetId, {
          type: WhyRecordMoveType.NewRecord,
          positionInfo: {
            recordId: newRecordId,
            visibleRowIndex: expectIndex,
            isInit: false,
          },
          recordSnapshot: newRecordSnapshot
        }));
      }
    });
  }, {
    sourceType: EventSourceTypeEnums.LOCAL, // 只监听本地的记录创建。
    realType: EventRealTypeEnums.REAL,
    beforeApply: true, // 在应用到 store 之前
  });

  opEventManager.addEventListener(OPEventNameEnums.RecordCreated, ({ recordId, op, datasheetId }) => {
    if (!store || !recordId || !datasheetId) return;
    const state = store.getState();
    const viewId = Selectors.getActiveViewId(state)!;
    const newRecordId = recordId;
    const newRecordSnapshot = Selectors.getRecordSnapshot(state, newRecordId);
    if (!newRecordSnapshot) {
      return;
    }
    // 如果新增有开启通知的成员列发送通知
    const memberCell: Array<ISendMessageType> = [];
    const newRecordData = newRecordSnapshot.recordMap[newRecordId].data;
    Object.keys(newRecordSnapshot.meta.fieldMap).forEach(field => {
      const fieldObj = newRecordSnapshot.meta.fieldMap[field];
      if (fieldObj.type === FieldType.Member && fieldObj.property?.shouldSendMsg && newRecordData[fieldObj.id]) {
        memberCell.push({ id: fieldObj.id, name: fieldObj.name, unitIds: newRecordData[fieldObj.id] as string[] });
      }
    });
    memberCell.forEach(member => {
      const isNotify = true;
      member.unitIds.forEach(unitId => {
        const key = createRemindKey({
          isNotify, linkId: Selectors.getLinkId(state), datasheetId, viewId, unitId,
        });
        remindAggregation.addRemindUnit(key, {
          recordId,
          fieldId: member.id
        });
      });
    });

  },
  {
    sourceType: EventSourceTypeEnums.LOCAL, // 只监听本地的记录创建。
    realType: EventRealTypeEnums.REAL,
  });
};

