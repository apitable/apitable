/**
 * pagination data fixed structure
 */
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