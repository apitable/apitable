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

import { CollaCommandName, IModifySelfView, IMoveSelfView } from 'commands';
import { IFieldMap, IRecordCellValue, IReduxState, IViewColumn, IViewLockInfo, IViewProperty, IViewRow } from 'exports/store/interfaces';
import { ViewType } from 'modules/shared/store/constants';
import {
  getSnapshot,
} from 'modules/database/store/selectors/resource/datasheet/base';
import { getViewIndex } from 'modules/database/store/selectors/resource/datasheet/calc';
import { keyBy } from 'lodash';
import { ICellValue } from 'model/record';
import { getViewClass } from 'model/views';
import { Store } from 'redux';
import type { Datasheet, ICommandExecutionResult, ISaveOptions } from './datasheet';
import { Field } from './field';
import { IRecordVoTransformOptions, Record } from './record';

export class View {
  private readonly fieldMap: IFieldMap;

  public readonly property: IViewProperty;

  /**
   * Create a `View` instance from `IViewInfo`.
   *
   * @internal This constructor is not intended for public use.
   */
  constructor(private readonly datasheet: Datasheet, private readonly store: Store<IReduxState>, info: IViewInfo) {
    const { property, fieldMap } = info;

    this.property = property;
    this.fieldMap = fieldMap;
  }

  public get id(): string {
    return this.property.id;
  }

  public get name(): string {
    return this.property.name;
  }

  public get type(): ViewType {
    return this.property.type;
  }

  public get rows(): IViewRow[] {
    return this.property.rows;
  }

  public get columns(): IViewColumn[] {
    return this.property.columns;
  }

  /**
   * get view index, begin with 0.
   *
   * @return index of view
   */
  public get index(): number {
    return getViewIndex(this.datasheet.snapshot, this.id);
  }

  /**
   * Get all fields in the view. Hidden fields are not included by default.
   */
  public getFields(options: IFieldsOptions): Promise<Field[]> {
    const { columns, fieldMap } = this;
    const { includeHidden } = options;
    const fields: Field[] = [];
    for (const column of columns) {
      const field = fieldMap[column.fieldId];
      // When specifying a view, it is consistent with the view order being visible and invisible.
      if (field && (includeHidden || !column.hidden)) {
        fields.push(new Field(field, this.store)); // core.Field.bindContext(field, state).getApiMeta(dstId)));
      }
    }
    return Promise.resolve(fields);
  }

  /**
   * Get records in the view.
   */
  public getRecords(options: IRecordsOptions): Promise<Record[]> {
    const { store, fieldMap } = this;
    const snapshot = getSnapshot(store.getState());
    if (!snapshot) {
      return Promise.resolve([]);
    }

    const { pagination, maxRecords } = options;

    // Pagination
    let pageRows = this.rows;
    if (maxRecords !== undefined && maxRecords < this.rows.length) {
      pageRows = this.rows.slice(0, maxRecords);
    }

    if (pagination !== undefined) {
      const start = (pagination.pageNum - 1) * pagination.pageSize;
      const end = start + pagination.pageSize;
      pageRows = pagination.pageSize == -1 ? pageRows : pageRows.slice(start, end);
    }

    if (pageRows.length === 0) {
      return Promise.resolve([]);
    }

    const recordMap = snapshot.recordMap;
    const fieldKeys = Object.keys(this.fieldMap);
    const columnMap = keyBy(this.columns, 'fieldId');
    const voTransformOptions: IRecordVoTransformOptions = {
      fieldMap,
      store,
      fieldKeys,
      columnMap,
    };

    const records: Record[] = [];
    for (const row of pageRows) {
      if (recordMap[row.recordId]) {
        records.push(
          new Record(recordMap[row.recordId]!, {
            voTransformOptions,
          }),
        );
      }
    }
    return Promise.resolve(records);
  }

  /**
   * Add records to the datasheet via this view.
   *
   * @param options Options for adding records.
   * @param saveOptions Options for the data saver.
   * @return If the command execution succeeded, the `data` field of the return value is an array of record IDs.
   */
  public addRecords(recordOptions: IAddRecordsOptions, saveOptions: ISaveOptions): Promise<ICommandExecutionResult<string[]>> {
    return this.datasheet.addRecords(
      {
        ...recordOptions,
        viewId: this.id,
      },
      saveOptions,
    );
  }

