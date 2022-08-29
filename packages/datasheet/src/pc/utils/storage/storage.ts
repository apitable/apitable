import store from 'store2';
import { ICalendarViewStatus, IGanttViewStatus, IOrgChartViewStatus, RecordVision } from '@vikadata/core';
import { IViewNodeStateMap } from 'pc/components/org_chart_view/interfaces';
import { IFieldDescCollapseStatus } from 'pc/components/expand_record/field_editor';

// 使用前看下同级目录下的文档

export enum StorageName {
  DatasheetView = 'DatasheetView',
  Description = 'Description', // 存储分享页面已经打开的过的节点，不再显示描述
  IsPanelClosed = 'IsPanelClosed', // 记录面板打开的状态
  SplitPos = 'SplitPos', // 记录面板左右两边的位置
  GroupCollapse = 'GroupCollapse', // 缓存 datasheet 分组的展开/收起情况
  KanbanCollapse = 'KanbanCollapse', // 记录看板的折叠收起状态
  WidgetPanelStatusMap = 'WidgetPanelStatusMap', // 记录小组件面板是否打开，以及打开的幅度
  ShareLoginFailed = 'ShareLoginFailed', // 记录当前分享页面的登录状态是否失败
  GanttStatusMap = 'GanttStatusMap', // 记录甘特图视图相关状态
  CalendarStatusMap = 'CalendarStatusMap', // 记录日历视图相关状态
  OrgChartStatusMap = 'OrgChartStatusMap', // 记录架构视图相关状态
  OrgChartNodeStateMap = 'OrgChartNodeStateMap', // 记录架构视图节点状态
  ShowHiddenFieldInExpand = 'ShowHiddenFieldInExpand', // 记录展开卡片中，隐藏字段的折叠收起状态
  SideRecordWidth = 'SideRecordWidth', // 记录展开卡片，侧边模式下的宽度
  RecordVision = 'RecordVision', // 展开卡片模式（目前为居中和侧边）
  TestFunctions = 'TestFunctions', // 测试功能
  FormFieldContainer = 'FormFieldContainer', // 收集表表单站内缓存
  SharedFormFieldContainer = 'SharedFormFieldContainer', // 收集表表单站外缓存
  SocialPlatformMap = 'SocialPlatformMap',
  PlayerTaskListDoneList = 'PlayerTaskListDoneList', // 新手引导的 taskList 模块
  DingTalkVisitedFolders ='DingTalkVisitedFolders', // 钉钉记录一个从模板创建的
  FieldDescCollapseStatus = 'FieldDescCollapseStatus', // 记录字段描述是否折叠
  ApiDebugWarnConfirm = 'ApiDebugWarnConfirm', // Api面板跳转调试没有开启token的时候警告是否确认阅读
  Other = 'Other',
}

// 配置是否在退出登录后清除相应的 storage
const LogInClearConfig = {
  [StorageName.DatasheetView]: true,
  [StorageName.Description]: true,
  [StorageName.IsPanelClosed]: false,
  [StorageName.SplitPos]: false,
  [StorageName.GroupCollapse]: true,
  [StorageName.KanbanCollapse]: true,
  [StorageName.WidgetPanelStatusMap]: true,
  [StorageName.ShareLoginFailed]: true,
  [StorageName.GanttStatusMap]: true,
  [StorageName.CalendarStatusMap]: true,
  [StorageName.OrgChartStatusMap]: true,
  [StorageName.ShowHiddenFieldInExpand]: true,
  [StorageName.SocialPlatformMap]: true,
  [StorageName.PlayerTaskListDoneList]: true,
  [StorageName.DingTalkVisitedFolders]: true,
  [StorageName.SideRecordWidth]: true,
  [StorageName.RecordVision]: true,
};

const ds = store.namespace('_common_datasheet');

interface IStorage {
  [StorageName.DatasheetView]: { [key: string]: string };
  [StorageName.Description]: string[];
  [StorageName.IsPanelClosed]: boolean;
  [StorageName.SplitPos]: number;
  [StorageName.GroupCollapse]: { [key: string]: string[] };
  [StorageName.KanbanCollapse]: { [key: string]: string[] };
  [StorageName.WidgetPanelStatusMap]: {
    [key: string]: {
      width: number;
      opening: boolean;
      activePanelId: string | null;
    };
  };
  [StorageName.SideRecordWidth]: number;
  [StorageName.RecordVision]: RecordVision;
  [StorageName.ShareLoginFailed]: boolean;
  [StorageName.GanttStatusMap]: { [key: string]: Partial<IGanttViewStatus> };
  [StorageName.CalendarStatusMap]: { [key: string]: Partial<ICalendarViewStatus> };
  [StorageName.OrgChartStatusMap]: { [key: string]: Partial<IOrgChartViewStatus> };
  [StorageName.OrgChartNodeStateMap]: IViewNodeStateMap;
  [StorageName.ShowHiddenFieldInExpand]: string[];
  [StorageName.TestFunctions]: { [key: string]: string };
  [StorageName.FormFieldContainer]: { [key: string]: { [key: string]: any } };
  [StorageName.SharedFormFieldContainer]: { [key: string]: { [key: string]: any } };
  [StorageName.SocialPlatformMap]: Record<string, { [key: string]: any }>;
  [StorageName.PlayerTaskListDoneList]: { [wizardId: number]: number[] };
  [StorageName.DingTalkVisitedFolders]: string[];
  [StorageName.FieldDescCollapseStatus]: IFieldDescCollapseStatus;
  [StorageName.ApiDebugWarnConfirm]: boolean;
  [StorageName.Other]: any;
}

export enum StorageMethod {
  Add,
  Set,
}

export const setStorage = <T extends StorageName = StorageName>(
  key: T,
  value: IStorage[T],
  type: StorageMethod = StorageMethod.Add
) => {
  try {
    if (type === StorageMethod.Set) {
      ds.set(key, value);
    }
    if (type === StorageMethod.Add) {
      ds.add(key, value);
    }
  } catch (error) {
    console.warn('! ' + 'LocalsStorage size has over limit, execute clear.');
    clearStorage();
  }
};

export const getStorage = <T extends StorageName = StorageName>(
  key: T
): IStorage[T] | null => {
  return ds.get(key);
};

export const clearStorage = () => {
  for (const key in LogInClearConfig) {
    if (LogInClearConfig[key]) {
      ds.remove(key);
    }
  }
};

export const deleteStorageByKey = (key) => {
  try {
    ds.remove(key);
  } catch (error) {
    console.warn('! ' + '当前 ${key} 不存在');
  }
};

export const getTestFunctionAvailable = (functionKey) => {
  const testFunctions = getStorage(StorageName.TestFunctions) as { [key: string]: string };
  if (testFunctions && typeof testFunctions === 'object') {
    return Boolean(testFunctions[functionKey]);
  }
  return false;
};
