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

import { compensator } from '../compensator';
import { IJOTAction, IObjectInsertAction, IObjectReplaceAction, OTActionName } from 'engine/ot/interface';
import { ViewPropertyFilter } from 'engine/view_property_filter';
import { findIndex, isEqual, omit, unionWith } from 'lodash';
import { getMaxViewCountPerSheet } from 'model/utils';
import { IComments, IMirrorSnapshot, IRecordAlarm, IReduxState, ITemporaryView, IUserInfo, IViewLockInfo } from '../exports/store/interfaces';
import { RowHeightLevel } from 'modules/shared/store/constants';
import { ViewType } from 'modules/shared/store/constants';
import { getDateTimeCellAlarm } from 'modules/database/store/selectors/resource/datasheet/calc';
import { getSnapshot } from 'modules/database/store/selectors/resource/datasheet/base';
import {
  IGridViewColumn,
  IGridViewProperty,
  IRecord,
  ISnapshot,
  IViewColumn,
  IViewProperty,
  IWidgetInPanel,
  IWidgetPanel,
} from '../exports/store/interfaces';

import { getCellValue } from 'modules/database/store/selectors/resource/datasheet/cell_calc';

import { getViewById } from 'modules/database/store/selectors/resource/datasheet/base';
import { getFilterInfo, sortRowsBySortInfo } from 'modules/database/store/selectors/resource/datasheet/rows_calc';
import { getResourceActiveWidgetPanel, getResourceWidgetPanels } from 'modules/database/store/selectors/resource';
import {
  getActiveViewGroupInfo,
  getFieldMap,
  getFilterInfoExceptInvalid,
  getGroupInfoWithPermission,
  getViewIndex,
} from 'modules/database/store/selectors/resource/datasheet/calc';
import { FilterConjunction, IFilterCondition, IFilterInfo, IGroupInfo, ISortInfo, ResourceType } from 'types';
import { FieldType, IField } from 'types/field_types';
import { assertNever, getNewId, getUniqName, IDPrefix, NamePrefix } from 'utils';
import { Field } from '../model/field/field';
import { StatType } from 'model/field/stat';
import { OtherTypeUnitId } from '../model/field/const';
import { ICellValue } from '../model/record';
import { getViewClass } from '../model/views';
import { ViewFilterDerivate } from 'compute_manager/view_derivate';
import { produce } from 'immer';

// TODO: all fields should be checked, not only the first one
function validateFilterInfo(filterInfo?: IFilterInfo) {
  if (filterInfo == null) {
    return true;
  }

  if (!Array.isArray(filterInfo.conditions)) {
    return false;
  }

  if (filterInfo.conjunction == null) {
    return false;
  }

  return true;
}

function getDefaultNewRecordDataByGroup(groupInfos: IGroupInfo, groupCellValues?: ICellValue[]): { [fieldId: string]: ICellValue } {
  const recordData: { [fieldId: string]: ICellValue } = {};
  if (groupInfos.length === 0 || !groupCellValues) {
    return recordData;
  }

  groupInfos.forEach((group, i) => {
    recordData[group.fieldId] = groupCellValues[i]!;
  });
  return recordData;
}

function getDefaultNewRecordDataByFilter(
  state: IReduxState,
  datasheetId: string,
  filterInfo: IFilterInfo,
  fieldMap: { [id: string]: IField },
  userInfo?: IUserInfo
): { [fieldId: string]: ICellValue } {
  const { conditions } = filterInfo;
  const recordData: { [fieldId: string]: ICellValue } = {};

  // Or combination, there are multiple filter conditions, no default data fill in,
  // and there is only one filter condition, then it is processed according to the `and` logic
  if (filterInfo.conjunction === FilterConjunction.Or && filterInfo.conditions.length !== 1) {
    return recordData;
  }

  // And combination

  // 1. Group filter conditions by fieldId
  const conditionGroups = conditions.reduce(
    (prev, condition) => {
      const { fieldId } = condition;
      let group = prev[fieldId];
      if (!group) {
        group = prev[fieldId] = [];
      }
      group.push(condition);
      return prev;
    },
    {} as { [fieldId: string]: IFilterCondition[] }
  );

  // 2. Determine the final `And` fill value, for each field corresponding to the filter condition
  for (const fieldId in conditionGroups) {
    const field = fieldMap[fieldId];
    if (!field) {
      continue;
    }

    const isComputedField = Field.bindContext(field, state).isComputed;
    if (isComputedField) {
      // the cell of calc field, no need to fill in default value
      continue;
    }

    const conditionGroup = conditionGroups[fieldId]!;
    const isMultiValueField = Field.bindContext(field, state).isMultiValueField();
    const candidate = new Set<any>();

    // 2.1. Collect all candidate values of all conditions
    for (let i = 0, ii = conditionGroup.length; i < ii; i++) {
      const condition = conditionGroup[i]!;
      const currentValue = Field.bindContext(field, state).defaultValueForCondition(condition);
      if (currentValue == null) {
        continue;
      }

      // multi-value type field, need to split the value "unique"
      // TODO: currently multi-value type field is basic type, so use "Set".
      // In the future, if reference type, optimize this
      if (isMultiValueField && Array.isArray(currentValue)) {
        currentValue.forEach((v) => {
          if (field.type === FieldType.Member && v === OtherTypeUnitId.Self) {
            userInfo && candidate.add(userInfo!.unitId);
            return;
          }
          candidate.add(v);
        });
      } else {
        candidate.add(currentValue);
      }
    }

    // no candidate values
    if (candidate.size === 0) {
      continue;
    }

    let result: ICellValue;
    if (isMultiValueField) {
      // multi value field, can put all candidate values together
      result = [...candidate];
    } else if (candidate.size === 1) {
      // single value field, only one value can meet the `And` condition
      result = candidate.values().next().value;
    } else {
      // single value field, more than one value can meet the `And` condition, which is not allowed
      continue;
    }

    /**
     * candidate default value must be able to pass all filter conditions.
     * assume that there are two filter conditions for the numeric field, =1 And < 0.
     * candidate value logic is 1, calc by the above.
     * and 1 cannot pass =1 and <0, default fill in this value does not meet user expectations.
     */
    const viewFilterDerivate = new ViewFilterDerivate(state, datasheetId);
    const pass = conditionGroup.every((condition) => viewFilterDerivate.doFilter(condition, field, result));
    if (pass) {
      // different fields of `And`, only need to assign the values that have values to them.
      recordData[fieldId] = result;
    }
  }
  return recordData;
}

export class DatasheetActions {
  /**
   * add `view` to table
   */
  static addView2Action(snapshot: ISnapshot, payload: { view: IViewProperty; startIndex?: number }): IJOTAction | null {
    const { view } = payload;
    let { startIndex } = payload;
    const views = snapshot.meta.views;
    if (views.length >= getMaxViewCountPerSheet()) {
      return null;
    }

    if (!views.every((viw) => viw.id !== view.id)) {
      return null;
    }

    if (!(startIndex !== undefined && startIndex >= 0 && startIndex <= views.length)) {
      startIndex = views.length;
    }

    // when add new datasheet view, set default summary value of the analysis bar
    const setDefaultFieldStat = (view: IViewProperty): IViewProperty => {
      if (view.type !== ViewType.Grid) return view;

      const newView = {
        ...view,
        columns: view.columns.map((col, i) => {
          if (i < 1) return { ...col, statType: StatType.CountAll };

          if ([FieldType.Number, FieldType.Currency].includes(snapshot.meta.fieldMap?.[col.fieldId]?.type as any)) {
            return { ...col, statType: StatType.Sum };
          }

          return col;
        }),
      };

      return newView;
    };

    return {
      n: OTActionName.ListInsert,
      p: ['meta', 'views', startIndex],
      li: setDefaultFieldStat(view),
    };
  }

