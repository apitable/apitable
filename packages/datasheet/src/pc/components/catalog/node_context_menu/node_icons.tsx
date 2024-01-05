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

import { colorVars } from '@apitable/components';
import {
  DashboardOutlined,
  SearchOutlined,
  AddOutlined,
  MoreOutlined,
  FolderAddOutlined,
  FileAddOutlined,
  FormAddOutlined,
  EditOutlined,
  DeleteOutlined,
  ImportOutlined,
  DownloadOutlined,
  DuplicateOutlined,
  LockOutlined,
  ShareOutlined,
  FileCsvOutlined,
  FileExcelOutlined,
  ImageOutlined,
  PlanetOutlined,
  StarOutlined,
  StarCrossOutlined,
  FolderNormalFilled,
  FolderOpenFilled,
  LinkOutlined,
  FormOutlined,
  FolderEmptyFilled,
  DatasheetOutlined,
  IIconProps,
  MirrorOutlined,
  InfoCircleOutlined,
  ChevronRightOutlined,
  AutomationOutlined,
  FolderRightOutlined,
  RobotOutlined,
  RefreshOutlined,
  EmbedOutlined,
} from '@apitable/icons';
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
  Ai = 'Ai',
  AddAutomation = 'add_automation',
  CreateBackup = 'CreateBackup',
  AddEmbed = 'add_embed',
}

// Enumeration and Resource Location Matching Table
export const nodeIconImportMap: {
  [iconName: string]: React.FC<React.PropsWithChildren<IIconProps>>;
} = {
  [NodeIcon.Search]: SearchOutlined,
  [NodeIcon.Add]: AddOutlined,
  [NodeIcon.More]: MoreOutlined,
  [NodeIcon.AddFolder]: FolderAddOutlined,
  [NodeIcon.AddFile]: FileAddOutlined,
  [NodeIcon.Rename]: EditOutlined,
  [NodeIcon.Delete]: DeleteOutlined,
  [NodeIcon.Import]: ImportOutlined,
  [NodeIcon.Export]: DownloadOutlined,
  [NodeIcon.ExportCsv]: FileAddOutlined,
  [NodeIcon.ExportXlsx]: FileAddOutlined,

  // TODO Node Icon
  [NodeIcon.AddAutomation]: AutomationOutlined,
  [NodeIcon.AddDatasheet]: FileAddOutlined,
  [NodeIcon.AddForm]: FormAddOutlined,
  [NodeIcon.Copy]: DuplicateOutlined,
  [NodeIcon.Permission]: LockOutlined,
  [NodeIcon.Share]: ShareOutlined,
  [NodeIcon.Csv]: FileCsvOutlined,
  [NodeIcon.Excel]: FileExcelOutlined,
  [NodeIcon.Image]: ImageOutlined,
  [NodeIcon.Template]: PlanetOutlined,
  [NodeIcon.Favorite]: StarOutlined,
  [NodeIcon.UnFavorite]: StarCrossOutlined,
  [NodeIcon.Url]: LinkOutlined,
  [NodeIcon.Folder]: FolderNormalFilled,
  [NodeIcon.OpenFolder]: FolderOpenFilled,
  [NodeIcon.EmptyFolder]: FolderEmptyFilled,
  [NodeIcon.Datasheet]: DatasheetOutlined,
  [NodeIcon.Form]: FormOutlined,
  [NodeIcon.AddDashboard]: DashboardOutlined,
  [NodeIcon.Dashboard]: DashboardOutlined,
  [NodeIcon.Mirror]: MirrorOutlined,
  [NodeIcon.NodeInfo]: InfoCircleOutlined,
  [NodeIcon.Arrow]: ChevronRightOutlined,
  [NodeIcon.MoveTo]: FolderRightOutlined,
  [NodeIcon.Ai]: RobotOutlined,
  [NodeIcon.CreateBackup]: RefreshOutlined,
  [NodeIcon.AddEmbed]: EmbedOutlined,
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
