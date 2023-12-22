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
import { IMeta } from '@apitable/core';

export interface INodeInstalledWidget {
  datasheetId: string;
  datasheetName: string;
  widgetId: string;
  widgetName: string;
  widgetPackageCover: string;
  widgetPackageIcon: string;
}

// interface IAllowNodeType {
//   datasheet?: boolean;
//   view?: boolean;
//   mirror?: boolean
// }

export interface IOnChangeParams {
  datasheetId?: string;
  automationId?: string;
  mirrorId?: string;
  viewId?: string;
  widgetIds?: string[];
  nodeName?: string;
  meta?: IMeta;
  formId?: string;
}

export type IOnChange<R extends IOnChangeParams> = (result: R) => void;

export interface IHeadConfig {
  title: string;
  docUrl?: string;

  onHide(): void;
}

// type IRequiredData = keyof IOnChangeParams;

export interface ISearchPanelProps<R extends IOnChangeParams = IOnChangeParams> {
  headerConfig?: IHeadConfig;
  onChange: IOnChange<R>;
  // allowNodeType?: IAllowNodeType;
  filterPermissionForNode?: 'editable';
  requiredData: (keyof R)[];
  defaultNodeIds: {
    folderId: string;
    datasheetId?: string;
    automationId?: string;
    formId?: string;
  };
}
