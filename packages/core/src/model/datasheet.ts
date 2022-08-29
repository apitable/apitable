import { compensator } from 'compensator';
import { IJOTAction, IObjectInsertAction, IObjectReplaceAction, OTActionName, ViewPropertyFilter } from 'engine';
import { findIndex, isEqual, omit, unionWith } from 'lodash';
import { getMaxViewCountPerSheet } from 'model/utils';
import {
  IComments, IMirrorSnapshot, IRecordAlarm, IReduxState, ITemporaryView, IUserInfo, IViewLockInfo, RowHeightLevel, Selectors, ViewType
} from 'store';
import { IGridViewColumn, IGridViewProperty, IRecord, ISnapshot, IViewColumn, IViewProperty, IWidgetInPanel, IWidgetPanel } from 'store/interface';
import {
  doFilter, getActiveViewGroupInfo, getCellValue, getFieldMap, getFilterInfo, getFilterInfoExceptInvalid, getGroupInfoWithPermission,
  getResourceActiveWidgetPanel, getResourceWidgetPanels, getViewById, getViewIndex, sortRowsBySortInfo,
} from 'store/selector';
import { FilterConjunction, IFilterCondition, IFilterInfo, IGroupInfo, ISortInfo, ResourceType } from 'types';
import { FieldType, IField } from 'types/field_types';
import { assertNever, getNewId, getUniqName, IDPrefix, NamePrefix } from 'utils';
import { Field, OtherTypeUnitId, StatType } from './field';
import { ICellValue } from './record';
import { getViewClass } from './views';

// todo: 应该结合所有属性进行整体校验，不应该单独判断
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

function getDefaultNewRecordDataByGroup(
  groupInfos: IGroupInfo,
  groupCellValues?: ICellValue[],
): { [fieldId: string]: ICellValue } {
  const recordData: { [fieldId: string]: ICellValue } = {};
  if (groupInfos.length === 0 || !groupCellValues) {
    return recordData;
  }

  groupInfos.forEach((group, i) => {
    recordData[group.fieldId] = groupCellValues[i];
  });
  return recordData;
}

