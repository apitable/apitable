import { ConfigConstant, Strings, t, WORKBENCH_SIDE_ID } from '@vikadata/core';
import { black } from '@vikadata/components';
import { ShortcutActionName } from 'pc/common/shortcut_key';
import { getShortcutKeyString } from 'pc/common/shortcut_key/keybinding_config';
import { colorVars } from '@vikadata/components';
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
  /** 重命名 */
  [ContextItemKey.Rename, (onClick: () => void, hidden: boolean) => ({
    icon: makeNodeIconComponent(NodeIcon.Rename),
    text: t(Strings.rename),
    shortcutKey: getShortcutKeyString(ShortcutActionName.RenameNode),
    'data-sensors-click': true,
    id: WORKBENCH_SIDE_ID.OPERATE_ITEM_RENAME_NODE,
    onClick,
    hidden,
  })],
  /** 星标 */
  [ContextItemKey.Favorite, (onClick: () => void, isFavorite: boolean) => ({
    icon: makeNodeIconComponent(isFavorite ? NodeIcon.UnFavorite : NodeIcon.Favorite),
    text: isFavorite ? t(Strings.remove_favorite) : t(Strings.favorite),
    'data-sensors-click': true,
    id: WORKBENCH_SIDE_ID.OPERATE_ITEM_STAR_NODE,
    onClick,
  })],
  /** 复制节点Url */
  [ContextItemKey.CopyUrl, (onClick: () => void, nodeType: ConfigConstant.NodeType) => ({
    icon: makeNodeIconComponent(NodeIcon.Url),
    text: getCopyUrlText(nodeType),
    'data-sensors-click': true,
    id: WORKBENCH_SIDE_ID.OPERATE_ITEM_COPY_NODE_URL,
    onClick,
  })],
  /** 设置权限 */
  [ContextItemKey.Permission, (onClick: () => void, nodeAssignable: boolean) => ({
    icon: makeNodeIconComponent(NodeIcon.Permission),
    text: nodeAssignable ? t(Strings.permission_setting) : t(Strings.view_permissions),
    shortcutKey: getShortcutKeyString(ShortcutActionName.Permission),
    'data-sensors-click': true,
    id: WORKBENCH_SIDE_ID.OPERATE_ITEM_SET_PERMISSIONS,
    onClick,
  })],
  /** 分享 */
  [ContextItemKey.Share, (onClick: () => void, hidden: boolean) => ({
    icon: makeNodeIconComponent(NodeIcon.Share),
    text: t(Strings.share),
    shortcutKey: getShortcutKeyString(ShortcutActionName.Share),
    'data-sensors-click': true,
    id: WORKBENCH_SIDE_ID.OPERATE_ITEM_SHARE_NODE,
    onClick,
    hidden,
  })],
  /** 保存为模板 */
  [ContextItemKey.SaveAsTemplate, (onClick: () => void, hidden: boolean) => ({
    icon: makeNodeIconComponent(NodeIcon.Template),
    text: t(Strings.save_as_template),
    shortcutKey: getShortcutKeyString(ShortcutActionName.SaveAsTemplate),
    'data-sensors-click': true,
    id: WORKBENCH_SIDE_ID.OPERATE_ITEM_SAVE_AS_TEMPLATE,
    onClick,
    hidden,
  })],
  /**
   * 移动至
   */
  [ContextItemKey.MoveTo, (onClick: () => void, hidden: boolean) => ({
    icon: makeNodeIconComponent(NodeIcon.MoveTo),
    text: t(Strings.move_to),
    'data-sensors-click': true,
    id: WORKBENCH_SIDE_ID.OPERATE_ITEM_MOVE_TO,
    onClick,
    hidden,
  })],
  /** 删除 */
  [ContextItemKey.Delete, (onClick: () => void, hidden: boolean) => ({
    icon: makeNodeIconComponent(NodeIcon.Delete, {
      color: isMobile
        ? colorVars.errorColor
        : colorVars.thirdLevelText,
    }),
    text: t(Strings.delete),
    'data-sensors-click': true,
    id: WORKBENCH_SIDE_ID.OPERATE_ITEM_DELETE_NODE,
    isWarn: true,
    onClick,
    hidden,
  })],
  /** 复制节点 */
  [ContextItemKey.Copy, (onClick: () => void, hidden: boolean) => ({
    icon: makeNodeIconComponent(NodeIcon.Copy),
    text: t(Strings.duplicate_datasheet),
    'data-sensors-click': true,
    id: WORKBENCH_SIDE_ID.OPERATE_ITEM_COPY_NODE,
    hidden,
    onClick,
  })],
  /** 导出 */
  [ContextItemKey.Export, (csvClick: () => void, excelClick: () => void, hidden: boolean) => ({
    icon: makeNodeIconComponent(NodeIcon.Export),
    text: t(Strings.export_to_excel),
    hidden,
    unsupportable: true,
    id: WORKBENCH_SIDE_ID.NODE_EXPORT,
    arrow: makeNodeIconComponent(NodeIcon.Arrow, { size: 10, color: black[500] }),
    children: [{
      icon: makeNodeIconComponent(NodeIcon.Excel),
      text: t(Strings.excel),
      'data-sensors-click': true,
      id: WORKBENCH_SIDE_ID.OPERATE_ITEM_EXPORT_NODE_EXCEL,
      onClick: excelClick,
    }, {
      icon: makeNodeIconComponent(NodeIcon.Csv),
      text: t(Strings.csv),
      'data-sensors-click': true,
      id: WORKBENCH_SIDE_ID.OPERATE_ITEM_EXPORT_NODE_CSV,
      onClick: csvClick,
    }],
  })],
  /** 导入 */
  [ContextItemKey.Import, (onClick: () => void, hidden: boolean) => ({
    icon: makeNodeIconComponent(NodeIcon.Import),
    text: t(Strings.import_excel),
    onClick,
    hidden,
    id: WORKBENCH_SIDE_ID.NODE_IMPORT,
  })],
  /** 新建数表 */
  [ContextItemKey.AddDatasheet, (onClick: () => void, hidden: boolean) => ({
    icon: makeNodeIconComponent(NodeIcon.AddDatasheet),
    text: t(Strings.empty_datasheet),
    shortcutKey: getShortcutKeyString(ShortcutActionName.NewDatasheet),
    onClick,
    hidden,
    id: WORKBENCH_SIDE_ID.NEW_DATASHEET,
  })],
  /** 新建神奇表单 */
  [ContextItemKey.AddForm, (onClick: () => void, hidden: boolean) => ({
    icon: makeNodeIconComponent(NodeIcon.AddForm),
    text: t(Strings.add_form),
    onClick,
    hidden,
    id: WORKBENCH_SIDE_ID.NEW_FORM,
  })],
  /** 新建文件夹 */
  [ContextItemKey.AddFolder, (onClick: () => void, hidden: boolean) => ({
    icon: makeNodeIconComponent(NodeIcon.AddFolder),
    text: t(Strings.new_folder),
    shortcutKey: getShortcutKeyString(ShortcutActionName.NewFolder),
    onClick,
    hidden,
    id: WORKBENCH_SIDE_ID.NEW_FOLDER,
  })],
  /** 从模板创建 */
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
  /** 查看节点信息 */
  [ContextItemKey.NodeInfo, (onClick: () => void, hidden: boolean) => ({
    icon: makeNodeIconComponent(NodeIcon.NodeInfo),
    text: t(Strings.node_info),
    onClick,
    hidden,
    id: WORKBENCH_SIDE_ID.NODE_INFO,
  })],
]);
