import { ICollaCommandExecuteContext, ILinkedActions } from 'command_manager';
import { IJOTAction } from 'engine';
import { Strings, t } from 'i18n';
import { isEqual, keyBy } from 'lodash';
import { CreatedByField, DatasheetActions, Field, getFieldClass, handleEmptyCellValue, ICellValue, StatType, TextField } from 'model';
import { IReduxState, ISnapshot, Selectors, ViewType } from 'store';
import { KanbanStyleKey } from 'store/constants';
import { getDatasheet, getSnapshot } from 'store/selector';
import { FieldType, IField, ILinkField, ISelectField, readonlyFields } from 'types';
import { getNewId, getUniqName, IDPrefix, isSelectField } from 'utils';
import { KanbanView } from '../../model/views/kanban_view';

// 这里不能调 store！！

/**
 * 当列类型不改变的情况下，单选、多选类型要进行单元格值的清洗
 */
function changeFieldSetting(
  snapshot: ISnapshot,
  oldField: IField,
  newField: IField,
) {
  const actions: IJOTAction[] = [];
  if (newField.type !== oldField.type) {
    return actions;
  }

  switch (oldField.type) {
    case FieldType.MultiSelect:
    case FieldType.SingleSelect: {
      // 删除不存在选项的record
      const optionIdMap = keyBy((newField as ISelectField).property.options, 'id');
      for (const recordId in snapshot.recordMap) {
        const cellValue = snapshot.recordMap[recordId].data[newField.id];

        let convertValue = cellValue;
        if (Array.isArray(cellValue)) {
          convertValue = (cellValue as string[]).filter(cv => optionIdMap[cv]);
        } else if (cellValue && (!optionIdMap || !optionIdMap[cellValue as string])) {
          convertValue = null;
        }

        if (!isEqual(cellValue, convertValue)) {
          const action = DatasheetActions.setRecord2Action(snapshot, {
            recordId,
            fieldId: newField.id,
            value: convertValue,
          });
          action && actions.push(action);
        }
      }
      return actions;
    }
    case FieldType.Link: {
      // 切换关联的 datasheetId 的时候，需要清空掉单元格的值
      if (oldField.property.foreignDatasheetId !== (newField as ILinkField).property.foreignDatasheetId) {
        for (const recordId in snapshot.recordMap) {
          const cellValue = snapshot.recordMap[recordId].data[newField.id];
          if (cellValue) {
            const action = DatasheetActions.setRecord2Action(snapshot, {
              recordId,
              fieldId: newField.id,
              value: null,
            });
            action && actions.push(action);
          }
        }
      }
    }
  }

  return actions;
}

/**
 * 当列的类型发生变化的时候，执行通用数据转换逻辑
 */
function switchFieldRecordData(
  context: ICollaCommandExecuteContext,
  snapshot: ISnapshot,
  oldField: IField,
  newField: IField,
) {
  const { model: state, ldcMaintainer } = context;
  const actions: IJOTAction[] = [];
  // 转换成关联字段要对关联表进行关联数据同步
  // 只有有兄弟字段的关联字段才需要进行数据一致性维护
  const needCreateLinkData = newField.type === FieldType.Link && newField.property.brotherFieldId;
  // 计算字段之间相互转换，啥都不用干
  if (Field.bindContext(oldField, state).isComputed && Field.bindContext(newField, state).isComputed) {
    return {
      actions,
    };
  }

  for (const recordId in snapshot.recordMap) {
    const cellValue = Selectors.getCellValue(state, snapshot, recordId, newField.id);

    function setValue(convertValue: ICellValue) {
      const action = DatasheetActions.setRecord2Action(snapshot, {
        recordId,
        fieldId: newField.id,
        value: convertValue,
      });
      action && actions.push(action);
      if (needCreateLinkData) {
        const linkedSnapshot = getSnapshot(state, newField.property.foreignDatasheetId)!;
        ldcMaintainer && ldcMaintainer.insert(
          state,
          linkedSnapshot,
          recordId,
          newField as ILinkField,
          convertValue as string[],
          null,
        );
      }
    }

    if (cellValue != null) {
      // 新字段是计算字段，旧字段是实体字段则将原有值全部清空
      if (Field.bindContext(newField, state).isComputed) {
        setValue(null);
      } else {
        const stdVal = Field.bindContext(oldField, state).cellValueToStdValue(cellValue);
        let convertValue = Field.bindContext(newField, state).stdValueToCellValue(stdVal);
        convertValue = handleEmptyCellValue(convertValue, Field.bindContext(newField, state).basicValueType);
        // 否则转换原有单元格的值
        setValue(convertValue);
      }
    }

    // 修改日期列类型时删除闹钟
    if (oldField.type === FieldType.DateTime) {
      const alarm = Selectors.getDateTimeCellAlarm(snapshot, recordId, oldField.id);
      if (alarm) {
        const alarmActions = DatasheetActions.setDateTimeCellAlarm(snapshot, {
          recordId,
          fieldId: oldField.id,
          alarm: null,
        });
        if (alarmActions) {
          actions.push(...alarmActions);
        }
      }
    }
  }

  return {
    actions,
  };
}

