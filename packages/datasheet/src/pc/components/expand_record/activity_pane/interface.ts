import { IComments } from '@apitable/core';
import { ActivitySelectType } from 'pc/utils';

export interface ICacheType {
  [key: string]: ActivitySelectType;
}

export interface IChooseComment {
  comment: IComments;
  datasheetId: string;
  expandRecordId: string;
}

export interface IActivityPaneProps {
  fromCurrentDatasheet?: boolean;
  expandRecordId: string;
  datasheetId: string;
  mirrorId?: string;
  viewId?: string;
  style?: React.CSSProperties;
  closable?: boolean;
  onClose?: () => void;
}