  /**
   * move views
   * @param {string} viewId
   */
  static moveView2Action = (snapshot: ISnapshot, payload: { viewId: string; target: number }): IJOTAction | null => {
    const { viewId, target } = payload;
    const views = snapshot.meta.views;
    let index = -1;
    for (let i = 0, l = views.length; i < l; i++) {
      if (views[i]!.id === viewId) {
        index = i;
        break;
      }
    }
    if (index === -1) {
      return null;
    }

    // moveArrayElement(views, index, target);
    return {
      n: OTActionName.ListMove,
      p: ['meta', 'views', index],
      lm: target,
    };
  };

  /**
   * delete view based viewID,
   *
   * @param {string} viewId
   */
  static deleteView2Action(snapshot: ISnapshot, payload: { viewId: string }): IJOTAction | null {
    const views = snapshot.meta.views;
    const viewId = payload.viewId;
    // check whether current is activeView
    const viewIndex = findIndex(views, (viw) => viw.id === viewId);
    if (viewIndex < 0) {
      return null;
    }
    return {
      n: OTActionName.ListDelete,
      p: ['meta', 'views', viewIndex],
      ld: views[viewIndex],
    };
  }

  /**
   * update view based viewID
   *
   * @param {string} viewId
   */
  static modifyView2Action(
    snapshot: ISnapshot,
    payload: { viewId: string; key: 'name' | 'description' | 'columns' | 'displayHiddenColumnWithinMirror'; value: string | IViewColumn[] | boolean }
  ): IJOTAction[] | null {
    const views = snapshot.meta.views;
    const { viewId, key, value } = payload;

    // check whether current is activeView
    const viewIndex = findIndex(views, (viw) => viw.id === viewId);
    if (viewIndex < 0) {
      return null;
    }

    if (key === 'columns' && Array.isArray(value)) {
      const rlt: IJOTAction[] = [];
      value.forEach((item) => {
        const fieldId = item.fieldId;
        const view = views[viewIndex]!;
        const columns = view['columns'];
        const modifyColumnIndex = columns.findIndex((column) => column.fieldId === fieldId);
        const oldItem = columns[modifyColumnIndex];
        if (!isEqual(oldItem, item)) {
          rlt.push({
            n: OTActionName.ListReplace,
            p: ['meta', 'views', viewIndex, 'columns', modifyColumnIndex],
            ld: oldItem,
            li: item,
          });
        }
      });
      return rlt;
    }

    return [
      {
        n: OTActionName.ObjectReplace,
        p: ['meta', 'views', viewIndex, key],
        od: views[viewIndex]![key],
        oi: value,
      },
    ];
  }

  /**
   * add Field to table
   */
  static addField2Action(
    snapshot: ISnapshot,
    payload: {
      field: IField;
      viewId?: string;
      index?: number;
      fieldId?: string;
      offset?: number;
      hiddenColumn?: boolean;
      forceColumnVisible?: boolean;
    }
  ): IJOTAction[] | null {
    const fieldMap = snapshot.meta.fieldMap;
    const views = snapshot.meta.views;
    const { field, viewId, fieldId, offset, index, hiddenColumn } = payload;

    const actions = views.reduce<IJOTAction[]>((pre, cur, viewIndex) => {
      let columnIndex = cur.columns.length;
      if (cur.columns.some((column) => column.fieldId === field.id)) {
        return pre;
      }
      // as new columns with duplicate operation, pass in `index` to take precedence
      if (viewId && index && viewId === cur.id) {
        columnIndex = index;
      }

      // only under specified view, if fieldId exists, calc index by every view's fieldId
      if (fieldId) {
        const fieldIdIndex = cur.columns.findIndex((column) => column.fieldId === fieldId);
        columnIndex = fieldIdIndex + (offset ?? 0);
      }

      const newColumn: IGridViewColumn = {
        fieldId: field.id,
      };
      if ([FieldType.Number, FieldType.Currency].includes(field.type)) {
        newColumn.statType = StatType.Sum;
      }

      // handler of new column in view
      function viewColumnHandler() {
        if (payload.forceColumnVisible != null) {
          newColumn.hidden = !payload.forceColumnVisible;
          return;
        }
        let hiddenKey = 'hidden';
        switch (cur.type) {
          case ViewType.Gantt:
            hiddenKey = 'hiddenInGantt';
            break;
          case ViewType.Calendar:
            hiddenKey = 'hiddenInCalendar';
            break;
          case ViewType.OrgChart:
            hiddenKey = 'hiddenInOrgChart';
            break;
          default:
            // current view default display or view has no hidden column
            if ((viewId && viewId === cur.id) || cur.columns.every((column) => !column.hidden)) {
              newColumn.hidden = Boolean(hiddenColumn);
              return;
            }
            break;
        }
        const isGanttView = viewId === cur.id && cur.type === ViewType.Gantt;
        newColumn.hidden = !isGanttView || hiddenColumn;
        newColumn[hiddenKey] = true;
      }

      viewColumnHandler();

      pre.push({
        n: OTActionName.ListInsert,
        p: ['meta', 'views', viewIndex, 'columns', columnIndex],
        li: newColumn,
      });

      return pre;
    }, []);

    if (!fieldMap[field.id]) {
      actions.push({
        n: OTActionName.ObjectInsert,
        p: ['meta', 'fieldMap', field.id],
        oi: field,
      });
    }

    return actions;
  }

