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

import {
  DashboardOutlined,
  SearchOutlined,
  AddOutlined,
  MoreOutlined,
  AddfolderOutlined,
  AddfileOutlined,
  AddformOutlined,
  EditOutlined,
  DeleteOutlined,
  ImportOutlined,
  ExportOutlined,
  CopyOutlined,
  LockOutlined,
  ShareOutlined,
  CsvOutlined,
  ExcelOutlined,
  CoverOutlined,
  TemplateSmallOutlined,
  FavoriteOutlined,
  UnfavoriteOutlined,
  FolderNormalFilled,
  FolderUnfoldFilled,
  ColumnUrlOutlined,
  FormOutlined,
  FolderEmptyFilled,
  DatasheetOutlined,
  IIconProps, MirrorOutlined, EditDescribeOutlined,
  CalenderRightOutlined,
  MovefileOutlined
} from '@apitable/icons';
import { colorVars } from '@apitable/components';

/**
 * Node icon type, external use of this enumeration as configuration
 *
 * @export
 * @enum {string}
 */
export enum NodeIcon {
  Arrow = 'arrow',
  Search = 'search',
  Add = 'add',
  More = 'more',
  AddFolder = 'add_folder',
  AddFile = 'add_file',
  Rename = 'rename',
  Delete = 'delete',
  Import = 'import',
  Export = 'export',
  ExportCsv = 'export_csv',
  ExportXlsx = 'export_xlsx',
  AddDatasheet = 'add_datasheet',
  AddDashboard = 'AddDashboard',
  AddForm = 'add_form',
  Copy = 'copy',
  Permission = 'permission',
  Share = 'share',
  Emoji = 'emoji',
  Csv = 'csv',
  Excel = 'excel',
  Image = 'image',
  Template = 'template',
  Favorite = 'favorite',
  UnFavorite = 'un_favorite',
  Url = 'url',
  NodeInfo = 'node_info',
  Folder = 'folder',
  OpenFolder = 'open_folder',
  EmptyFolder = 'empty_folder',
  Datasheet = 'datasheet',
  Form = 'form',
  Dashboard = 'dashboard',
  Mirror = 'Mirror',
  MoveTo = 'MoveTo',
}

// Enumeration and Resource Location Matching Table
export const nodeIconImportMap: {
  [iconName: string]: React.FC<React.PropsWithChildren<IIconProps>>
} = {
  [NodeIcon.Search]: SearchOutlined,
  [NodeIcon.Add]: AddOutlined,
  [NodeIcon.More]: MoreOutlined,
  [NodeIcon.AddFolder]: AddfolderOutlined,
  [NodeIcon.AddFile]: AddfileOutlined,
  [NodeIcon.Rename]: EditOutlined,
  [NodeIcon.Delete]: DeleteOutlined,
  [NodeIcon.Import]: ImportOutlined,
  [NodeIcon.Export]: ExportOutlined,
  [NodeIcon.ExportCsv]: AddfileOutlined,
  [NodeIcon.ExportXlsx]: AddfileOutlined,
  [NodeIcon.AddDatasheet]: AddfileOutlined,
  [NodeIcon.AddForm]: AddformOutlined,
  [NodeIcon.Copy]: CopyOutlined,
  [NodeIcon.Permission]: LockOutlined,
  [NodeIcon.Share]: ShareOutlined,
  [NodeIcon.Csv]: CsvOutlined,
  [NodeIcon.Excel]: ExcelOutlined,
  [NodeIcon.Image]: CoverOutlined,
  [NodeIcon.Template]: TemplateSmallOutlined,
  [NodeIcon.Favorite]: FavoriteOutlined,
  [NodeIcon.UnFavorite]: UnfavoriteOutlined,
  [NodeIcon.Url]: ColumnUrlOutlined,
  [NodeIcon.Folder]: FolderNormalFilled,
  [NodeIcon.OpenFolder]: FolderUnfoldFilled,
  [NodeIcon.EmptyFolder]: FolderEmptyFilled,
  [NodeIcon.Datasheet]: DatasheetOutlined,
  [NodeIcon.Form]: FormOutlined,
  [NodeIcon.AddDashboard]: DashboardOutlined,
  [NodeIcon.Dashboard]: DashboardOutlined,
  [NodeIcon.Mirror]: MirrorOutlined,
  [NodeIcon.NodeInfo]: EditDescribeOutlined,
  [NodeIcon.Arrow]: CalenderRightOutlined,
  [NodeIcon.MoveTo]: MovefileOutlined
};

/**
 * Get Node related icons by enumeration value
 */
export function makeNodeIconComponent(
  icon: NodeIcon,
  props: IIconProps = { color: colorVars.thirdLevelText }, // FIXME: color name
) {
  const NodeIconComponent = nodeIconImportMap[icon];
  return <NodeIconComponent {...props} />;
}