function getDefaultNewRecordDataByFilter(
  state: IReduxState,
  filterInfo: IFilterInfo,
  fieldMap: { [id: string]: IField },
  userInfo?: IUserInfo,
): { [fieldId: string]: ICellValue } {
  const { conditions } = filterInfo;
  const recordData: { [fieldId: string]: ICellValue } = {};

  // Or 组合，存在多个筛选条件，不默认填写数据，仅存在一个筛选条件，则按照 and 的逻辑处理
  if (filterInfo.conjunction === FilterConjunction.Or && filterInfo.conditions.length !== 1) {
    return recordData;
  }

  // And 组合

  // 1. 将筛选条件按 fieldId 分组
  const conditionGroups = conditions.reduce((prev, condition) => {
    const { fieldId } = condition;
    let group = prev[fieldId];
    if (!group) {
      group = prev[fieldId] = [];
    }
    group.push(condition);
    return prev;
  }, {} as { [fieldId: string]: IFilterCondition[] });

  // 2. 确定每个字段的对应筛选条件的最终 And 填充值
  for (const fieldId in conditionGroups) {
    const field = fieldMap[fieldId];
    if (!field) {
      continue;
    }

    const isComputedField = Field.bindContext(field, state).isComputed;
    if (isComputedField) {
      // 计算字段的单元格不需要填入默认值
      continue;
    }

    const conditionGroup = conditionGroups[fieldId];
    const isMultiValueField = Field.bindContext(field, state).isMultiValueField();
    const candidate = new Set<any>();

    // 2.1. 将所有条件的候选值都收集起来
    for (let i = 0, ii = conditionGroup.length; i < ii; i++) {
      const condition = conditionGroup[i];
      const currentValue = Field.bindContext(field, state).defaultValueForCondition(condition);
      if (currentValue == null) {
        continue;
      }

      // 多值类型的字段，需要将每个值都拆出来 unique。
      // TODO: 目前多值类型都是基础类型，所以采用 Set。后续有引用类型，需要改动
      if (isMultiValueField && Array.isArray(currentValue)) {
        currentValue.forEach(v => {
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

    // 没有候选值
    if (candidate.size === 0) {
      continue;
    }

    let result: ICellValue;
    if (isMultiValueField) {
      // 多值字段，可以把候选值都整一起
      result = [...candidate];
    } else if (candidate.size === 1) {
      // 单值字段，只有一个值的情况才能符合 And 条件
      result = candidate.values().next().value;
    } else {
      // 单值字段不止一个值，那肯定不符合 And 条件
      continue;
    }

    // 候选的默认值要能通过所有筛选条件才能再赋值。
    // 假设数字字段有两个筛选条件，=1 And < 0。
    // 通过上面的逻辑确认的候选值为 1。
    // 而 1 是无法通过 =1 And < 0 的，默认填充这个值不符合用户期望。
    const pass = conditionGroup.every(condition => doFilter(state, condition, field, result));
    if (pass) {
      // 不同字段的 And，只需要把有值的都赋值上去。
      recordData[fieldId] = result;
    }
  }
  return recordData;
}

export class DatasheetActions {
  /**
   * 为 table 添加 view
   */
  static addView2Action(
    snapshot: ISnapshot,
    payload: { view: IViewProperty, startIndex?: number },
  ): IJOTAction | null {
    const { view } = payload;
    let { startIndex } = payload;
    const views = snapshot.meta.views;
    if (views.length >= getMaxViewCountPerSheet()) {
      return null;
    }

    if (!views.every(viw => viw.id !== view.id)) {
      return null;
    }

    if (!(startIndex !== undefined && startIndex >= 0 && startIndex <= views.length)) {
      startIndex = views.length;
    }

    // 新增维格视图时，同时设置统计栏默认统计值
    const setDefaultFieldStat = (view: IViewProperty): IViewProperty => {
      if (view.type !== ViewType.Grid) return view;

      const newView = {
        ...view,
        columns: view.columns.map((col, i) => {
          if (i < 1) return { ...col, statType: StatType.CountAll };

          if ([FieldType.Number, FieldType.Currency].includes(snapshot.meta.fieldMap?.[col.fieldId]?.type)) {
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
   * 移动 views
   * @param {string} viewId
   */
  static moveView2Action = (
    snapshot: ISnapshot,
    payload: { viewId: string, target: number },
  ): IJOTAction | null => {
    const { viewId, target } = payload;
    const views = snapshot.meta.views;
    let index = -1;
    for (let i = 0, l = views.length; i < l; i++) {
      if (views[i].id === viewId) {
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
   * 基于 viewID 删除 view
   * @param {string} viewId
   */
  static deleteView2Action(
    snapshot: ISnapshot,
    payload: { viewId: string },
  ): IJOTAction | null {
    const views = snapshot.meta.views;
    const viewId = payload.viewId;
    // 判断是否当前是 activeView
    const viewIndex = findIndex(views, viw => viw.id === viewId);
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
   * 基于 viewID 更新 view
   * @param {string} viewId
   */
  static modifyView2Action(
    snapshot: ISnapshot,
    payload: { viewId: string, key: 'name' | 'description' | 'columns', value: string | IViewColumn[] },
  ): IJOTAction[] | null {
    const views = snapshot.meta.views;
    const { viewId, key, value } = payload;

    // 判断是否当前是 activeView
    const viewIndex = findIndex(views, viw => viw.id === viewId);
    if (viewIndex < 0) {
      return null;
    }

    if (key === 'columns' && Array.isArray(value)) {
      const rlt: IJOTAction[] = [];
      value.forEach(item => {
        const fieldId = item.fieldId;
        const view = views[viewIndex];
        const columns = view['columns'];
        const modifyColumnIndex = columns.findIndex(column => column.fieldId === fieldId);
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

    return [{
      n: OTActionName.ObjectReplace,
      p: ['meta', 'views', viewIndex, key],
      od: views[viewIndex][key],
      oi: value,
    }];
  }

  /**
   * 为 table 添加 Field
   */
  static addField2Action(
    snapshot: ISnapshot,
    payload: { field: IField, viewId?: string, index?: number, fieldId?: string, offset?: number, hiddenColumn?: boolean },
  ): IJOTAction[] | null {
    const fieldMap = snapshot.meta.fieldMap;
    const views = snapshot.meta.views;
    const { field, viewId, fieldId, offset, index, hiddenColumn } = payload;

    const actions = views.reduce<IJOTAction[]>((pre, cur, viewIndex) => {
      let columnIndex = cur.columns.length;
      if (cur.columns.some(column => column.fieldId === field.id)) {
        return pre;
      }
      // 对于复制产生的新增列，会传入 index，以传入的index为准
      if (viewId && index && viewId === cur.id) {
        columnIndex = index;
      }

      // 只有在指定 view 下，如果 fieldId 存在 则根据每个视图对应的 fieldId 计算 index
      if (fieldId) {
        const fieldIdIndex = cur.columns.findIndex(column => column.fieldId === fieldId);
        columnIndex = fieldIdIndex + (offset ?? 0);
      }

      const newColumn: IGridViewColumn = {
        fieldId: field.id,
      };
      if ([FieldType.Number, FieldType.Currency].includes(field.type)) {
        newColumn.statType = StatType.Sum;
      }

      // 视图新增列处理
      function viewColumnHandler() {
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
            // 当前视图默认显示 或 视图没有隐藏列时不隐藏
            if ((viewId && viewId === cur.id) || cur.columns.every(column => !column.hidden)) {
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
   * 删除 field
   */
  static deleteField2Action(
    snapshot: ISnapshot,
    payload: { fieldId: string, datasheetId: string, viewId?: string },
  ): IJOTAction[] | null {
    const fieldMap = snapshot.meta.fieldMap;
    const views = snapshot.meta.views;
    const { fieldId, datasheetId, viewId } = payload;

    // 删除所有 view 中的对应 columns 相关属性
    const actions = views.reduce<IJOTAction[]>((action, view, index) => {
      const columnIndex = view.columns.findIndex(column => column.fieldId === fieldId);

      if (columnIndex < 0) {
        return action;
      }

      const deleteGroupOrSortInfo = (type: 'groupInfo' | 'sortInfo') => {
        const info = type === 'groupInfo' ? view.groupInfo : view.sortInfo?.rules;
        if (info) {
          const infoIndex = info.findIndex(gp => gp.fieldId === fieldId);
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
          // 剩最后一个，要直接删掉 group/sort 字段
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
        // 这里的判断是为了处理视图锁的权限提示，比方说，视图 2 设置了字段 A 的筛选条件，我在视图 1 中删除了字段 A，因为视图 2 的视图锁会导致我的操作失败，
        // 从用户的角度看，他不可能删除一个字段前检查所有视图，并且关掉视图锁，所以这里的判断就是删除字段的同时，不删除被锁视图配置里的信息，而只是提示异常状态
        // 特殊的地方是对于关联表的操作，关联表的检查在中间层并不是很严格，只要求有节点的可编辑权限，因此关联表的操作可直接放行

        // 筛选中依赖的 field 也要被删除
        if (view.filterInfo) {
          const newConditions = view.filterInfo.conditions.filter(condition => {
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

      // 删除 columns
      action.push({
        n: OTActionName.ListDelete,
        p: ['meta', 'views', index, 'columns', columnIndex],
        ld: view.columns[columnIndex],
      });

      return action;
    }, []);

    const field = fieldMap[fieldId];
    if (field) {
      // 删除日期列数据时移除闹钟
      const recordMap = snapshot.recordMap;
      Object.keys(recordMap).forEach(recordId => {
        const alarm = Selectors.getDateTimeCellAlarm(snapshot, recordId, field.id);
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

  static setColumnWidth2Action = (
    snapshot: ISnapshot,
    payload: { viewId: string, fieldId: string, width: number | null },
  ): IJOTAction | null => {
    const { viewId, fieldId, width } = payload;
    const viewIndex = getViewIndex(snapshot, viewId);
    if (viewIndex < 0) {
      return null;
    }

    const view = snapshot.meta.views[viewIndex] as IGridViewProperty;
    const columnIndex = view.columns.findIndex(column => column.fieldId === fieldId);
    const column = view.columns[columnIndex];
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

  static moveColumns2Action = (
    snapshot: ISnapshot,
    payload: { fieldId: string, target: number, viewId: string },
  ): IJOTAction | null => {
    const { fieldId, target, viewId } = payload;

    const viewIndex = getViewIndex(snapshot, viewId);
    if (viewIndex < 0) {
      return null;
    }

    const view = snapshot.meta.views[viewIndex];
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

  /**
   * 设置 gridview 视图中的 column 的统计维度
   */
  static setColumnStatType2Action = (
    snapshot: ISnapshot,
    payload: { viewId: string, fieldId: string, statType?: StatType | null },
  ): IJOTAction | null => {
    const { fieldId, statType, viewId } = payload;

    const viewIndex = getViewIndex(snapshot, viewId);
    if (viewIndex < 0) {
      return null;
    }

    const view = snapshot.meta.views[viewIndex] as IGridViewProperty;
    const columnIndex = view.columns.findIndex(column => column.fieldId === fieldId);
    const column = view.columns[columnIndex];
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
   * 设置 gridview 视图中的行高
   */
  static setRowHeightLevel2Action = (
    snapshot: ISnapshot,
    payload: { viewId: string, level: RowHeightLevel },
  ): IJOTAction | null => {
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
   * 设置 Grid/Gantt 视图中的列头是否自动换行
   */
  static setAutoHeadHeight2Action = (
    snapshot: ISnapshot,
    payload: { viewId: string, isAuto: boolean },
  ): IJOTAction | null => {
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

  static setFrozenColumnCount2Action = (
    snapshot: ISnapshot,
    payload: { viewId: string, count: RowHeightLevel },
  ): IJOTAction | null => {
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
   * 为 table 添加 record
   */
  static addRecord2Action(
    snapshot: ISnapshot,
    payload: { viewId: string, record: IRecord, index: number },
  ): IJOTAction[] | null {
    const recordMap = snapshot.recordMap;
    const views = snapshot.meta.views;
    const { record, index, viewId } = payload;

    const actions = views.reduce<IJOTAction[]>((pre, cur, viewIndex) => {
      let rowIndex = cur.rows.length;
      if (cur.rows.some(row => row.recordId === record.id)) {
        return pre;
      }

      // 只有在激活的 view 才添加到指定的 index 处
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
   * 更新 record, 当返回 null 时表示该 record 不存在与当前 table 中或者值未变
   */
  static setRecord2Action(
    snapshot: ISnapshot,
    payload: {
      recordId: string,
      fieldId: string,
      value: ICellValue,
    },
  ): IJOTAction | null {
    const { recordId, fieldId, value } = payload;

    // recordId 在数据中不存在
    if (!snapshot.recordMap[recordId]) {
      return null;
    }
    // oldCellValue 不使用 getCellValue 直接拿数据实体，以免得到计算字段计算后的值
    const cv = snapshot.recordMap[recordId].data[fieldId];
    const oldCellValue = cv == null ? null : cv;

    // 非计算字段的时候，要检查数据是否未做任何修改
    if (isEqual(oldCellValue, value)) {
      return null;
    }

    // 当输入的 value 为空(空数组)的时候，实际上是要把fieldId key 一起干掉，避免冗余
    if (value == null || (Array.isArray(value) && value.length === 0)) {
      return {
        n: OTActionName.ObjectDelete,
        p: ['recordMap', recordId, 'data', fieldId],
        od: oldCellValue,
      };
    }

    // 当原来的 cellValue 为空的时候，实际上是要 insert 一条 fieldId key。
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
   * 根据 record id 删除 record
   */
  static deleteRecords(
    snapshot: ISnapshot,
    payload: {
      recordIds: string[],
      getFieldByFieldId(fieldId: string): IField,
      state: IReduxState
    },
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
     * 根据要删除的条数和要删除条数占总条数的比率来综合判断是一条一条删除(ld)，还是整体替换（or）
     * 当要删除的条数大于500或者删除条数占总条数的50%以上并且总条数在100条以上则整体替换，否则逐条删除
     */

    // 整体删除views的rows
    const rate = waitDeleteRecordSet.size / recordSize;
    if ((rate > 0.5 && recordSize > 100) || waitDeleteRecordSet.size > 500) {
      // 删除views中关联的record
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
      // 逐条删除
      actions = views.reduce<IJOTAction[]>((pre, cur, index) => {
        const toDelete = cur.rows.reduce<{ recordId: string, index: number }[]>((pre, row, i) => {
          if (waitDeleteRecordSet.has(row.recordId)) {
            pre.push({
              recordId: row.recordId,
              index: i,
            });
          }
          return pre;
        }, []).map<IJOTAction>((item, i) => {
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

    recordIds.forEach(recordId => {
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

        // 删除日期行数据时移除闹钟
        // TODO(kailang) ObjectDelete 已经做过这个处理
        Object.keys(fieldMap).forEach(fieldId => {
          if (fieldMap[fieldId].type === FieldType.DateTime) {
            const alarm = Selectors.getDateTimeCellAlarm(snapshot, recordId, fieldId);
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
   * 根据 record 设置闹钟
   */
  static setDateTimeCellAlarm(
    snapshot: ISnapshot,
    payload: {
      recordId: string,
      fieldId: string,
      alarm: IRecordAlarm | null,
    },
  ): IJOTAction[] | null {
    const { recordId, fieldId, alarm } = payload;
    const oldAlarm = Selectors.getDateTimeCellAlarm(snapshot, recordId, fieldId);

    // 新建闹钟
    if (!oldAlarm) {
      const fieldExtraMap = snapshot.recordMap[recordId]?.recordMeta?.fieldExtraMap;
      // 补偿 snapshot 中 fieldExtraMap 的默认数据
      let defaultAction;
      // 没有 fieldExtraMap
      if (!fieldExtraMap) {
        defaultAction = {
          n: OTActionName.ObjectInsert,
          p: ['recordMap', recordId, 'recordMeta', 'fieldExtraMap'],
          oi: {
            [fieldId]: {}
          },
        };
      } else if (!fieldExtraMap[fieldId]) { // 已有 fieldExtraMap 但是没有 fieldExtraMap[fieldId]
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
    // 删除闹钟
    if (!alarm) {
      return [{
        n: OTActionName.ObjectDelete,
        p: ['recordMap', recordId, 'recordMeta', 'fieldExtraMap', fieldId, 'alarm'],
        od: oldAlarm,
      }];
    }

    /**
     * 发现会有 alarm.alarmUsers 的长度为 0 的情况，原因待查，这里先做个判断
     */
    if (!alarm.alarmUsers?.length) {
      return null;
    }

    // 修改闹钟
    return [{
      n: OTActionName.ObjectReplace,
      p: ['recordMap', recordId, 'recordMeta', 'fieldExtraMap', fieldId, 'alarm'],
      od: oldAlarm,
      oi: alarm
    }];

  }

  static moveRow2Action = (
    snapshot: ISnapshot,
    payload: { recordId: string, target: number, viewId: string },
  ): IJOTAction | null => {
    const { recordId, target, viewId } = payload;
    const viewIndex = getViewIndex(snapshot, viewId);
    if (viewIndex < 0) {
      return null;
    }

    const view = snapshot.meta.views[viewIndex];
    const recordIndex = view.rows.findIndex(row => row.recordId === recordId);
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
    payload: { viewId: string, sortInfo?: ISortInfo, applySort?: boolean },
  ): IJOTAction[] | null {
    const { viewId, sortInfo, applySort } = payload;
    const viewIndex = getViewIndex(snapshot, viewId);
    if (viewIndex < 0) {
      return null;
    }

    const view = snapshot.meta.views[viewIndex];

    // 清空排序的时候，直接删除排序字段
    if (!sortInfo) {
      return [{
        n: OTActionName.ObjectDelete,
        p: ['meta', 'views', viewIndex, 'sortInfo'],
        od: view.sortInfo,
      }];
    }

    if (applySort) {
      // sort 方法会对数组进行突变(Mutate)，所以这里要提前复制一遍数组
      const rows = sortRowsBySortInfo(state, view.rows, sortInfo.rules, snapshot);

      return [{
        n: OTActionName.ObjectReplace,
        p: ['meta', 'views', viewIndex, 'sortInfo'],
        oi: sortInfo,
        od: view.sortInfo,
      }, {
        n: OTActionName.ObjectReplace,
        p: ['meta', 'views', viewIndex, 'rows'],
        oi: rows,
        od: view.rows,
      }];
    }

    return [{
      n: OTActionName.ObjectReplace,
      p: ['meta', 'views', viewIndex, 'sortInfo'],
      oi: sortInfo,
      od: view.sortInfo,
    }];
  }

  /**
   * 更新 Field, 直接替换 field
   */
  static setFieldAttr2Action = (
    snapshot: ISnapshot,
    payload: { field: IField },
  ): IJOTAction | null => {
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
   * 设置视图筛选 filterInfo
   */
  static setFilterInfo2Action = (
    snapshot: ISnapshot,
    payload: { viewId: string, filterInfo?: IFilterInfo },
  ): IJOTAction | null => {
    const viewId = payload.viewId;
    let filterInfo = payload.filterInfo;
    const viewIndex = getViewIndex(snapshot, viewId);
    if (viewIndex < 0) {
      return null;
    }
    const view = snapshot.meta.views[viewIndex];

    if (!validateFilterInfo(filterInfo)) {
      console.error('非法的筛选条件！');
      filterInfo = undefined;
    }

    if (isEqual(view.filterInfo, filterInfo)) {
      return null;
    }

    /**
     * 清空筛选的时候，直接删除筛选字段
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

  static setViewLockInfo2Action = (
    snapshot: ISnapshot,
    payload: { viewId: string, viewLockInfo: IViewLockInfo | null },
  ): IJOTAction | null => {
    const viewId = payload.viewId;
    const viewLock = payload.viewLockInfo;
    const viewIndex = getViewIndex(snapshot, viewId);

    if (viewIndex < 0) {
      return null;
    }
    const view = snapshot.meta.views[viewIndex];

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
      oi: viewLock
    };
  };

  static setGroupInfoField2Action = (
    snapshot: ISnapshot,
    payload: { viewId: string, groupInfo?: IGroupInfo },
  ): IJOTAction | null => {
    const { viewId, groupInfo } = payload;
    const viewIndex = getViewIndex(snapshot, viewId);

    if (viewIndex < 0) {
      return null;
    }

    const view = snapshot.meta.views[viewIndex];
    if (isEqual(view.groupInfo, groupInfo)) {
      return null;
    }

    compensator.setLastGroupInfoIfNull(view.groupInfo);

    /**
     * 清空分组的时候，直接删除分组字段
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
   * 产生新 viewId
   * @returns {string}
   */
  static getNewViewId(views: IViewProperty[]): string {
    return getNewId(IDPrefix.View, views.map(view => view.id));
  }

  /**
   * 生成新的 recordId
   * @returns {string}
   * @memberof Table
   */
  static getNewRecordId(recordMap: { [recordId: string]: IRecord }): string {
    return getNewId(IDPrefix.Record, Object.keys(recordMap));
  }

  /**
   * 生成新的 field Id
   * @returns {string}
   * @memberof Table
   */
  static getNewFieldId(fieldMap?: { [fieldId: string]: IField }): string {
    return getNewId(IDPrefix.Field, fieldMap && Object.keys(fieldMap));
  }

  /**
   * 返回 table 要新增的有默认值的 record
   */
  static getDefaultNewRecord(
    state: IReduxState,
    snapshot: ISnapshot,
    recordId: string,
    viewId?: string,
    groupCellValues?: ICellValue[],
    userInfo?: IUserInfo,
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
      const field = fieldMap[fieldId];
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

    const curFilterInfo = getFilterInfoExceptInvalid(state, view.filterInfo, snapshot.datasheetId);
    if (filterInfo && curFilterInfo) {
      filterInfo = {
        conjunction: curFilterInfo.conjunction,
        conditions: curFilterInfo.conditions.concat(filterInfo.conditions)
      };
    } else if (curFilterInfo) {
      filterInfo = curFilterInfo;
    }
    if (filterInfo) {
      const dataByFilter = getDefaultNewRecordDataByFilter(state, filterInfo, fieldMap, userInfo);
      Object.assign(record.data, dataByFilter);
    }

    return record;
  }

  static getDefaultFieldName(fieldMap: { [fieldId: string]: IField }): string {
    const names: string[] = [];
    for (const id in fieldMap) {
      names.push(fieldMap[id].name);
    }
    return getUniqName(NamePrefix.Field, names);
  }

  /**
   * 返回新生成的 view 名
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
    return getUniqName(prefix, views.map(view => view.name));
  }

  /**
   * 获取保持行列顺序的默认 View Property
   */
  static deriveDefaultViewProperty(
    snapshot: ISnapshot,
    viewType: ViewType,
    activeViewId: string | null | undefined,
  ): IViewProperty {
    const defaultProperty = getViewClass(viewType).generateDefaultProperty(snapshot, activeViewId);
    if (!defaultProperty) {
      throw Error(`Unexpected view type ${viewType}!`);
    }
    return defaultProperty;
  }

  /**
   * 获取 View 所有 Record 对应 FieldId 的数据
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
          recordIds = view.rows.map(view => view.recordId);
        }
      }
    }

    for (let i = 0; i < recordIds.length; i++) {
      const record = recordMap[recordIds[i]];
      const cellValue = getCellValue(state, snapshot, record.id, fieldId);
      if (isEntity || cellValue != null) {
        cellValues.push(cellValue);
      }
    }
    return cellValues;
  }

  // 生成新增 comment 的 action
  static insertComment2Action(
    state: IReduxState,
    options: {
      datasheetId: string;
      recordId: string;
      insertComments?: Omit<IComments, 'revision'>[],
    },
  ): IJOTAction[] | null {
    const { recordId, datasheetId, insertComments } = options;
    const recordMap = Selectors.getSnapshot(state, datasheetId)!.recordMap;
    const record: IRecord = recordMap[recordId];
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

  static updateComment2Action(
    options: {
      datasheetId: string;
      recordId: string;
      updateComments: IComments[];
      emojiAction?: boolean;
    },
  ): IJOTAction[] | null {
    const { recordId, updateComments, emojiAction } = options;
    const actions: IJOTAction[] = [];

    if (emojiAction) {
      // 新增
      actions.push(
        {
          n: OTActionName.ListInsert,
          // p 只验证更新 comment 的 emoji，没有其他地方使用
          p: ['recordMap', recordId, 'comments', 'emojis'],
          li: updateComments[0],
        }
      );
    } else {
      // 取消
      actions.push(
        {
          n: OTActionName.ListDelete,
          // p 只验证更新 comment 的 emoji，没有其他地方使用
          p: ['recordMap', recordId, 'comments', 'emojis'],
          ld: updateComments[0],
        }
      );
    }
    return actions;
  }

  static deleteComment2Action(
    options: {
      datasheetId: string;
      recordId: string;
      comments: IComments[];
    },
  ) {
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
      },
    );

    return actions;
  }

  static deleteWidgetPanel2Action(
    state: IReduxState,
    panelId: string,
    widgetPanels: IWidgetPanel[],
    resourceType: ResourceType.Mirror | ResourceType.Datasheet
  ): IJOTAction[] | null {
    if (!widgetPanels) {
      return null;
    }

    const index = widgetPanels.findIndex(item => {
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
      return [{
        n: OTActionName.ObjectInsert,
        p: ['meta', 'widgetPanels'],
        oi: [panel],
      }];
    }

    return [{
      n: OTActionName.ListInsert,
      p: ['meta', 'widgetPanels', widgetPanels.length + 1],
      li: panel,
    }];

  }

  static addWidgetPanelWithMirror2Action(snapshot: IMirrorSnapshot, panel: IWidgetPanel): IJOTAction[] | null {
    const widgetPanels = snapshot.widgetPanels;

    if (!Array.isArray(widgetPanels)) {
      return [{
        n: OTActionName.ObjectInsert,
        p: ['widgetPanels'],
        oi: [panel],
      }];
    }

    return [{
      n: OTActionName.ListInsert,
      p: ['widgetPanels', widgetPanels.length + 1],
      li: panel,
    }];

  }

  static modifyPanelName2Acton(
    state: IReduxState,
    newPanel: IWidgetPanel,
    widgetPanels: IWidgetPanel[],
    resourceType: ResourceType.Mirror | ResourceType.Datasheet
  ): IJOTAction[] | null {
    if (!widgetPanels) {
      return null;
    }

    const index = widgetPanels.findIndex(item => {
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
          od: widgetPanels[index].name,
          oi: newPanel.name,
        },
      ];
    }

    return [
      {
        n: OTActionName.ObjectReplace,
        p: ['meta', 'widgetPanels', index, 'name'],
        od: widgetPanels[index].name,
        oi: newPanel.name,
      },
    ];
  }

  static addWidgetToPanel2Action(state: IReduxState, { installationIndex, panelIndex, widgetId }): IJOTAction[] | null {

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

  static addWidgetToPanelWithMirror2Action(state: IReduxState, { installationIndex, panelIndex, widgetId }): IJOTAction[] | null {

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
    state: IReduxState,
    options: {
      widgetPanelIndex: number,
      widget: IWidgetInPanel,
      widgetIndex: number
    },
  ): IJOTAction[] {
    const { widgetPanelIndex, widgetIndex, widget } = options;
    return [{
      n: OTActionName.ListDelete,
      p: ['meta', 'widgetPanels', widgetPanelIndex, 'widgets', widgetIndex],
      ld: widget,
    }];
  }

  static deleteMirrorWidget2Action(
    state: IReduxState,
    options: {
      widgetPanelIndex: number,
      widget: IWidgetInPanel,
      widgetIndex: number
    },
  ): IJOTAction[] {
    const { widgetPanelIndex, widgetIndex, widget } = options;
    return [{
      n: OTActionName.ListDelete,
      p: ['widgetPanels', widgetPanelIndex, 'widgets', widgetIndex],
      ld: widget,
    }];
  }

  static changeWidgetHeight2Action(state: IReduxState, { widgetPanelIndex, widgetIndex, widgetHeight, datasheetId }): IJOTAction[] | null {
    const activeWidgetPanel = getResourceActiveWidgetPanel(state, datasheetId, ResourceType.Datasheet)!;
    const widget = activeWidgetPanel.widgets[widgetIndex];
    return [
      {
        n: OTActionName.ObjectReplace,
        p: ['meta', 'widgetPanels', widgetPanelIndex, 'widgets', widgetIndex, 'height'],
        oi: widgetHeight,
        od: widget.height,
      },
    ];

  }

  static moveWidget2Action(state: IReduxState, { widgetPanelIndex, layout, resourceType, resourceId }): IJOTAction[] | null {
    const widgetPanel = getResourceWidgetPanels(state, resourceId, resourceType);
    const oldLayout = widgetPanel?.[widgetPanelIndex]?.widgets;
    if (!oldLayout || layout.length !== oldLayout.length) {
      return null;
    }

    const actions: IJOTAction[] = [];

    const getPath = (widgetPanelIndex, index, key) => {
      const basePath = ['widgetPanels', widgetPanelIndex, 'widgets', index, key];
      return resourceType === ResourceType.Mirror ? basePath : ['meta', ...basePath];
    };

    oldLayout.forEach((oldPosition, index) => {
      const newPosition = layout[index];
      for (const k in newPosition) {
        const oldValue = oldPosition[k];
        const newValue = newPosition[k];
        if (oldValue !== newValue) {
          // 兼容老的小程序面板第一次设置 y 坐标属性，用 oi
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
            oi: newValue
          };
          actions.push(isFirstSetY ? insertAction : replaceAction);
        }
      }
    });
    return actions;
  }

  static manualSaveView2Action(snapshot: ISnapshot, payload: { viewId: string; viewProperty: ITemporaryView }): IJOTAction[] | null {
    const { viewId, viewProperty: serverView } = payload;
    const viewIndex = snapshot.meta.views.findIndex(view => view.id === viewId);

    if (viewIndex == null) {
      return null;
    }

    const localView = snapshot.meta.views[viewIndex];
    const action: IJOTAction[] = [];

    const integrationView = { ...omit(serverView, ViewPropertyFilter.ignoreViewProperty), ...omit(localView, ViewPropertyFilter.ignoreViewProperty) };
    for (const key in integrationView) {
      if (localView[key] === serverView[key]) {
        continue;
      }
      if (localView[key] && serverView[key]) {
        action.push({
          n: OTActionName.ObjectReplace,
          p: ['meta', 'views', viewIndex, key],
          oi: localView[key],
          od: serverView[key],
        });
      }
      if (localView[key] && !serverView[key]) {
        action.push({
          n: OTActionName.ObjectInsert,
          p: ['meta', 'views', viewIndex, key],
          oi: localView[key],
        });
      }
      if (!localView[key] && serverView[key]) {
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
    const viewIndex = snapshot.meta.views.findIndex(view => view.id === viewId);

    if (viewIndex == null) {
      return null;
    }

    const localView = snapshot.meta.views[viewIndex];
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
    const viewIndex = views.findIndex(view => view.id === viewId);

    if (viewIndex == null) {
      return null;
    }

    const view = views[viewIndex];

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
      od: view['autoSave']
    };
  }

  /**
   * 修改单向关联DstId
   * @param snapshot
   * @param payload
   */
  static changeOneWayLinkDstId2Action(snapshot: ISnapshot, payload: { fieldId: string, newField: IField }): IJOTAction | null {
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

}