  /**
   * delete field
   */
  static deleteField2Action(snapshot: ISnapshot, payload: { fieldId: string; datasheetId: string; viewId?: string }): IJOTAction[] | null {
    const fieldMap = snapshot.meta.fieldMap;
    const views = snapshot.meta.views;
    const { fieldId, datasheetId, viewId } = payload;

    // delete all columns related attributes in all view
    const actions = views.reduce<IJOTAction[]>((action, view, index) => {
      const columnIndex = view.columns.findIndex((column) => column.fieldId === fieldId);

      if (columnIndex < 0) {
        return action;
      }

      const deleteGroupOrSortInfo = (type: 'groupInfo' | 'sortInfo') => {
        const info = type === 'groupInfo' ? view.groupInfo : view.sortInfo?.rules;
        if (info) {
          const infoIndex = info.findIndex((gp) => gp.fieldId === fieldId);
          if (infoIndex > -1 && info.length > 1) {
            if (type === 'groupInfo') {
              action.push({
                n: OTActionName.ListDelete,
                p: ['meta', 'views', index, type, infoIndex],
                ld: info[infoIndex],
              });
              compensator.setLastGroupInfoIfNull(info);
            } else {
              action.push({
                n: OTActionName.ListDelete,
                p: ['meta', 'views', index, type, 'rules', infoIndex],
                ld: info[infoIndex],
              });
            }
          }
          // remain the last one, need to delete the group/sort field directly
          if (infoIndex > -1 && info.length === 1) {
            action.push({
              n: OTActionName.ObjectDelete,
              p: ['meta', 'views', index, type],
              od: type === 'groupInfo' ? info : view.sortInfo,
            });
          }
        }
      };
      const deleteKanbanFieldId = () => {
        const isKanbanView = view.type === ViewType.Kanban && view.style.kanbanFieldId === fieldId;
        if (isKanbanView) {
          action.push({
            n: OTActionName.ObjectDelete,
            p: ['meta', 'views', index, 'style', 'kanbanFieldId'],
            od: fieldId,
          });
        }
      };
      const deleteGanttFieldId = () => {
        if (view.type !== ViewType.Gantt) {
          return;
        }
        const isStartField = view.style.startFieldId === fieldId;
        const isEndField = view.style.endFieldId === fieldId;
        if (isStartField) {
          action.push({
            n: OTActionName.ObjectDelete,
            p: ['meta', 'views', index, 'style', 'startFieldId'],
            od: fieldId,
          });
        }
        if (isEndField) {
          action.push({
            n: OTActionName.ObjectDelete,
            p: ['meta', 'views', index, 'style', 'endFieldId'],
            od: fieldId,
          });
        }
      };
      const setFrozenColumnCount = () => {
        const frozenColumnCount = (view as IGridViewProperty)?.frozenColumnCount;
        if (frozenColumnCount && columnIndex < frozenColumnCount) {
          action.push({
            n: OTActionName.ObjectReplace,
            p: ['meta', 'views', index, 'frozenColumnCount'],
            oi: frozenColumnCount - 1,
            od: frozenColumnCount,
          });
        }
      };
      if (datasheetId !== snapshot.datasheetId || !(view.lockInfo && view.id !== viewId)) {
        // judgement here is for the permissions tips of lock view.
        // for example, `view 2` set field A's filter condition, I delete field A in `view 1`,
        // because `view 2`'s view lock will make me operation failed,
        // from user's point of view, he may not delete one field before check all views, and close view lock
        // so, judgement here is to delete field, and at the same time, doesn't delete the information in lock view,
        // just show exception tips only
        // what's special, is the relation table operation, verifications of relation table in middle server(room-server) is not strict,
        // only require editable permission, therefor, relation table operation can go pass directly.

        // the dependencies in filter's field, also need to be deleted
        if (view.filterInfo) {
          const newConditions = view.filterInfo.conditions.filter((condition) => {
            if (condition.fieldId === fieldId) {
              return false;
            }
            return true;
          });
          if (newConditions.length === 0) {
            action.push({
              n: OTActionName.ObjectDelete,
              p: ['meta', 'views', index, 'filterInfo'],
              od: view.filterInfo,
            });
          } else if (newConditions.length !== view.filterInfo.conditions.length) {
            action.push({
              n: OTActionName.ObjectReplace,
              p: ['meta', 'views', index, 'filterInfo', 'conditions'],
              od: view.filterInfo.conditions,
              oi: newConditions,
            });
          }
        }

        deleteGroupOrSortInfo('groupInfo');
        deleteGroupOrSortInfo('sortInfo');
        deleteKanbanFieldId();
        deleteGanttFieldId();
        setFrozenColumnCount();
      }

      // delete columns
      action.push({
        n: OTActionName.ListDelete,
        p: ['meta', 'views', index, 'columns', columnIndex],
        ld: view.columns[columnIndex],
      });

      return action;
    }, []);

    const field = fieldMap[fieldId];
    if (field) {
      // when delete date column, remove alarm
      const recordMap = snapshot.recordMap;
      Object.keys(recordMap).forEach((recordId) => {
        const alarm = getDateTimeCellAlarm(snapshot, recordId, field.id);
        if (alarm) {
          const alarmActions = DatasheetActions.setDateTimeCellAlarm(snapshot, {
            recordId,
            fieldId: field.id,
            alarm: null,
          });
          if (alarmActions) {
            actions.push(...alarmActions);
          }
        }
      });

      actions.push({
        n: OTActionName.ObjectDelete,
        p: ['meta', 'fieldMap', fieldId],
        od: field,
      });
    }

    return actions;
  }

  static setColumnWidth2Action = (snapshot: ISnapshot, payload: { viewId: string; fieldId: string; width: number | null }): IJOTAction | null => {
    const { viewId, fieldId, width } = payload;
    const viewIndex = getViewIndex(snapshot, viewId);
    if (viewIndex < 0) {
      return null;
    }

    const view = snapshot.meta.views[viewIndex] as IGridViewProperty;
    const columnIndex = view.columns.findIndex((column) => column.fieldId === fieldId);
    const column = view.columns[columnIndex]!;
    if (columnIndex < 0 || ![ViewType.Grid, ViewType.Gantt].includes(view.type) || column.width === width) {
      return null;
    }

    return {
      n: OTActionName.ObjectReplace,
      p: ['meta', 'views', viewIndex, 'columns', columnIndex, 'width'],
      oi: width,
      od: column.width,
    };
  };

  static moveColumns2Action = (snapshot: ISnapshot, payload: { fieldId: string; target: number; viewId: string }): IJOTAction | null => {
    const { fieldId, target, viewId } = payload;

    const viewIndex = getViewIndex(snapshot, viewId);
    if (viewIndex < 0) {
      return null;
    }

    const view = snapshot.meta.views[viewIndex]!;
    const columnIndex = view.columns.findIndex((column) => column.fieldId === fieldId);
    if (columnIndex < 0 || columnIndex === target) {
      return null;
    }

    return {
      n: OTActionName.ListMove,
      p: ['meta', 'views', viewIndex, 'columns', columnIndex],
      lm: target,
    };
  };

  /**
   * set grid view's column's statistic dimension
   */
  static setColumnStatType2Action = (
    snapshot: ISnapshot,
    payload: { viewId: string; fieldId: string; statType?: StatType | null }
  ): IJOTAction | null => {
    const { fieldId, statType, viewId } = payload;

    const viewIndex = getViewIndex(snapshot, viewId);
    if (viewIndex < 0) {
      return null;
    }

    const view = snapshot.meta.views[viewIndex] as IGridViewProperty;
    const columnIndex = view.columns.findIndex((column) => column.fieldId === fieldId);
    const column = view.columns[columnIndex]!;
    if (columnIndex < 0 || ![ViewType.Grid, ViewType.Gantt].includes(view.type) || column.statType === statType) {
      return null;
    }

    if (!statType) {
      return {
        n: OTActionName.ObjectDelete,
        p: ['meta', 'views', viewIndex, 'columns', columnIndex, 'statType'],
        od: column.statType,
      };
    }
    return {
      n: OTActionName.ObjectReplace,
      p: ['meta', 'views', viewIndex, 'columns', columnIndex, 'statType'],
      oi: statType,
      od: column.statType,
    };
  };

  /**
   * set the row height of gridview View
   */
  static setRowHeightLevel2Action = (snapshot: ISnapshot, payload: { viewId: string; level: RowHeightLevel }): IJOTAction | null => {
    const { level, viewId } = payload;

    const viewIndex = getViewIndex(snapshot, viewId);
    if (viewIndex < 0) {
      return null;
    }

    const view = snapshot.meta.views[viewIndex] as IGridViewProperty;
    if (![ViewType.Grid, ViewType.Gantt].includes(view.type) || view.rowHeightLevel === level) {
      return null;
    }

    return {
      n: OTActionName.ObjectReplace,
      p: ['meta', 'views', viewIndex, 'rowHeightLevel'],
      oi: level,
      od: view.rowHeightLevel,
    };
  };

  /**
   * set Grid/Gantt view's column whether auto word wrap
   */
  static setAutoHeadHeight2Action = (snapshot: ISnapshot, payload: { viewId: string; isAuto: boolean }): IJOTAction | null => {
    const { isAuto, viewId } = payload;

    const viewIndex = getViewIndex(snapshot, viewId);
    if (viewIndex < 0) {
      return null;
    }

    const view = snapshot.meta.views[viewIndex] as IGridViewProperty;
    if (![ViewType.Grid, ViewType.Gantt].includes(view.type) || view.autoHeadHeight === isAuto) {
      return null;
    }

    return {
      n: OTActionName.ObjectReplace,
      p: ['meta', 'views', viewIndex, 'autoHeadHeight'],
      oi: isAuto,
      od: view.autoHeadHeight,
    };
  };

