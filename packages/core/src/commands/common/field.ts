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

import { ICollaCommandExecuteContext, ILinkedActions } from 'command_manager';
import { IJOTAction } from 'engine';
import { Strings, t } from '../../exports/i18n';
import { isEqual, keyBy } from 'lodash';
import { Field } from 'model/field';
import { DatasheetActions } from 'commands_actions/datasheet';
import { CreatedByField } from 'model/field/created_by_field';
import { StatType } from 'model/field/stat';
import { TextField } from 'model/field/text_field';
import { getFieldClass } from 'model/field';
import { handleEmptyCellValue } from 'model/utils';
import { ICellValue } from 'model/record';
import { IReduxState, ISnapshot } from '../../exports/store/interfaces';
import { ViewType } from 'modules/shared/store/constants';
import { getDateTimeCellAlarm } from 'modules/database/store/selectors/resource/datasheet/calc';
import { getCellValue } from 'modules/database/store/selectors/resource/datasheet/cell_calc';
import { KanbanStyleKey } from '../../modules/shared/store/constants';
import { getDatasheet, getSnapshot } from 'modules/database/store/selectors/resource/datasheet/base';
import { FieldType, IField, ILinkField, ISelectField, readonlyFields } from 'types';
import { getNewId, getUniqName, IDPrefix, isSelectField } from 'utils';
import { ViewAction } from 'commands_actions/view';

// The store cannot be called here! !

/**
  * When the column type does not change, the single-selection and multi-selection types need to clean the cell values
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
      // delete records without options
      const optionIdMap = keyBy((newField as ISelectField).property.options, 'id');
      for (const recordId in snapshot.recordMap) {
        const cellValue = snapshot.recordMap[recordId]!.data[newField.id];

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
            // TODO what if convertValue is null ? value does not accept null
            value: convertValue!,
          });
          action && actions.push(action);
        }
      }
      return actions;
    }
    case FieldType.OneWayLink:
    case FieldType.Link: {
      // When switching the associated datasheetId, you need to clear the value of the cell
      if (oldField.property.foreignDatasheetId !== (newField as ILinkField).property.foreignDatasheetId) {
        for (const recordId in snapshot.recordMap) {
          const cellValue = snapshot.recordMap[recordId]!.data[newField.id];
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
      return actions;
    }
    // Score type row score cannot be greater than the maximum value
    case FieldType.Rating: {
      if (newField.property.max < oldField.property.max) {
        for (const recordId in snapshot.recordMap) {
          const cellValue = snapshot.recordMap[recordId]!.data[newField.id];
          if (cellValue && cellValue > newField.property.max) {
            const action = DatasheetActions.setRecord2Action(snapshot, {
              recordId,
              fieldId: newField.id,
              value: newField.property.max,
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
 * Execute general data conversion logic when the type of the column changes
 */
