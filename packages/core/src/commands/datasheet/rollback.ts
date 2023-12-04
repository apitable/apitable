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

import { IJOTAction, IOperation, jot, IAnyAction } from 'engine/ot';
import { xor, cloneDeep } from 'lodash';
import { FieldType, IField, ILinkField, ResourceType } from 'types';
import { CollaCommandName } from 'commands/enum';
import { ExecuteResult, ICollaCommandDef, ILinkedActions } from 'command_manager';
import { IRecordMap, IReduxState, ISnapshot } from '../../exports/store/interfaces';
import { fastCloneDeep, getNewId, getUniqName, IDPrefix, ActionType, parseAction } from 'utils';
import { getField, getSnapshot, getDatasheet } from 'modules/database/store/selectors/resource/datasheet/base';
import { DatasheetActions } from 'commands_actions/datasheet';
import { createNewField, setField } from 'commands/common/field';
import { TextField } from 'model/field/text_field';
import { Events, Player } from '../../modules/shared/player';
import { Field } from 'model/field';

export interface IRollback {
  // Note that the order of operations This operation is in reverse order, the new one is in the front, the old one is in the back
  operations: IOperation[];
}

export interface IRollbackOptions {
  cmd: CollaCommandName.Rollback;
  datasheetId: string;
  data: IRollback;
}

export const getRollbackActions = (operations: IOperation[], state: IReduxState, snapshot: ISnapshot) => {
  return operations.reduce((collect, op) => {
    const needIgnoreActionFlag = { field: {}, record: {} };
    // First restore the column-related operations to ensure that the subsequent
    // action of checking the set cell value can get the correct verification result
    const updateFieldActions: IAnyAction[] = [];
    const addFieldActions: IAnyAction[] = [];
    const otherActions: IAnyAction[] = [];
    op.actions.forEach((action) => {
      const { type } = parseAction(action as IAnyAction);
      if ([ActionType.UpdateField, ActionType.DelField].includes(type)) {
        updateFieldActions.push(action);
      } else if (type === ActionType.AddField) {
        addFieldActions.push(action);
      } else {
        otherActions.push(action);
      }
    });
    const sortedActions = [...updateFieldActions, ...otherActions, ...addFieldActions];
    sortedActions.forEach(item => {
      const action = item as IAnyAction;
      if (['comments', 'commentCount'].includes(action.p[2])) {
        return;
      }
      const res = parseAction(action);
      // The original field is link, and the link field will be inserted during recovery.
      // If the corresponding association table cannot be found, the recovery of this data will be ignored.
      if ([ActionType.UpdateField, ActionType.DelField].includes(res.type)) {
        const oldField = action.od;
        if (oldField.type === FieldType.Link && oldField.property.foreignDatasheetId) {
          const foreDatasheet = getDatasheet(state, oldField.property.foreignDatasheetId);
          if (!foreDatasheet) {
            needIgnoreActionFlag.field[oldField.id] = true;
            return;
          }
        }
      }
      // When deleting a column, if the corresponding field has been marked to be ignored, the data will not be restored
      if (res.type === ActionType.DelColumn) {
        if (needIgnoreActionFlag.field[res.context.fieldId!]) {
          return;
        }
      }

      // Set the cell value, but the field does not match the type of the value to be set and needs to be ignored
      if (res.type === ActionType.UpdateRecord) {
        const fieldId = res.context.fieldId!;
        const recordId = res.context.recordId!;
        if (needIgnoreActionFlag.field[fieldId] || needIgnoreActionFlag.record[recordId]) {
          return;
        }
        const oldData = action.od;
        const field = snapshot.meta.fieldMap[fieldId];
        if (!field) {
          return;
        }
        const validError = Field.bindContext(field, state).validateCellValue(oldData).error;
        if (validError && !validError.message.endsWith('is required')) {
          return;
        }
      }
      try {
        const invertActions = jot.invert([action as unknown as IJOTAction]) as IJOTAction[];
        jot.apply(snapshot, invertActions);
        collect.push(...invertActions);
      } catch (error) {
        Player.doTrigger(Events.app_error_logger, {
          error: new Error(`Time Machine rollback error: ${error}`),
          metaData: {
            actions: [action],
            snapshot,
          },
        });
      }
      return true;
    });
    return collect;
  }, [] as IJOTAction[]);
};