  static setFrozenColumnCount2Action = (snapshot: ISnapshot, payload: { viewId: string; count: RowHeightLevel }): IJOTAction | null => {
    const { count, viewId } = payload;

    const viewIndex = getViewIndex(snapshot, viewId);
    if (viewIndex < 0) {
      return null;
    }

    const view = snapshot.meta.views[viewIndex] as IGridViewProperty;
    if (![ViewType.Grid, ViewType.Gantt].includes(view.type) || view.frozenColumnCount === count) {
      return null;
    }

    return {
      n: OTActionName.ObjectReplace,
      p: ['meta', 'views', viewIndex, 'frozenColumnCount'],
      oi: count,
      od: view.frozenColumnCount,
    };
  };

  /**
   * add record to table
   */
  static addRecord2Action(
    snapshot: ISnapshot,
    payload: { viewId: string; record: IRecord; index: number; newRecordIndex: number }
  ): IJOTAction[] | null {
    const recordMap = snapshot.recordMap;
    const views = snapshot.meta.views;
    const { record, index, viewId, newRecordIndex } = payload;

    const actions = views.reduce<IJOTAction[]>((pre, cur, viewIndex) => {
      // multi add rows length no change
      let rowIndex = cur.rows.length + newRecordIndex;
      if (cur.rows.some((row) => row.recordId === record.id)) {
        return pre;
      }

      // only add to index when view is active
      if (viewId === cur.id) {
        rowIndex = index;
      }

      pre.push({
        n: OTActionName.ListInsert,
        p: ['meta', 'views', viewIndex, 'rows', rowIndex],
        li: { recordId: record.id },
      });

      return pre;
    }, []);

    if (!recordMap[record.id]) {
      actions.push({
        n: OTActionName.ObjectInsert,
        p: ['recordMap', record.id],
        oi: record,
      });
    }

    return actions;
  }

  /**
   * update record, when return null, it means record does not exist and current table's value has not changed
   */
  static setRecord2Action(
    snapshot: ISnapshot,
    payload: {
      recordId: string;
      fieldId: string;
      value: ICellValue;
    }
  ): IJOTAction | null {
    const { recordId, fieldId, value } = payload;

    // recordId, not exist in data
    if (!snapshot.recordMap[recordId]) {
      return null;
    }

    // oldCellValue, don't use `getCellValue`, because it may be a computed field
    const cv = snapshot.recordMap[recordId]!.data[fieldId];
    const oldCellValue = cv == null ? null : cv;

    // non-computed field, check whether value has changed
    if (isEqual(oldCellValue, value)) {
      return null;
    }

    // when value is empty(empty array), we should delete the key to avoid redundancy
    if (value == null || (Array.isArray(value) && value.length === 0)) {
      return {
        n: OTActionName.ObjectDelete,
        p: ['recordMap', recordId, 'data', fieldId],
        od: oldCellValue,
      };
    }

    // when origin cellValue is empty, in fact it need insert one fieldId key

    if (oldCellValue == null) {
      return {
        n: OTActionName.ObjectInsert,
        p: ['recordMap', recordId, 'data', fieldId],
        oi: value,
      };
    }

    return {
      n: OTActionName.ObjectReplace,
      p: ['recordMap', recordId, 'data', fieldId],
      od: oldCellValue,
      oi: value,
    };
  }

  /**
   * delete record by record id
   */
  static deleteRecords(
    snapshot: ISnapshot,
    payload: {
      recordIds: string[];
      getFieldByFieldId(fieldId: string): IField;
      state: IReduxState;
    }
  ): IJOTAction[] {
    const recordMap = snapshot.recordMap;
    const recordSize = Object.keys(recordMap).length;
    const views = snapshot.meta.views;
    const fieldMap = snapshot.meta.fieldMap;
    const { recordIds, getFieldByFieldId, state } = payload;
    const waitDeleteRecordSet = new Set(recordIds);
    compensator.addWillRemoveRecords(recordIds);
    let actions: IJOTAction[] = [];

    /**
     *
     * depends on records count to delete,  and the percent of delete count and total count to judge
     * delete one by one (ld) ,  or total replace(or)
     *
     * when the number of records to delete larger than 500,
     * or delete records / total records percent larger thant 50%,
     * and total records larger than 160,
     * then total replace
     * otherwise delete one by one
     *
     */

    // delete all rows in views
    const rate = waitDeleteRecordSet.size / recordSize;
    if ((rate > 0.5 && recordSize > 100) || waitDeleteRecordSet.size > 500) {
      // delete related records in views
      actions = views.map<IJOTAction>((curView, index) => {
        const nextViewRows = curView.rows.reduce<{ recordId: string }[]>((pre, row) => {
          if (!waitDeleteRecordSet.has(row.recordId)) {
            pre.push(row);
          }
          return pre;
        }, []);
        return {
          n: OTActionName.ObjectReplace,
          p: ['meta', 'views', index, 'rows'],
          od: curView.rows,
          oi: nextViewRows,
        };
      });
    } else {
      // delete one by one
      actions = views.reduce<IJOTAction[]>((pre, cur, index) => {
        const toDelete = cur.rows
          .reduce<{ recordId: string; index: number }[]>((pre, row, i) => {
            if (waitDeleteRecordSet.has(row.recordId)) {
              pre.push({
                recordId: row.recordId,
                index: i,
              });
            }
            return pre;
          }, [])
          .map<IJOTAction>((item, i) => {
            return {
              n: OTActionName.ListDelete,
              p: ['meta', 'views', index, 'rows', item.index - i],
              ld: cur.rows[item.index],
            };
          });

        pre.push(...toDelete);

        return pre;
      }, []);
    }

    recordIds.forEach((recordId) => {
      const record = recordMap[recordId];
      if (record) {
        const data = {};
        for (const k in record.data) {
          const field = getFieldByFieldId(k);
          if (Field.bindContext(field, state).recordEditable()) {
            data[k] = record.data[k];
          }
        }
        const _record = {
          ...record,
          data: data,
        };

        // when delete date, remove alarm
        // TODO(kailang) ObjectDelete has did this
        Object.keys(fieldMap).forEach((fieldId) => {
          if (fieldMap[fieldId]!.type === FieldType.DateTime) {
            const alarm = getDateTimeCellAlarm(snapshot, recordId, fieldId);
            if (alarm) {
              const alarmActions = DatasheetActions.setDateTimeCellAlarm(snapshot, {
                recordId,
                fieldId,
                alarm: null,
              });
              if (alarmActions) {
                actions.push(...alarmActions);
              }
            }
          }
        });

        actions.push({
          n: OTActionName.ObjectDelete,
          p: ['recordMap', recordId],
          od: _record,
        });
      }
    });

    return actions;
  }

