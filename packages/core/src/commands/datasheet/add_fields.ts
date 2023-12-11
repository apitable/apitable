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

import { ICollaCommandDef, ILinkedActions } from 'command_manager/command';
import { ExecuteResult } from 'command_manager/types';
import { IJOTAction } from 'engine';
import { IGridViewProperty } from '../../exports/store/interfaces';
import { getActiveDatasheetId, getSnapshot, getDatasheet } from 'modules/database/store/selectors/resource/datasheet/base';

import { FieldType, IField } from 'types/field_types';
import { getNewIds, IDPrefix } from 'utils';
import { createNewBrotherField, createNewField, IInternalFix } from '../common/field';
import { fixOneWayLinkDstId } from '..';
import { CollaCommandName } from '../enum';
import { Field } from 'model/field';
import { CreatedByField } from 'model/field/created_by_field';
import { getMaxFieldCountPerSheet } from 'model/utils';
import { DatasheetActions } from 'commands_actions/datasheet';
import { Strings, t } from '../../exports/i18n';
import { ResourceType } from 'types';
import { ISetRecordOptions, setRecords } from './set_records';

export interface IAddFieldOptions {
  viewId?: string;
  index: number;
  data: Omit<IField, 'id'> & { id?: string };
  // The fieldId that triggers the operation of adding a new column
  fieldId?: string;
  // Offset relative to fieldId position
  offset?: number;
  // whether to hide this newly created field
  hiddenColumn?: boolean;
  // force hidden
  forceColumnVisible?: boolean;
}

export interface IAddFieldsOptions {
  cmd: CollaCommandName.AddFields;
  data: IAddFieldOptions[];
  resourceType?: ResourceType,
  datasheetId?: string;
  resourceId?: string;
  copyCell?: boolean;
  fieldId?: string;
  internalFix?: IInternalFix;
}