export const rollback: ICollaCommandDef<IRollbackOptions> = {

  undoable: false,

  execute: (context, options) => {
    const { state: state } = context;
    const { datasheetId, data } = options;
    const { operations } = data;
    const preDatasheet = getDatasheet(state, datasheetId);
    if (!preDatasheet) {
      return null;
    }
    /* 1. [apply], apply the reverse actions to a cloned snapshot in turn to get the original rollback snapshot */
    const preSnapshot = preDatasheet.snapshot;
    const postSnapshot = fastCloneDeep(preSnapshot);
    const actions = getRollbackActions(operations, state, postSnapshot);

    if (!actions.length) {
      return null;
    }

    // collect actions
    const linkedActions: ILinkedActions[] = [];

    function setLinkedActions(datasheetId: string, actions: IJOTAction[]) {
      if (!actions.length) {
        return;
      }

      const la = linkedActions.find(la => la.datasheetId === datasheetId);
      if (la) {
        la.actions.push(...actions);
      } else {
        linkedActions.push({
          datasheetId,
          actions,
        });
      }
    }

    /* 2. [diff], compare the snapshot after apply with the previous snapshot,
    take out the changed link field, and generate field changes to the associated table */
    const { deletedLinkFields, newLinkFields, normalLinkFields } = getLinkFieldChange(preSnapshot.meta.fieldMap, postSnapshot.meta.fieldMap);

    console.log({ deletedLinkFields, newLinkFields, normalLinkFields });
    /* 3. [patch], re-establish bidirectional associations for all associated fields and align the data */
    deletedLinkFields.forEach(sourceField => {
      const foreignDatasheetId = sourceField.property.foreignDatasheetId;
      const foreignSnapshot = getSnapshot(state, foreignDatasheetId)!;
      const foreignField = getField(state, sourceField.property.brotherFieldId!, foreignDatasheetId);
      const actions = setField(context, foreignSnapshot, foreignField, {
        id: foreignField.id,
        name: foreignField.name,
        type: FieldType.Text,
        property: TextField.defaultProperty(),
      }).actions;
      setLinkedActions(foreignDatasheetId, actions);
    });

    const newForeignField = newLinkFields.map(sourceField => {
      const foreignDatasheetId = sourceField.property.foreignDatasheetId;
      let brotherFieldId = sourceField.property.brotherFieldId!;
      const foreignSnapshot = getSnapshot(state, foreignDatasheetId)!;
      if(!foreignSnapshot){
        // one-way association
        return;
      }
      const foreignField = getField(state, brotherFieldId, foreignDatasheetId);

      const foreignFieldIds = Object.keys(foreignSnapshot.meta.fieldMap);

      /**
       * The brotherFieldId corresponding to newLinkFields still exists in the association table,
       * and the association field is not plain text, you need to modify brotherFieldId to create a new association field
       * Otherwise set the field type of the association table to the magic association type.
       */
      if (foreignField && foreignField.type !== FieldType.Text) {
        brotherFieldId = getNewId(IDPrefix.Field, foreignFieldIds);
        /** A deep clone avoids the following DatasheetActions.setFieldAttr2Action method to get the same value for ac oi and od.
         * In order to avoid the occurrence of od when the middle layer does OT conversion,
         * the value corresponding to the associated table fieldMap cannot be found
         */
        sourceField = cloneDeep(sourceField);
        sourceField.property.brotherFieldId = brotherFieldId;

        const ac = DatasheetActions.setFieldAttr2Action(postSnapshot, {
          field: sourceField
        });
        if (ac) {
          actions.push(ac);
          jot.apply(postSnapshot, [ac]);
        }
        const newField: ILinkField = {
          id: brotherFieldId,
          type: FieldType.Link,
          name: getUniqName(preDatasheet.name, foreignFieldIds.map(id => foreignSnapshot.meta.fieldMap[id]!.name)),
          property: {
            foreignDatasheetId: datasheetId,
            brotherFieldId: sourceField.id,
          }
        };

        const newFieldActions = createNewField(foreignSnapshot, newField);

        setLinkedActions(foreignDatasheetId, newFieldActions);
        return newField;
      }

      const modifiedField: ILinkField = {
        ...foreignField,
        type: FieldType.Link,
        property: {
          foreignDatasheetId: datasheetId,
          brotherFieldId: sourceField.id,
        }
      };

      const { actions: modifiedFieldActions } = setField(context, foreignSnapshot, foreignField, modifiedField);
      setLinkedActions(foreignDatasheetId, modifiedFieldActions);
      return sourceField;
    });

    newLinkFields.forEach((sourceField, index) => {
      console.log('newLinkFields: ', sourceField);
      if(!newForeignField[index]){
        // one-way direction
        return;
      }
      const result = patchFieldValues(state, postSnapshot, sourceField, newForeignField[index]);
      actions.push(...result.sourceActions);
      setLinkedActions(sourceField.property.foreignDatasheetId, result.foreignActions);
    });

    normalLinkFields.forEach(sourceField => {
      const result = patchFieldValues(state, postSnapshot, sourceField);
      actions.push(...result.sourceActions);
      setLinkedActions(sourceField.property.foreignDatasheetId, result.foreignActions);
    });

    return {
      result: ExecuteResult.Success,
      resourceId: datasheetId,
      resourceType: ResourceType.Datasheet,
      actions,
      linkedActions,
    };
  },
};

