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

import { DatasheetOperationPermission, FieldType, IInsertPosition, IPermissionResult, IWidgetContext, IWidgetDatasheetState } from 'interface';
import {
  CollaCommandName, ConfigConstant, ExecuteResult, Field as CoreField, ICollaCommandExecuteResult, ISetRecordOptions, Selectors,
  FieldType as CoreFieldType, IDPrefix, getNewId, getFieldClass, IField, Conversion,
  getFieldTypeByString,
  IReduxState
} from 'core';
import { cmdExecute } from 'message/utils';
import { getWidgetDatasheet } from 'store';
import { errMsg } from 'utils/private';

/**
 * Datasheet operation
 * 
 * It is recommended to use if you want to operate datasheet, such as obtaining datasheet data, adding records, deleting records, etc.,
 * we recommend using the {@link useDatasheet} hook function.
 * 
 * If you need to obtain record data, 
 * you can use {@link useRecord} (query single record data) and {@link useRecords} (batch query record data).
 *
 * - {@link addRecord}: Creates a new record with the specified cell values
 *
 * - {@link addRecords}: Creates multiple new records with the specified cell values
 *
 * - {@link setRecord}: Updates cell values for a record
 *
 * - {@link setRecords}: Updates cell values for multiple records
 *
 * - {@link deleteRecord}: Delete the given record
 *
 * - {@link deleteRecords}: Delete the given records
 * 
 * - {@link addField}: Creates a new field
 * 
 * - {@link deleteField}: Delete the given field
 *
 * - {@link checkPermissionsForAddRecord}: Checks whether the current user has permission to create the specified record
 *
 * - {@link checkPermissionsForAddRecords}: Checks whether the current user has permission to create the specified records
 *
 * - {@link checkPermissionsForSetRecord}: Checks whether the current user has permission to perform the given record update
 *
 * - {@link checkPermissionsForSetRecords}: Checks whether the current user has permission to perform the given record updates
 *
 * - {@link checkPermissionsForDeleteRecord}: Checks whether the current user has permission to delete the specified record
 *
 * - {@link checkPermissionsForDeleteRecords}: Checks whether the current user has permission to delete the specified records
 * 
 * - {@link checkPermissionsForAddField}: Checks whether the current user has permission to create the specified field
 *
 * - {@link checkPermissionsForDeleteField}: Checks whether the current user has permission to delete the specified field
 *
 */
export class Datasheet {
  private datasheetData: IWidgetDatasheetState | null | undefined;

  /**
   * @inner
   * @hidden
   */
  constructor(
    public datasheetId: string,
    private wCtx: IWidgetContext,
  ) {
    this.datasheetData = wCtx.widgetStore?.getState().datasheetMap[this.datasheetId];
  }

  /**
   * The unique ID of this datasheet.
   * @returns
   *
   * #### Example
   * ```js
   * console.log(myDatasheet.id);
   * // => 'dstxxxxxxx'
   * ```
   */
  get id() {
    return this.datasheetData?.datasheet?.datasheetId;
  }

  /**
   * The name of the Datasheet.
   * 
   * @returns
   *
   * #### Example
   * ```js
   * console.log(myDatasheet.name);
   * // => 'Name'
   * ```
   */
  get name() {
    return this.datasheetData?.datasheet?.datasheetName; 
  }

  private checkRecordsValues(records: { [key: string]: any }[]) {
    const state = this.wCtx.widgetStore.getState() as any as IReduxState;
    const fieldDataMap = Selectors.getFieldMap(state, this.datasheetId)!;

    records.forEach(valuesMap => {
      Object.entries(valuesMap).forEach(([fieldId, cellValue]) => {
        const fieldData = fieldDataMap[fieldId];
        if (!fieldData) {
          throw new Error(`FieldId: ${fieldId} is not exist in datasheet`);
        }

        const coreField = CoreField.bindModel(fieldDataMap[fieldId]!, state);
        if (!coreField.recordEditable(this.datasheetId)) {
          throw new Error(`FieldId: ${fieldId} is not editable`);
        }

        if (coreField.validateCellValue(cellValue).error) {
          throw new Error(`CellValue: ${cellValue} is not validate for field ${fieldId}(${fieldData.name})`);
        }
      });
    });
  }

  private transformRecordValues(records: { [key: string]: any }[]): { [key: string]: any }[] {
    const state = this.wCtx.widgetStore.getState() as any as IReduxState;
    const fieldDataMap = Selectors.getFieldMap(state, this.datasheetId)!;
    return records.map(valuesMap => {
      const coreFieldMap: Record<string, any> = {};
      Object.entries(valuesMap).forEach(([fieldId, cellValue]) => {
        const coreField = CoreField.bindModel(fieldDataMap[fieldId]!, state);
        // Compatible with the case where cellValue is undefined
        coreFieldMap[fieldId] = cellValue === undefined ? null : coreField.openWriteValueToCellValue(cellValue);
      });
      return coreFieldMap;
    });
  }