  /**
   * set alarm by record
   */
  static setDateTimeCellAlarm(
    snapshot: ISnapshot,
    payload: {
      recordId: string;
      fieldId: string;
      alarm: IRecordAlarm | null;
    }
  ): IJOTAction[] | null {
    const { recordId, fieldId, alarm } = payload;
    const oldAlarm = getDateTimeCellAlarm(snapshot, recordId, fieldId);

    // new alarm
    if (!oldAlarm) {
      const fieldExtraMap = snapshot.recordMap[recordId]?.recordMeta?.fieldExtraMap;
      // compensate snapshot fieldExtraMap default data
      let defaultAction: IObjectInsertAction | undefined;
      // without fieldExtraMap
      if (!fieldExtraMap) {
        defaultAction = {
          n: OTActionName.ObjectInsert,
          p: ['recordMap', recordId, 'recordMeta', 'fieldExtraMap'],
          oi: {
            [fieldId]: {},
          },
        };
      } else if (!fieldExtraMap[fieldId]) {
        // already have fieldExtraMap, but still have no fieldExtraMap[fieldId]
        defaultAction = {
          n: OTActionName.ObjectInsert,
          p: ['recordMap', recordId, 'recordMeta', 'fieldExtraMap', fieldId],
          oi: {},
        };
      }
      const alarmAction: IJOTAction = {
        n: OTActionName.ObjectInsert,
        p: ['recordMap', recordId, 'recordMeta', 'fieldExtraMap', fieldId, 'alarm'],
        oi: alarm,
      };
      return defaultAction ? [defaultAction, alarmAction] : [alarmAction];
    }
    if (isEqual(oldAlarm, alarm)) {
      return null;
    }
    // delete alarm
    if (!alarm) {
      return [
        {
          n: OTActionName.ObjectDelete,
          p: ['recordMap', recordId, 'recordMeta', 'fieldExtraMap', fieldId, 'alarm'],
          od: oldAlarm,
        },
      ];
    }

    /**
     * found a situation, alarm.alarmUsers length equals 0,
     * TODO: wait for debug, here just place the check
     */
    if (!alarm.alarmUsers?.length) {
      return null;
    }

    // edit alarm
    return [
      {
        n: OTActionName.ObjectReplace,
        p: ['recordMap', recordId, 'recordMeta', 'fieldExtraMap', fieldId, 'alarm'],
        od: oldAlarm,
        oi: alarm,
      },
    ];
  }

  static moveRow2Action = (snapshot: ISnapshot, payload: { recordId: string; target: number; viewId: string }): IJOTAction | null => {
    const { recordId, target, viewId } = payload;
    const viewIndex = getViewIndex(snapshot, viewId);
    if (viewIndex < 0) {
      return null;
    }

    const view = snapshot.meta.views[viewIndex]!;
    const recordIndex = view.rows.findIndex((row) => row.recordId === recordId);
    if (recordIndex < 0) {
      return null;
    }

    return {
      n: OTActionName.ListMove,
      p: ['meta', 'views', viewIndex, 'rows', recordIndex],
      lm: target,
    };
  };

  static setViewSort2Action(
    state: IReduxState,
    snapshot: ISnapshot,
    payload: { viewId: string; sortInfo?: ISortInfo; applySort?: boolean }
  ): IJOTAction[] | null {
    const { viewId, sortInfo, applySort } = payload;
    const viewIndex = getViewIndex(snapshot, viewId);
    if (viewIndex < 0) {
      return null;
    }

    const view = snapshot.meta.views[viewIndex]!;

    // when clear sorts, delete sort field directly
    if (!sortInfo) {
      return [
        {
          n: OTActionName.ObjectDelete,
          p: ['meta', 'views', viewIndex, 'sortInfo'],
          od: view.sortInfo,
        },
      ];
    }

    if (applySort) {
      // sort method will mutate the array, so here duplicate the array first
      const rows = sortRowsBySortInfo(state, view.rows, sortInfo.rules, snapshot);

      return [
        {
          n: OTActionName.ObjectReplace,
          p: ['meta', 'views', viewIndex, 'sortInfo'],
          oi: sortInfo,
          od: view.sortInfo,
        },
        {
          n: OTActionName.ObjectReplace,
          p: ['meta', 'views', viewIndex, 'rows'],
          oi: rows,
          od: view.rows,
        },
      ];
    }

    return [
      {
        n: OTActionName.ObjectReplace,
        p: ['meta', 'views', viewIndex, 'sortInfo'],
        oi: sortInfo,
        od: view.sortInfo,
      },
    ];
  }

  /**
   * update Field, replace field directly
   */
  static setFieldAttr2Action = (snapshot: ISnapshot, payload: { field: IField }): IJOTAction | null => {
    const fieldMap = snapshot.meta.fieldMap;
    const field = payload.field;
    if (!fieldMap[field.id] || isEqual(field, fieldMap[field.id])) {
      return null;
    }

    return {
      n: OTActionName.ObjectReplace,
      p: ['meta', 'fieldMap', field.id],
      oi: field,
      od: fieldMap[field.id],
    };
  };

  /**
   * set view filter  filterInfo
   */
  static setFilterInfo2Action = (snapshot: ISnapshot, payload: { viewId: string; filterInfo?: IFilterInfo }): IJOTAction | null => {
    const viewId = payload.viewId;
    let filterInfo = payload.filterInfo;
    const viewIndex = getViewIndex(snapshot, viewId);
    if (viewIndex < 0) {
      return null;
    }
    const view = snapshot.meta.views[viewIndex]!;

    if (!validateFilterInfo(filterInfo)) {
      console.error('illegal filter condition!');
      filterInfo = undefined;
    }

    if (isEqual(view.filterInfo, filterInfo)) {
      return null;
    }

    /**
     * when clear filter, delete filter field directly
     */
    if (!filterInfo) {
      return {
        n: OTActionName.ObjectDelete,
        p: ['meta', 'views', viewIndex, 'filterInfo'],
        od: view.filterInfo,
      };
    }

    return {
      n: OTActionName.ObjectReplace,
      p: ['meta', 'views', viewIndex, 'filterInfo'],
      oi: filterInfo,
      od: view.filterInfo,
    };
  };

  static setViewLockInfo2Action = (snapshot: ISnapshot, payload: { viewId: string; viewLockInfo: IViewLockInfo | null }): IJOTAction | null => {
    const viewId = payload.viewId;
    const viewLock = payload.viewLockInfo;
    const viewIndex = getViewIndex(snapshot, viewId);

    if (viewIndex < 0) {
      return null;
    }
    const view = snapshot.meta.views[viewIndex]!;

    if (viewLock === null) {
      return {
        n: OTActionName.ObjectDelete,
        p: ['meta', 'views', viewIndex, 'lockInfo'],
        od: view.lockInfo,
      };
    }
    return {
      n: OTActionName.ObjectInsert,
      p: ['meta', 'views', viewIndex, 'lockInfo'],
      oi: viewLock,
    };
  };

  static setGroupInfoField2Action = (snapshot: ISnapshot, payload: { viewId: string; groupInfo?: IGroupInfo }): IJOTAction | null => {
    const { viewId, groupInfo } = payload;
    const viewIndex = getViewIndex(snapshot, viewId);

    if (viewIndex < 0) {
      return null;
    }

    const view = snapshot.meta.views[viewIndex]!;
    if (isEqual(view.groupInfo, groupInfo)) {
      return null;
    }

    compensator.setLastGroupInfoIfNull(view.groupInfo);

    /**
     * when clear grouping, delete grouping field directly
     */
    if (!groupInfo) {
      return {
        n: OTActionName.ObjectDelete,
        p: ['meta', 'views', viewIndex, 'groupInfo'],
        od: view.groupInfo,
      };
    }

    return {
      n: OTActionName.ObjectReplace,
      p: ['meta', 'views', viewIndex, 'groupInfo'],
      oi: groupInfo,
      od: view.groupInfo,
    };
  };

  /*
   * generate new viewId
   *
   * @returns {string}
   */
  static getNewViewId(views: IViewProperty[]): string {
    return getNewId(
      IDPrefix.View,
      views.map((view) => view.id)
    );
  }

  /**
   * generate new recordId
   * @returns {string}
   * @memberof Table
   */
  static getNewRecordId(recordMap: { [recordId: string]: IRecord }): string {
    return getNewId(IDPrefix.Record, Object.keys(recordMap));
  }

