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

export enum TrackEvents {
  ButtonClick = 'ButtonClick',
  OpTransform = 'OpTransform',
  Operation = 'Operation',
  OldLocalChangeset = 'OldLocalChangeset',
  UpdateLog = 'UpdateLog',
  ViewsInfo = 'ViewsInfo',
  IntroVideoStart = 'IntroVideoStart',
  IntroVideoEnd = 'IntroVideoEnd',
  // Folder novice guide related
  TaskListPush = 'TaskListPush', // The task list popup window appears
  TaskListClick = 'TaskListClick', // click on a task
  TaskListComplete = 'TaskListComplete', // complete a task
  TaskListClose = 'TaskListClose', // close the task list popup

  Theme = 'Theme',
  Language = 'Language',
  RecordCard = 'RecordCard',
  // Template center search keyword report
  TemplateKeyword = 'TemplateKeyword',

  // posthug event name
  TemplateSearchKeyword = 'templateSearchKeyword',
  TemplatePageView='templatePageView',
  TemplateUse='templateUse',
  TemplateConfirmUse='templateConfirmUse',
  InviteByContacts='inviteByContacts',
  InviteByWorkbench='inviteByWorkbench',
  FormPrefill='formPrefill'
}
