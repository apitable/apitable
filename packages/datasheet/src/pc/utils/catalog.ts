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

import { Workbook } from 'exceljs';
import React from 'react';
import {
  ConfigConstant,
  Field,
  IDatasheetState,
  IReduxState,
  ISpaceBasicInfo,
  ISpaceInfo,
  ITreeNodesMap,
  IViewColumn,
  IViewProperty,
  ResourceType,
  Selectors,
  StoreActions,
  Strings,
  t,
  UnitItem,
  ViewDerivateBase,
} from '@apitable/core';
import { browser } from 'modules/shared/browser';
import { NodeIcon } from 'pc/components/catalog/node_context_menu/node_icons';
import { Message } from 'pc/components/common/message';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { IShareSpaceInfo } from 'pc/components/share/interface';
import { store } from 'pc/store';
import { runInTimeSlicing } from './utils';
// @ts-ignore
import { getSocialWecomUnitName } from 'enterprise/home/social_platform/utils';

export const nodeConfigData = [
  {
    type: ConfigConstant.NodeType.FOLDER,
    icon: NodeIcon.EmptyFolder,
    notEmptyIcon: NodeIcon.Folder,
    openedIcon: NodeIcon.OpenFolder,
    name: t(Strings.folder),
  },
  {
    type: ConfigConstant.NodeType.DATASHEET,
    icon: NodeIcon.Datasheet,
    name: t(Strings.datasheet),
  },
  {
    type: ConfigConstant.NodeType.FORM,
    icon: NodeIcon.Form,
    name: t(Strings.view_form),
  },
  {
    type: ConfigConstant.NodeType.DASHBOARD,
    icon: NodeIcon.Dashboard,
    name: t(Strings.dashboard),
  },
  {
    type: ConfigConstant.NodeType.MIRROR,
    icon: NodeIcon.Mirror,
    name: t(Strings.mirror),
  },
  {
    type: ConfigConstant.NodeType.AI,
    icon: NodeIcon.Ai,
    name: 'chatbot',
  },
  {
    type: ConfigConstant.NodeType.AUTOMATION,
    icon: NodeIcon.AddAutomation,
    name: t(Strings.automation),
  },
  {
    type: ConfigConstant.NodeType.CUSTOM_PAGE,
    icon: NodeIcon.AddEmbed,
    name: t(Strings.embed_page),
  },
];

// Check if the url belongs to this site
export const isLocalSite = (url: string, originUrl: string) => {
  url = decodeURIComponent(url);
  originUrl = decodeURIComponent(originUrl);
  const urlHost = new URL(url).host;
  const originUrlHost = new URL(originUrl).host;
  return urlHost === originUrlHost;
};

/**
 * Generate standard membership information
 * {
 *  avatar: string;
 *  name: string;
 *  info: number | string;
 * }
 * @param item User information
 * @param spaceInfo
 */
export const generateUserInfo = (
  item: UnitItem,
  spaceInfo?: ISpaceInfo | ISpaceBasicInfo | null,
): {
  id: string;
  avatar: string;
  name: string;
  nickName?: string;
  avatarColor?: number | null;
  title?: string | JSX.Element;
  info: string;
  isTeam: boolean;
} => {
  if ('teamId' in item) {
    return {
      id: item.unitId,
      avatar: '',
      name: item.originName || item.teamName,
      info: t(Strings.display_person_count, {
        count: item.memberCount,
      }),
      isTeam: true,
    };
  }
  if ('tagId' in item) {
    return {
      id: item.unitId,
      avatar: item.tagName,
      name: item.originName || item.tagName,
      info: t(Strings.display_person_count, {
        count: item.memberCount,
      }),
      isTeam: true,
    };
  }
  if ('memberId' in item) {
    const title = spaceInfo
      ? getSocialWecomUnitName?.({
        name: item.originName || item.memberName,
        isModified: item.isMemberNameModified,
        spaceInfo,
      }) ||
        item.originName ||
        item.memberName
      : item.memberName;

    return {
      id: item.unitId,
      avatar: item.avatar,
      nickName: item.nickName,
      avatarColor: item.avatarColor,
      name: item.originName || item.memberName || t(Strings.unnamed),
      title: title || item.originName || t(Strings.unnamed),
      info: item.teams || '',
      isTeam: false,
    };
  }

  if ('roleId' in item) {
    return {
      id: item.unitId,
      avatar: '',
      name: item.roleName,
      info: t(Strings.display_person_count, {
        count: item.memberCount,
      }),
      isTeam: true,
    };
  }
  return { id: '', avatar: '', name: '', info: '', isTeam: false };
};

