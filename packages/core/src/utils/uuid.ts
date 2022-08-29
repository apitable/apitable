import { generateRandomString } from './string';
import { t, Strings } from '../i18n';

const EFFECTIVE_ID_LENGTH = 10;

export enum IDPrefix {
  Table = 'dst', // datasheetId
  View = 'viw',
  Record = 'rec',
  Field = 'fld',
  Option = 'opt',
  Condition = 'cdt',
  File = 'atc', // 上传的附件
  Comment = 'cmt',
  WidgetPanel = 'wpl',
  Editor = 'edt',
  SPACE = 'spc',
  DateTimeAlarm = 'dta',
}

/**
 * 生成不重复的新 id
 * @param {IDPrefix} prefix 新的 id 前缀
 * @param {string[]} [ids=[]] 已有的 id，不会与这组重复
 * @returns {string}
 */
export function getNewId(prefix: IDPrefix, ids: string[] = []): string {
  return getNewIds(prefix, 1, ids)[0];
}

/**
 * 生成一组不重复的新 id
 * @param {IDPrefix} prefix 新的 id 前缀
 * @param {number} num 期望生成的个数
 * @param {string[]} [ids=[]] 已有的 id，不会与这组重复
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
  GridView: t(Strings.grid_view), // '表格视图',
  KanbanView: t(Strings.kanban_view), // '看板视图',
  GalleryView: t(Strings.gallery_view), // '相册视图',
  FormView: t(Strings.form_view), // '表单视图',
  CalendarView: t(Strings.calendar_view), // '日历视图',
  GanttView: t(Strings.gantt_view), // '甘特图视图',
  OrgChartView: t(Strings.org_chart_view), // '架构视图',
  View: t(Strings.view), // 'View',
};

/**
 * 获取安全不重复的命名
 * @param newName 想要取的名字
 * @param names 已有名字的数组，如存在重复则自动加上后缀
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