function switchFieldRecordData(
  context: ICollaCommandExecuteContext,
  snapshot: ISnapshot,
  oldField: IField,
  newField: IField,
) {
  const { state: state, ldcMaintainer } = context;
  const actions: IJOTAction[] = [];
  // Converted into an associated field to synchronize the associated data of the associated table
  // Only related fields with sibling fields need data consistency maintenance
  const needCreateLinkData = newField.type === FieldType.Link && newField.property.brotherFieldId;
  // Convert between computed fields without doing anything
  if (Field.bindContext(oldField, state).isComputed && Field.bindContext(newField, state).isComputed) {
    return {
      actions,
    };
  }

  for (const recordId in snapshot.recordMap) {
    const cellValue = getCellValue(state, snapshot, recordId, newField.id);

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
      // The new field is a calculated field, and the old field is an entity field, then all the original values are cleared
      if (Field.bindContext(newField, state).isComputed) {
        setValue(null);
      } else {
        const stdVal = Field.bindContext(oldField, state).cellValueToStdValue(cellValue);
        let convertValue = Field.bindContext(newField, state).stdValueToCellValue(stdVal);
        convertValue = handleEmptyCellValue(convertValue, Field.bindContext(newField, state).basicValueType);
        // Otherwise convert the value of the original cell
        setValue(convertValue);
      }
    }

    // delete the alarm when modifying the date column type
    if (oldField.type === FieldType.DateTime) {
      const alarm = getDateTimeCellAlarm(snapshot, recordId, oldField.id);
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
 * When the field changes, the related properties on the view should be cleared synchronously.
 */
function clearViewAttribute(snapshot: ISnapshot, oldField: IField, newField: IField) {
  const actions: IJOTAction[] = [];
  snapshot.meta.views.forEach(view => {
    // filter condition clear
    if (newField.type !== oldField.type && view.filterInfo) {
      const filterInfo = view.filterInfo;
      const newConditions = filterInfo.conditions.filter(condition => {
        // 1. The fieldId is not the same, indicating that there is no corresponding relationship, and no need to delete
        if (condition.fieldId !== newField.id) {
          return true;
        }

        // 2. The fieldId is the same, but the fieldType is different and needs to be deleted
        // In theory, oldField.type is equal to condition.fieldType
        if (
          newField.type !== oldField.type ||
          newField.type !== condition.fieldType
        ) {
          return false;
        }

        // 3. If the fieldType is not changed, and it is a single/multiple selection type, and the condition has selection options
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
           * If condition has an option,
           * And the selection drop-down box does not exist this option,
           * Then you need to delete this condition
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

    // Statistics type clear
    if (view.type === ViewType.Grid && newField.type !== oldField.type && !view.lockInfo) {
      let statType: StatType | undefined;
      // Convert to numeric type, automatically set it to StatType.Sum
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

    // The grouping field of the kanban board, if the type is converted,
    // or the multi-selection of the member field is turned on, the grouping field should be clear
    if (
      view.type === ViewType.Kanban &&
      view.style.kanbanFieldId === oldField.id &&
      (
        newField.type !== oldField.type || newField.property.isMulti
      )
    ) {
      const action = ViewAction.setViewStyle2Action(snapshot, {
        viewId: view.id,
        styleKey: KanbanStyleKey.KanbanFieldId,
        styleValue: null,
      });
      action && actions.push(action);
    }

    // The Grid view needs to consider the attachment field.
    // The field that has been set as a grouping item should be deleted after being converted into an attachment field.
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
 * After modifying the field, perform conversion logic on all cell data in this column
 * Make it meet the requirements of the field attribute, and the value of the column cell cannot be out of the limit of the column attribute
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
  const state = context.state;
  const actions: IJOTAction[] = [];
  // When different types are converted to each other, the property needs to be updated
  if (newField.type !== oldField.type) {
    const cellValues = DatasheetActions.getCellValuesByFieldId(state, snapshot, newField.id);
    const stdVals = cellValues.map(cv => {
      return Field.bindContext(oldField, state).cellValueToStdValue(cv);
    });
    const property = Field.bindContext(newField, state).enrichProperty(stdVals);
    newField.property = property;
    // Calculated fields need to determine their own datasheet through the field property,
    // here we force him to specify the datasheetId of the current command
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

  // When modifying a field, if the target field of the conversion is a calculated field or an initial non-editable field,
  // For LastModifiedBy/LastModifiedTime field type, fieldIdCollection needs to be updated
  if (!readonlyFields.has(oldField.type) && readonlyFields.has(newField.type)) {
    const newActions = setAffectFieldAttr2Action(snapshot, newField.id);
    actions.push(...newActions);
  }

  const setFieldAction = DatasheetActions.setFieldAttr2Action(snapshot, { field: newField });
  setFieldAction && actions.push(setFieldAction);

  // Convert the value in record to type
  const converted = createConvertActions(context, snapshot, oldField, newField);
  actions.push(...converted.actions);

  /**
   * After the field is converted/deleted, the corresponding functions on the view,
   * such as filtering/grouping, need to be deleted or adjusted synchronously
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
  options?: { viewId?: string; index?: number; fieldId?: string, offset?: number, hiddenColumn?: boolean, forceColumnVisible?: boolean }
) {
  if (!field.property) {
    // @ts-ignore
    field.property = getFieldClass(field.type).defaultProperty();
  }

  const action = DatasheetActions.addField2Action(snapshot, {
    viewId: options && options.viewId,
    index: options && options.index,
    fieldId: options && options.fieldId,
    offset: options && options.offset,
    hiddenColumn: options && options.hiddenColumn,
    forceColumnVisible: options?.forceColumnVisible,
    field,
  });

  if (!action) {
    return [];
  }

  return action;
}

export function createNewBrotherField(state: IReduxState, newField: ILinkField, datasheetId: string): ILinkedActions | null {
  const currentDatasheet = getDatasheet(state, datasheetId)!;
  // If the new field is the associated table, no action is required
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
   * Create a field that is a sibling field of each other in the associated table.
   */
  const actions = createNewField(foreignSnapshot, {
    id: foreignFieldNewId,
    name: getUniqName(currentDatasheet.name, foreignFieldIds.map(id => foreignFieldMap[id]!.name)),
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
  const { state: state } = context;

  // If the old field is not associated with a sibling field, no additional operations are required
  if (!oldField.property?.brotherFieldId) {
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

  if (!foreignOldField || foreignOldField.property?.brotherFieldId !== oldField.id) {
    return null;
  }

  if (deleteField) {
    // delete field
    const actions = DatasheetActions.deleteField2Action(foreignSnapshot, {
      fieldId: oldField.property.brotherFieldId, datasheetId: state.pageParams.datasheetId!
    });

    return actions ? {
      datasheetId: oldField.property.foreignDatasheetId,
      actions,
    } : null;
  }

  /**
   * Convert the sibling link field of the associated table to text type.
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
 * For some types of fields, it may be necessary to perform corresponding operations when other columns are changed.
 * Temporarily only provides operations required for LastModifiedBy/LastModifiedTime types
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
  // When a one-way association is converted to text - clean up the one-way association cell content
  clearOneWayLinkCell?: boolean;
}
