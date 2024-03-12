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
import { CollaCommandName } from 'commands/enum';
import { clearOldBrotherField, setAffectFieldAttr2Action } from 'commands/common/field';
import { IJOTAction, jot } from 'engine';
import { Strings, t } from '../../exports/i18n';
import { DatasheetActions } from 'commands_actions/datasheet';
import {
  getActiveDatasheetId,
  getSnapshot,
} from 'modules/database/store/selectors/resource/datasheet/base';
import { FieldType, ResourceType } from 'types';

export interface IDeleteFieldOptions {
  cmd: CollaCommandName.DeleteField;
  data: IDeleteFieldData[];
  datasheetId?: string;
}

export interface IDeleteFieldData {
  deleteBrotherField?: boolean;
  fieldId: string;
}

export const deleteField: ICollaCommandDef<IDeleteFieldOptions> = {
  undoable: true,

  execute: (context, options) => {
    const { state: state } = context;
    const { data, datasheetId: _datasheetId } = options;
    const datasheetId = options.datasheetId ?? getActiveDatasheetId(state)!;
    const snapshot = getSnapshot(state, _datasheetId || datasheetId);
    if (!snapshot) {
      return null;
    }

    const actions: IJOTAction[] = [];
    const linkedActions: ILinkedActions[] = [];

    // delete all cellValues of this field
    data.forEach(({ fieldId }) => {
      if (!snapshot.meta.fieldMap[fieldId]) {
        throw new Error(t(Strings.field_had_deleted));
      }
      for (const recordId in snapshot.recordMap) {
        const action = DatasheetActions.setRecord2Action(snapshot, { recordId, fieldId, value: null });
        action && actions.push(action);
      }
      // For LastModifiedBy/LastModifiedTime field type, fieldIdCollection needs to be updated
      const newActions = setAffectFieldAttr2Action(snapshot, fieldId);
      actions.push(...newActions);
    });

    const { viewId } = state.pageParams;
    const collected = data.reduce<IJOTAction[]>((collected, { fieldId, deleteBrotherField }) => {
      const field = snapshot.meta.fieldMap[fieldId]!;
      if (field.type === FieldType.Link) {
        const linkedAction = clearOldBrotherField(context, field, deleteBrotherField);
        linkedAction && linkedActions.push(linkedAction);
      }

      let action = DatasheetActions.deleteField2Action(snapshot, {
        fieldId,
        datasheetId,
        viewId,
      });

      if (!action) {
        return collected;
      }

      if (collected.length) {
        action = jot.transform(action, collected, 'right');
      }

      collected.push(...action);

      return collected;
    }, []);

    actions.push(...collected);
    console.log({ actions });

    return {
      result: ExecuteResult.Success,
      resourceId: _datasheetId || datasheetId,
      resourceType: ResourceType.Datasheet,
      actions,
      linkedActions,
    };
  },
};

/*

 declare module 'command_manager/command_manager' {
 interface CollaCommandManager {
 execute(options: IAddRecordsOptions & { cmd: 'AddRecords' }): ICollaCommandExecuteResult<IAddRecordsResult>;
 }
 }

 */
