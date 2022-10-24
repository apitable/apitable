import { DropDirectionType } from '@apitable/core';
import { GalleryGroupItemType } from './constant';

export interface ICommitDragDropState {
  dragRecordId: string;
  dropRecordId: string;
  direction: DropDirectionType;
}

/**
 * 对于 react-window 来说，item 的 interface 应该是通用的。在分组的情况下，类型不同而已。
 */
export interface IGalleryGroupItem {
  groupIndex?: number,
  recordId: string,
  groupHeadRecordId?: string;
  type: GalleryGroupItemType,
}

export interface IDragItem {
  index: number;
  id: string;
  type: string;
}
