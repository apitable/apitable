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

import { ICollaCommandExecuteResult } from 'command_manager';
import { IFieldMap, IRecordCellValue, IReduxState, IViewColumn, IViewRow, Selectors, ViewType } from 'exports/store';
import { keyBy } from 'lodash';
import { ICellValue } from 'model';
import { Store } from 'redux';
import { Datasheet, ISaveOptions } from './datasheet';
import { Field } from './field';
import { IRecordVoTransformOptions, Record } from './record';

export class View {
  public readonly type: ViewType;
  public readonly id: string;
  public readonly name: string;

  public readonly rows: IViewRow[];
  public readonly columns: IViewColumn[];
  private readonly fieldMap: IFieldMap;

  /**
   * Create a `View` instance from `IViewInfo`.
   *
   * @internal This constructor is not intended for public use.
   */
  constructor(private readonly datasheet: Datasheet, private readonly store: Store<IReduxState>, info: IViewInfo) {
    const { name, type, viewId, rows, columns, fieldMap } = info;

    this.name = name;
    this.type = type;
    this.id = viewId;
    this.rows = rows;
    this.columns = columns;
    this.fieldMap = fieldMap;
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
    const snapshot = Selectors.getSnapshot(store.getState());
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
   * @param options options for adding records
   * @param saveOptions options for the data saver.
   * @return If the command succeeded, the `data` field of the return value is an array of record IDs.
   */
  public addRecords(recordOptions: IAddRecordsOptions, saveOptions: ISaveOptions): Promise<ICollaCommandExecuteResult<string[]>> {
    return this.datasheet.addRecords(
      {
        ...recordOptions,
        viewId: this.id,
      },
      saveOptions,
    );
  }
}

/**
 * Options for creating a `View` instance.
 */
export interface IViewOptions {
  getViewInfo: (state: IReduxState) => Promise<IViewInfo | null> | IViewInfo | null;
}

/**
 * The data that are required to create a `View` instance.
 */
export interface IViewInfo {
  name: string;
  type: ViewType;
  viewId: string;
  rows: IViewRow[];
  columns: IViewColumn[];
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

      groupCellValues?: ICellValue[];

      ignoreFieldPermission?: boolean;
    };

/**
 * The options for getting fields in a view.
 */
export interface IFieldsOptions {
  /**
   * If hidden fields are included. Defaults to false.
   */
  includeHidden?: boolean;
}