/**
 * Get an array of new and deleted associated fields
 * @param preFieldMap fieldMap before rollback
 * @param postFieldMap rollback fieldMap
 * @return deletedLinkFields Link fields deleted after rollback
 * @return newLinkFields added after rollback
 * @return normalLinkFields rollback existing associated fields
 */
function getLinkFieldChange(preFieldMap: Record<string, IField>, postFieldMap: Record<string, IField>) {
  let deletedLinkFields: ILinkField[] = [];
  let newLinkFields: ILinkField[] = [];
  let normalLinkFields: ILinkField[] = [];
  /**
    * The three cases are regarded as deletedLinkFields. After preFieldMap gets a field, it is matched with fieldId in postFieldMap
    * pre is linkField, this field cannot be matched in post
    * pre is a linkField, and it is not a link field that is converted in post
    * pre is a linkField, the post is converted into another link field, or the sibling fields are inconsistent,
    * (the link field in the post is considered new at this time)
    *
    * Three cases are treated as newLinkFields
    * post is a linkField, this field does not exist in pre
    * post is a linkField, pre is not a linkField
    * pre is a linkField, the post is converted into another link field, or the sibling fields are inconsistent, (same as the third item above)
    *
    * One case is treated as normalLinkFields
    * exists in both pre and post, and the associated table and sibling fields have not changed
    */
  Object.values(preFieldMap).forEach(preField => {
    const postField = postFieldMap[preField.id];
    // post is linkField, pre is not linkField, you need to push a record to newLinkFields;
    if (postField && postField.type === FieldType.Link) {
      if (preField && preField.type !== FieldType.Link) {
        newLinkFields.push(postField);
        return;
      }
    }
    // pre is not a linkField to filter out first
    if (preField.type !== FieldType.Link) {
      return;
    }

    // This field cannot be matched in the post
    if (!postField) {
      deletedLinkFields.push(preField);
      return;
    }

    // The post is converted not the link field
    if (postField.type !== FieldType.Link) {
      deletedLinkFields.push(preField);
      return;
    }

    // Posts are not related to the same table
    if (preField.property.foreignDatasheetId !== postField.property.foreignDatasheetId) {
      deletedLinkFields.push(preField);
      newLinkFields.push(postField);
      return;
    }

    // The post is associated with the same table, but the sibling fields are not the same
    if (preField.property.brotherFieldId !== postField.property.brotherFieldId) {
      deletedLinkFields.push(preField);
      newLinkFields.push(postField);
      return;
    }

    // Both pre and post exist, and the associated table and sibling fields have not changed
    normalLinkFields.push(postField);
  });

  // post is a linkField, this field does not exist in pre
  const newInPostFields = Object.values(postFieldMap).filter(postField => !preFieldMap[postField.id] && postField.type === FieldType.Link);
  newLinkFields.push(...newInPostFields as ILinkField[]);

  // Filter out the fields where brotherFieldId is empty, that is, the fields associated with the table
  deletedLinkFields = deletedLinkFields.filter(field => field.property.brotherFieldId);
  newLinkFields = newLinkFields.filter(field => field.property.brotherFieldId);
  normalLinkFields = normalLinkFields.filter(field => field.property.brotherFieldId);

  return { deletedLinkFields, newLinkFields, normalLinkFields };
}

