import { ILinkField, IOrgChartViewStatus, IOrgChartViewStyle, IPermissions, ISetRecordOptions, IViewColumn } from '@apitable/core';
import { IFuncUpdater } from 'ahooks/lib/createUseStorageState';
import * as React from 'react';
import { INodesMap, INode, INodeStateMap, IPre, IGhostNodesRef, IBounds } from '../interfaces';

export interface IFlowContext {
  nodesMap: INodesMap;
  pre: IPre;
  nodeStateMap: INodeStateMap;
  setNodeStateMap: (
    value: INodeStateMap | IFuncUpdater<INodeStateMap> | undefined
  ) => void;
  orgChartStyle: IOrgChartViewStyle;
  orgChartViewStatus: IOrgChartViewStatus;
  unhandledNodes: INode[];
  handlingCount: number;
  getCardHeight: (recordId: string | null) => number;
  viewId: string;
  menuVisible: boolean | undefined;
  setMenuVisible(visible: boolean): void;
  initialElements: INode[];
  cycleElements: INode[];
  datasheetId: string;
  currentSearchCell: string | [string, string] | undefined;
  bodySize: {
    width: number;
    height: number;
  };
  offsetLeft: number;
  offsetTop: number;
  columns: IViewColumn[];
  permissions: IPermissions;
  linkField: ILinkField;
  rowsCount: number;
  isCryptoLinkField: boolean;
  isFieldDeleted: boolean;
  isFieldInvalid: boolean;
  fieldEditable: boolean;
  onChange: (data: ISetRecordOptions[]) => void;
  overGhostRef: React.MutableRefObject<IGhostNodesRef | null>;
  primaryFieldId: string;
  quickAddRecId: string | undefined;
  setQuickAddRecId: React.Dispatch<React.SetStateAction<string | undefined>>;
  horizontal: boolean;
  bounds: IBounds;
}

export const FlowContext = React.createContext({} as IFlowContext);
