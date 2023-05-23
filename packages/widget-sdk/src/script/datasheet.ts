import { FieldType, IInsertPosition, ISortedField, IWidgetContext, IWidgetDatasheetState } from 'interface';
import { Selectors, IAddOpenFieldProperty as IFieldProperty, Conversion } from 'core';
import { IReduxState, IViewRow, ViewDerivateFactory, ViewType } from '@apitable/core';
import { View } from './view';
import { Field } from './field';
import { Record } from './record';
import { Datasheet as ModelDatasheet } from '../model';
import { getSnapshot } from 'store';

/**
 * Datasheet operations
 * 
 * - {@link id} The unique ID of the datasheet.
 * 
 * - {@link name} The name of the datasheet.
 * 
 * - {@link url} The url of the datasheet.
 * 
 * - {@link description} The description of the Datasheet.
 * 
 * - {@link views}: All views of the datasheet.
 * 
 * - {@link fields}: All fields of the datasheet.
 * 
 * - {@link getView}: Get the specified view in the datasheet.
 * 
 * - {@link getField}: Get the specified field in the datasheet.
 * 
 * - {@link createFieldAsync}: Create a new field.
 * 
 * - {@link deleteFieldAsync}: Delete the specified field.
 * 
 * - {@link getRecordAsync}: Get the record by record ID in the datasheet.
 * 
 * - {@link getRecordsAsync}: Batch get records in the datasheet.
 *
 * - {@link createRecordAsync}: Create a new record with the specified cell values.
 *
 * - {@link createRecordsAsync}: Create new records with the specified cell values.
 *
 * - {@link updateRecordAsync}: Updates cell values for a record.
 *
 * - {@link updateRecordsAsync}: Updates cell values for records.
 *
 * - {@link deleteRecordAsync}: Delete the specified record.
 *
 * - {@link deleteRecordsAsync}: Delete the specified records.
 *
 */
export class Datasheet {
  private datasheetData: IWidgetDatasheetState | null | undefined;
  private modalDatasheet: ModelDatasheet;

  /**
   * @inner
   * @hidden
   */
  constructor(
    private datasheetId: string,
    private wCtx: IWidgetContext,
  ) {
    this.modalDatasheet = new ModelDatasheet(datasheetId, wCtx);
    this.datasheetData = wCtx.widgetStore?.getState().datasheetMap[this.datasheetId];
  }

  /**
   * The unique ID of the datasheet.
   * 
   * @returns
   *
   * #### Example
   * ```js
   * console.log(myDatasheet.id);
   * // => 'dstxxxxxxx'
   * ```
   */
  public get id() {
    return this.datasheetData?.datasheet?.datasheetId;
  }

  /**
   * The name of the datasheet.
   * 
   * @returns
   *
   * #### Example
   * ```js
   * console.log(myDatasheet.name);
   * // => 'datasheetName'
   * ```
   */
  public get name() {
    return this.datasheetData?.datasheet?.datasheetName; 
  }

  /**
   * The description of the datasheet.
   * 
   * @returns
   *
   * #### Example
   * ```js
   * console.log(myDatasheet.description);
   * // => 'description information'
   * ```
   */
  public get description() {
    return this.datasheetData?.datasheet?.description;
  }

  /**
   * The url of the datasheet.
   * 
   * @returns
   *
   * #### Example
   * ```js
   * console.log(myDatasheet.url);
   * ```
   */
  public get url(): string {
    return `${window.location.origin}/workbench/${this.datasheetId}`;
  }

  /**
   * All views of the datasheet.
   * 
   * @returns
   *
   * #### Example
   * ```js
   * console.log(myDatasheet.views);
   * // => [View, View]
   * ```
   */
  public get views(): Array<View> {
    const state = this.wCtx.widgetStore.getState() as unknown as IReduxState;
    const viewList = Selectors.getViewsList(state, this.datasheetId);
    return viewList.map(view => new View(this.datasheetId ,this.wCtx, view));
  }

  /**
   * All fields of the datasheet.
   * 
   * @returns
   *
   * #### Example
   * ```js
   * console.log(myDatasheet.fields);
   * // => [Field, Field]
   * ```
   */
  public get fields() {
    const state = this.wCtx.widgetStore.getState() as unknown as IReduxState;
    const currentView = Selectors.getCurrentView(state);
    const fieldDataMap = Selectors.getFieldMap(state, this.datasheetId)!;
    const finalView = currentView || Selectors.getViewsList(state, this.datasheetId)[0]!;
    return (finalView.columns || [])?.map(({ fieldId }) => {
      return new Field(this.datasheetId, this.wCtx, fieldDataMap[fieldId]!);
    });
  }

  /**
   * Get the specified view in the datasheet.
   * 
   * @param viewKey Name or ID of the view
   * 
   * @returns
   *
   * #### Example
   * ```js
   * console.log(myDatasheet.getView('viewName')); // => View
   * console.log(myDatasheet.getView('viwxxxxxx')); // => View
   * ```
   */
  public getView(viewKey: string): View {
    const view = this.getViewByIdOrNameIfExists(viewKey);
    if (!view) {
      throw new Error('No view with ID in datasheet');
    }
    return view;
  }

