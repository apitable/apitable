import { IReduxState, IViewProperty, IViewRow, ViewType, ViewDerivateFactory, Selectors } from '@apitable/core';
import { ISortedField, IWidgetContext } from 'interface';
import { getSnapshot } from 'store';
import { Record } from './record';

export class View {
  /**
   * @hidden
   */
  constructor(
    private datasheetId: string,
    private wCtx: IWidgetContext,
    private viewData: IViewProperty
  ) {}

  /**
   * The unique ID of the view.
   * 
   * @returns
   *
   * #### Example
   * ```js
   * console.log(myView.id);
   * // => 'viwxxxxxx'
   * ```
   */
  public get id() {
    return this.viewData.id;
  }

  /**
   * The name of the view.
   * 
   * @returns
   *
   * #### Example
   * ```js
   * console.log(myView.name);
   * // => 'Test View'
   * ```
   */
  public get name() {
    return this.viewData.name;
  }

  /**
   * The type of the view.
   * 
   * @returns
   * 
   * #### Example
   * ```js
   * console.log(myView.type);
   * // => 1
   * ```
   */
  public get type() {
    return this.viewData.type;
  }

  /**
   * The url of the view.
   * 
   * @returns
   * 
   * #### Example
   * ```js
   * console.log(myView.url);
   * ```
   */
  public get url() {
    return `${window.location.origin}/workbench/${this.datasheetId}/${this.id}`;
  }

  /**
   * Get the specified record in the view.
   * 
   * @param recordId The ID of the record.
   * 
   * @returns
   * 
   * #### Example
   * ```js
   * console.log(myView.getRecordAsync('recxxxxxx')); // => Record
   * ```
   */
  public getRecordAsync(recordId: string): Record {
    return new Record(this.datasheetId, this.wCtx, recordId);
  }

  /**
   * Batch get the records in the view.
   * 
   * @param options.recordIds List of record IDs.
   * 
   * @param options.sorts Which fields the records need to be sorted by.
   * 
   * @returns
   * 
   * #### Example
   * ```js
   * console.log(myView.getRecordsAsync()); // => [Record, Record, ...]
   * console.log(myView.getRecordsAsync({ recordIds: ['recxxxxxx01', 'recxxxxxx02'] })); // => [Record, Record]
   * ```
   */
  public getRecordsAsync(
    options?: {
      recordIds?: string[],
      sorts?: ISortedField[],
    }
  ): Record[] {
    const { rows } = this.viewData;
    if (!rows?.length) return [];

    let finalRows: IViewRow[];
    const state = this.wCtx.widgetStore.getState() as unknown as IReduxState;
    const viewDerivate = ViewDerivateFactory.createViewDerivate(state, this.datasheetId, ViewType.Grid);
    const viewDerivation = viewDerivate.getViewDerivation(this.viewData);
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
}