/**
 * Get the specified properties of all children under the current node
 * @param treeNodesMap
 * @param nodeId
 * @param exceptArr Nodes to be removed
 * @param property
 */
export const getPropertyByTree = (treeNodesMap: ITreeNodesMap, nodeId: string, exceptArr: string[], property: string) => {
  const node = treeNodesMap[nodeId];
  if (!node) {
    return [];
  }
  return node.children.reduce((names, nodeId) => {
    if (!exceptArr.includes(nodeId)) {
      names.push(treeNodesMap[nodeId]![property]);
    }
    return names;
  }, [] as any[]);
};

export const exportMirror = (mirrorId: string, exportType: string) => {
  store.dispatch(
    StoreActions.fetchMirrorPack(mirrorId, () => {
      const state = store.getState();
      const mirrorSource = Selectors.getMirrorSourceInfo(state, mirrorId)!;
      const view = Selectors.getViewById(Selectors.getSnapshot(state, mirrorSource?.datasheetId)!, mirrorSource?.viewId!);
      exportDatasheet(mirrorSource?.datasheetId, exportType, { view, mirrorId });
    }),
  );
};

export const exportDatasheetBase = async (
  datasheetId: string,
  exportType: string,
  option: {
    view?: IViewProperty;
    mirrorId?: string;
    ignorePermission?: boolean;
  } = {},
) => {
  Message.info({
    content: t(Strings.start_download_loading),
  });
  const { view, mirrorId, ignorePermission } = option;
  const state = store.getState();
  const datasheet = Selectors.getDatasheet(state, datasheetId)!;
  const permission = Selectors.getPermissions(state, datasheetId, undefined, mirrorId);
  const fieldMap = Selectors.getFieldMap(state, datasheetId);
  const fieldPermissionMap = Selectors.getFieldPermissionMap(state);
  if (!datasheet || !fieldMap) {
    return;
  }
  if (!ignorePermission && !permission.exportable) {
    Modal.error({
      title: t(Strings.no_permission_tips_title),
      content: t(Strings.no_permission_tips_description),
      okText: t(Strings.refresh),
      onOk: () => {
        window.location.reload();
      },
    });
    return;
  }
  const { rows, cols } = getRowsAndCols(state, datasheet, view);
  // Filter out fields without permissions
  const visibleCols = cols.filter((col) => Selectors.getFieldRoleByFieldId(fieldPermissionMap, col.fieldId) !== ConfigConstant.Role.None);

  const Excel = await import('exceljs');
  const list: string[][] = [];
  const runTask = runInTimeSlicing(function* () {
    for (const row of rows) {
      const item = visibleCols.map((col) => {
        const cellValue = Selectors.getCellValue(state, datasheet.snapshot, row.recordId, col.fieldId);
        const propsField = fieldMap[col.fieldId]!;
        return Field.bindModel(propsField).cellValueToString(cellValue) || '';
      });
      list.push(item);
      yield;
    }

    const workbook = new Excel.Workbook();
    const nodeName = datasheet.name;
    const viewName = view ? view.name : ConfigConstant.EXPORT_ALL_SHEET_NAME;
    const tempWorksheet = workbook.addWorksheet(`${viewName}`);
    tempWorksheet.columns = getColumnHeader(datasheet, visibleCols);

    // @ts-ignore
    tempWorksheet.addRows(list);

    const fileName = `${nodeName}-${viewName}`;
    switch (exportType) {
      case ConfigConstant.EXPORT_TYPE_XLSX:
        exportExcel(workbook, fileName, !!view);
        break;
      case ConfigConstant.EXPORT_TYPE_CSV:
      default:
        exportCSV(workbook, fileName, !!view);
    }
  });

  runTask?.();
};