/**
 * field 变动时要同步清除 view 上的相关属性。
 */
function clearViewAttribute(snapshot: ISnapshot, oldField: IField, newField: IField) {
  const actions: IJOTAction[] = [];
  snapshot.meta.views.forEach(view => {
    // 筛选条件清除
    if (newField.type !== oldField.type && view.filterInfo) {
      const filterInfo = view.filterInfo;
      const newConditions = filterInfo.conditions.filter(condition => {
        // 1. fieldId 不相同，表示不存在对应的关系，不需要删除
        if (condition.fieldId !== newField.id) {
          return true;
        }

        // 2. fieldId 相同，但是 fieldType 却不同，需要删除
        // 理论上来说，oldField.type 与 condition.fieldType 相等
        if (
          newField.type !== oldField.type ||
          newField.type !== condition.fieldType
        ) {
          return false;
        }

        // 3. 如果没有改变 fieldType，而且是单/多选类型，并且 condition 有选择选项
        if (
          newField.type === oldField.type &&
          newField.type === condition.fieldType &&
          isSelectField(newField) &&
          (Field.isFilterBelongFieldType(FieldType.SingleSelect, condition) ||
            Field.isFilterBelongFieldType(FieldType.MultiSelect, condition))
        ) {
          if (condition.value == null) {
            return false;
          }

          /*
           * 如果 condition 存在一个 option，
           * 而选择下拉框不存在这个 option,
           * 那么需要删除这个 condition
           */
          const selectField = newField;
          return condition.value.some(optionId => {
            return selectField.property.options.every(option => {
              return optionId !== option.id;
            });
          });
        }

        return true;
      });
      const action = DatasheetActions.setFilterInfo2Action(snapshot, {
        viewId: view.id,
        filterInfo: {
          conjunction: filterInfo.conjunction,
          conditions: newConditions,
        },
      });
      action && actions.push(action);
    }

    // 统计类型清除
    if (view.type === ViewType.Grid && newField.type !== oldField.type && !view.lockInfo) {
      let statType: StatType | undefined;
      // 转换为数字类型，自动为其设置为 StatType.Sum
      if (newField.type === FieldType.Number) {
        statType = StatType.Sum;
      }
      if (newField.type !== FieldType.Number) {
        statType = undefined;
      }
      const action = DatasheetActions.setColumnStatType2Action(snapshot, {
        viewId: view.id,
        fieldId: newField.id,
        statType,
      });
      action && actions.push(action);
    }

    // 看板的分组字段，如果转换了类型，或者将成员字段的多选打开，则应该清楚分组字段
    if (
      view.type === ViewType.Kanban &&
      view.style.kanbanFieldId === oldField.id &&
      (
        newField.type !== oldField.type || newField.property.isMulti
      )
    ) {
      const action = KanbanView.setViewStyle2Action(snapshot, {
        viewId: view.id,
        styleKey: KanbanStyleKey.KanbanFieldId,
        styleValue: null,
      });
      action && actions.push(action);
    }

    // Gird 视图需要考虑附件字段，已经设置为分组项的 field，转换成 附件 字段后应该被删除
    if (
      view.type === ViewType.Grid &&
      newField.type !== oldField.type &&
      newField.type === FieldType.Attachment &&
      view.groupInfo
    ) {
      const groupInfo = view.groupInfo!.filter(item => item.fieldId !== newField.id);
      if (groupInfo.length !== view.groupInfo.length) {
        const action = DatasheetActions.setGroupInfoField2Action(snapshot, {
          viewId: view.id,
          groupInfo,
        });
        action && actions.push(action);
      }
    }
  });
  return actions;
}