  private checkRecordIdsExist(recordIds: (string | undefined)[]): IPermissionResult {
    const state = this.wCtx.widgetStore.getState() as any as IReduxState;
    const datasheetId = this.datasheetId;
    for (const recordId of recordIds) {
      // If the recordId is not passed in, the existence verification will not be performed
      if (!recordId) {
        return { acceptable: true };
      }
      const record = Selectors.getRecord(state, recordId, datasheetId);
      if (!record) {
        return { acceptable: false, message: `record:${recordId} doesn't exist` };
      }
    }
    return { acceptable: true };
  }

  private checkBasicPermissions(operation: DatasheetOperationPermission): IPermissionResult {
    const state = this.wCtx.widgetStore.getState();
    const datasheetId = this.datasheetId;
    const datasheet = getWidgetDatasheet(state, datasheetId);
    const sourceId = state.widget?.snapshot.sourceId;
    const globalState = this.wCtx.widgetStore.getState() as any as IReduxState;
    const permissions = Selectors.getPermissions(globalState, datasheetId, undefined, sourceId?.startsWith('mir') ? sourceId : '');
    if (!datasheet || !permissions) {
      return { acceptable: false, message: 'Failed to load the data of the datasheet' };
    }

    switch(operation) {
      case DatasheetOperationPermission.AddRecord: {
        if (!permissions.rowCreatable) {
          return { acceptable: false, message: 'The permission of the datasheet is read-only and cannot be added record' };
        }
      } break;
      case DatasheetOperationPermission.EditRecord: {
        if (!permissions.cellEditable) {
          return { acceptable: false, message: 'The permission of the datasheet is read-only and cannot be updated cell' };
        }
      } break;
      case DatasheetOperationPermission.DeleteRecord: {
        if (!permissions.rowRemovable) {
          return { acceptable: false, message: 'The permission of the datasheet is read-only and cannot be deleted record' };
        }
      } break;
      case DatasheetOperationPermission.AddField: {
        if (!permissions.fieldCreatable) {
          return { acceptable: false, message: 'The permission of the datasheet is read-only and cannot be added field' };
        }
      } break;
      case DatasheetOperationPermission.DeleteField: {
        if (!permissions.fieldRemovable) {
          return { acceptable: false, message: 'The permission of the datasheet is read-only and cannot be deleted field' };
        }
      } break;
    }

    return { acceptable: true };
  }

  private checkPermissionsForRecordsValues(records: ({ [key: string]: any } | undefined)[]): IPermissionResult {
    const state = this.wCtx.widgetStore.getState() as any as IReduxState;
    const datasheetId = this.datasheetId;

    for (const valuesMap of records) {
      // No value verification will be performed if valuesMap is not transferred
      if (!valuesMap) {
        continue;
      }

      for (const [fieldId, value] of Object.entries(valuesMap)) {
        const fieldPermissionMap = Selectors.getFieldPermissionMap(state, datasheetId);
        const fieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, fieldId);
        const field = Selectors.getField(state, fieldId, datasheetId);
        if (!field) {
          return errMsg(`The fieldId of the current operation: ${fieldId} does not exist`);
        }

        if (fieldRole === ConfigConstant.Role.None || fieldRole === ConfigConstant.Role.Reader) {
          return errMsg(`No write permission for ${field.name}(${fieldId}) column`);
        }

        const fieldEntity = CoreField.bindContext(field, state);

        if (fieldEntity.isComputed) {
          return errMsg(`The content of the ${field.name}(${fieldId}) field is automatically generated by calculation and cannot be written`);
        }
        // Compatible with undefined
        const checkError = fieldEntity.validateOpenWriteValue(!value ? null : value).error;
        if (checkError) {
          return errMsg(`
            The currently written value ${value} of the ${field.name} field does not conform to the format of ${checkError.message}. Please check.`
          );
        }
      }
    }

