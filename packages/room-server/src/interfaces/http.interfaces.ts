// HTTP 错误响应
export interface IHttpErrorResponse {
  success: boolean;
  code: number;
  message: string;
}

// HTTP 成功响应
export interface IHttpSuccessResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T | IPaginateInfo<T>;
}

// 数表相关
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

// record请求排序结构
export interface ISortRo {
  order: string;
  /**
   * 需要排序的字段
   */
  field: string;
}

export interface IApiPaginateRo {
  maxRecords?: number;
  pageNum?: number;
  pageSize?: number;
  /**
   * 排序数组
   */
  sort: ISortRo[];
}

// 空间站相关
export interface ISpaceList<T> {
  spaces: T;
}

export interface INodeList<T> {
  nodes: T;
}

// Http响应结构
export type IHttpResponse<T> = IHttpSuccessResponse<T> | IHttpErrorResponse;

export type IMessage = string;
export type IExceptionOption = IMessage | { message: IMessage; error?: any };
