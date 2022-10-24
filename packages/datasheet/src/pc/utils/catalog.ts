import {
  ConfigConstant,
  Field,
  IDatasheetState,
  ISpaceBasicInfo,
  ISpaceInfo,
  ITreeNodesMap,
  IViewProperty,
  ResourceType,
  Selectors,
  StoreActions,
  Strings,
  t,
  UnitItem,
} from '@apitable/core';
import { Workbook } from 'exceljs';
import { browser } from 'pc/common/browser';
import { NodeIcon } from 'pc/components/catalog/node_context_menu/node_icons';
import { Message } from 'pc/components/common/message';
import { Modal } from 'pc/components/common/modal';
import { getSocialWecomUnitName } from 'pc/components/home/social_platform';
import { IShareSpaceInfo } from 'pc/components/share/interface';
import { store } from 'pc/store';

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
    name: t(Strings.vika_form),
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
];

// 检查该url是否是属于本站点
export const isLocalSite = (url: string, originUrl: string) => {
  url = decodeURIComponent(url);
  originUrl = decodeURIComponent(originUrl);
  const urlHost = new URL(url).host;
  const originUrlHost = new URL(originUrl).host;
  return urlHost === originUrlHost;
};

/**
 * 生成标准的成员信息
 * {
 *  avatar: string;
 *  name: string;
 *  info: number | string;
 * }
 * @param item 用户信息
 */
