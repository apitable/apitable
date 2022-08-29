import { ActivityListParamsType } from 'config/constant';

export interface IActivityListParams {
  type?: ActivityListParamsType;
  // 版本号
  maxRevision?: number;
  // 每页数量
  pageSize?: number;
  limitDays?: number;
}

export interface IRubbishListParams {
  // 已加载列表中最后一个节点的ID
  lastNodeId?: string;
  // 每页数量
  size?: number;
  // 是否请求超限节点（默认FALSE）
  isOverLimit?: boolean;
}
