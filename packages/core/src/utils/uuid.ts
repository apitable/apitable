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

import { Strings, t } from 'exports/i18n';
import { generateRandomString } from './string';

const EFFECTIVE_ID_LENGTH = 10;

export enum IDPrefix {
  Table = 'dst', // datasheetId
  View = 'viw',
  Record = 'rec',
  Field = 'fld',
  Option = 'opt',
  Condition = 'cdt',
  File = 'atc', // uploaded attachments
  Comment = 'cmt',
  WidgetPanel = 'wpl',
  Editor = 'edt',
  SPACE = 'spc',
  DateTimeAlarm = 'dta',
  EmbedLink = 'emb',
  Form = 'fom',
  Dashboard = 'dsb',
  AutomationAction = 'aac',
  Document = 'doc',
  AutomationTrigger = 'atr',
  WorkDocAonymousId = 'wda',
}

/**
 * Generate unique new id
 * @param {IDPrefix} prefix new id prefix
 * @param {string[]} [ids=[]] Existing ids, will not be repeated with this group
 * @returns {string}
 */
export function getNewId(prefix: IDPrefix, ids: string[] = []): string {
  return getNewIds(prefix, 1, ids)[0]!;
}

/**
 * Generate a new set of unique ids
 * @param {IDPrefix} prefix new id prefix
 * @param {number} num the expected number
 * @param {string[]} [ids=[]] Existing ids, will not be repeated with this group
 * @returns {string[]}
 */
export function getNewIds(prefix: IDPrefix, num: number, ids: string[] = []): string[] {
  if (num <= 0) return [];

  const newIds: string[] = [];
  const idMap = ids.reduce((prev, id) => {
    prev[id] = true;
    return prev;
  }, {} as { [id: string]: true });

  for (let i = 0; i < num; i++) {
    let newId: string;
    do {
      newId = `${prefix}${generateRandomString(EFFECTIVE_ID_LENGTH)}`;
    } while (idMap[newId]);
    newIds.push(newId);
    idMap[newId] = true;
  }
  return newIds;
}

export type NamePrefixString = string;
export const NamePrefix = {
  Field: t(Strings.field), // 'Field',
  GridView: t(Strings.grid_view),
  KanbanView: t(Strings.kanban_view),
  GalleryView: t(Strings.gallery_view),
  FormView: t(Strings.form_view),
  CalendarView: t(Strings.calendar_view),
  GanttView: t(Strings.gantt_view),
  OrgChartView: t(Strings.org_chart_view),
  View: t(Strings.view), // 'View',
};

/**
 * Get safe and unique names
 * @param newName the name you want to take
 * @param names An array of existing names, if there are duplicates, suffixes will be added automatically
 */
export function getUniqName(newName: string, names: string[]) {
  let index = 1;
  const nameMap = names.reduce((prev, name) => {
    prev[name] = true;
    return prev;
  }, {} as { [name: string]: true });

  let uniqName: string = newName;
  while (nameMap[uniqName]) {
    uniqName = `${newName} ${++index}`;
  }
  return uniqName;
}

const numbers = '0123456789';
export function generateRandomNumber(length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    result += numbers.charAt(randomIndex);
  }

  return result;
}
