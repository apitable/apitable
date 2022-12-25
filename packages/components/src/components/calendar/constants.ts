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

export const COUNT = 35;

export const DEFAULT_LIST_HEIGHT = 28;

export const SPACE = 6;

export const DEFAULT_MOBILE_LIST_HEIGHT = 24;

export const SPACE_MOBILE = 4;

export const TYPE = 'TASK';

export const FORMAT_MONTH = 'yyyy/MM';

export const FORMAT = 'yyyy/MM/dd';

export const MAX_LEVEL = 5;

export const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct', 
  'Nov',
  'Dec',
];

export const WEEKS = {
  en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  zh: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
};

export const DETAIL_WEEKS = {
  en: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  zh: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天']
};

export const TOUCH_TIP = {
  en: 'Hand off page turning',
  zh: '松手即可翻页'
};

export const MONTH_TOGGLE = {
  en: {
    pre: 'Last Month',
    next: 'Next Month',
  },
  zh: {
    pre: '上一月',
    next: '下一月'
  }
};

export const TODAY = {
  en: 'Today',
  zh: '今天'
};

export enum Direction {
  Left = 'left',
  Right = 'right'
}