  /**
   * generate new field id
   * @returns {string}
   * @memberof Table
   */
  static getNewFieldId(fieldMap?: { [fieldId: string]: IField }): string {
    return getNewId(IDPrefix.Field, fieldMap && Object.keys(fieldMap));
  }

  /**
   * return new record with default value in table
   */
  static getDefaultNewRecord(
    state: IReduxState,
    snapshot: ISnapshot,
    recordId: string,
    viewId?: string,
    groupCellValues?: ICellValue[],
    userInfo?: IUserInfo
  ): IRecord {
    const fieldMap = getFieldMap(state, snapshot.datasheetId);
    const record: IRecord = {
      id: recordId,
      data: {},
      commentCount: 0,
      comments: [],
      recordMeta: {},
    };

    if (!fieldMap) {
      return record;
    }

    for (const fieldId in fieldMap) {
      const field = fieldMap[fieldId]!;
      const defaultValue = Field.bindContext(field, state).defaultValue();
      if (defaultValue != null) {
        record.data[field.id] = defaultValue;
      }
    }

    if (!viewId) {
      return record;
    }
    const view = getViewById(snapshot, viewId);
    if (!view) {
      return record;
    }

    const curMirrorId = state.pageParams.mirrorId;

    let _groupInfo: IGroupInfo = [];
    let filterInfo: IFilterInfo | undefined;

    if (curMirrorId) {
      _groupInfo = getActiveViewGroupInfo(state);
      filterInfo = getFilterInfo(state);
    }
    if (view.groupInfo) {
      const curGroupInfo = getGroupInfoWithPermission(state, view.groupInfo, snapshot.datasheetId);
      _groupInfo = unionWith(_groupInfo, curGroupInfo, isEqual);
    }
    if (_groupInfo.length > 0) {
      const dataByGroup = getDefaultNewRecordDataByGroup(_groupInfo, groupCellValues);
      Object.assign(record.data, dataByGroup);
    }

    const curFilterInfo = getFilterInfoExceptInvalid(state, snapshot.datasheetId, view.filterInfo);
    if (filterInfo && curFilterInfo) {
      filterInfo = {
        conjunction: curFilterInfo.conjunction,
        conditions: curFilterInfo.conditions.concat(filterInfo.conditions),
      };
    } else if (curFilterInfo) {
      filterInfo = curFilterInfo;
    }
    if (filterInfo) {
      const dataByFilter = getDefaultNewRecordDataByFilter(state, snapshot.datasheetId, filterInfo, fieldMap, userInfo);
      Object.assign(record.data, dataByFilter);
    }

    return record;
  }

  static getDefaultFieldName(fieldMap: { [fieldId: string]: IField }): string {
    const names: string[] = [];
    for (const id in fieldMap) {
      names.push(fieldMap[id]!.name);
    }
    return getUniqName(NamePrefix.Field, names);
  }

  /**
   * return new generated view name
   *
   * @param {ViewType} type
   * @returns {string}
   */
  static getDefaultViewName(views: IViewProperty[], type: ViewType): string {
    let prefix: any;
    switch (type) {
      case ViewType.Grid:
        prefix = NamePrefix.GridView;
        break;
      case ViewType.Gallery:
        prefix = NamePrefix.GalleryView;
        break;
      case ViewType.Kanban:
        prefix = NamePrefix.KanbanView;
        break;
      case ViewType.Form:
        prefix = NamePrefix.FormView;
        break;
      case ViewType.Calendar:
        prefix = NamePrefix.CalendarView;
        break;
      case ViewType.Gantt:
        prefix = NamePrefix.GanttView;
        break;
      case ViewType.OrgChart:
        prefix = NamePrefix.OrgChartView;
        break;
      case ViewType.NotSupport:
        prefix = NamePrefix.View;
        break;

      default:
        assertNever(type);
        prefix = NamePrefix.View;
    }
    return getUniqName(
      prefix,
      views.map((view) => view.name)
    );
  }

  /**
   * get default view property with stable row and column order
   */
  static deriveDefaultViewProperty(snapshot: ISnapshot, viewType: ViewType, activeViewId: string | null | undefined): IViewProperty {
    const defaultProperty = getViewClass(viewType).generateDefaultProperty(snapshot, activeViewId);
    if (!defaultProperty) {
      throw Error(`Unexpected view type ${viewType}!`);
    }
    return defaultProperty;
  }

  /**
   * get View's all Records' FieldId data
   * @param {string} fieldId
   * @returns {ICellValue[]}
   * @memberof Table
   */
  static getCellValuesByFieldId(state: IReduxState, snapshot: ISnapshot, fieldId: string, view?: IViewProperty, isEntity?: boolean): ICellValue[] {
    const fieldMap = snapshot.meta.fieldMap;
    const recordMap = snapshot.recordMap;
    if (!fieldMap[fieldId]) {
      return [];
    }

    const cellValues: ICellValue[] = [];
    let recordIds = Object.keys(recordMap);
    if (view) {
      switch (view.type) {
        case ViewType.Grid:
        case ViewType.Gantt: {
          recordIds = view.rows.map((view) => view.recordId);
        }
      }
    }

    for (let i = 0; i < recordIds.length; i++) {
      const record = recordMap[recordIds[i]!]!;
      const cellValue = getCellValue(state, snapshot, record.id, fieldId);
      if (isEntity || cellValue != null) {
        cellValues.push(cellValue);
      }
    }
    return cellValues;
  }

  // generate new comment's action
  static insertComment2Action(
    state: IReduxState,
    options: {
      datasheetId: string;
      recordId: string;
      insertComments?: Omit<IComments, 'revision'>[];
    }
  ): IJOTAction[] | null {
    const { recordId, datasheetId, insertComments } = options;
    const recordMap = getSnapshot(state, datasheetId)!.recordMap;
    const record: IRecord = recordMap[recordId]!;
    const { comments = [] } = record;

    if (insertComments) {
      return [
        {
          n: OTActionName.ListInsert,
          p: ['recordMap', recordId, 'comments', comments!.length],
          li: insertComments[0],
        },
        {
          n: OTActionName.NumberAdd,
          p: ['recordMap', recordId, 'commentCount'],
          na: 1,
        },
      ];
    }

    return null;
  }

  static updateComment2Action(options: {
    datasheetId: string;
    recordId: string;
    updateComments: IComments[];
    emojiAction?: boolean;
  }): IJOTAction[] | null {
    const { recordId, updateComments, emojiAction } = options;
    const actions: IJOTAction[] = [];

    if (emojiAction) {
      // new
      actions.push({
        n: OTActionName.ListInsert,
        // p, only verify update comment's emoji, no use in other place
        p: ['recordMap', recordId, 'comments', 'emojis'],
        li: updateComments[0],
      });
    } else {
      // cancel
      actions.push({
        n: OTActionName.ListDelete,
        // p, only verify update comment's emoji, no use in other place
        p: ['recordMap', recordId, 'comments', 'emojis'],
        ld: updateComments[0],
      });
    }
    return actions;
  }

  static deleteComment2Action(options: { datasheetId: string; recordId: string; comments: IComments[] }) {
    const { recordId, comments } = options;

    const actions: IJOTAction[] = [];
    actions.push(
      {
        n: OTActionName.ListDelete,
        p: ['recordMap', recordId, 'comments', 0],
        ld: comments[0],
      },
      {
        n: OTActionName.NumberAdd,
        p: ['recordMap', recordId, 'commentCount'],
        na: -1,
      }
    );

    return actions;
  }