/**
 * 修改 field 之后，要对这一列所有的单元格数据执行转换逻辑
 * 使其符合 field 属性的要求，不能出现列单元格的值脱离列属性限制的情况
 */
export function createConvertActions(
  context: ICollaCommandExecuteContext,
  snapshot: ISnapshot,
  oldField: IField,
  newField: IField,
) {
  if (oldField.type === newField.type) {
    return {
      actions: changeFieldSetting(snapshot, oldField, newField),
    };
  }

  return switchFieldRecordData(context, snapshot, oldField, newField);
}

export function setField(
  context: ICollaCommandExecuteContext, snapshot: ISnapshot, oldField: IField, newField: IField, datasheetId?: string,
) {
  const state = context.model;
  const actions: IJOTAction[] = [];
  // 不同类型相互转换的时候，需要更新 property
  if (newField.type !== oldField.type) {
    const cellValues = DatasheetActions.getCellValuesByFieldId(state, snapshot, newField.id);
    const stdVals = cellValues.map(cv => {
      return Field.bindContext(oldField, state).cellValueToStdValue(cv);
    });
    const property = Field.bindContext(newField, state).enrichProperty(stdVals);
    newField.property = property;
    // 计算字段都需要通过field property 确定自己所在的 datasheet，在这里我们给他强行指定为当前 command 的 datasheetId
    if (Field.bindContext(newField, state).isComputed) {
      newField.property = {
        ...newField.property,
        datasheetId,
      };
    }
    if (newField.type === FieldType.CreatedBy || newField.type === FieldType.LastModifiedBy) {
      newField.property.uuids = (Field.bindContext(newField, state) as CreatedByField).getUuidsByRecordMap(snapshot.recordMap);
    }
  }

  const validateFieldPropertyError = Field.bindContext(newField, state).validateProperty().error;
  if (validateFieldPropertyError) {
    throw new Error(`${t(Strings.error_set_column_failed_bad_property)}: ${validateFieldPropertyError.details.map(d => d.message).join(',\n')}`);
  }

  // 修改字段时，若转换的目标字段是 计算字段 或 初始不可编辑 字段，
  // 对于 LastModifiedBy/LastModifiedTime 字段类型，需要更新 fieldIdCollection
  if (!readonlyFields.has(oldField.type) && readonlyFields.has(newField.type)) {
    const newActions = setAffectFieldAttr2Action(snapshot, newField.id);
    actions.push(...newActions);
  }

  const setFieldAction = DatasheetActions.setFieldAttr2Action(snapshot, { field: newField });
  setFieldAction && actions.push(setFieldAction);

  // 将 record 中的值进行类型转换
  const converted = createConvertActions(context, snapshot, oldField, newField);
  actions.push(...converted.actions);

  /**
   * field 被转换/删除之后，view 上面对应的功能比如筛选/分组等需要同步进行删除或者调整
   */
  actions.push(...clearViewAttribute(snapshot, oldField, newField));

  return {
    actions,
    linkedActions: undefined,
  };
}

export function createNewField(
  snapshot: ISnapshot,
  field: IField,
  options?: { viewId?: string; index?: number; fieldId?: string, offset?: number, hiddenColumn?: boolean }
) {
  if (!field.property) {
    field.property = getFieldClass(field.type).defaultProperty();
  }

  const action = DatasheetActions.addField2Action(snapshot, {
    viewId: options && options.viewId,
    index: options && options.index,
    fieldId: options && options.fieldId,
    offset: options && options.offset,
    hiddenColumn: options && options.hiddenColumn,
    field,
  });

  if (!action) {
    return [];
  }

  return action;
}

