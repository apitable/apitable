import { CollaCommandName, IFieldMap, IRecordCellValue, IReduxState, IViewColumn, IViewRow, Selectors, ViewType } from '@apitable/core';
import { keyBy } from 'lodash';
import { Store } from 'redux';
import { IRecordTransformOptions } from 'shared/interfaces';
import { Datasheet, ICommandExecutionResult } from './datasheet';
import { Record } from './record';

export class View {
  public readonly type: ViewType;
  public readonly id: string;

  private readonly store: Store<IReduxState>;
  private readonly rows: IViewRow[];
  private readonly columns: IViewColumn[];
  private readonly fieldMap: IFieldMap;

  constructor(private readonly datasheet: Datasheet, options: IViewOptions) {
    const { store, getViewInfo } = options;
    this.store = store;
    const state = store.getState();

    const { viewId, rows, columns, fieldMap } = getViewInfo(state);

    this.id = viewId;
    this.rows = rows;
    this.columns = columns;
    this.fieldMap = fieldMap;
  }

  public get numRows(): number {
    return this.rows.length;
  }

  public getRecords(options: IRecordsOptions): Promise<Record[]> {
    const snapshot = Selectors.getSnapshot(this.store.getState());
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
    const voTransformOptions: IRecordTransformOptions = {
      fieldMap: this.fieldMap,
      store: this.store,
      recordMap,
      fieldKeys,
      columnMap,
    };

    return Promise.resolve(
      pageRows.map(row => {
        return new Record(row.recordId, {
          voTransformOptions,
        });
      }),
    );
  }

  public addRecords(options: IAddRecordsOptions): Promise<ICommandExecutionResult<string[]>> {
    return this.datasheet.doCommand<string[]>({
      cmd: CollaCommandName.AddRecords,
      datasheetId: this.datasheet.id,
      viewId: this.id,
      index: options.index,
      count: 'count' in options ? options.count : options.recordValues.length,
      cellValues: 'count' in options ? undefined : options.recordValues,
      ignoreFieldPermission: true,
    });
  }
}

export interface IViewOptions {
  getViewInfo: (state: IReduxState) => IViewInfo;
  store: Store<IReduxState>;
}

export interface IViewInfo {
  viewId: string;
  rows: IViewRow[];
  columns: IViewColumn[];
  fieldMap: IFieldMap;
}

export interface IRecordsOptions {
  maxRecords?: number;
  pagination?: {
    pageNum: number;
    pageSize: number;
  };
}

export type IAddRecordsOptions =
  | {
      index: number;
      count: number;
    }
  | {
      index: number;
      recordValues: IRecordCellValue[];
    };
