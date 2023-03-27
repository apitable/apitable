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

import { ConfigConstant, Strings, t, WORKBENCH_SIDE_ID } from '@apitable/core';
import { black } from '@apitable/components';
import { ShortcutActionName } from 'modules/shared/shortcut_key';
import { getShortcutKeyString } from 'modules/shared/shortcut_key/keybinding_config';
import { colorVars } from '@apitable/components';
import { getEnvVariables } from 'pc/utils/env';
import { isMobile } from 'react-device-detect';
import { makeNodeIconComponent, NodeIcon } from './node_icons';

export enum ContextItemKey {
  Rename,
  Favorite,
  CopyUrl,
  Permission,
  Share,
  SaveAsTemplate,
  Delete,
  Copy,
  Export,
  Import,
  AddDatasheet,
  AddFolder,
  AddForm,
  CreateFromTemplate,
  AddDashboard,
  NodeInfo,
  MoveTo
}

const getCopyUrlText = (nodeType: ConfigConstant.NodeType) => {
  switch (nodeType) {
    case ConfigConstant.NodeType.FOLDER:
      return t(Strings.copy_folder_url);
    case ConfigConstant.NodeType.DATASHEET:
      return t(Strings.copy_datasheet_url);
    case ConfigConstant.NodeType.FORM:
      return t(Strings.copy_form_url);
    case ConfigConstant.NodeType.DASHBOARD:
      return t(Strings.copy_dashboard_url);
    case ConfigConstant.NodeType.MIRROR:
      return t(Strings.copy_mirror_url);
    default:
      return t(Strings.copy_folder_url);
  }
};