// Provide sourceLinkField to align the cellValue in the field corresponding to the association table to a bidirectional association
function patchFieldValues(
  state: IReduxState,
  sourceSnapshot: ISnapshot,
  sourceField: IField,
  // The newly added field of the association table is not in the snapshot, and needs to be added in
  isolateForeignField?: ILinkField
): {
  sourceActions: IJOTAction[];
  foreignActions: IJOTAction[];
} {
  const foreignDatasheetId = sourceField.property.foreignDatasheetId;
  const foreignSnapshot = getSnapshot(state, foreignDatasheetId)!;
  const foreignField = isolateForeignField || getField(state, sourceField.property.brotherFieldId!, foreignDatasheetId);
  // Generate the value required by the sibling field
  const foreignLinkRecordValueMap: Record<string, string[]> = {};
  const foreignActions: IJOTAction[] = [];
  const sourceActions: IJOTAction[] = [];
  function eachFieldValue(fieldId: string, recordMap: IRecordMap, cb: (rid: string, v?: string[]) => void) {
    for (const recordId in recordMap) {
      const record = recordMap[recordId]!;
      const linkCellValue = record.data && record.data[fieldId];
      cb(recordId, linkCellValue as string[] | undefined);
    }
  }

  // Generate a value map of the associated column based on postField
  eachFieldValue(sourceField.id, sourceSnapshot.recordMap, (recordId, linkCellValue) => {
    if (!linkCellValue) {
      return;
    }
    const filteredLinkCellValue = linkCellValue.filter(rid => {
      // If the associated cell summary rid does not exist in the associated table, delete this rid
      if (!foreignSnapshot.recordMap[rid]) {
        return false;
      }
      if (foreignLinkRecordValueMap[rid]) {
        foreignLinkRecordValueMap[rid]!.push(recordId);
      } else {
        foreignLinkRecordValueMap[rid] = [recordId];
      }
      return true;
    });
    if (filteredLinkCellValue.length !== linkCellValue.length) {
      const action = DatasheetActions.setRecord2Action(sourceSnapshot, {
        fieldId: sourceField.id,
        recordId: recordId,
        value: filteredLinkCellValue,
      });
      action && sourceActions.push(action);
    }
  });

  console.log({ foreignLinkRecordValueMap });

  // Traverse the association table, replace the existing ones, delete the ones that don't exist, and add the missing ones
  foreignSnapshot && eachFieldValue(foreignField.id, foreignSnapshot.recordMap, (recordId, linkCellValue) => {
    let action: IJOTAction | null = null;
    const newCellValue = foreignLinkRecordValueMap[recordId];
    if (newCellValue) {
      // need to be replaced if there are different values in the array
      if (xor(linkCellValue, newCellValue)) {
        action = DatasheetActions.setRecord2Action(foreignSnapshot, {
          fieldId: foreignField.id,
          recordId: recordId,
          value: newCellValue,
        });
      }
    } else {
      action = DatasheetActions.setRecord2Action(foreignSnapshot, {
        fieldId: foreignField.id,
        recordId: recordId,
        value: null,
      });
    }
    action && foreignActions.push(action);
  });

  return { sourceActions, foreignActions };
}
