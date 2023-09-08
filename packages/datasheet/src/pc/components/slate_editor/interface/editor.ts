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

import { Selection } from 'slate';
import { META_KEYS } from '../plugins/constant';
import { IElement } from './element';

export declare type EditorValue = Array<IElement>;

export interface IEditorMeta {
  imageSize: number;
  [key: string]: number;
}
export interface IMousePosition {
  x: number;
  y: number;
}

export interface IEditorData {
  document: EditorValue;
  meta: IEditorMeta;
}

export interface ISlateEditorProps {
  mode?: 'lite' | 'full';
  readOnly?: boolean;
  onChange?: (data: IEditorData) => void;
  value?: IEditorData | EditorValue;
  height?: number | string;
  headerToolbarEnabled?: boolean;
  hoveringToolbarEnabled?: boolean;
  operationAble?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  imageUploadApi?: (file: File) => Promise<any>;
  useMention?: boolean;
  sectionSpacing?: 'small' | 'middle' | 'large';
  className?: string;
}

export type TEditorMode = 'full' | 'lite';

export interface IVikaEditor {
  lastSelection?: Selection;
  hasInsertPanel?: boolean;
  hasMentionPanel?: boolean;
  mode?: TEditorMode;
  isComposing?: boolean;
}

export type EventHandle = (...params: Array<any>) => void;
export interface IEventBusEditor {
  events: { [key: string]: Array<EventHandle> | null };
  on: (eventType: string, arg1: EventHandle) => void;
  off: (eventType: string, arg1: EventHandle) => boolean;
  clear: () => void;
  dispatch: (eventType: string, ...params: Array<any>) => void;
}
export interface IMetaEditor {
  meta: IEditorMeta;
  updateMeta: (key: keyof typeof META_KEYS, value: number, op?: 'add' | 'desc') => void;
  setMeta: (meta: IEditorMeta) => void;
  resetMeta: () => void;
}
