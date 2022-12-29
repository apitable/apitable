import { store } from 'pc/store';
import { IFieldMap, IViewColumn, Selectors, StoreActions } from '@apitable/core';
import { difference, isEqual } from 'lodash';

let mirrorId: string | undefined;
let fieldMap: IFieldMap | undefined;

store.subscribe(function TemplateChange() {
  const state = store.getState();
  const pageParams = state.pageParams;

  if (!pageParams.mirrorId) {
    // store The user does not have to care about changes to the cached data if they are not in the mirror
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
      // No mirror means it's the first time you've entered the mirror, so keep the mirror and the original view in sync.
      // The logic is the same without the temporaryView
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
    // Filtering deleted columns
    _columns = _columns.filter(column => {
      return !deleteIds.includes(column.fieldId);
    });
  }

  if (insertIds.length) {
    // New column
    insertIds.map(id => {
      _columns.push({
        fieldId: id
      });
    });
  }
  store.dispatch(StoreActions.cacheTemporaryView({ columns: _columns }, mirrorId));
}
