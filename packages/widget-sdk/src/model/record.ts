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

import { CacheManager, getFieldTypeString, IReduxState } from '@apitable/core';
import { ConfigConstant, Field, Selectors, Strings, t } from 'core';
import { FieldType, IWidgetContext } from 'interface';
import { getActiveViewId, getFieldPermissionMap, getFieldRoleByFieldId, getSnapshot, getView } from 'store/selector';
import { isSandbox } from 'utils/private';
import { showField } from './field';

/**
 * Datasheet row operations and information.
 *
 * Get the rows record, you can use {@link useRecord} (querying single record data), {@link useRecords} (batch query of record data)
 */
export class Record {
  /**
   * @hidden
   */
  constructor(public datasheetId: string, protected wCtx: IWidgetContext, public recordId: string) {}

  private getRecordData() {
    const state = this.wCtx.widgetStore.getState() as any as IReduxState;
    const datasheetId = this.datasheetId;
    const record = Selectors.getRecord(state, this.recordId, datasheetId);
    return record;
  }

  private getFieldRole(fieldId: string) {
    const state = this.wCtx.widgetStore.getState();
    const fieldPermissionMap = getFieldPermissionMap(state, this.datasheetId);
    return getFieldRoleByFieldId(fieldPermissionMap, fieldId);
  }

  /**
   * Gets the cell value of the given field for this record.
   *
   * @param fieldId The field ID whose cell value you'd like to get.
   * @returns
   *
   * #### Example
   * ```js
   * const cellValue = myRecord.getCellValue(mySingleLineTextFieldId);
   * console.log(cellValue);
   * // => 'cell value'
   * ```
   */
  getCellValue(fieldId: string): any {
    const state = this.wCtx.widgetStore.getState() as any as IReduxState;
    const field = Selectors.getField(state, fieldId, this.datasheetId)!;
    const cellValue = this._getCellValue(fieldId);
    return Field.bindContext(field, state).cellValueToOpenValue(cellValue);
  }

  /**
   * @hidden
   */
  _getCellValue(fieldId: string): any {
    const state = this.wCtx.widgetStore.getState();
    const globalState = state as any as IReduxState;
    const snapshot = getSnapshot(state, this.datasheetId)!;

    const field = Selectors.getField(globalState, fieldId, this.datasheetId)!;
    // wecom blocked fields
    if (!showField(getFieldTypeString(field.type) as any as FieldType)) {
      return null;
    }

    // getCellValue determines the column permission. Return null if no permission
    if (this.getFieldRole(fieldId) === ConfigConstant.Role.None) {
      return null;
    }
    // remove cell value cache.
    isSandbox() && CacheManager.removeCellCacheByRecord(this.datasheetId, this.recordId);
    return Selectors.getCellValue(globalState, snapshot, this.recordId, fieldId);
  }

  /**
   * Gets the cell value of the given field of record, and convert to string type.
   *
   * @returns
   *
   * #### Example
   * ```js
   * const stringValue = myRecord.getCellValueString(myNumberFieldId);
   * console.log(stringValue);
   * // => '42'
   * ```
   */
  getCellValueString(fieldId: string): string | null {
    const state = this.wCtx.widgetStore.getState() as any as IReduxState;
    const datasheetId = this.datasheetId;
    const field = Selectors.getField(state, fieldId, this.datasheetId)!;
    const cellValue = this._getCellValue(fieldId);
    return Field.bindContext(field, state).cellValueToString(cellValue, { datasheetId });
  }

  /**
   *
   * The URL address of the record, which you can access in your browser,
   * opens the Wiggle Table interface and locates the record
   *
   * @param viewId
   * @returns
   *
   */
  url(viewId?: string) {
    const state = this.wCtx.widgetStore.getState() as any as IReduxState;
    const proto = window.location.protocol;
    const host = window.location.host;
    viewId = viewId ? viewId : Selectors.getActiveViewId(state, this.datasheetId)!;
    return `${proto}//${host}/workbench/${this.datasheetId}/${viewId}/${this.recordId}`;
  }

  /**
   * The ID for this record.
   */
  get id() {
    return this.recordId;
  }

  /**
   * The primary cell value in this record, formatted as a string.
   *
   * @returns
   *
   * #### Example
   * ```js
   * console.log(myRecord.title);
   * // => '42'
   * ```
   */
  get title(): string | null {
    const state = this.wCtx.widgetStore.getState();
    const viewId = getActiveViewId(state);
    const view = getView(state, viewId!, this.datasheetId)!;
    const primaryFieldId = view.columns[0]!.fieldId;
    return this.getCellValue(primaryFieldId) || t(Strings.record_unnamed);
  }

  /**
   * The number of comments on this record.
   * @returns
   *
   */
  get commentCount() {
    const record = this.getRecordData()!;
    return record.commentCount;
  }
}
