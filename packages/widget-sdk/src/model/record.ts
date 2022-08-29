import { CacheManager, getFieldTypeString } from '@vikadata/core';
import { Field, Selectors, t, Strings, ConfigConstant } from 'core';
import { isIframe } from 'iframe_message/utils';
import { IWidgetContext } from 'interface';
import { getActiveView, getFieldPermissionMap, getFieldRoleByFieldId, getSnapshot, getView } from 'store/selector';
import { showField } from './field';

/**
 * 数表行操作以及信息。
 * 
 * 获取行记录数据，可以使用 {@link useRecord}（查询单条记录数据）、{@link useRecords}（批量查询记录数据）。
 */
export class Record {
  /**
   * @hidden
   */
  constructor(
    public datasheetId: string,
    private wCtx: IWidgetContext,
    public recordId: string,
  ) { }

  private getRecordData() {
    const state = this.wCtx.globalStore.getState();
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
   * 获取 Record 中的指定单元格值
   *
   * @param fieldId 字段ID
   * @returns
   * 
   * #### 示例
   * ```js
   * const cellValue = myRecord.getCellValue(mySingleLineTextFieldId);
   * console.log(cellValue);
   * // => 'cell value'
   * ```
   */
  getCellValue(fieldId: string): any {
    const state = this.wCtx.globalStore.getState();
    const field = Selectors.getField(state, fieldId, this.datasheetId)!;
    const cellValue = this._getCellValue(fieldId);
    return Field.bindContext(field, state).cellValueToOpenValue(cellValue);
  }

  /**
   * @hidden
   */
  _getCellValue(fieldId: string): any {
    const state = this.wCtx.widgetStore.getState();
    const globalState = this.wCtx.globalStore.getState();
    const snapshot = getSnapshot(state, this.datasheetId)!;

    const field = Selectors.getField(globalState, fieldId, this.datasheetId)!;
    // 企业微信屏蔽的字段
    if (!showField(getFieldTypeString(field.type))) {
      return null;
    }

    if (isIframe()) {
      CacheManager.removeCellCacheByRecord(this.datasheetId, this.recordId);
    }
    // getCellValue 判断列权限。如果无权限返回null
    if (this.getFieldRole(fieldId) === ConfigConstant.Role.None) {
      return null;
    }
    return Selectors.getCellValue(globalState, snapshot, this.recordId, fieldId);
  }

  /**
   * 获取 Record 中的指定单元格值, 并且转换为字符串类型
   *
   * @returns
   * 
   * #### 示例
   * ```js
   * const stringValue = myRecord.getCellValueString(myNumberFieldId);
   * console.log(stringValue);
   * // => '42'
   * ```
   */
  getCellValueString(fieldId: string): string | null {
    const state = this.wCtx.globalStore.getState();
    const datasheetId = this.datasheetId;
    const field = Selectors.getField(state, fieldId, this.datasheetId)!;
    const cellValue = this._getCellValue(fieldId);
    return Field.bindContext(field, state).cellValueToString(cellValue, { datasheetId });
  }

  /**
   * 记录的 URL 地址，你可以在浏览器中访问这个地址，打开维格表界面并定位到记录
   * 
   * @param viewId 
   * @returns
   * 
   */
  url(viewId?: string) {
    const state = this.wCtx.globalStore.getState();
    const proto = window.location.protocol;
    const host = window.location.host;
    viewId = viewId ? viewId : Selectors.getActiveViewId(state, this.datasheetId)!;
    return `${proto}//${host}/workbench/${this.datasheetId}/${viewId}/${this.recordId}`;
  }

  /**
   * 记录ID recordId
   */
  get id() {
    return this.recordId;
  }

  /**
   * 首列单元格的字符串值。首列通常被看做主字段。
   *
   * @returns
   * 
   * #### 示例
   * ```js
   * console.log(myRecord.title);
   * // => '42'
   * ```
   */
  get title(): string | null {
    const state = this.wCtx.widgetStore.getState();
    const viewId = getActiveView(state);
    const view = getView(state, viewId, this.datasheetId)!;
    const primaryFieldId = view.columns[0].fieldId;
    return this.getCellValue(primaryFieldId) || t(Strings.record_unnamed);
  }

  /**
   * 评论数量
   * @returns
   * 
   */
  get commentCount() {
    const record = this.getRecordData();
    return record.commentCount;
  }
}
