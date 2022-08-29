/**
 * 翻页组件样式接受的状态
 */
export interface IPaginationStatus {
  /**
   * 是否选中
   */
  selected?: boolean;

  /**
   * 是否禁用
   */
  disabled: boolean;

  /**
   * 是否为最后一个元素
   */
  lastRangeChild?: boolean;
}

/**
 * 翻页组件内部状态
 */
export interface IPaginationState {
  /**
   * 当前页码
   */
   current: number;

   /**
    * 每页条数
    */
   pageSize: number;
 
   /**
    * 数据总数
    */
   total: number;

   /**
    * 总页数
    */
   pages: number;

}

/**
 * 翻页组件输入参数
 */
export interface IPaginationProps {
  /**
   * 当前页码
   */
  current?: number;

   /**
    * 每页条数
    */
  pageSize?: number;
 
   /**
    * 数据总数
    */
  total: number;

  /**
   * 禁用
   */
  disabled?: boolean;

  /**
   * 显示总数
   */
  showTotal?: boolean;

  /**
   * 显示每页容量切换
   */
  showChangeSize?: boolean;

  /**
   * 显示快速跳转
   */
  showQuickJump?: boolean;

  /**
   * 国际化
   */
  lang?: 'zh' | 'en';

  /**
   * 页码改变后的回调
   */
  onChange?: (page: number, pageSize: number) => void;

  /**
   * pageSize 变化的回调
   */
  onPageSizeChange?: (page: number, pageSize: number) => void;
}