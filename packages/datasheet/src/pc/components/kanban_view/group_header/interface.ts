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

import { DraggableProvided } from 'react-beautiful-dnd';
import { IRecord, IField, IMemberField, ISelectField } from '@apitable/core';

export interface IGroupHeaderProps {
  groupId: string;
  kanbanGroupMap: {
    [key: string]: IRecord[];
  };
  setCollapse: (value: string[]) => void;
  scrollToItem?(index: number): void;
  provided?: DraggableProvided;
  collapse?: string[];
}

export interface IHeadProps<T, K, P> {
  cellValue: T;
  field: K;
  editing: boolean;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  onCommand(result: P): void;
  readOnly?: boolean;
  isAdd?: boolean;
  isNewBoard?: boolean;
}

export type IHeadOptionProps = IHeadProps<string, ISelectField, IField>;
export type IHeadMemberProps = IHeadProps<string[], IMemberField, string[]>;
