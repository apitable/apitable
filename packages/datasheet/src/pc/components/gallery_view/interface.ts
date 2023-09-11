/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
  groupIndex?: number;
  recordId: string;
  groupHeadRecordId?: string;
  type: GalleryGroupItemType;
}

export interface IDragItem {
  index: number;
  id: string;
  type: string;
}