/**
 * Export Datasheet
 * Export the full datasheet by default without passing in the view
 * @param datasheetId
 * @param exportType csv or xlsx
 * @param option
 */
export const exportDatasheet = (datasheetId: string, exportType: string, option: { view?: IViewProperty; mirrorId?: string } = {}) => {
  store.dispatch(
    StoreActions.fetchDatasheet(datasheetId, async () => {
      await exportDatasheetBase(datasheetId, exportType, option);
    }) as any,
  );
};

export const exportExcelBase = (workbook: Workbook, fileName: string, extraFunc?: () => void) => {
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${fileName}.xlsx`;
    link.click();

    extraFunc && extraFunc();
  });
};

const exportExcel = (workbook: Workbook, fileName: string, isView?: boolean) => {
  exportExcelBase(workbook, fileName, () => {
    Message.success({
      content: isView ? t(Strings.import_view_data_succeed) : t(Strings.import_file_data_succeed),
    });
  });
};

const exportCSV = async (workbook: Workbook, fileName: string, isView?: boolean) => {
  await workbook.csv.writeBuffer({ encoding: 'UTF-8' }).then((buffer) => {
    const blob = new Blob(['\uFEFF' + buffer], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${fileName}.csv`;
    link.click();
    Message.success({
      content: isView ? t(Strings.import_view_data_succeed) : t(Strings.import_file_data_succeed),
    });
  });
};

const getColumnHeader = (datasheet: IDatasheetState, cols: IViewColumn[]) => {
  return cols.map((col) => ({
    header: datasheet.snapshot.meta.fieldMap[col.fieldId]!.name,
  }));
};

/**
 * Get the set of objects to be exported in rows and columns
 * When the view object is passed in, the rows and columns are retrieved according to the display of the view
 */
const getRowsAndCols = (state: IReduxState, datasheet: IDatasheetState, view?: IViewProperty) => {
  let rows;
  let cols;
  if (view) {
    rows = new ViewDerivateBase(state, datasheet.id).getViewDerivation(view).visibleRows;
    cols = view.columns.filter((item) => !item.hidden);
  } else {
    rows = datasheet.snapshot.meta.views[0]!.rows;
    cols = datasheet.snapshot.meta.views[0]!.columns;
  }
  return { rows, cols };
};

// Return the current datasheet permissions with the provided parameters
export const getSharePermission = (info: IShareSpaceInfo) => {
  const { allowEdit, hasLogin, allowSaved } = info;
  if (allowSaved) {
    return ConfigConstant.permission.shareSave;
  }
  if (allowEdit && !hasLogin) {
    return ConfigConstant.permission.shareEditor;
  }
  if (allowEdit && hasLogin) {
    return ConfigConstant.permission.editor;
  }
  if (!allowEdit && !allowSaved) {
    return ConfigConstant.permission.shareReader;
  }
  return '';
};

/**
 * Convert roles to front-end to display permissions (e.g., manageable, editable, viewable)
 * @param role
 * @param data List of other parameters that affect the permission text
 */
export const getPermission = (role: string, data?: { shareInfo?: IShareSpaceInfo }): string => {
  let permission = ConfigConstant.permission[role];
  if (data?.shareInfo) {
    permission = getSharePermission(data.shareInfo);
  }

  return permission;
};

export const shouldOpenInNewTab = (e: React.MouseEvent) => {
  // Hold down cmd in mac environment or hold down ctrl in win environment and click left mouse button to open the table in new tab.
  return (browser?.is('Windows') && e.ctrlKey) || (browser?.is('macOS') && e.metaKey);
};

