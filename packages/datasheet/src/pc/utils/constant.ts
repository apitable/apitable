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

import { Strings, t } from '@apitable/core';

export const OPERATE_HEAD_CLASS = 'operateHeadClass';

export const CELL_CLASS = 'cellClass';

export const FIELD_HEAD_CLASS = 'fieldHeaderClass';

export const OPACITY_LINE_CLASS = 'opacityLineClass';

export const EDITOR_CONTAINER = 'editor-container';

export const DEFAULT_LINK_RECORD_COUNT = 20;

export const OPERATE_BUTTON_CLASS = 'operateButton';

export const GROUP_TITLE = 'groupTitle';

export const FIELD_DOT = 'fieldDot';

export const GHOST_RECORD_ID = 'ghostRecordId';

export const DEFAULT_FONT_FAMILY =
  // eslint-disable-next-line max-len
  "BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'";

export enum ButtonOperateType {
  AddRecord = 'addRecord',
  AddField = 'addField',
  OpenFieldSetting = 'openFieldSetting',
  OpenFieldDesc = 'openFieldDesc',
}

export const UNDO = 'UNDO';

export enum ActivitySelectType {
  All = 'all',
  Comment = 'comment',
  Changeset = 'changeset',
  NONE = 'none',
}

export const ACTIVITY_SELECT_MAP = {
  [ActivitySelectType.All]: [0, t(Strings.all_record)],
  [ActivitySelectType.Comment]: [2, t(Strings.record_comment)],
  [ActivitySelectType.Changeset]: [1, t(Strings.record_history)],
};

export const CURRENT_ALARM_SUBTRACT = {
  current: t(Strings.task_reminder_notify_date_option_exact),
};

export const INNER_DAY_ALARM_SUBTRACT = {
  '5m': t(Strings.task_reminder_notify_date_option_5_minutes_before),
  '15m': t(Strings.task_reminder_notify_date_option_15_minutes_before),
  '30m': t(Strings.task_reminder_notify_date_option_30_minutes_before),
  '1h': t(Strings.task_reminder_notify_date_option_1_hour_before),
  '2h': t(Strings.task_reminder_notify_date_option_2_hours_before),
};

export const ALARM_SUBTRACT = {
  '1d': t(Strings.task_reminder_notify_date_option_one_day_before),
  '2d': t(Strings.task_reminder_notify_date_option_two_day_before),
  '1w': t(Strings.task_reminder_notify_date_option_one_week_before),
  '2w': t(Strings.task_reminder_notify_date_option_two_weeks_before),
  '1M': t(Strings.task_reminder_notify_date_option_one_month_before),
  '2M': t(Strings.task_reminder_notify_date_option_two_months_before),
  '3M': t(Strings.task_reminder_notify_date_option_three_month_before),
  '6M': t(Strings.task_reminder_notify_date_option_six_months_before),
};

export const ALL_ALARM_SUBTRACT = {
  ...CURRENT_ALARM_SUBTRACT,
  ...INNER_DAY_ALARM_SUBTRACT,
  ...ALARM_SUBTRACT,
};

export const WECOM_ROBOT_URL = 'https://vika.cn/share/shrp05bbVP0YQXExy4HbU/fomqsurE54BZHHnjq1?fldqqe1zV9W7I=%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1';