    return {
      acceptable: true,
    };
  }

  private checkFieldName(name?: string): IPermissionResult {
    if (typeof name !== 'string'){
      return errMsg('Field name must be a string');
    }
    const state = this.wCtx.widgetStore.getState() as any as IReduxState;
    const fieldDataMap = Selectors.getFieldMap(state, this.datasheetId)!;
    const hasTheSameName = Object.keys(fieldDataMap).some(fieldId => {
      const item = fieldDataMap[fieldId]!;
      return item.name === name;
    });
    if (hasTheSameName) {
      return errMsg(`${name} is already exist, Please enter a unique field name`);
    }
    return { acceptable: true };
  }

  private checkPrimaryField(fieldId: string) {
    const state = this.wCtx.widgetStore.getState() as any as IReduxState;
    const snapshot = Selectors.getSnapshot(state, this.datasheetId);
    return Boolean(snapshot?.meta.views[0]!.columns[0]!.fieldId === fieldId);
  }

  /**
   * Creates a new record with the specified cell values.
   *
   * @param valuesMap object mapping fieldId to value for that field.
   *
   * @param insertPosition position to insert in view.
   *
   * @returns The returned promise will resolve to the recordId of the new record once it is persisted.
   *
   * #### Description
   * Adds a new record and optionally specifies its position in the view (default at the end), returning an array of new record IDs.
   *
   * An error will be thrown when the user does not have permission to perform the operation or when the cell value format check does not pass.
   *
   * Refer to {@link FieldType} for cell value write formats.
   *
   * #### Example
   * ```js
   * async function addNewRecord(valuesMap) {
   *   if (datasheet.checkPermissionsForAddRecord(valuesMap).acceptable) {
   *     const newRecordId = await datasheet.addRecord(valuesMap);
   *     alert(`The newly created record ID is ${newRecordId}`);
   *
   *     // Next, you can select, or manipulate, the newly created records.
   *     // ...
   *   }
   * }
   *
   * // The key of the parameter is the fieldId and the value is the cell value.
   * addNewRecord({
   *   fld1234567980: 'this is a text value',
   *   fld0987654321: 1024,
   * });
   *
   * // Different types of field cell values have specific data structures that need to be passed in correctly
   * addNewRecord({
   *   fld1234567890: 'this is a text value', // SingleLineText
   *   fld0987654321: 1024, // Number
   *   fld1234567891: 'option 1', // SingleSelect
   *   fld1234567892: ['option 1', 'option 2'], // MultiSelect
   *   fld1234567893:  1635513510962, // DateTime
   *   fld1234567894: ['rec1234567'], // MagicLink (recordId)
   * });
   * ```
   */
  async addRecord(valuesMap: { [key: string]: any } = {}, insertPosition?: IInsertPosition) {
    return (await this.addRecords([{ valuesMap }], insertPosition))[0]!;
  }

  /**
   * Creates new records with the specified cell values.
   * 
   * @param records Array of objects with a fields key mapping fieldId to value for that field.
   * 
   * @param insertPosition Position to insert in the view.
   *
   * @returns The returned promise will resolve to an array of recordIds of the new records once the new records are persisted.
   *
   * #### Description
   * Add multiple records and optionally specify its position in the view (inserted at the end by default).
   *
   * An error will be thrown when the user does not have permission to perform the operation or when the cell value format check does not pass.
   *
   * Refer to {@link FieldType} for cell value write formats.
   *
   * #### Example
   * ```js
   * const records = [
   *   // Cell values should generally have format matching the output of
   *   {
   *     valuesMap: {
   *       fld1234567890: 'this is a text value',
   *       fld0987654321: 1024,
   *     },
   *   },
   *   // Specifying no fields will create a new record with no cell values set
   *   {
   *     valuesMap: {},
   *   },
   *   // Different types of field cell values have specific data structures that need to be passed in correctly
   *   {
   *     valuesMap: {
   *       fld1234567890: 'Cat video 2', // SingleLineText
   *       fld0987654321: 1024, // Number
   *       fld1234567891: 'option 1', // SingleSelect
   *       fld1234567892: ['option 1', 'option 2'], // MultiSelect
   *       fld1234567893:  1635513510962, // DateTime (Timestamp)
   *       fld1234567894: ['rec1234567'], // MagicLink (recordId)
   *     },
   *   },
   * ];
   *
   * async function addNewRecords() {
   *   if (datasheet.checkPermissionToAddRecords(records)) {
   *     const recordIds = await datasheet.addRecords(records);
   *
   *     alert(`new records with IDs: ${recordIds}`);
   *
   *     // Next, you can select, or manipulate, the newly created records
   *     // ...
   *   }
   * }
   * ```
   */
  addRecords(records: { valuesMap: { [key: string]: any } }[] = [], insertPosition?: IInsertPosition): Promise<string[]> {
    const state = this.wCtx.widgetStore.getState() as any as IReduxState;
    const recordsValues: { [key: string]: any }[] = [];
    for (const record of records) {
      recordsValues.push(record.valuesMap);
    }
    const transformedRecords = this.transformRecordValues(recordsValues);
    this.checkRecordsValues(transformedRecords);

    // Default position
    let view = Selectors.getCurrentView(state, this.datasheetId)!;
    let viewId = view.id;
    let index = view.rows.length;

    // Designated location
    if (insertPosition) {
      // Iterate through rows to find the actual insertion location, same as common/components/menu datasheet right click UI operation
      // TODO: This approach will need to be optimized in the future
      index = view.rows!.findIndex(row => row.recordId === insertPosition.anchorRecordId) ;
      if (index === -1) {
        throw new Error(`Anchor recordId: ${insertPosition.anchorRecordId} is not exist in datasheet`);
      }
      viewId = insertPosition.viewId;
      const snapshot = Selectors.getSnapshot(state, this.datasheetId)!;
      view = Selectors.getViewById(snapshot, viewId)!;
    }

    if (index < 0) {
      throw new Error('Insert index should not less than 0');
    }

    if (index > view.rows.length) {
      throw new Error('Insert index should not greater than all row count in view');
    }

    return new Promise(async(resolve) => {
      const result: ICollaCommandExecuteResult<any> = await cmdExecute({
        cmd: CollaCommandName.AddRecords,
        datasheetId: this.datasheetId,
        viewId,
        count: transformedRecords.length,
        index,
        cellValues: transformedRecords,
      }, this.wCtx.id);
      if (result.result === ExecuteResult.Fail) {
        throw new Error(result.reason);
      }
  
      if (result.result === ExecuteResult.None) {
        throw new Error('Add record method has been ignored');
      }
      resolve(result.data as string[]);
    });
  }

  /**
   * Updates cell values for a record.
   *
   * @param recordId the record to update.
   *
   * @param valuesMap key for fieldId, value for the contents of the cell object,
   * only need to pass to modify the value, do not need to modify the key value do not need to pass.
   * To empty a field, you need to pass key: null.
   * @return 
   *
   * #### Description
   * Throws an error if the user does not have permission to update the given cell values in the record, or or recordId does not exist,
   * or when the written value type does not match.
   *
   * We refer to a field in a record as a cell.
   * Refer to {@link FieldType} for cell value write formats.
   *
   *
   * If you need to modify multiple records at the same time, use the {@link setRecords}.
   *
   * #### Example
   * ```js
   * function setRecord(recordId, valuesMap) {
   *   if (datasheet.checkPermissionsForSetRecord(recordId, valuesMap).acceptable) {
   *     datasheet.setRecord(recordId, valuesMap);
   *   }
   * }
   * ```
   */
  setRecord(recordId: string, valuesMap: { [key: string]: any } = {}) {
    return this.setRecords([{ id: recordId, valuesMap }]);
  }

  /**
   * Updates cell values for records.
   * @param records Specify the records be modified.
   * @return
   *
   * #### Description
   * Throws an error if the user does not have permission to update the given cell values in the record, or or recordId does not exist,
   * or when the written value type does not match.
   *
   * valuesMap key for fieldId, value for the contents of the cell object,
   * only need to pass to modify the value, do not need to modify the key value do not need to pass.
   * To empty a field, you need to pass key: null.
   *
   * We refer to a field in a record as a cell.
   * Refer to {@link FieldType} for cell value write formats.
   *
   *
   * If you only need to modify a single record, use the {@link setRecord}
   *
   * #### Example
   * ```js
   * function setRecord(id, valuesMap) {
   *   if (datasheet.checkPermissionsForSetRecords([{ id, valuesMap }]).acceptable) {
   *     datasheet.setRecords([{ id, valuesMap }]);
   *   }
   * }
   * ```
   */
  async setRecords(records: { id: string, valuesMap: { [key: string]: any } }[]) {
    const recordIds: string[] = [];
    const recordsValues: { [key: string]: any }[] = [];
    for (const record of records) {
      recordIds.push(record.id);
      recordsValues.push(record.valuesMap);
    }
    const state = this.wCtx.widgetStore.getState() as any as IReduxState;
    const transformedRecordsValues = this.transformRecordValues(recordsValues);
    this.checkRecordsValues(transformedRecordsValues);

    const data = records.reduce<ISetRecordOptions[]>((pre, record) => {
      const recordId = record.id;
      const recordData = Selectors.getRecord(state, recordId, this.datasheetId);
      if (!recordData) {
        throw new Error(`RecordId: ${recordId} is not exist in datasheet`);
      }

      this.transformRecordValues([record.valuesMap]).forEach(valueMap => {
        Object.entries(valueMap).forEach(([fieldId, cellValue])=> {
          pre.push({
            recordId,
            fieldId,
            value: cellValue,
          });
        });
      });
      return pre;
    }, []);

    const result: ICollaCommandExecuteResult<any> = await cmdExecute({
      cmd: CollaCommandName.SetRecords,
      datasheetId: this.datasheetId,
      data,
    }, this.wCtx.id);
    if (result.result === ExecuteResult.Fail) {
      throw new Error(result.reason);
    }
  }

  /**
   * Delete the given record.
   *
   * @param recordId the record to be deleted.
   * @returns
   *
   * #### Description
   * Delete a record by recordId.
   *
   * Throws an error if the user does not have permission to delete the given record.
   *
   * #### Example
   * ```js
   * async function deleteRecord(recordId) {
   *   if (datasheet.checkPermissionsForDeleteRecord(recordId).acceptable) {
   *     await datasheet.deleteRecord(recordId);
   *     alert('The record has been deleted');
   *
   *     // Record deletion has been saved to servers
   *   }
   * }
   * ```
   */
  deleteRecord(recordId: string) {
    return this.deleteRecords([recordId]);
  }

  /**
   * Delete the given records.
   *
   * @param recordIds array of recordIds.
   * @returns
   * 
   *
   * #### Description
   * Delete the given record by recordIds.
   *
   * Throws an error if the user does not have permission to delete the given record.
   *
   * #### Example
   * ```js
   * async function deleteRecords(recordIds) {
   *   if (datasheet.checkPermissionsForDeleteRecords(recordIds).acceptable) {
   *     await datasheet.deleteRecords(recordIds);
   *     alert('The records has been deleted');
   *
   *     // Records deletion has been saved to servers
   *   }
   * }
   * ```
   */
  async deleteRecords(recordIds: string[]) {
    const result: ICollaCommandExecuteResult<any> = await cmdExecute({
      cmd: CollaCommandName.DeleteRecords,
      datasheetId: this.datasheetId,
      data: recordIds,
    }, this.wCtx.id);
    if (result.result === ExecuteResult.Fail) {
      throw new Error(result.reason);
    }
  }

  /**
   * Creates a new field.
   *
   * @param name name for the field. must be case-insensitive unique
   * @param type type for the field.
   * @param property property for the field. omit for fields without writable property.
   * @returns
   * 
   *
   * #### Description
   *
   * Refer to {@link FieldType} for supported field types, the write format for property, and other specifics for certain field types.
   * 
   * Throws an error if the user does not have permission to create a field,
   * if invalid name, type or property are provided, or if creating fields of this type is not supported.
   *
   * #### Example
   * ```js
   * function addField(name, type, property) {
   *   if (datasheet.checkPermissionsForAddField(name, type, property).acceptable) {
   *     datasheet.addField(recordIds);
   *   }
   * }
   * ```
   */
  async addField(name: string, type: FieldType, property: any): Promise<string> {
    const state = this.wCtx.widgetStore.getState() as any as IReduxState;
    const view = Selectors.getCurrentView(state, this.datasheetId)!;
    const index = view.columns.length;
    const fieldType = getFieldTypeByString(type as any)!;
    const fieldInfoForState = {
      id: getNewId(IDPrefix.Field),
      name,
      type: fieldType,
      property: getFieldClass(fieldType).defaultProperty(),
    } as IField;
    const field = CoreField.bindContext(fieldInfoForState, state);
    const result: ICollaCommandExecuteResult<any> = await cmdExecute({
      cmd: CollaCommandName.AddFields,
      data: [{
        data: {
          name,
          type: fieldType,
          property: field.addOpenFieldPropertyTransformProperty(property),
        } as any,
        index,
      }],
    }, this.wCtx.id);
    if (result.result === ExecuteResult.Fail) {
      throw new Error(result.reason);
    }
    if (result.result === ExecuteResult.None) {
      throw new Error('Add field method has been ignored');
    }
    return result.data;
  }

  /**
   * Delete the given field.
   *
   * @param fieldId the field to be deleted.
   * @param conversion
   * When deleting a field as an associated field,
   * mark whether the associated field of the associated datasheet is deleted or converted to text,
   * the default is Converted to a text field.
   * @returns
   * 
   *
   * #### Description
   *
   * Throws an error if the user does not have permission to delete a field.
   *
   * #### Example
   * ```js
   * function deleteField(fieldId) {
   *   if (datasheet.checkPermissionsForDeleteField(fieldId).acceptable) {
   *     datasheet.deleteField(fieldId);
   *   }
   * }
   * ```
   */
  async deleteField(fieldId: string, conversion?: Conversion): Promise<void> {
    // Check the primary column. It is allowed to delete the primary column. After deletion, the datasheet will crash.
    if (this.checkPrimaryField(fieldId!)) {
      throw new Error(`${fieldId} is Primary field, cannot be deleted`);
    }
    const result: ICollaCommandExecuteResult<any> = await cmdExecute({
      cmd: CollaCommandName.DeleteField,
      data: [{
        deleteBrotherField: conversion === Conversion.Delete,
        fieldId,
      }],
    }, this.wCtx.id);
    if (result.result === ExecuteResult.Fail) {
      throw new Error(result.reason);
    }
    if (result.result === ExecuteResult.None) {
      throw new Error('Delete field method has been ignored');
    }
    return result.data;
  }

  /**
   * Checks whether the current user has permission to create the specified record.
   * 
   * @param valuesMap object mapping fieldId to value for that field.
   * @returns
   * 
   * 
   * #### Description
   * Accepts partial input, in the same format as {@link addRecord}. The more information provided, the more accurate the permissions check will be.
   *
   * The format of valuesMap is the same as when writing to cells. For cell value writing format, refer to {@link FieldType}.
   *
   * Returns `{acceptable: true}` if the current user can create the specified record.
   *
   * Returns `{acceptable: false, message: string}` if no permission to operate, message may be used to display an error message to the user.
   *
   * #### Example
   * ```js
   * // Check if user can create a specific record, when you already know what
   * // fields/cell values will be set for the record.
   * const setRecordCheckResult = datasheet.checkPermissionsForAddRecord({
   *   'fld1234567890': 'Advertising campaign',
   *   'fld0987654321': 1024,
   * });
   * if (!setRecordCheckResult.acceptable) {
   *   alert(setRecordCheckResult.message);
   * }
   *
   * // Check if user could potentially create a record.
   * // Use when you don't know the specific fields/cell values yet (for example,
   * // to show or hide UI controls that let you start creating a record.)
   * const addUnknownRecordCheckResult =
   *   datasheet.checkPermissionsForAddRecord();
   * ```
   */
  checkPermissionsForAddRecord(valuesMap?: { [key: string]: any }): IPermissionResult {
    const basicPermissionsCheckResult = this.checkBasicPermissions(DatasheetOperationPermission.AddRecord);
    if (!basicPermissionsCheckResult.acceptable) {
      return basicPermissionsCheckResult;
    }
    return this.checkPermissionsForRecordsValues(valuesMap ? [valuesMap] : []);
  }

  /**
   * Checks whether the current user has permission to create the specified records.
   * 
   * @param records Array of objects mapping fieldId to value for that field.
   * @returns
   * 
   * 
   * #### Description
   * array of objects mapping fieldId to value for that field.
   *
   * Accepts partial input, in the same format as {@link addRecords}.
   * The more information provided, the more accurate the permissions check will be.
   * 
   * The format of records is the same as when writing to cells. For cell value writing format, refer to {@link FieldType}.
   *
   * Returns `{acceptable: true}` if the current user can update the specified record.
   *
   * Returns `{acceptable: false, message: string}` if no permission to operate, message may be used to display an error message to the user.
   *
   * #### Example
   * ```js
   * // Check if user can update a specific records, when you already know what
   * // fields/cell values will be set for the record.
   * const addRecordsCheckResult = datasheet.checkPermissionsForAddRecords([
   *   {
   *     valuesMap: {
   *       fld1234567890: 'this is a text value',
   *       fld0987654321: 1024,
   *     },
   *   },
   *   {
   *     valuesMap: {
   *       fld1234567890: 'this is another text value',
   *       fld0987654321: 256,
   *     },
   *   },
   *   {},
   * ]);
   * if (!addRecordsCheckResult.acceptable) {
   *   alert(addRecordsCheckResult.message);
   * }
   * // Check if user could potentially create a record.
   * // Use when you don't know the specific fields/cell values yet (for example,
   * // to show or hide UI controls that let you start creating a record.)
   * // same as checkPermissionsForSetRecord
   * const addUnknownRecordCheckResult =
   *   datasheet.checkPermissionsForAddRecords();
   * ```
   */
  checkPermissionsForAddRecords(records?: { valuesMap: { [key: string]: any } }[]): IPermissionResult {
    const recordsValues: ({ [key: string]: any } | undefined)[] = [];
    for (const record of (records || [])) {
      recordsValues.push(record.valuesMap);
    }
    const basicPermissionsCheckResult = this.checkBasicPermissions(DatasheetOperationPermission.AddRecord);
    if (!basicPermissionsCheckResult.acceptable) {
      return basicPermissionsCheckResult;
    }
    return this.checkPermissionsForRecordsValues(recordsValues || []);
  }

  /**
   * Checks whether the current user has permission to perform the given record update.
   * 
   * @param recordId the record to update
   *
   * @param valuesMap specified as object mapping fieldId to value for that field
   *
   * @returns {@link IPermissionResult}
   *
   * #### Description
   *
   * This method performs **permission** and **value legality** checks based on the level of detail of the value passed in. 
   * Passing in valuesMap will check the legality of cell writes and column permissions, 
   * and passing in recordId will check the existence of records and modification permissions.
   *
   * The format of records is the same as when writing to cells. For cell value writing format, refer to {@link FieldType}.
   *
   * Returns `{acceptable: true}` if the current user can update the specified record.
   *
   * Returns `{acceptable: false, message: string}` if no permission to operate, message may be used to display an error message to the user.
   *
   * #### Example
   * ```js
   * // Check if user can update specific fields for a specific record
   * const setRecordCheckResult =
   *   datasheet.checkPermissionsForSetRecord('rec1234567', {
   *     'fld1234567890': 'this is a text value',
   *     'fld0987654321': 1024,
   *   });
   * if (!setRecordCheckResult.acceptable) {
   *   alert(setRecordCheckResult.message);
   * }
   *
   * // Checks if a user has permission to modify a record, but does not check if the specific value can be modified
   * const setUnknownFieldsCheckResult =
   *   datasheet.checkPermissionsForSetRecord('rec1234567');
   *
   * // Check whether the user has permission to modify the corresponding field, do not care about the specific record
   * const setUnknownRecordCheckResult =
   *   datasheet.checkPermissionsForSetRecord(undefined, {
   *     'fld1234567890': 'this is a text value',
   * 		// You can also choose not to pass in a specific value and use undefined instead, which will not perform a value type check
   *     'fld0987654321': undefined,
   *   });
   * // Check if user could perform updates within the datasheet, without knowing the
   * // specific record or fields that will be updated yet (e.g., to render your
   * // extension in "read only" mode)
   * const setUnknownRecordAndFieldsCheckResult =
   *   datasheet.checkPermissionsForSetRecord();
   * ```
   */
  checkPermissionsForSetRecord(recordId?: string, valuesMap?: { [key: string]: any }): IPermissionResult {
    return this.checkPermissionsForSetRecords([{ id: recordId, valuesMap }]);
  }

  /**
   * Checks whether the current user has permission to perform the given record updates.
   * 
   * @param records Array of objects containing recordId and fields/cellValues to update for that records.
   *
   * @returns {@link IPermissionResult}
   *
   * #### Description
   *
   * This method performs **permission** and **value legality** checks based on the level of detail of the value passed in. 
   * Passing in valuesMap will check the legality of cell writes and column permissions, 
   * and passing in recordId will check the existence of records and modification permissions.
   *
   * The format of records is the same as when writing to cells. For cell value writing format, refer to {@link FieldType}.
   *
   * Returns `{acceptable: true}` if the current user can update the specified records.
   *
   * Returns `{acceptable: false, message: string}` if no permission to operate, message may be used to display an error message to the user.
   *
   * #### Example
   * ```js
   * const recordsToSet = [
   *   {
   *     // Validating a complete record update
   *     id: record1.id,
   *     valuesMap: {
   *       // fields can be specified by ID
   *       fld1234567890: 'this is a text value',
   *       fld0987654321: 1024,
   *     },
   *   },
   *   {
   *     id: record2.id,
   *     valuesMap: {
   *       // If only a fieldId is passed, only the cell of this record will be modified, and the other cells will not be modified
   *       fld1234567890: 'another text value',
   *     },
   *   },
   *   {
   *     // Validating an update to a specific record, not knowing what fields will be updated
   *     id: record3.id,
   *   },
   *   {
   *     // Validating an update to specific cell values, not knowing what record will be updated
   *     valuesMap: {
   *       fld1234567890: 'another text value',
   *       // You can use undefined if you know you're going to update a field, but don't know the new cell value yet.
   *       fld0987654321: undefined,
   *     },
   *   },
   * ];
   *
   * const checkResult = datasheet.checkPermissionsForSetRecords(recordsToSet);
   * if (!checkResult.acceptable) {
   *   console.log(checkResult.message);
   * }
   *
   * // Check if user could potentially update records.
   * // Equivalent to datasheet.checkPermissionsForSetRecord()
   * const setUnknownRecordAndFieldsCheckResult =
   *   datasheet.checkPermissionsForSetRecords();
   * ```
   *
   */
  checkPermissionsForSetRecords(records: { id?: string, valuesMap?: { [key: string]: any } }[]): IPermissionResult {
    const recordIds: (string | undefined)[] = [];
    const recordsValues: ({ [key: string]: any } | undefined)[] = [];
    for (const record of records) {
      recordIds.push(record.id);
      recordsValues.push(record.valuesMap);
    }
    // records checks existence
    const recordIdsExist = this.checkRecordIdsExist(recordIds);
    if (!recordIdsExist.acceptable) {
      return recordIdsExist;
    }

    const basicPermissionsCheckResult = this.checkBasicPermissions(DatasheetOperationPermission.EditRecord);
    if (!basicPermissionsCheckResult.acceptable) {
      return basicPermissionsCheckResult;
    }

    return this.checkPermissionsForRecordsValues(recordsValues);
  }

  /**
   * Checks whether the current user has permission to delete the specified record.
   *
   * @param recordId the record to be deleted.
   * @returns
   * 
   *
   * #### Description
   * Accepts optional input.
   *
   * Returns `{acceptable: true}` if the current user can delete the specified record.
   *
   * Returns `{acceptable: false, message: string}` if no permission to operate, message may be used to display an error message to the user.
   *
   * #### Example
   * ```js
   * // Check if user can delete a specific record
   * const deleteRecordCheckResult =
   *   datasheet.checkPermissionsForDeleteRecord(recordId);
   * if (!deleteRecordCheckResult.acceptable) {
   *   alert(deleteRecordCheckResult.message);
   * }
   *
   * // Check if user could potentially delete a record.
   * // Use when you don't know the specific record you want to delete yet (for
   * // example, to show/hide UI controls that let you select a record to delete).
   * const deleteUnknownRecordCheckResult =
   *   datasheet.checkPermissionsForDeleteRecord();
   * ```
   */
  checkPermissionsForDeleteRecord(recordId?: string): IPermissionResult {
    const basicPermissionsCheckResult = this.checkBasicPermissions(DatasheetOperationPermission.DeleteRecord);
    if (!basicPermissionsCheckResult.acceptable) {
      return basicPermissionsCheckResult;
    }

    if (!recordId) {
      return basicPermissionsCheckResult;
    }

    return this.checkPermissionsForDeleteRecords([recordId]);
  }

  /**
   * Checks whether the current user has permission to delete the specified records.
   * 
   * @param recordIds the records to be deleted.
   * @returns
   * 
   * 
   * #### Description
   * Accepts optional input.
   *
   * Returns `{acceptable: true}` if the current user can delete the specified records.
   *
   * Returns `{acceptable: false, message: string}` if no permission to operate, message may be used to display an error message to the user.
   *
   * #### Example
   * ```js
   * // Check if user can delete specific records
   * const deleteRecordsCheckResult =
   *   datasheet.checkPermissionsForDeleteRecords([recordId1. recordId2]);
   * if (!deleteRecordsCheckResult.acceptable) {
   *   alert(deleteRecordsCheckResult.message);
   * }
   *
   * // Check if user could potentially delete records.
   * // Use when you don't know the specific records you want to delete yet (for
   * // example, to show/hide UI controls that let you select records to delete).
   * // Equivalent to datasheet.checkPermissionsForDeleteRecord
   * const deleteUnknownRecordsCheckResult =
   *   datasheet.checkPermissionsForDeleteRecords();
   * ```
   */
  checkPermissionsForDeleteRecords(recordIds?: string[]): IPermissionResult {
    const basicPermissionsCheckResult = this.checkBasicPermissions(DatasheetOperationPermission.DeleteRecord);
    if (!basicPermissionsCheckResult.acceptable) {
      return basicPermissionsCheckResult;
    }

    if (!recordIds) {
      return basicPermissionsCheckResult;
    }

    return this.checkRecordIdsExist(recordIds);
  }
  
  /**
   * Checks whether the current user has permission to create a field.
   *
   * @param name name for the field. must be case-insensitive unique.
   * @param type type for the field.
   * @param property property for the field. omit for fields without writable property.
   * @returns
   * 
   *
   * #### Description
   *
   * Accepts partial input, in the same format as {@link addField}.
   * 
   * Returns `{acceptable: true}` if the current user can create the specified field.
   *
   * Returns `{acceptable: false, message: string}` if no permission to operate, message may be used to display an error message to the user.
   *
   * #### Example
   * ```js
   * // Checks whether the current user has permission to create a field
   * const addFieldCheckResult =
   *   datasheet.checkPermissionsForAddField(recordId);
   * if (!addFieldCheckResult.acceptable) {
   *   alert(addFieldCheckResult.message);
   * }
   * 
   * // Check if user could potentially create a field.
   * // Use when you don't know the specific a field you want to create yet (for example,
   * // to show or hide UI controls that let you start creating a field.)
   * const addUnknownFieldCheckResult =
   *   datasheet.checkPermissionsForAddField();
   * ```
   */
  checkPermissionsForAddField(name?: string | undefined, type?: FieldType, property?: any): IPermissionResult {
    const basicPermissionsCheckResult = this.checkBasicPermissions(DatasheetOperationPermission.AddField);
    if (!basicPermissionsCheckResult.acceptable) {
      return basicPermissionsCheckResult;
    }

    const checkFieldName = this.checkFieldName(name);
    if (!checkFieldName.acceptable) {
      return checkFieldName;
    }

    let fieldType: CoreFieldType | undefined = undefined;
    if (type) {
      fieldType = getFieldTypeByString(type as any);
      if (!fieldType) {
        return errMsg('Unknown field type');
      }
    }
    
    if (fieldType && property != null) {
      const fieldInfoForState = {
        id: getNewId(IDPrefix.Field),
        // New fields are added and no longer populated with a field name by default
        name,
        type: fieldType,
        property: getFieldClass(fieldType).defaultProperty(),
      } as IField;
      const state = this.wCtx.widgetStore.getState() as any as IReduxState;
      const field = CoreField.bindContext(fieldInfoForState, state);
      const { error } = field.validateAddOpenFieldProperty(property || null);
      if (error) {
        return errMsg(`current property ${JSON.stringify(property)} does not match the format, please check: ${error.message}`);
      }
    }
    return { acceptable: true };
  }

  /**
   * Checks whether the current user has permission to delete a field.
   * 
   * @param fieldId the field to be deleted
   * @returns
   * 
   *
   * #### Description
   *
   * Returns `{acceptable: true}` if the current user can delete the specified field.
   *
   * Returns `{acceptable: false, message: string}` if no permission to operate, message may be used to display an error message to the user.
   *
   * #### Example
   * ```js
   * // Checks whether the current user has permission to delete a field.
   * const deleteFieldCheckResult =
   *   datasheet.checkPermissionsForDeleteField(fieldId);
   * if (!deleteFieldCheckResult.acceptable) {
   *   alert(deleteFieldCheckResult.message);
   * }
   *
   * // Check if user could potentially delete a field.
   * // Use when you don't know the specific a field you want to delete yet (for
   * // example, to show/hide UI controls that let you select a field to delete).
   * const deleteUnknownFieldCheckResult =
   *   datasheet.checkPermissionsForDeleteField();
   * ```
   */
  checkPermissionsForDeleteField(fieldId?: string | undefined) {
    const basicPermissionsCheckResult = this.checkBasicPermissions(DatasheetOperationPermission.DeleteField);
    if (!basicPermissionsCheckResult.acceptable) {
      return basicPermissionsCheckResult;
    }
    if (!fieldId) {
      return basicPermissionsCheckResult;
    }

    const state = this.wCtx.widgetStore.getState() as any as IReduxState;
    const fieldPermissionMap = Selectors.getFieldPermissionMap(state, this.datasheetId);
    const fieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, fieldId);
    const field = Selectors.getField(state, fieldId, this.datasheetId);

    if (!field) {
      return errMsg(`Current deleted fieldId: ${fieldId} does not exist`);
    }

    if (this.checkPrimaryField(fieldId!)) {
      return errMsg(`${field.name}(${fieldId}) is Primary field, cannot be deleted`);
    }

    if (fieldRole === ConfigConstant.Role.None || fieldRole === ConfigConstant.Role.Reader) {
      return errMsg(`No write access for ${field.name}(${fieldId}) column`);
    }

    return { acceptable: true };
  }
}
