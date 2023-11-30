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

import { ExecuteResult, ICollaCommandDef, ICollaCommandExecuteContext, ILinkedActions } from 'command_manager';
import { isEqual } from 'lodash';
import {
  getActiveDatasheetId,
  getSnapshot,
} from 'modules/database/store/selectors/resource/datasheet/base';
import { ISnapshot } from '../../exports/store/interfaces';
import { getDatasheet } from 'modules/database/store/selectors/resource/datasheet/base';
import { getFieldMap } from 'modules/database/store/selectors/resource/datasheet/calc';
import { FieldType, IField } from 'types/field_types';
import { IJOTAction } from 'engine';
import { Strings, t } from '../../exports/i18n';
import { ResourceType } from 'types';
import { CollaCommandName } from 'commands/enum';
import { clearOldBrotherField, createNewBrotherField, IInternalFix, setField } from '../common/field';
import { Field } from 'model/field';
import { DatasheetActions } from 'commands_actions/datasheet';

export interface ISetFieldAttrOptions {
  cmd: CollaCommandName.SetFieldAttr;
  datasheetId?: string;
  fieldId: string;
  deleteBrotherField?: boolean;
  data: IField;
  internalFix?: IInternalFix;
}

function generateLinkedFieldActions(
  context: ICollaCommandExecuteContext, snapshot: ISnapshot,
  oldField: IField, newField: IField, datasheetId: string, deleteBrotherField?: boolean,
  internalFix?: IInternalFix,
): { actions: IJOTAction[], linkedActions?: ILinkedActions[] } {
  const actions: IJOTAction[] = [];
  const linkedActions: ILinkedActions[] = [];
  const { state: state } = context;
  if (oldField.type === FieldType.Link && newField.type === FieldType.Link) {
    // If the associated table id has not changed, no related operations are required.
    if (oldField.property.foreignDatasheetId === newField.property.foreignDatasheetId) {
      return setField(context, snapshot, oldField, newField, datasheetId);
    }
  }

  if (oldField.type === FieldType.Link) {
    const clearedActions = clearOldBrotherField(context, oldField, deleteBrotherField);
    clearedActions && linkedActions.push(clearedActions);
  }

  if (newField.type === FieldType.Link) {
    const createdActions = createNewBrotherField(state, newField, datasheetId);
    createdActions && linkedActions.push(createdActions);
  }

  if (FieldType.Text === newField.type && internalFix?.clearOneWayLinkCell) {
    const fieldId = oldField.id;
    // Clean up the content of the one-way association cell
    if (snapshot.meta.fieldMap[fieldId]) {
      for (const recordId in snapshot.recordMap) {
        const action = DatasheetActions.setRecord2Action(snapshot, { recordId, fieldId, value: null });
        action && actions.push(action);
      }
    }
  }

  const newFieldData = setField(context, snapshot, oldField, newField, datasheetId);
  actions.push(...newFieldData.actions);
  return { actions: actions, linkedActions };
}

export const setFieldAttr: ICollaCommandDef<ISetFieldAttrOptions> = {
  undoable: true,

  execute: (context, options) => {
    const { state: state } = context;
    const activeDatasheetId = getActiveDatasheetId(state)!;
    const { fieldId, datasheetId = activeDatasheetId, deleteBrotherField, internalFix } = options;
    const newField = { ...options.data };
    const snapshot = getSnapshot(state, datasheetId);
    if (!snapshot || fieldId !== newField.id) {
      return null;
    }

    const fieldMap = getFieldMap(state, datasheetId)!;
    const oldField = fieldMap[fieldId];
    if (!oldField) {
      return null;
    }
    /* Check for duplicate names */
    const duplicate = Object.values(fieldMap).some(f => {
      return f.id !== options.fieldId && f.name === options.data.name;
    });
    if (duplicate) {
      throw new Error(t(Strings.error_set_column_failed_duplicate_column_name));
    }

    if (
      oldField.type === FieldType.NotSupport ||
      newField.type === FieldType.NotSupport
    ) {
      throw new Error(t(Strings.error_set_column_failed_no_support_unknown_column));
    }

    if (
      oldField.type === newField.type &&
      oldField.name === newField.name &&
      oldField.desc === newField.desc &&
      oldField.required === newField.required &&
      isEqual(oldField.property, newField.property)
    ) {
      return null;
    }

    // Compatible with errors caused by defaultValue of some online fields being null
    if (
      [FieldType.Currency, FieldType.Percent, FieldType.Number].includes(newField.type) &&
      newField.property.defaultValue === null
    ) {
      newField.property = { ...newField.property, defaultValue: '' };
    }

    // AutoNumber needs to record the current view index
    if (newField.type === FieldType.AutoNumber) {
      const datasheet = getDatasheet(state);
      const viewIdx = snapshot.meta.views.findIndex(item => item.id === datasheet?.activeView) || 0;
      newField.property = { ...newField.property, viewIdx };
    }

    // Ensure that the properties of the following fields must have datasheetId
    if (
      !newField.property?.datasheetId &&
      [FieldType.AutoNumber, FieldType.CreatedBy, FieldType.CreatedTime, FieldType.LastModifiedBy, FieldType.LastModifiedTime].includes(newField.type)
    ) {
      newField.property = { ...newField.property, datasheetId };
    }

    // When modifying the associated field, it is necessary to maintain the sibling field data of the associated table
    if (oldField.type === FieldType.Link || newField.type === FieldType.Link) {
      const validateFieldPropertyError = Field.bindContext(newField, state).validateProperty().error;
      if (validateFieldPropertyError) {
        throw new Error(`${t(Strings.error_set_column_failed_bad_property)}: ${validateFieldPropertyError.details.map(d => d.message).join(',\n')}`);
      }
      const result = generateLinkedFieldActions(context, snapshot, oldField, newField, datasheetId, deleteBrotherField, internalFix);
      const linkedActions = result.linkedActions || [];

      return {
        result: ExecuteResult.Success,
        resourceId: datasheetId,
        resourceType: ResourceType.Datasheet,
        actions: result.actions,
        linkedActions,
      };
    }

    return {
      result: ExecuteResult.Success,
      resourceId: datasheetId,
      resourceType: ResourceType.Datasheet,
      actions: setField(context, snapshot, oldField, newField, datasheetId).actions,
    };
  },
};