  private getViewByIdOrNameIfExists(viewKey: string): View | null {
    const state = this.wCtx.widgetStore.getState() as unknown as IReduxState;
    const views = Selectors.getViewsList(state, this.datasheetId);
    const finalView = views.find(({ id, name }) => [id, name].includes(viewKey));
    if (!finalView) {
      return null;
    }
    return new View(this.datasheetId ,this.wCtx, finalView);
  }

  /**
   * Get the specified field in the datasheet.
   * 
   * @param fieldKey Name or ID of the field.
   * 
   * @returns
   *
   * #### Example
   * ```js
   * console.log(myDatasheet.getField('fieldName')); // => Field
   * console.log(myDatasheet.getField('fldxxxxxx')); // => Field
   * ```
   */
  public getField(fieldKey: string) {
    const state = this.wCtx.widgetStore.getState() as unknown as IReduxState;
    const fieldDataMap = Selectors.getFieldMap(state, this.datasheetId)!;
    let fieldId = fieldKey;

    if (!fieldDataMap[fieldId]) {
      const field = Object.values(fieldDataMap).find(({ name }) => fieldKey === name);

      if (field != null) {
        fieldId = field.id;
      }
    }
    const field = Selectors.getField(state, fieldId, this.datasheetId);
    return new Field(this.datasheetId, this.wCtx, field);
  }

  /**
   * Create a new field.
   *
   * @param name The name of the field.
   * @param type The type of the field.
   * @param property The property of the field.
   * 
   * @returns
   * 
   * #### Description
   *
   * Refer to {@link FieldType} for supported field types, the write format for property, and other specifics for certain field types.
   *
   * #### Example
   * ```js
   * function createFieldAsync(name, type, property) {
   *   await datasheet.createFieldAsync(recordIds);
   * }
   * ```
   */
  public async createFieldAsync(name: string, type: FieldType, property: IFieldProperty): Promise<string> {
    return await this.modalDatasheet.addField(name, type, property);
  }

  /**
   * Delete the specified field.
   *
   * @param fieldId The ID of the field.
   * @param conversion
   * When deleting a field as an associated field,
   * mark whether the associated field of the associated datasheet is deleted or converted to text, the default is Converted to a text field.
   * 
   * @returns
   *
   * #### Description
   *
   * Throws an error if the user does not have permission to delete a field.
   *
   * #### Example
   * ```js
   * function deleteFieldAsync(fieldId) {
   *   await datasheet.deleteFieldAsync(fieldId);
   * }
   * ```
   */
  public async deleteFieldAsync(fieldId: string, conversion?: Conversion): Promise<void> {
    return await this.modalDatasheet.deleteField(fieldId, conversion);
  }

  /**
   * Get the record by record ID in the datasheet.
   * 
   * @param recordId the ID of the record.
   * @returns
   *
   * #### Example
   * ```js
   * console.log(myDatasheet.getRecordAsync(myRecordId));
   * // => Record
   * ```
   */
  public getRecordAsync(recordId: string) {
    return new Record(this.datasheetId, this.wCtx, recordId);
  }

  /**
   * Batch get records in the datasheet.
   * 
   * @param options.recordIds List of record IDs
   * 
   * @param options.sorts Which fields the records need to be sorted by.
   * 
   * @returns
   *
   * #### Example
   * ```js
   * console.log(myDatasheet.getRecordsAsync()); // => [Record, Record, ...]
   * console.log(myDatasheet.getRecordsAsync({ recordIds: [myRecordId01, myRecordId02] })); // => [Record, Record]
   * ```
   */
  public getRecordsAsync(
    options?: {
      recordIds?: string[],
      sorts?: ISortedField[],
    }
  ) {
    const state = this.wCtx.widgetStore.getState() as unknown as IReduxState;
    const currentView = Selectors.getCurrentView(state, this.datasheetId);
    const finalView = currentView || Selectors.getViewsList(state, this.datasheetId)[0];
    const viewDerivate = ViewDerivateFactory.createViewDerivate(state, this.datasheetId, ViewType.Grid);
    const viewDerivation = viewDerivate.getViewDerivation(finalView);
    let finalRows: IViewRow[];

    if (options == null || !options.recordIds?.length) {
      finalRows = viewDerivation.visibleRows;
    } else {
      const { recordIds } = options;
      finalRows = recordIds?.map(recordId => ({ recordId }));
    }

    const sorts = options?.sorts;
    if (sorts?.length) {
      const snapshot = getSnapshot(state as any, this.datasheetId);
      finalRows = Selectors.sortRowsBySortInfo(state, finalRows, sorts, snapshot!);
    }
    return finalRows.map(({ recordId }) => {
      return new Record(this.datasheetId, this.wCtx, recordId);
    });
  }