export function createNewBrotherField(state: IReduxState, newField: ILinkField, datasheetId: string): ILinkedActions | null {
  const currentDatasheet = getDatasheet(state, datasheetId)!;
  // 如果新 field 是关联的本表，则不需要进行任何操作
  if (newField.property.foreignDatasheetId === currentDatasheet.id) {
    return {
      datasheetId: '',
      actions: [],
    };
  }

  const foreignSnapshot = getSnapshot(state, newField.property.foreignDatasheetId)!;
  const foreignFieldMap = foreignSnapshot.meta.fieldMap;
  const foreignFieldIds = Object.keys(foreignSnapshot.meta.fieldMap);
  const foreignFieldNewId = getNewId(IDPrefix.Field, foreignFieldIds);
  newField.property = {
    ...newField.property,
    brotherFieldId: foreignFieldNewId,
  };

  /**
   * 在关联表创建一个互相为兄弟字段的 field。
   */
  const actions = createNewField(foreignSnapshot, {
    id: foreignFieldNewId,
    name: getUniqName(currentDatasheet.name, foreignFieldIds.map(id => foreignFieldMap[id].name)),
    type: FieldType.Link,
    property: {
      foreignDatasheetId: currentDatasheet.id,
      brotherFieldId: newField.id,
    },
  });

  return {
    datasheetId: newField.property.foreignDatasheetId,
    actions,
  };
}

export function clearOldBrotherField(
  context: ICollaCommandExecuteContext, oldField: ILinkField, deleteField?: boolean,
): ILinkedActions | null {
  const { model: state } = context;

  // 如果旧 field 并没有关联一个兄弟字段，不需要进行额外操作
  if (!oldField.property.brotherFieldId) {
    return {
      datasheetId: '',
      actions: [],
    };
  }

  const foreignSnapshot = getSnapshot(state, oldField.property.foreignDatasheetId);
  if (!foreignSnapshot) {
    return null;
  }

  const foreignFieldMap = foreignSnapshot.meta.fieldMap;
  const foreignOldField = foreignFieldMap[oldField.property.brotherFieldId] as ILinkField;

  if (!foreignOldField || foreignOldField.property.brotherFieldId !== oldField.id) {
    return null;
  }

  if (deleteField) {
    // 删除 field
    const actions = DatasheetActions.deleteField2Action(foreignSnapshot, {
      fieldId: oldField.property.brotherFieldId, datasheetId: state.pageParams.datasheetId!
    });

    return actions ? {
      datasheetId: oldField.property.foreignDatasheetId,
      actions,
    } : null;
  }

  /**
   * 给关联表的兄弟link字段转换成 text 类型。
   */
  return {
    datasheetId: oldField.property.foreignDatasheetId,
    actions: setField(context, foreignSnapshot, foreignOldField, {
      id: foreignOldField.id,
      name: foreignOldField.name,
      type: FieldType.Text,
      property: TextField.defaultProperty(),
    }).actions,
  };
}

/**
 * 对于部分类型的字段，可能需要在其他列变更时做相应操作，
 * 暂时只提供了对于 LastModifiedBy/LastModifiedTime 类型所需要的操作
 */
export function setAffectFieldAttr2Action(snapshot: ISnapshot, fieldId: string) {
  const actions: IJOTAction[] = [];
  const fieldMap = snapshot.meta?.fieldMap;

  fieldMap && Object.values(fieldMap).forEach(field => {
    switch (field.type) {
      case FieldType.LastModifiedBy:
      case FieldType.LastModifiedTime: {
        const fieldIdCollection = field.property.fieldIdCollection.slice();
        const index = fieldIdCollection.indexOf(fieldId);
        if (index > -1) {
          fieldIdCollection.splice(index, 1);
          const newField = {
            ...field,
            property: {
              ...field.property,
              fieldIdCollection,
            },
          };
          const action = DatasheetActions.setFieldAttr2Action(snapshot, { field: newField as IField });
          action && actions.push(action);
        }
        break;
      }
      default:
        break;
    }
  });
  return actions;
}

export interface IInternalFix {
  anonymouFix?: boolean;
  fixUser?: {
    userId: string,
    uuid: string
  };
  selfCreateNewField?: boolean;
  changeOneWayLinkDstId?: boolean;
  // 单向关联转换为文本时 - 清理单向关联单元格内容
  clearOneWayLinkCell?: boolean;
}