// Menu data source for switching permissions
export const permissionMenuData = (nodeType: ConfigConstant.NodeType) => {
  const data = [
    {
      value: ConfigConstant.permission.manager,
      label: t(Strings.add_manager),
      subLabel: ConfigConstant.nodePermissionMap.get(nodeType)![ConfigConstant.permission.manager],
    },
    {
      value: ConfigConstant.permission.editor,
      label: t(Strings.add_editor),
      subLabel: ConfigConstant.nodePermissionMap.get(nodeType)![ConfigConstant.permission.editor],
    },
    {
      value: ConfigConstant.permission.updater,
      label: t(Strings.add_updater),
      subLabel: ConfigConstant.nodePermissionMap.get(nodeType)![ConfigConstant.permission.updater],
    },
    {
      value: ConfigConstant.permission.reader,
      label: t(Strings.add_reader),
      subLabel: ConfigConstant.nodePermissionMap.get(nodeType)![ConfigConstant.permission.reader],
    },
  ];
  return data;
};

/** Get menu by node type */
export const getContextTypeByNodeType = (type: ConfigConstant.NodeType) => {
  switch (type) {
    case ConfigConstant.NodeType.AUTOMATION:
      return ConfigConstant.ContextMenuType.AUTOMATION;
    case ConfigConstant.NodeType.DATASHEET:
      return ConfigConstant.ContextMenuType.DATASHEET;
    case ConfigConstant.NodeType.FORM:
      return ConfigConstant.ContextMenuType.FORM;
    case ConfigConstant.NodeType.FOLDER:
      return ConfigConstant.ContextMenuType.FOLDER;
    case ConfigConstant.NodeType.DASHBOARD:
      return ConfigConstant.ContextMenuType.DASHBOARD;
    case ConfigConstant.NodeType.MIRROR:
      return ConfigConstant.ContextMenuType.MIRROR;
    case ConfigConstant.NodeType.AI:
      return ConfigConstant.ContextMenuType.AI;
    case ConfigConstant.NodeType.CUSTOM_PAGE:
      return ConfigConstant.ContextMenuType.CUSTOM_PAGE;
    default:
      return ConfigConstant.ContextMenuType.DEFAULT;
  }
};

/** Get node type based on node id */
export const getNodeTypeByNodeId = (nodeId: string): ConfigConstant.NodeType => {
  const nodeTypeReg = ConfigConstant.NodeTypeReg;
  const nodeType = ConfigConstant.NodeType;
  const getReg = (nodeType: string) => {
    return new RegExp('^' + nodeType);
  };

  switch (true) {
    case getReg(nodeTypeReg.AUTOMATION).test(nodeId):
      return nodeType.AUTOMATION;
    case getReg(nodeTypeReg.FOLDER).test(nodeId):
      return nodeType.FOLDER;
    case getReg(nodeTypeReg.DATASHEET).test(nodeId):
      return nodeType.DATASHEET;
    case getReg(nodeTypeReg.FORM).test(nodeId):
      return nodeType.FORM;
    case getReg(nodeTypeReg.DASHBOARD).test(nodeId):
      return nodeType.DASHBOARD;
    case getReg(nodeTypeReg.MIRROR).test(nodeId):
      return nodeType.MIRROR;
    default:
      return nodeType.FOLDER;
  }
};

export const getResourceTypeByNodeType = (nodeType: ConfigConstant.NodeType) => {
  switch (nodeType) {
    case ConfigConstant.NodeType.MIRROR: {
      return ResourceType.Mirror;
    }
    case ConfigConstant.NodeType.DASHBOARD: {
      return ResourceType.Dashboard;
    }
    case ConfigConstant.NodeType.DATASHEET: {
      return ResourceType.Datasheet;
    }
    case ConfigConstant.NodeType.FORM: {
      return ResourceType.Form;
    }
    default: {
      return ResourceType.Datasheet;
    }
  }
};
