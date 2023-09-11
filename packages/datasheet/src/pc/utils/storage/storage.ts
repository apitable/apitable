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

import store from 'store2';
import { ICalendarViewStatus, IGanttViewStatus, IOrgChartViewStatus, RecordVision } from '@apitable/core';
import { IFieldDescCollapseStatus } from 'pc/components/expand_record/field_editor';
import { IViewNodeStateMap } from 'pc/components/org_chart_view/interfaces';

// Read the documentation in the same level directory before use
export enum StorageName {
  DatasheetView = 'DatasheetView',
  Description = 'Description', // Store the nodes that have been opened on the share page and no longer display the description
  IsPanelClosed = 'IsPanelClosed', // The state of the open panel
  SplitPos = 'SplitPos', // The position of the left and right sides of the panel
  GroupCollapse = 'GroupCollapse', // Cache datasheet grouping expansion/extension
  KanbanCollapse = 'KanbanCollapse', // The folded and folded status of the kanban board
  WidgetPanelStatusMap = 'WidgetPanelStatusMap', // Whether the widget panel is open and how far it is open
  ShareLoginFailed = 'ShareLoginFailed', // Whether the login status of the current sharing page has failed
  GanttStatusMap = 'GanttStatusMap', // Gantt view related status
  CalendarStatusMap = 'CalendarStatusMap', // Calendar view related status
  OrgChartStatusMap = 'OrgChartStatusMap', // OrgChart view related status
  OrgChartNodeStateMap = 'OrgChartNodeStateMap', // view related node status
  ShowHiddenFieldInExpand = 'ShowHiddenFieldInExpand', // Collapsed and collapsed state of the hidden fields in the expanded card
  SideRecordWidth = 'SideRecordWidth', // Expanded card, width in side-by-side mode
  RecordVision = 'RecordVision', // Expand card mode (currently centered and side-by-side)
  TestFunctions = 'TestFunctions', // Experimental Features
  FormFieldContainer = 'FormFieldContainer', // Form In-Site Cache
  SharedFormFieldContainer = 'SharedFormFieldContainer', // Form off-site caching
  SocialPlatformMap = 'SocialPlatformMap',
  PlayerTaskListDoneList = 'PlayerTaskListDoneList', // TaskList Module for User Guide
  DingTalkVisitedFolders = 'DingTalkVisitedFolders', // Folders created from Dingtalk templates
  FieldDescCollapseStatus = 'FieldDescCollapseStatus', // Whether the field description is collapsed
  ApiDebugWarnConfirm = 'ApiDebugWarnConfirm', // Api panel jump debugging does not open token when warning whether to confirm reading
  Other = 'Other',
}

// Configure whether to clear the corresponding storage after logging out
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

export const setStorage = <T extends StorageName = StorageName>(key: T, value: IStorage[T], type: StorageMethod = StorageMethod.Add) => {
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

export const getStorage = <T extends StorageName = StorageName>(key: T): IStorage[T] | null => {
  return ds.get(key);
};

export const clearStorage = () => {
  for (const key in LogInClearConfig) {
    if (LogInClearConfig[key]) {
      ds.remove(key);
    }
  }
};

export const deleteStorageByKey = (key: StorageName) => {
  try {
    ds.remove(key);
  } catch (error) {
    console.warn('! ' + `Current ${key} does not exist`);
  }
};
