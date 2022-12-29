import { ActivityListParamsType } from 'config/constant';

export interface IActivityListParams {
  type?: ActivityListParamsType;

  maxRevision?: number;
  /**
   * Number of items per page
   */
  pageSize?: number;
  limitDays?: number;
}

export interface IRubbishListParams {
  /**
   * the last node ID in the loaded list
   */
  lastNodeId?: string;
  /**
   * number of items per page
   */
  size?: number;
  /**
   * whether or not request the over-limit nodes (default FALSE)
   */
  isOverLimit?: boolean;
}
