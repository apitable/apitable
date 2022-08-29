// 分页数据固定字段
export interface IPageDataBase {
  pageNum: number;
  pageSize: number;
  size: number;
  total: number;
  pages: number;
  startRow: number;
  endRow: number;
  prePage: number;
  nextPage: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  firstPage: boolean;
  lastPage: boolean;
}