type IAddFieldResult = string;
export const addFields: ICollaCommandDef<IAddFieldsOptions, IAddFieldResult> = {
  undoable: true,

  execute: (context, options) => {
    const { state: state } = context;
    const activeDatasheetId = options.datasheetId ?? getActiveDatasheetId(state)!;
    const datasheetId = activeDatasheetId;
    const { data, copyCell, internalFix, fieldId } = options;
    const snapshot = getSnapshot(state, activeDatasheetId);
    const recordMap = snapshot!.recordMap;

    const maxFieldCountPerSheet = getMaxFieldCountPerSheet();

    if (!snapshot || data.length === 0) {
      return null;
    }
    const isOverLimit = data.length + snapshot.meta.views[0]!.columns.length > maxFieldCountPerSheet;
    if (isOverLimit) {
      throw new Error(
        t(Strings.columns_count_limit_tips, {
          column_limit: maxFieldCountPerSheet,
        }),
      );
    }
    const newFieldIds = getNewIds(IDPrefix.Field, data.length, Object.keys(snapshot.meta.fieldMap));
    const frozenCountMap = new Map();

    let newFieldId = '';
    const linkedActions: ILinkedActions[] = [];
    const actions = data.reduce<IJOTAction[]>((collected, fieldOption, index) => {
      newFieldId = newFieldIds[index]!;
      const { index: columnIndex, viewId } = fieldOption;
      const view = snapshot.meta.views.find((view) => view.id === viewId);
      const frozenColumnCount = (view as IGridViewProperty)?.frozenColumnCount;

      // special handling for associated fields
      // When the table associated with the newly added associated field cannot be queried in the state,
      // an association cannot be established at this time.
      // Here we convert this field directly to a text field.
      if (fieldOption.data.type === FieldType.Link && !getDatasheet(state, fieldOption.data.property.foreignDatasheetId)) {
        fieldOption = {
          ...fieldOption,
          data: {
            ...fieldOption.data,
            type: FieldType.Text,
            property: null,
          },
        };
      }

      const field = {
        ...fieldOption.data,
        id: fieldOption.data.id ? fieldOption.data.id : newFieldId,
        property: fieldOption.data.property,
      } as IField;

      // Calculated fields need to determine their own datasheet through the field property,
      // here we force him to specify the datasheetId of the current command
      if (Field.bindContext(field, state).isComputed) {
        field.property = {
          ...field.property,
          datasheetId,
        };
      }

      if (field.type === FieldType.Link) {
        field.property = { ...field.property, brotherFieldId: undefined };
        const linkedAction = createNewBrotherField(state, field, datasheetId);
        linkedAction && linkedActions.push(linkedAction);
      }

      // AutoNumber needs to record the current view index
      if (field.type === FieldType.AutoNumber) {
        const datasheet = getDatasheet(state, datasheetId);
        const viewIdx = snapshot.meta.views.findIndex((item) => item.id === datasheet?.activeView) || 0;
        field.property = { ...field.property, viewIdx };
      }

      if (field.type === FieldType.CreatedBy || field.type === FieldType.LastModifiedBy) {
        const uuids = (Field.bindContext(field, state) as CreatedByField).getUuidsByRecordMap(recordMap);
        field.property = { ...field.property, uuids };
      }

      const selfCreateNewField = internalFix?.selfCreateNewField ?? true;
      // Special repair one-way association, if False, this table does not create a new field
      if (selfCreateNewField) {
        const action = createNewField(snapshot, field, fieldOption);

        collected.push(...action);
      }

      if (copyCell) {
        const recordData = Object.keys(recordMap).reduce<ISetRecordOptions[]>((data, recordId) => {
          if (!fieldId) return data;
          const value = recordMap[recordId]!.data[fieldId];

          if (!value) return data;
          data.push({
            recordId,
            fieldId: newFieldId,
            field,
            value,
          });

          return data;
        }, []);

        const ret = setRecords.execute(context, {
          cmd: CollaCommandName.SetRecords,
          data: recordData,
          internalFix: internalFix,
        });

        if (ret && ret.result === ExecuteResult.Success) {
          collected.push(...ret.actions);
        }
      }

      if (internalFix?.changeOneWayLinkDstId && linkedActions.length) {
        const fixOneWayLinkData = {
          oldBrotherFieldId: snapshot.meta.fieldMap[fieldId!]!.property.brotherFieldId,
          newBrotherFieldId: linkedActions[0]!.actions[0]!['li']['fieldId'],
        };
        linkedActions[0]!.actions[linkedActions[0]!.actions.length - 1]!['oi'].property.brotherFieldId = fieldId;
        // Fix one-way association column DstId
        const result = fixOneWayLinkDstId.execute(context, {
          cmd: CollaCommandName.FixOneWayLinkDstId,
          data: [fixOneWayLinkData],
          datasheetId: datasheetId,
          fieldId: fieldId!,
        });

        if (result && result.result === ExecuteResult.Success) {
          collected.push(...result.actions);
        }
      }

      if (frozenColumnCount && columnIndex < frozenColumnCount) {
        const count = (frozenCountMap.get(viewId) || frozenColumnCount) + 1;
        const action = DatasheetActions.setFrozenColumnCount2Action(snapshot, { viewId: viewId!, count: count });

        if (action) {
          frozenCountMap.set(viewId, frozenColumnCount + 1);
          collected.push(action);
        }
      }

      return collected;
    }, []);

    if (actions.length === 0) {
      return null;
    }

    return {
      result: ExecuteResult.Success,
      resourceId: datasheetId,
      resourceType: ResourceType.Datasheet,
      data: newFieldId,
      actions,
      datasheetId,
      linkedActions,
    };
  },
};

/*

 declare module 'command_manager/command_manager' {
 interface CollaCommandManager {
 execute(options: IAddFieldsOptions & { cmd: 'AddFields' });
 }
 }

 */