  /**
   * Create a new record with the specified cell values.
   *
   * @param valuesMap object mapping fieldId to value for that field.
   *
   * @param insertPosition Position to insert in the view.
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
   * async function createNewRecord(valuesMap) {
   *   const newRecordId = await datasheet.createRecordAsync(valuesMap);
   *   alert(`The newly created record ID is ${newRecordId}`);
   * }
   *
   * // The key of the parameter is the fieldId and the value is the cell value.
   * createNewRecord({
   *   fld1234567980: 'this is a text value',
   *   fld0987654321: 1024,
   * });
   *
   * // Different types of field cell values have specific data structures that need to be passed in correctly
   * createNewRecord({
   *   fld1234567890: 'this is a text value', // SingleLineText
   *   fld0987654321: 1024, // Number
   *   fld1234567891: 'option 1', // SingleSelect
   *   fld1234567892: ['option 1', 'option 2'], // MultiSelect
   *   fld1234567893:  1635513510962, // DateTime
   *   fld1234567894: ['rec1234567'], // MagicLink
   * });
   * ```
   */
  public async createRecordAsync(valuesMap: { [key: string]: any } = {}, insertPosition?: IInsertPosition) {
    return (await this.createRecordsAsync([valuesMap], insertPosition))[0];
  }

  /**
   * Create new records with the specified cell values.
   * 
   * @param records Array of objects with a fields key mapping fieldId to value for that field.
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
   *   // Cell values should generally have format matching the output
   *   {
   *     fld1234567890: 'this is a text value',
   *     fld0987654321: 1024,
   *   },
   *   // Specifying no fields will create a new record with no cell values set
   *   {},
   *   // Different types of field cell values have specific data structures that need to be passed in correctly
   *   {
   *     fld1234567890: 'Cat video 2', // SingleLineText
   *     fld0987654321: 1024, // Number
   *     fld1234567891: 'option 1', // SingleSelect
   *     fld1234567892: ['option 1', 'option 2'], // MultiSelect
   *     fld1234567893:  1635513510962, // DateTime
   *     fld1234567894: ['rec1234567'], // MagicLink
   *   },
   * ];
   *
   * async function createNewRecords() {
   *   const recordIds = await datasheet.createRecordsAsync(records);
   *   alert(`new records with IDs: ${recordIds}`);
   * }
   * ```
   */
  public async createRecordsAsync(
    records: { [key: string]: any }[] = [], 
    insertPosition?: IInsertPosition
  ): Promise<string[]> {
    const finalRecords = records.map(record => ({ valuesMap: record }));
    return await this.modalDatasheet.addRecords(finalRecords, insertPosition);
  }

  /**
   * Updates cell values for a record.
   *
   * @param recordId The ID of the record.
   *
   * @param valuesMap 
   * key for fieldId, value for the contents of the cell object,
   * only need to pass to modify the value, do not need to modify the key value do not need to pass.
   * To empty a field, you need to pass key: null.
   * @return 
   *
   * #### Description
   * Throws an error if the user does not have permission to update the given cell values in the record, or or recordId does not exist,
   * or when the written value type does not match.
   *
   * Refer to {@link FieldType} for cell value write formats.
   *
   * If you need to modify multiple records at the same time, use the {@link updateRecordsAsync}.
   *
   * #### Example
   * ```js
   * function updateRecordAsync(recordId, valuesMap) {
   *     datasheet.updateRecordAsync(recordId, valuesMap);
   * }
   * ```
   */
  public async updateRecordAsync(recordId: string, valuesMap: { [key: string]: any } = {}) {
    return await this.updateRecordsAsync([{ id: recordId, valuesMap }]);
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
   * If you only need to modify a single record, use the {@link updateRecordAsync}
   *
   * #### Example
   * ```js
   * function updateRecordsAsync(id, valuesMap) {
   *   datasheet.updateRecordsAsync([{ id, valuesMap }]);
   * }
   * ```
   */
  public async updateRecordsAsync(records: { id: string, valuesMap: { [key: string]: any } }[]) {
    return await this.modalDatasheet.setRecords(records);
  }

  /**
   * Delete the specified record.
   *
   * @param recordId The ID of the record.
   * @returns
   *
   * #### Description
   * Delete a record by recordId.
   *
   * Throws an error if the user does not have permission to delete the specified record.
   *
   * #### Example
   * ```js
   * async function deleteRecordAsync(recordId) {
   *   await datasheet.deleteRecordAsync(recordId);
   *   alert('The record has been deleted');
   * }
   * ```
   */
  public async deleteRecordAsync(recordId: string) {
    return await this.deleteRecordsAsync([recordId]);
  }

  /**
   * Delete the specified records.
   *
   * @param recordIds Array of recordIds.
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
   * async function deleteRecordsAsync(recordIds) {
   *   await datasheet.deleteRecordsAsync(recordIds);
   *   alert('The records has been deleted');
   * }
   * ```
   */
  public async deleteRecordsAsync(recordIds: string[]) {
    await this.modalDatasheet.deleteRecords(recordIds);
  }
}
