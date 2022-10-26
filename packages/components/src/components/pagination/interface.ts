/**
 * Pagination status interface
 */
export interface IPaginationStatus {
  /**
   * Whether selected or not
   */
  selected?: boolean;

  /**
   * Whether disabled or not
   */
  disabled: boolean;

  /**
   * Whether is the last child
   */
  lastRangeChild?: boolean;
}

/**
 * Pagination inner state interface
 */
export interface IPaginationState {
  /**
   * Current page number
   */
   current: number;

   /**
    * Per page size
    */
   pageSize: number;
 
   /**
    * Total number
    */
   total: number;

   /**
    * Total pages
    */
   pages: number;

}

/**
 * Pagination props interface
 */
export interface IPaginationProps {
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Current page number
   */
  current?: number;

   /**
    * Page Size
    */
  pageSize?: number;
 
   /**
    * Total number
    */
  total: number;

  /**
   * Whether disabled or not
   */
  disabled?: boolean;

  /**
   * Whether show total number or not
   */
  showTotal?: boolean;

  /**
   * Whether show page change UI or not
   */
  showChangeSize?: boolean;

  /**
   * Whether show quick jump UI or not
   */
  showQuickJump?: boolean;

  /**
   * i18n
   */
  lang?: 'zh' | 'en';

  /**
   * Size or page change callback
   */
  onChange?: (page: number, pageSize: number) => void;

  /**
   * Size change callback
   */
  onPageSizeChange?: (page: number, pageSize: number) => void;
}