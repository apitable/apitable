import { DropDirectionType } from '@apitable/core';
import { GalleryGroupItemType } from './constant';

export interface ICommitDragDropState {
  dragRecordId: string;
  dropRecordId: string;
  direction: DropDirectionType;
}

/**
 * For react-window, the interface for items should be common. In the case of grouping, the type is just different.
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