  static deleteWidgetPanel2Action(
    _state: IReduxState,
    panelId: string,
    widgetPanels: IWidgetPanel[],
    resourceType: ResourceType.Mirror | ResourceType.Datasheet
  ): IJOTAction[] | null {
    if (!widgetPanels) {
      return null;
    }

    const index = widgetPanels.findIndex((item) => {
      return item.id === panelId;
    });

    if (index < 0) {
      return null;
    }

    if (resourceType === ResourceType.Mirror) {
      return [
        {
          n: OTActionName.ListDelete,
          p: ['widgetPanels', index],
          ld: widgetPanels[index],
        },
      ];
    }

    return [
      {
        n: OTActionName.ListDelete,
        p: ['meta', 'widgetPanels', index],
        ld: widgetPanels[index],
      },
    ];
  }

  static movePanel2Action(targetIndex: number, sourceIndex: number, resourceType: ResourceType.Mirror | ResourceType.Datasheet): IJOTAction[] | null {
    if (resourceType === ResourceType.Mirror) {
      return [
        {
          n: OTActionName.ListMove,
          p: ['widgetPanels', sourceIndex],
          lm: targetIndex,
        },
      ];
    }
    return [
      {
        n: OTActionName.ListMove,
        p: ['meta', 'widgetPanels', sourceIndex],
        lm: targetIndex,
      },
    ];
  }

  static addWidgetPanel2Action(snapshot: ISnapshot, panel: IWidgetPanel): IJOTAction[] | null {
    const widgetPanels = snapshot.meta.widgetPanels;

    if (!Array.isArray(widgetPanels)) {
      return [
        {
          n: OTActionName.ObjectInsert,
          p: ['meta', 'widgetPanels'],
          oi: [panel],
        },
      ];
    }

    return [
      {
        n: OTActionName.ListInsert,
        p: ['meta', 'widgetPanels', widgetPanels.length + 1],
        li: panel,
      },
    ];
  }

  static addWidgetPanelWithMirror2Action(snapshot: IMirrorSnapshot, panel: IWidgetPanel): IJOTAction[] | null {
    const widgetPanels = snapshot.widgetPanels;

    if (!Array.isArray(widgetPanels)) {
      return [
        {
          n: OTActionName.ObjectInsert,
          p: ['widgetPanels'],
          oi: [panel],
        },
      ];
    }

    return [
      {
        n: OTActionName.ListInsert,
        p: ['widgetPanels', widgetPanels.length + 1],
        li: panel,
      },
    ];
  }

  static modifyPanelName2Acton(
    _state: IReduxState,
    newPanel: IWidgetPanel,
    widgetPanels: IWidgetPanel[],
    resourceType: ResourceType.Mirror | ResourceType.Datasheet
  ): IJOTAction[] | null {
    if (!widgetPanels) {
      return null;
    }

    const index = widgetPanels.findIndex((item) => {
      return item.id === newPanel.id;
    });

    if (index < 0) {
      return null;
    }

    if (resourceType === ResourceType.Mirror) {
      return [
        {
          n: OTActionName.ObjectReplace,
          p: ['widgetPanels', index, 'name'],
          od: widgetPanels[index]!.name,
          oi: newPanel.name,
        },
      ];
    }

    return [
      {
        n: OTActionName.ObjectReplace,
        p: ['meta', 'widgetPanels', index, 'name'],
        od: widgetPanels[index]!.name,
        oi: newPanel.name,
      },
    ];
  }

  static addWidgetToPanel2Action(
    _state: IReduxState,
    { installationIndex, panelIndex, widgetId }: { installationIndex: number; panelIndex: number; widgetId: string }
  ): IJOTAction[] | null {
    const newWidget = {
      id: widgetId,
      height: 6.2,
      y: Number.MAX_SAFE_INTEGER,
    };

    return [
      {
        n: OTActionName.ListInsert,
        p: ['meta', 'widgetPanels', panelIndex, 'widgets', installationIndex],
        li: newWidget,
      },
    ];
  }

  static addWidgetToPanelWithMirror2Action(
    _state: IReduxState,
    { installationIndex, panelIndex, widgetId }: { installationIndex: number; panelIndex: number; widgetId: string }
  ): IJOTAction[] | null {
    const newWidget = {
      id: widgetId,
      height: 6.2,
      y: Number.MAX_SAFE_INTEGER,
    };

    return [
      {
        n: OTActionName.ListInsert,
        p: ['widgetPanels', panelIndex, 'widgets', installationIndex],
        li: newWidget,
      },
    ];
  }

  static deleteWidget2Action(
    _state: IReduxState,
    options: {
      widgetPanelIndex: number;
      widget: IWidgetInPanel;
      widgetIndex: number;
    }
  ): IJOTAction[] {
    const { widgetPanelIndex, widgetIndex, widget } = options;
    return [
      {
        n: OTActionName.ListDelete,
        p: ['meta', 'widgetPanels', widgetPanelIndex, 'widgets', widgetIndex],
        ld: widget,
      },
    ];
  }

  static deleteMirrorWidget2Action(
    _state: IReduxState,
    options: {
      widgetPanelIndex: number;
      widget: IWidgetInPanel;
      widgetIndex: number;
    }
  ): IJOTAction[] {
    const { widgetPanelIndex, widgetIndex, widget } = options;
    return [
      {
        n: OTActionName.ListDelete,
        p: ['widgetPanels', widgetPanelIndex, 'widgets', widgetIndex],
        ld: widget,
      },
    ];
  }

  static changeWidgetHeight2Action(
    state: IReduxState,
    {
      widgetPanelIndex,
      widgetIndex,
      widgetHeight,
      resourceId,
      resourceType,
    }: {
      widgetPanelIndex: number;
      widgetIndex: number;
      widgetHeight: number;
      resourceId: string;
      resourceType: ResourceType;
    }
  ): IJOTAction[] | null {
    const activeWidgetPanel = getResourceActiveWidgetPanel(state, resourceId, resourceType)!;
    const widget = activeWidgetPanel.widgets[widgetIndex]!;
    const path =
      resourceType === ResourceType.Datasheet
        ? ['meta', 'widgetPanels', widgetPanelIndex, 'widgets', widgetIndex, 'height']
        : ['widgetPanels', widgetPanelIndex, 'widgets', widgetIndex, 'height'];
    return [
      {
        n: OTActionName.ObjectReplace,
        p: path,
        oi: widgetHeight,
        od: widget.height,
      },
    ];
  }

  static moveWidget2Action(
    state: IReduxState,
    {
      widgetPanelIndex,
      layout,
      resourceType,
      resourceId,
    }: { widgetPanelIndex: number; layout: any[]; resourceType: ResourceType; resourceId: string }
  ): IJOTAction[] | null {
    const widgetPanel = getResourceWidgetPanels(state, resourceId, resourceType);
    const oldLayout = widgetPanel?.[widgetPanelIndex]?.widgets;
    if (!oldLayout || layout.length !== oldLayout.length) {
      return null;
    }

    const actions: IJOTAction[] = [];

    const getPath = (widgetPanelIndex: number, index: number, key: string) => {
      const basePath = ['widgetPanels', widgetPanelIndex, 'widgets', index, key];
      return resourceType === ResourceType.Mirror ? basePath : ['meta', ...basePath];
    };

    oldLayout.forEach((oldPosition, index) => {
      const newPosition = layout[index];
      for (const k in newPosition) {
        const oldValue = oldPosition[k];
        const newValue = newPosition[k];
        if (oldValue !== newValue) {
          // compatible with the old mini program panel, set the y coordinate attribute for the first time, use oi
          const isFirstSetY = k === 'y' && oldValue === undefined;
          const replaceAction: IObjectReplaceAction = {
            n: OTActionName.ObjectReplace,
            p: getPath(widgetPanelIndex, index, k),
            oi: newValue,
            od: oldValue,
          };
          const insertAction: IObjectInsertAction = {
            n: OTActionName.ObjectInsert,
            p: getPath(widgetPanelIndex, index, k),
            oi: newValue,
          };
          actions.push(isFirstSetY ? insertAction : replaceAction);
        }
      }
    });
    return actions;
  }

