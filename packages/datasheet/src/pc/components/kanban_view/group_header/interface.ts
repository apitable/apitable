import { IRecord, IField, IMemberField, ISelectField } from '@apitable/core';
import { DraggableProvided } from 'react-beautiful-dnd';

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
