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

import { ExecuteResult, ICollaCommandDef, ILinkedActions } from 'command_manager';
import { IJOTAction } from 'engine';
import { Field } from 'model/field';
import { TextField } from 'model/field/text_field';
import { ViewType } from 'modules/shared/store/constants';
import { getViewById,getActiveDatasheetId,getSnapshot } from 'modules/database/store/selectors/resource/datasheet/base';
import { getVisibleColumns,getPermissions,getRangeFields } from 'modules/database/store/selectors/resource/datasheet/calc';
import { getSelectRanges } from 'modules/database/store/selectors/resource/datasheet/cell_range_calc';
import { IViewColumn } from '../../exports/store/interfaces';
import { FieldType, ResourceType } from 'types';
import { IField, IStandardValue } from 'types/field_types';
import { fastCloneDeep, NamePrefix } from '../../utils';
import { CollaCommandName } from '..';
import { addFields } from './add_fields';
import { setFieldAttr } from './set_field_attr';

export interface IPasteSetFieldsOptions {
  cmd: CollaCommandName.PasteSetFields;
  viewId: string;
  column: number;
  fields: Omit<IField, 'id'>[];
  stdValues: IStandardValue[][];
}

export const pasteSetFields: ICollaCommandDef<IPasteSetFieldsOptions> = {
  undoable: true,
  execute: (context, options) => {
    const { state: state } = context;
    const { viewId, column, stdValues } = options;
    const { fields } = options;
    const datasheetId = getActiveDatasheetId(state)!;

    const snapshot = getSnapshot(state, datasheetId);
    if (!snapshot) {
      return null;
    }

    const view = getViewById(snapshot, viewId);
    const actions: IJOTAction[] = [];
    const linkedActions: ILinkedActions[] = [];
    // Currently only the Grid view has paste
    if (!view || ![ViewType.Grid, ViewType.Gantt].includes(view.type)) {
      return null;
    }

    if (isNaN(column) || column < 0) {
      return null;
    }

    const fieldCount = fields.length;
    const visibleColumns = getVisibleColumns(state);
    const columnsToPaste = visibleColumns.slice(column, column + fieldCount);
    if (columnsToPaste.length === 0) {
      return null;
    }

    const fieldMap = snapshot.meta.fieldMap;
    const { fieldPropertyEditable, fieldCreatable } = getPermissions(state);

    function enrichColumnProperty(column: IViewColumn, stdValues: IStandardValue[]) {
      const oldField = fieldMap[column.fieldId]!;
      if (!fieldPropertyEditable) {
        return;
      }
      const newField = fastCloneDeep(oldField);
      if (newField.type === FieldType.Member) {
        return;
      }
      const newProperty = Field.bindContext(newField, state).enrichProperty(stdValues);
      if (newProperty === newField.property) {
        return;
      }
      const rst = setFieldAttr.execute(context, {
        cmd: CollaCommandName.SetFieldAttr,
        fieldId: column.fieldId,
        data: {
          ...newField,
          property: newProperty,
        },
      });
      if (rst && rst.result === ExecuteResult.Success) {
        actions.push(...rst.actions);
        rst.linkedActions && linkedActions.push(...rst.linkedActions);
      }
    }

    // In the case where only one cell is copied, enrich field property on the selection column
    const singleCellPaste = stdValues.length === 1 && stdValues[0]!.length === 1;
    if (singleCellPaste) {
      const ranges = getSelectRanges(state)!;
      const range = ranges[0]!;
      const fields = getRangeFields(state, range, datasheetId)!;
      let stdValue = stdValues[0]![0]!;
      const data = stdValue.data.filter(d => d.text);
      stdValue = { ...stdValue, data };
      for (const field of fields) {
        enrichColumnProperty({ fieldId: field.id }, [stdValue]);
      }
    } else {
      for (let i = 0, ii = columnsToPaste.length; i < ii; i++) {
        const column = columnsToPaste[i]!;
        const stdValueField = stdValues.reduce((result, stdValueRow) => {
          const stdValue = stdValueRow[i];
          if (stdValue) {
            const data = stdValue.data.filter(d => d.text);
            result.push({ ...stdValue, data });
          }
          return result;
        }, []);
        enrichColumnProperty(column, stdValueField);
      }
    }

    // have columns to expand
    let newFields = fields.slice(columnsToPaste.length);
    // Does not allow adding new columns without the fieldCreatable permission
    if (fieldCreatable && newFields.length > 0) {
      const fieldNames = new Set<string>();
      for (const fieldId in fieldMap) {
        fieldNames.add(fieldMap[fieldId]!.name);
      }
      newFields = newFields.map(field => {
        const originName = field.name;
        // The incoming fields may have fieldId. In order to ensure that it does not conflict with the id of the newly created field,
        // we force it to be deleted in this category.
        delete (field as any).id;
        let name = originName;
        let i = 1;
        if (!originName) {
          do {
            name = `${NamePrefix.Field} ${i++}`;
          } while (fieldNames.has(name));
        } else {
          while (fieldNames.has(name)) {
            name = `${originName} (${i++})`;
          }
        }
        fieldNames.add(name);
        if (field.type === FieldType.LookUp) {
          const relatedLinkFieldId = field.property.relatedLinkFieldId;
          if (!fieldMap[relatedLinkFieldId] || fieldMap[relatedLinkFieldId]!.type !== FieldType.Link) {
            return {
              name,
              type: FieldType.Text,
              property: TextField.defaultProperty(),
            };
          }
        }
        return {
          ...field,
          name,
        };
      });
      const rst = addFields.execute(context, {
        cmd: CollaCommandName.AddFields,
        data: newFields.map((field, index) => ({
          viewId: view.id,
          index: index + visibleColumns.length,
          data: field,
        })),
      });
      if (rst) {
        if (rst.result === ExecuteResult.Fail) {
          return rst;
        }
        actions.push(...rst.actions);
        rst.linkedActions && linkedActions.push(...rst.linkedActions);
      }
    }

    if (actions.length === 0) {
      return null;
    }

    return {
      result: ExecuteResult.Success,
      resourceId: datasheetId,
      resourceType: ResourceType.Datasheet,
      actions,
      linkedActions,
    };
  },
};

/*

 declare module 'command_manager/command_manager' {
 interface CollaCommandManager {
 execute(options: IPasteSetFieldsOptions & { cmd: 'PasteSetFields' }):
 ICollaCommandExecuteResult<IPasteSetFieldsOptions>;
 }
 }

 */
