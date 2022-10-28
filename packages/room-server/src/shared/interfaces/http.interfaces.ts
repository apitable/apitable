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
  sort: ISortRo[];
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
