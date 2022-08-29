import { Strings, t } from '@vikadata/core';

// Grid 第一列的操作区域的类型
export const OPERATE_HEAD_CLASS = 'operateHeadClass';
// Cell 单元格的类名
export const CELL_CLASS = 'cellClass';
// 列头的类名
export const FIELD_HEAD_CLASS = 'fieldHeaderClass';
// 拖动列宽，给鼠标留下的操作区的类名
export const OPACITY_LINE_CLASS = 'opacityLineClass';

// EditorContainerBase id名
export const EDITOR_CONTAINER = 'editor-container';

// 默认的checkbox icon
export const DEFAULT_CHECK_ICON = 'white_check_mark';

// 展开卡片默认显示关联记录最大值
export const DEFAULT_LINK_RECORD_COUNT = 20;

export const OPERATE_BUTTON_CLASS = 'operateButton';

export const GROUP_TITLE = 'groupTitle';

export const FIELD_DOT = 'fieldDot';

// 使用第一行在第一列
export const GHOST_RECORD_ID = 'ghostRecordId';

// index.less 中设置的默认字体
// eslint-disable-next-line
export const DEFAULT_FONT_FAMILY = " BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'";

// 表格区域操作按钮的操作对象
export enum ButtonOperateType {
  AddRecord = 'addRecord',
  AddField = 'addField',
  OpenFieldSetting = 'openFieldSetting',
  OpenFieldDesc = 'openFieldDesc',
}

// 色盘基础颜色
export type ColorBase = 'purple' | 'deepPurple' | 'indigo' | 'blue' | 'teal' | 'green'
  | 'yellow' | 'orange' | 'tangerine' | 'pink' | 'red' | 'brown' | 'black' | 'blackBlue';

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
  ...ALARM_SUBTRACT
};

export const WECOM_ROBOT_URL= 'https://vika.cn/share/shrp05bbVP0YQXExy4HbU/fomqsurE54BZHHnjq1?fldqqe1zV9W7I=%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1';

