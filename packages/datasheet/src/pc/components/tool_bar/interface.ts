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

export enum ToolHandleType {
  ViewSort = 'viewSort',
  ViewSwitcher = 'viewSwitcher',
  GallerySetting = 'gallerySetting',
  HideField = 'hideField',
  HideExclusiveField = 'hideExclusiveField',
  ChangeRowHeight = 'changeRowHeight',
  ViewFilter = 'viewFilter',
  ViewGroup = 'ViewGroup',
  GanttSetting = 'GanttSetting',
  CalendarSetting = 'CalendarSetting',
  OrgChartSetting = 'OrgChartSetting',
  HiddenKanbanGroup = 'HiddenKanbanGroup',
  Share = 'Share',
}

export enum HideFieldType {
  Common = 'common',
  Exclusive = 'exclusive',
}