  /**
   * Delete this view.
   *
   * @param saveOptions The options that will be passed to the data saver.
   */
  public delete(saveOptions: ISaveOptions): Promise<ICommandExecutionResult<void>> {
    return this.datasheet.deleteViews([this.id], saveOptions);
  }

  /**
   * Modify view property.
   *
   * @param view view info
   * @param saveOptions The options that will be passed to the data saver.
   */
  public modify(view: IModifySelfView, saveOptions: ISaveOptions): Promise<ICommandExecutionResult<void>> {
    return this.datasheet.modifyViews([{ ...view, viewId: this.id }], saveOptions);
  }

  /**
   * move view.
   *
   * @param view view move info
   * @param saveOptions The options that will be passed to the data saver.
   */
  public move(view: IMoveSelfView, saveOptions: ISaveOptions): Promise<ICommandExecutionResult<void>> {
    return this.datasheet.moveViews([{ ...view, viewId: this.id }], saveOptions);
  }

  /**
   * Set lock info of the view.
   *
   * @param saveOptions The options that will be passed to the data saver.
   */
  public setLockInfo(lockInfo: IViewLockInfo | null, saveOptions: ISaveOptions): Promise<ICommandExecutionResult<void>> {
    return this.datasheet.doCommand<void>(
      {
        cmd: CollaCommandName.SetViewLockInfo,
        data: lockInfo,
        viewId: this.id,
      },
      saveOptions,
    );
  }

  /**
   * Set autoSave of the view.
   *
   * @param saveOptions The options that will be passed to the data saver.
   */
  public setAutoSave(autoSave: boolean, saveOptions: ISaveOptions): Promise<ICommandExecutionResult<void>> {
    return this.datasheet.doCommand<void>(
      {
        cmd: CollaCommandName.SetViewAutoSave,
        autoSave,
        viewId: this.id,
      },
      saveOptions,
    );
  }

  /**
   * generate default view property
   *
   * @param viewType view type, if omitted, defaults to the type of this view.
   */
  public deriveDefaultViewProperty(viewType?: ViewType): IViewProperty | null {
    return getViewClass(viewType ?? this.type).generateDefaultProperty(this.datasheet.snapshot, this.id, this.store.getState());
  }
}

/**
 * Options for creating a `View` instance.
 */
export interface IViewOptions {
  /**
   * The function to get the `IViewInfo` of a view from the internal redux state.
   */
  getViewInfo: (state: IReduxState) => Promise<IViewInfo | null> | IViewInfo | null;
}

/**
 * The data that are required to create a `View` instance.
 */
export interface IViewInfo {
  property: IViewProperty;
  fieldMap: IFieldMap;
}

/**
 * The options for getting records.
 */
export interface IRecordsOptions {
  /**
   * Maximum number of records retrieved. The retrieved list of records is trimmed before pagination.
   * The default value is Infinity.
   */
  maxRecords?: number;

  pagination?: {
    /**
     * 1-based page number. If the page number exceeds maximum pages, an empty list of records is returned.
     */
    pageNum: number;

    /**
     * The maximum number of records in a single page.
     */
    pageSize: number;
  };
}

export type IAddRecordsOptions =
  | {
  /**
   * The position where new records will be inserted.
   */
  index: number;

  /**
   * The number of new records. All cells of new records are set to default values, or left empty if no
   * default values are set for corresponding fields.
   */
  count: number;

  /**
   * The cell values of the group which the new records belongs to.
   */
  groupCellValues?: ICellValue[];

  ignoreFieldPermission?: boolean;
}
  | {
  /**
   * The position where new records will be inserted.
   */
  index: number;

  /**
   * New record values.
   */
  recordValues: IRecordCellValue[];

  /**
   * The cell values of the group which the new records belongs to.
   */
  groupCellValues?: ICellValue[];

  ignoreFieldPermission?: boolean;
};

/**
 * The options for getting fields in a view.
 */
export interface IFieldsOptions {
  /**
   * If hidden fields are included in the returned field list. Defaults to false.
   */
  includeHidden?: boolean;
}