  static manualSaveView2Action(snapshot: ISnapshot, payload: { viewId: string; viewProperty: ITemporaryView }): IJOTAction[] | null {
    const { viewId, viewProperty: serverView } = payload;
    const viewIndex = snapshot.meta.views.findIndex((view) => view.id === viewId);

    if (viewIndex == null) {
      return null;
    }

    const localView = snapshot.meta.views[viewIndex]!;
    const action: IJOTAction[] = [];

    const integrationView = { ...omit(serverView, ViewPropertyFilter.ignoreViewProperty), ...omit(localView, ViewPropertyFilter.ignoreViewProperty) };
    for (const key in integrationView) {
      if (localView[key] === serverView[key]) {
        continue;
      }
      if (localView.hasOwnProperty(key) && serverView.hasOwnProperty(key)) {
        action.push({
          n: OTActionName.ObjectReplace,
          p: ['meta', 'views', viewIndex, key],
          oi: localView[key],
          od: serverView[key],
        });
      }
      if (localView.hasOwnProperty(key) && !serverView.hasOwnProperty(key)) {
        action.push({
          n: OTActionName.ObjectInsert,
          p: ['meta', 'views', viewIndex, key],
          oi: localView[key],
        });
      }
      if (!localView.hasOwnProperty(key) && serverView.hasOwnProperty(key)) {
        action.push({
          n: OTActionName.ObjectDelete,
          p: ['meta', 'views', viewIndex, key],
          od: serverView[key],
        });
      }
    }

    return action;
  }

  static resetView2Action(snapshot: ISnapshot, payload: { viewId: string; viewProperty: ITemporaryView }): IJOTAction[] | null {
    const { viewId, viewProperty: serverView } = payload;
    const viewIndex = snapshot.meta.views.findIndex((view) => view.id === viewId);

    if (viewIndex == null) {
      return null;
    }

    const localView = snapshot.meta.views[viewIndex]!;
    const action: IJOTAction[] = [];
    const integrationView = { ...omit(localView, ViewPropertyFilter.ignoreViewProperty), ...omit(serverView, ViewPropertyFilter.ignoreViewProperty) };
    for (const key in integrationView) {
      if (localView[key] === serverView[key]) {
        continue;
      }
      if (localView[key] && serverView[key]) {
        action.push({
          n: OTActionName.ObjectReplace,
          p: ['meta', 'views', viewIndex, key],
          oi: serverView[key],
          od: localView[key],
        });
      }
      if (localView[key] && !serverView[key]) {
        action.push({
          n: OTActionName.ObjectDelete,
          p: ['meta', 'views', viewIndex, key],
          od: localView[key],
        });
      }
      if (!localView[key] && serverView[key]) {
        action.push({
          n: OTActionName.ObjectInsert,
          p: ['meta', 'views', viewIndex, key],
          oi: serverView[key],
        });
      }
    }

    return action;
  }

  static setViewAutoSave2Action(snapshot: ISnapshot, { viewId, autoSave }: { viewId: string; autoSave: boolean }): IJOTAction | null {
    const views = snapshot.meta.views;
    const viewIndex = views.findIndex((view) => view.id === viewId);

    if (viewIndex == null) {
      return null;
    }

    const view = views[viewIndex]!;

    if (view.autoSave == null) {
      return {
        n: OTActionName.ObjectInsert,
        p: ['meta', 'views', viewIndex, 'autoSave'],
        oi: autoSave,
      };
    }

    return {
      n: OTActionName.ObjectReplace,
      p: ['meta', 'views', viewIndex, 'autoSave'],
      oi: autoSave,
      od: view['autoSave'],
    };
  }

  /**
   * edit single relation dstID
   *
   * @param snapshot
   * @param payload
   */
  static changeOneWayLinkDstId2Action(snapshot: ISnapshot, payload: { fieldId: string; newField: IField }): IJOTAction | null {
    const fieldMap = snapshot.meta.fieldMap;
    const { fieldId, newField } = payload;
    if (!fieldMap[fieldId]) {
      return null;
    }
    return {
      n: OTActionName.ObjectReplace,
      p: ['meta', 'fieldMap', fieldId],
      od: fieldMap[fieldId],
      oi: newField,
    };
  }

  /**
   * Undo archieve recordIds
   * @Parmas snapshot
   * @param payload
   */

  static unarchivedRecords2Action(snapshot: ISnapshot, payload: { recordsData: any; linkFields: string[] }): IJOTAction[] | null {
    const { recordsData, linkFields } = payload;

    if (!recordsData || !recordsData.length || !snapshot) return null;
    const rows = snapshot.meta.views[0]!.rows;
    const views = snapshot.meta.views;
    const rlt: IJOTAction[] = [];

    for (let i = 0; i < recordsData.length; i++) {
      for (let j = 0; j < views.length; j++) {
        rlt.push({
          n: OTActionName.ListInsert,
          p: ['meta', 'views', j, 'rows', rows.length],
          li: { recordId: recordsData[i].id },
        });
      }

      const newRecord = produce(recordsData[i], (draft: any) => {
        Object.keys(draft.data).forEach((key) => {
          if (linkFields.includes(key)) {
            draft.data[key] = [];
          }
        });
      });

      const archivedRecordIds = snapshot.meta.archivedRecordIds || [];
      recordsData.forEach((record: any) => {
        const index = archivedRecordIds.findIndex((id) => id === record.id);
        if (index >= 0) {
          rlt.push({
            n: OTActionName.ListDelete,
            p: ['meta', 'archivedRecordIds', index],
            ld: record.id,
          });
        }
      });

      rlt.push({
        n: OTActionName.ObjectInsert,
        p: ['recordMap', recordsData[i].id],
        oi: newRecord,
      });
    }

    return rlt;
  }

  /**
   * add archieve RecordIds
   * @param snapshot
   * @param payload
   */
  static addArchiveRecordIdsToAction(snapshot: ISnapshot, payload: { recordIds: string[] }): IJOTAction[] | null {
    const { recordIds } = payload;
    const archivedRecordIds = snapshot.meta.archivedRecordIds || [];

    if (!recordIds || !recordIds.length) return null;

    const rlt: IJOTAction[] = [];
    recordIds.forEach((recordId, index) => {
      if (archivedRecordIds.includes(recordId)) return;
      rlt.push({
        n: OTActionName.ListInsert,
        p: ['meta', 'archivedRecordIds', archivedRecordIds.length + index],
        li: recordId,
      });
    });
    return rlt;
  }

  /**
   * Delete archieve recordIds
   */
  static deleteArchivedRecords2Action(snapshot: ISnapshot, payload: { recordsData: any }): IJOTAction[] | null {
    const { recordsData } = payload;

    if (!recordsData || !snapshot) return null;

    const rlt: IJOTAction[] = [];
    for (let i = 0; i < recordsData.length; i++) {
      rlt.push({
        n: OTActionName.ObjectDelete,
        p: ['recordMap', recordsData[i].id],
        od: recordsData[i],
      });
    }

    const archivedRecordIds = snapshot.meta.archivedRecordIds || [];
    recordsData.forEach((record: any) => {
      const index = archivedRecordIds.findIndex((id) => id === record.id);
      if (index >= 0) {
        rlt.push({
          n: OTActionName.ListDelete,
          p: ['meta', 'archivedRecordIds', index],
          ld: record.id,
        });
      }
    });

    return rlt;
  }
}
