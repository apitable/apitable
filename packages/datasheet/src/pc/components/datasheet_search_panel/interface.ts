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
import * as React from 'react';
import { IMeta } from '@apitable/core';
import { ISearchPanelState } from 'pc/components/datasheet_search_panel/store/interface/search_panel';

export enum SecondConfirmType {
  Widget,
  Form,
  Chat,
  AIForm
}

export interface INodeInstalledWidget {
  datasheetId: string;
  datasheetName: string;
  widgetId: string;
  widgetName: string;
  widgetPackageCover: string;
  widgetPackageIcon: string;
}

export interface ISearchOptions {
  showForm: boolean
  showDatasheet: boolean
  needPermission?: 'manageable' | 'editable'
  showMirror: boolean
  showView: boolean
}
export interface ISearchPanelProps {
  hidePanel(e: any): void;
  options?: {
    showForm: boolean
    showDatasheet: boolean
    needPermission?: 'manageable' | 'editable'
    showMirror: boolean
    showView: boolean
  },

  onNodeSelect?: (data: {
    datasheetId?: string;
    formId?: string;
  }) => void;

  directClickMode?: boolean
  noCheckPermission?: boolean;
  showMirrorNode: boolean | undefined;
  folderId: string;
  onChange: (result: { datasheetId?: string;
    formId?: string;
    mirrorId?: string; viewId?: string; widgetIds?: string[]; nodeName?: string; meta?: IMeta }) => void;
  secondConfirmType?: SecondConfirmType;
  localState: ISearchPanelState;
  localDispatch: React.Dispatch<Partial<ISearchPanelState>>;
}
