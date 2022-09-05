import { Selection } from 'slate';
import { IElement } from './element';
import { META_KEYS } from '../plugins/constant';

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
  on: (eventType: string, EventHandle) => void;
  off: (eventType: string, EventHandle) => boolean;
  clear: () => void;
  dispatch: (eventType: string, ...params: Array<any>) => void;
}
export interface IMetaEditor {
  meta: IEditorMeta;
  updateMeta: (key: keyof typeof META_KEYS, value: number, op?: 'add' | 'desc') => void;
  setMeta: (meta: IEditorMeta) => void;
  resetMeta: () => void;
}
