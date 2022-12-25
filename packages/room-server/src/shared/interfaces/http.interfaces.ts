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

// HTTP error response
export interface IHttpErrorResponse {
  success: boolean;
  code: number;
  message: string;
}

// HTTP success response
export interface IHttpSuccessResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T | IPaginateInfo<T>;
}

// datasheet related
export interface IPaginateInfo<T> {
  total: number;
  pageNum: number;
  pageSize: number;
  records: T;
}

export interface IRecordList<T> {
  records: T;
}

export interface IFieldList<T> {
  fields: T;
}

export interface IViewList<T> {
  views: T;
}

// sort request structure of records
export interface ISortRo {
  order: string;
  /**
   * field that need to be sorted
   */
  field: string;
}

export interface IApiPaginateRo {
  maxRecords?: number;
  pageNum?: number;
  pageSize?: number;
  /**
   * sorted array
   */
  sort?: ISortRo[];
}

// space related
export interface ISpaceList<T> {
  spaces: T;
}

export interface INodeList<T> {
  nodes: T;
}

// Http response
export type IHttpResponse<T> = IHttpSuccessResponse<T> | IHttpErrorResponse;

export type IMessage = string;
export type IExceptionOption = IMessage | { message: IMessage; error?: any };
