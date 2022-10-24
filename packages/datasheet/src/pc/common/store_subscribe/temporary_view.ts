import { store } from 'pc/store';
import { IFieldMap, IViewColumn, Selectors, StoreActions } from '@apitable/core';
import { difference, isEqual } from 'lodash';

let mirrorId: string | undefined;
let fieldMap: IFieldMap | undefined;

store.subscribe(function TemplateChange() {
  const state = store.getState();
  const pageParams = state.pageParams;

  if (!pageParams.mirrorId) {
    // store 发生变化，用户不在镜像中就不用关心缓存数据的变化
    return;
  }

  const previousMirrorId = mirrorId;
  mirrorId = pageParams.mirrorId;
  const mirror = Selectors.getMirror(state, mirrorId!)!;

  if ((!previousMirrorId && mirrorId) || (previousMirrorId && mirrorId && previousMirrorId !== mirrorId)) {
    return;
  }

  if (previousMirrorId && mirrorId && previousMirrorId === mirrorId) {
    if (!mirror || !mirror.temporaryView) {
      // 没有 mirror 说明是第一次进入 mirror，此时保持 mirror 和原视图的数据同步
      // 没有 temporaryView 也是一样的逻辑
      return;
    }
    const previousFieldMap = fieldMap;
    fieldMap = Selectors.getFieldMap(state, mirror.sourceInfo.datasheetId)!;
    if (!previousFieldMap) {
      return;
    }

    if (isEqual(Object.keys(previousFieldMap), Object.keys(fieldMap))) {
      return;
    }

    fillColumns(fieldMap, mirror.temporaryView.columns, mirrorId);
  }
});

function fillColumns(fieldMap, columns, mirrorId) {
  const fieldMapKeys = Object.keys(fieldMap);
  const columnsIds = (columns as IViewColumn[]).map(column => {return column.fieldId;});
  const deleteIds = difference(columnsIds, fieldMapKeys);
  const insertIds = difference(fieldMapKeys, columnsIds);
  let _columns = [...columns];

  if (deleteIds.length) {
    // 过滤被删除的列
    _columns = _columns.filter(column => {
      return !deleteIds.includes(column.fieldId);
    });
  }

  if (insertIds.length) {
    // 新增列
    insertIds.map(id => {
      _columns.push({
        fieldId: id
      });
    });
  }
  store.dispatch(StoreActions.cacheTemporaryView({ columns: _columns }, mirrorId));
}
