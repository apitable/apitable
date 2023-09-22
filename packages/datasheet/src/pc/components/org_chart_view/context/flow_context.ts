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

import { IFuncUpdater } from 'ahooks/lib/createUseStorageState';
import * as React from 'react';
import { ILinkField, IOneWayLinkField, IOrgChartViewStatus, IOrgChartViewStyle, IPermissions, ISetRecordOptions, IViewColumn } from '@apitable/core';
import { INodesMap, INode, INodeStateMap, IPre, IGhostNodesRef, IBounds } from '../interfaces';

export interface IFlowContext {
  nodesMap: INodesMap;
  pre: IPre;
  nodeStateMap: INodeStateMap;
  setNodeStateMap: (value: INodeStateMap | IFuncUpdater<INodeStateMap> | undefined) => void;
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
  linkField: ILinkField | IOneWayLinkField;
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
