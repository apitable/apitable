import { IWidgetContext } from 'interface';
import { Record as ModelRecord } from '../model';

/**
 * Record operations
 */
export class Record {
  private modelRecord: ModelRecord;

  /**
   * @hidden
   */
  constructor(
    private datasheetId: string,
    private wCtx: IWidgetContext,
    private recordId: string,
  ) {
    this.modelRecord = new ModelRecord(this.datasheetId, this.wCtx, this.recordId);
  }

  /**
   * The unique ID of the record.
   * 
   * @returns
   * 
   * #### Example
   * ```js
   * console.log(myRecord.id);
   * // => 'recxxxxxx'
   */
  public get id() {
    return this.recordId;
  }

  /**
   * The cell value of the primary field of cells. 
   * The primary field is usually seen as the main field.
   *
   * @returns
   * 
   * #### Example
   * ```js
   * console.log(myRecord.title);
   * // => '42'
   * ```
   */
  public get title(): string | null {
    return this.modelRecord.title;
  }

  /**
   * The comment counts of the record.
   * 
   * @returns
   * 
   * #### Example
   * ```js
   * console.log(myRecord.commentCount); // => 10
   */
  public get commentCount() {
    return this.modelRecord.commentCount;
  }

  /**
   * Get the cell value of a specified cell in record.
   *
   * @param fieldId The ID of the field.
   * @returns
   * 
   * #### Example
   * ```js
   * const cellValue = myRecord.getCellValue(mySingleLineTextFieldId);
   * console.log(cellValue); // => 'cell value'
   * ```
   */
  public getCellValue(fieldId: string): any {
    return this.modelRecord.getCellValue(fieldId);
  }

  /**
   * Get the cell value of a specified cell in record, and convert it to a string type.
   *
   * @returns
   * 
   * #### Example
   * ```js
   * const stringValue = myRecord.getCellValueString(myNumberFieldId);
   * console.log(stringValue); // => '42'
   * ```
   */
  public getCellValueString(fieldId: string): string | null {
    return this.modelRecord.getCellValueString(fieldId);
  }

  /**
   * The url of the record.
   * 
   * @param viewId 
   * 
   * @returns
   * 
   * #### Example
   * ```js
   * console.log(myRecord.getUrl('viwxxxxxx'));
   * ```
   */
  public getUrl(viewId?: string) {
    return this.modelRecord.url(viewId);
  }
}