export const contextItemMap = new Map<ContextItemKey, any>([
  [ContextItemKey.Rename, (onClick: () => void, hidden: boolean) => ({
    icon: makeNodeIconComponent(NodeIcon.Rename),
    text: t(Strings.rename),
    shortcutKey: getShortcutKeyString(ShortcutActionName.RenameNode),
    id: WORKBENCH_SIDE_ID.OPERATE_ITEM_RENAME_NODE,
    onClick,
    hidden,
  })],
  [ContextItemKey.Favorite, (onClick: () => void, isFavorite: boolean) => ({
    icon: makeNodeIconComponent(isFavorite ? NodeIcon.UnFavorite : NodeIcon.Favorite),
    text: isFavorite ? t(Strings.remove_favorite) : t(Strings.favorite),
    id: WORKBENCH_SIDE_ID.OPERATE_ITEM_STAR_NODE,
    onClick,
  })],
  [ContextItemKey.CopyUrl, (onClick: () => void, nodeType: ConfigConstant.NodeType) => ({
    icon: makeNodeIconComponent(NodeIcon.Url),
    text: getCopyUrlText(nodeType),
    id: WORKBENCH_SIDE_ID.OPERATE_ITEM_COPY_NODE_URL,
    onClick,
  })],
  [ContextItemKey.Permission, (onClick: () => void, nodeAssignable: boolean) => ({
    icon: makeNodeIconComponent(NodeIcon.Permission),
    text: nodeAssignable ? t(Strings.permission_setting) : t(Strings.view_permissions),
    shortcutKey: getShortcutKeyString(ShortcutActionName.Permission),
    id: WORKBENCH_SIDE_ID.OPERATE_ITEM_SET_PERMISSIONS,
    onClick,
    hidden: !getEnvVariables().FILE_PERMISSION_VISIBLE
  })],
  [ContextItemKey.Share, (onClick: () => void, hidden: boolean) => ({
    icon: makeNodeIconComponent(NodeIcon.Share),
    text: t(Strings.share),
    shortcutKey: getShortcutKeyString(ShortcutActionName.Share),
    id: WORKBENCH_SIDE_ID.OPERATE_ITEM_SHARE_NODE,
    onClick,
    hidden,
  })],
  [ContextItemKey.SaveAsTemplate, (onClick: () => void, hidden: boolean) => ({
    icon: makeNodeIconComponent(NodeIcon.Template),
    text: t(Strings.save_as_template),
    shortcutKey: getShortcutKeyString(ShortcutActionName.SaveAsTemplate),
    id: WORKBENCH_SIDE_ID.OPERATE_ITEM_SAVE_AS_TEMPLATE,
    onClick,
    hidden,
  })],
  [ContextItemKey.MoveTo, (onClick: () => void, hidden: boolean) => ({
    icon: makeNodeIconComponent(NodeIcon.MoveTo),
    text: t(Strings.move_to),
    id: WORKBENCH_SIDE_ID.OPERATE_ITEM_MOVE_TO,
    onClick,
    hidden,
  })],
  [ContextItemKey.Delete, (onClick: () => void, hidden: boolean) => ({
    icon: makeNodeIconComponent(NodeIcon.Delete, {
      color: isMobile
        ? colorVars.errorColor
        : colorVars.thirdLevelText,
    }),
    text: t(Strings.delete),
    id: WORKBENCH_SIDE_ID.OPERATE_ITEM_DELETE_NODE,
    isWarn: true,
    onClick,
    hidden,
  })],
  [ContextItemKey.Copy, (onClick: () => void, hidden: boolean) => ({
    icon: makeNodeIconComponent(NodeIcon.Copy),
    text: t(Strings.duplicate_datasheet),
    id: WORKBENCH_SIDE_ID.OPERATE_ITEM_COPY_NODE,
    hidden,
    onClick,
  })],
  [ContextItemKey.Export, (csvClick: () => void, excelClick: () => void, hidden: boolean) => ({
    icon: makeNodeIconComponent(NodeIcon.Export),
    text: t(Strings.export_to_excel),
    hidden,
    unsupportable: true,
    id: WORKBENCH_SIDE_ID.NODE_EXPORT,
    arrow: makeNodeIconComponent(NodeIcon.Arrow, { size: 10, color: black[500] }),
    children: [{
      // icon: makeNodeIconComponent(NodeIcon.Excel),
      text: t(Strings.excel),
      id: WORKBENCH_SIDE_ID.OPERATE_ITEM_EXPORT_NODE_EXCEL,
      onClick: excelClick,
    }, {
      // icon: makeNodeIconComponent(NodeIcon.Csv),
      text: t(Strings.csv),
      id: WORKBENCH_SIDE_ID.OPERATE_ITEM_EXPORT_NODE_CSV,
      onClick: csvClick,
    }],
  })],
  [ContextItemKey.Import, (onClick: () => void, hidden: boolean) => ({
    icon: makeNodeIconComponent(NodeIcon.Import),
    text: t(Strings.import_excel),
    onClick,
    hidden,
    id: WORKBENCH_SIDE_ID.NODE_IMPORT,
  })],
  [ContextItemKey.AddDatasheet, (onClick: () => void, hidden: boolean) => ({
    icon: makeNodeIconComponent(NodeIcon.AddDatasheet),
    text: t(Strings.empty_datasheet),
    shortcutKey: getShortcutKeyString(ShortcutActionName.NewDatasheet),
    onClick,
    hidden,
    id: WORKBENCH_SIDE_ID.NEW_DATASHEET,
  })],
  [ContextItemKey.AddForm, (onClick: () => void, hidden: boolean) => ({
    icon: makeNodeIconComponent(NodeIcon.AddForm),
    text: t(Strings.add_form),
    onClick,
    hidden,
    id: WORKBENCH_SIDE_ID.NEW_FORM,
  })],
  [ContextItemKey.AddFolder, (onClick: () => void, hidden: boolean) => ({
    icon: makeNodeIconComponent(NodeIcon.AddFolder),
    text: t(Strings.new_folder),
    shortcutKey: getShortcutKeyString(ShortcutActionName.NewFolder),
    onClick,
    hidden,
    id: WORKBENCH_SIDE_ID.NEW_FOLDER,
  })],
  [ContextItemKey.CreateFromTemplate, (onClick: () => void, hidden: boolean) => ({
    icon: makeNodeIconComponent(NodeIcon.Template),
    text: t(Strings.new_from_template),
    onClick,
    hidden,
    id: WORKBENCH_SIDE_ID.NEW_FORM_TEMPLATE,
  })],
  [ContextItemKey.AddDashboard, (onClick: () => void, hidden: boolean) => ({
    icon: makeNodeIconComponent(NodeIcon.AddDashboard),
    text: t(Strings.add_dashboard),
    onClick,
    hidden,
    id: WORKBENCH_SIDE_ID.NEW_DASHBOARD,
  })],
  [ContextItemKey.NodeInfo, (onClick: () => void, hidden: boolean) => ({
    icon: makeNodeIconComponent(NodeIcon.NodeInfo),
    text: t(Strings.node_info),
    onClick,
    hidden,
    id: WORKBENCH_SIDE_ID.NODE_INFO,
  })],
]);