export const generateUserInfo = (
  item: UnitItem,
  spaceInfo?: ISpaceInfo | ISpaceBasicInfo | null,
): {
  id: string;
  avatar: string;
  name: string;
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
      ? getSocialWecomUnitName({
        name: item.originName || item.memberName,
        isModified: item.isMemberNameModified,
        spaceInfo,
      })
      : item.memberName;

    return {
      id: item.unitId,
      avatar: item.avatar,
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
 *  获取当前节点下所有子节点的指定的属性
 * @param treeNodesMap 树的数据源
 * @param treeNodes 树
 * @param nodeId 要查找的节点ID
 * @param exceptArr 要去除的节点
 * @param property 要获取的节点属性
 */
export const getPropertyByTree = (treeNodesMap: ITreeNodesMap, nodeId: string, exceptArr: string[], property: string) => {
  const node = treeNodesMap[nodeId];
  if (!node) {
    return [];
  }
  return node.children.reduce((names, nodeId) => {
    if (!exceptArr.includes(nodeId)) {
      names.push(treeNodesMap[nodeId][property]);
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

/**
 * 导出数表
 * 不传入view对象默认导出全表
 * @param datasheetId 要导出的数表ID
 * @param exportType 导出的文件类型（csv/xlsx）
 * @param view 要导出数表的视图ID
 */
export const exportDatasheet = (datasheetId: string, exportType: string, option: { view?: IViewProperty; mirrorId?: string } = {}) => {
  const { view, mirrorId } = option;
  store.dispatch(
    StoreActions.fetchDatasheet(datasheetId, async() => {
      const state = store.getState();
      const datasheet = Selectors.getDatasheet(state, datasheetId)!;
      const permission = Selectors.getPermissions(state, datasheetId, undefined, mirrorId);
      const fieldMap = Selectors.getFieldMap(state, datasheetId);
      const fieldPermissionMap = Selectors.getFieldPermissionMap(state);
      if (!datasheet || !fieldMap) {
        return;
      }
      if (!permission.exportable) {
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
      const { rows, cols } = getRowsAndCols(datasheet, view);
      // 过滤掉没有权限的列
      const visibleCols = cols.filter(col => Selectors.getFieldRoleByFieldId(fieldPermissionMap, col.fieldId) !== ConfigConstant.Role.None);

      const data = rows.map(row => {
        return visibleCols.map(col => {
          const cellValue = Selectors.getCellValue(state, datasheet.snapshot, row.recordId, col.fieldId);
          const propsField = fieldMap[col.fieldId];
          return Field.bindModel(propsField).cellValueToString(cellValue) || '';
        });
      });
      // 新建workbook对象
      const Excel = await import('exceljs');
      const workbook = new Excel.Workbook();
      const nodeName = datasheet.name;
      const viewName = view ? view.name : ConfigConstant.EXPORT_ALL_SHEET_NAME;
      // 新建sheet
      const tempWorksheet = workbook.addWorksheet(`${viewName}`);
      const columnHeader = getColumnHeader(datasheet, visibleCols);
      // 定义column标题
      tempWorksheet.columns = columnHeader;
      tempWorksheet.addRows(data);
      const fileName = `${nodeName}-${viewName}`;
      switch (exportType) {
        case ConfigConstant.EXPORT_TYPE_XLSX:
          exportExcel(workbook, fileName, !!view);
          break;
        case ConfigConstant.EXPORT_TYPE_CSV:
        default:
          exportCSV(workbook, fileName, !!view);
      }
    }) as any,
  );
};

export const exportExcelBase = (workbook: Workbook, fileName: string, extraFunc?: () => void) => {
  workbook.xlsx.writeBuffer().then(buffer => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${fileName}.xlsx`;
    link.click();

    extraFunc && extraFunc();
  });
};
/**
 * 导出excel的文件
 * @param workbook workbook对象
 * @param fileName excel文件的名称
 */
const exportExcel = (workbook: Workbook, fileName: string, isView?: boolean) => {
  exportExcelBase(workbook, fileName, () => {
    Message.success({
      content: isView ? t(Strings.import_view_data_succeed) : t(Strings.import_file_data_succeed),
    });
  });
};

/**
 * 导出csv的文件
 * @param workbook workbook对象
 * @param fileName csv文件的名称
 */
const exportCSV = async(workbook: Workbook, fileName: string, isView?: boolean) => {
  await workbook.csv.writeBuffer({ encoding: 'UTF-8' }).then(buffer => {
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

/**
 * 获取列标题集合
 * @param datasheetPack 数表数据
 * @param cols column对象的集合
 */
const getColumnHeader = (datasheet: IDatasheetState, cols: any) => {
  return cols.map(col => ({
    header: datasheet.snapshot.meta.fieldMap[col.fieldId].name,
  }));
};

/**
 * 获取要导出的行和列的对象集合
 * *当传入view对象时会根据视图的显示来获取行和列（所见即所得）
 * @param datasheetPack 数表数据
 * @param view 要导出的视图
 */
const getRowsAndCols = (datasheet: IDatasheetState, view?: IViewProperty) => {
  let rows;
  let cols;
  if (view) {
    rows = Selectors.getVisibleRowsBase(store.getState(), datasheet.snapshot, view);
    cols = view.columns.filter(item => !item.hidden);
  } else {
    rows = datasheet.snapshot.meta.views[0].rows;
    cols = datasheet.snapshot.meta.views[0].columns;
  }
  return { rows, cols };
};

// 通过提供的参数返回当前的数表权限
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
 * 将角色转换成前端要显示权限（如：可管理、可编辑、可查看）
 * @param role 角色
 * @param data 其他影响权限文案的参数列表
 */
export const getPermission = (role: string, data?: { shareInfo?: IShareSpaceInfo }): string => {
  let permission = ConfigConstant.permission[role];
  if (data?.shareInfo) {
    permission = getSharePermission(data.shareInfo);
  }

  return permission;
};

export const shouldOpenInNewTab = (e: React.MouseEvent) => {
  // mac环境下按住cmd 或者 win环境下按住ctrl键，单击鼠标左键时，在新 tab 打开数表。
  return (browser.is('Windows') && e.ctrlKey) || (browser.is('macOS') && e.metaKey);
};

// 切换权限的菜单数据源
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

/** 根据节点类型获取菜单 */
export const getContextTypeByNodeType = (type: ConfigConstant.NodeType) => {
  switch (type) {
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
    default:
      return ConfigConstant.ContextMenuType.DEFAULT;
  }
};

/** 根据节点id获取节点类型 */
export const getNodeTypeByNodeId = (nodeId: string): ConfigConstant.NodeType => {
  const nodeTypeReg = ConfigConstant.NodeTypeReg;
  const nodeType = ConfigConstant.NodeType;
  const getReg = (nodeType: string) => {
    return new RegExp('^' + nodeType);
  };

  switch (true) {
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
