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

import { IComments, IFieldMap, IRecord, IReduxState, IViewColumn } from 'exports/store/interfaces';
import { Store } from 'redux';

export class Record {
  private readonly voTransformOptions: IRecordVoTransformOptions;

  /**
   * Create a `Record` instance from an `IRecord` object.
   *
   * @deprecated This constructor is not intended for public use.
   */
  constructor(private readonly record: IRecord, options: IRecordOptions) {
    const { voTransformOptions } = options;
    this.voTransformOptions = voTransformOptions;
  }

  get id(): string {
    return this.record.id;
  }

  /**
   * The comment list of the record. If no comments exist, an empty array is returned.
   */
  get comments(): readonly IComments[] {
    return this.record.comments ?? [];
  }

  /**
   * Get the view object of the record via `transform`.
   */
  getViewObject<R>(transform: (record: IRecord, options: IRecordVoTransformOptions) => R): R {
    return transform(this.record, this.voTransformOptions);
  }

  getVoTransformOptions(): IRecordVoTransformOptions {
    return this.voTransformOptions;
  }
}

/**
 * The options for creating a `Record` instance.
 */
export interface IRecordOptions {
  voTransformOptions: IRecordVoTransformOptions;
}

/**
 * The options for the record view object transformer function.
 */
export interface IRecordVoTransformOptions {
  fieldMap: IFieldMap;
  store: Store<IReduxState>;
  fieldKeys: string[];
  columnMap: { [fieldId: string]: IViewColumn };
}