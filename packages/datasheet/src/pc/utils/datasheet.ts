import { DropDirectionType, IJOTAction, IListMoveAction, IMoveColumn, jot, OTActionName, Selectors } from '@vikadata/core';
import produce from 'immer';
import { store } from 'pc/store';

/** 获取isColNameVisible值，兼容之前已创建的视图isColNameVisible为undefined
 *  默认为ture
 */
export const getIsColNameVisible = (value) => {
  return typeof value === 'boolean' ? value : true;
};

interface IMoveColumnsProps {
  datasheetId: string;
  viewId: string;
  data: IMoveColumn[];
}

export const getMoveColumnsResult = (props: IMoveColumnsProps) => {
  const { datasheetId, viewId, data } = props;
  const state = store.getState();
  const snapshot = Selectors.getSnapshot(state, datasheetId)!;
  const mirror = Selectors.getMirror(state, datasheetId);
  const view = Selectors.getCurrentViewBase(snapshot, viewId, datasheetId, undefined, mirror);
  const temporaryView = Selectors.getTemporaryView(snapshot, viewId, datasheetId);

  if (!view) {
    return;
  }

  const getColumnIndexMap = () => {
    const columnsMap: { [id: string]: number } = {};
    if (!view) {
      return columnsMap;
    }
    for (const [index, column] of view.columns.entries()) {
      columnsMap[column.fieldId] = index;
    }
    return columnsMap;
  };

  const columnIndexMapById = getColumnIndexMap();

  const actions = data.reduce<IJOTAction[]>((collected, recordOption) => {
    const { fieldId, overTargetId, direction } = recordOption;
    const originColumnIndex = columnIndexMapById[fieldId];
    const targetColumnIndex = columnIndexMapById[overTargetId!];
    let targetIndex = originColumnIndex > targetColumnIndex ? targetColumnIndex + 1 : targetColumnIndex;
    if (direction === DropDirectionType.BEFORE) {
      targetIndex--;
    }
    if (targetIndex === 0) {
      // 不允许将其他列拖动到第一列
      return collected;
    }
    if (originColumnIndex === 0) {
      // 第一列不允许拖动
      return collected;
    }

    const buildAction = (fieldId: string, target: number) => {
      if (temporaryView) {
        const columnIndex = view.columns.findIndex(column => column.fieldId === fieldId);
        return {
          n: OTActionName.ListMove,
          p: ['columns', columnIndex],
          lm: target,
        };
      }
      const viewIndex = Selectors.getViewIndex(snapshot, viewId);
      if (viewIndex < 0) {
        return null;
      }

      const columnIndex = view.columns.findIndex(column => column.fieldId === fieldId);
      if (columnIndex < 0 || columnIndex === target) {
        return null;
      }

      return {
        n: OTActionName.ListMove,
        p: ['meta', 'views', viewIndex, 'columns', columnIndex],
        lm: target,
      };
    };

    const action = buildAction(fieldId, targetIndex);

    if (!action) {
      return collected;
    }

    if (collected.length) {
      const transformedAction = jot.transform([action as IListMoveAction], collected, 'right');
      collected.push(...transformedAction);
    } else {
      collected.push(action as IListMoveAction);
    }

    return collected;
  }, []);

  if (!actions) {
    return;
  }

  const getColumns = () => {
    if (temporaryView) {
      const _temporaryView = produce(temporaryView, draft => {
        jot.apply(draft, actions);
        return draft;
      });
      return _temporaryView.columns;
    }
    const _snapshot = produce(snapshot, draft => {
      jot.apply(draft, actions);
      return draft;
    });
    return _snapshot.meta.views.find(view => view.id === viewId)!.columns;
  };

  return getColumns();

};
