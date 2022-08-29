import differenceInDays from 'date-fns/differenceInDays';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import min from 'date-fns/min';
import max from 'date-fns/max';
import add from 'date-fns/add';
import format from 'date-fns/format';
import subDays from 'date-fns/subDays';
import { ILevel, ILevelResult, IResizeFormat } from './interface';
import { COUNT, MONTHS, FORMAT, FORMAT_MONTH, Direction } from './constants';

const date2Day = (date: Date) => {
  return new Date(format(date, FORMAT));
};

export const date2Month = (date: Date) => {
  // 火狐上 new Date('2021/09') => Invalid Date, 默认补充一个天数
  const formatDate = format(date, FORMAT_MONTH) + '/01';
  return new Date(formatDate);
};

export const resizeFormat = (resizeData: IResizeFormat) => {
  let { startDate, endDate } = resizeData;
  endDate = endDate || startDate;
  startDate = startDate || endDate;
  const { day, direction } = resizeData;
  const isRight = direction === Direction.Right;
  const isWarning = isAfter(startDate, endDate);
  // 修改结束时间
  if (isRight) {
    // 告警时拉伸实时修正时间
    endDate = add(isWarning ? startDate : endDate, { days: day });
    // 右拉伸不允许小于开始时间
    if (isAfter(startDate, endDate)) {
      endDate = startDate;
    }
  } else { // 修改开始时间
    const calcStartDate = subDays(startDate, day);
    // 正常记录左拉伸不允许大于结束时间
    if (!isWarning && isAfter(calcStartDate, endDate)) {
      startDate = endDate;
    } else if (
    // 异常记录左拉伸不允许大于原始的开始时间
      !(isWarning && isAfter(calcStartDate, startDate))
    ) {
      startDate = calcStartDate;
    } 
  }
  return { startDate, endDate };
};

/**
 * 获取当前月的天数
 * @param year 
 * @param month 
 */
export const daysInMonth = (year: number, month: number) => {
  const d = new Date(year, month - 1, 0);
  return d.getDate();
};

/**
 * 获取当前月第一天的星期
 * @param year 
 * @param month 
 */
export const firstDayOfMonth = (year: number, month:number) => {
  const d = new Date(year, month - 1, 1);
  const day = d.getDay();
  return day === 0 ? 7 : day;
};

export const formatDate = (year: number, month: number, lang: string) => {
  return lang === 'zh' ? `${year}年${month}月` : `${MONTHS[month - 1]} ${year}`;
};

/**
 * 获取当前日历面板数据
 * @param step 
 */
export const getPanelData = (step: number) => {
  const now = new Date();
  const currMonth = now.getMonth();
  const totalMonth = step + currMonth + 1;
  const year = now.getFullYear() + Math.ceil(totalMonth / 12) - 1;
  let month = totalMonth % 12;
  if (month <= 0) {
    month += 12;
  }
  const days = daysInMonth(year, month + 1);
  const preDays = daysInMonth(year, month);
  const firstDay = firstDayOfMonth(year, month);
  const data: { day: number, month: number }[] = [];
  let i = 1;
  const count = COUNT + (days + firstDay - 1 > COUNT ? 7 : 0);
  while(count >= i) {
    if (firstDay >= i + 1) {
      data.push({
        day: preDays - firstDay + i + 1,
        month: month - 1
      });
    } else if (days < i + 1 - firstDay) {
      data.push({
        day: i + 1 - firstDay - days,
        month: month + 1,
      });
    } else {
      data.push({
        day: i + 1 - firstDay,
        month,
      });
    }
    i++;
  }
  return {
    data,
    year,
    month,
  };
};

export const isMouseEvent = (event: MouseEvent | TouchEvent): event is MouseEvent => {
  return Boolean(
    ((event as MouseEvent).clientX || (event as MouseEvent).clientX === 0) &&
      ((event as MouseEvent).clientY || (event as MouseEvent).clientY === 0),
  );
};

export const isTouchEvent = (event: MouseEvent | TouchEvent): event is TouchEvent => {
  return Boolean((event as TouchEvent).touches && (event as TouchEvent).touches.length);
};

export const getLevels = ({ week, year, tasks, resizeMsg }: ILevel) => {
  const start = week[0];
  const end = week[week.length - 1];
  const startDate = new Date(year, start.month - 1, start.day);
  const endDate = new Date(year, end.month - 1, end.day);
  let updateTasks = tasks;
  if (resizeMsg) {
    const { id, day, direction } = resizeMsg;
    updateTasks = tasks.map(task => {
      if (id === task.id) {
        const { startDate, endDate } = task;
        const formatData = resizeFormat({ startDate, endDate, day, direction });
        return {
          ...task,
          ...formatData,
        };
      }
      return task;
    });
  }
  
  const rowTasks = updateTasks.filter(task =>
    (!isAfter(date2Day(task.startDate || task.endDate), endDate) && !isAfter(startDate, task.endDate || task.startDate)) ||
    // 开始时间大于结束时间，异常任务处理
    (isAfter(task.startDate, task.endDate) && !isBefore(task.startDate, startDate) && !isBefore(endDate, task.startDate))
  ).map(task => {
    const isWarning = isAfter(task.startDate, task.endDate);
    const taskStartDate = date2Day(task.startDate || task.endDate);
    const taskEndDate = date2Day(task.endDate || task.startDate);
    const currMaxStartDay = date2Day(max([startDate, taskStartDate]));
    const currMinLastDay = date2Day(min([endDate, taskEndDate]));
    const len = isWarning ? 1 : (differenceInDays(currMinLastDay, currMaxStartDay) + 1);
    const diffStart = differenceInDays(taskStartDate, startDate);
    const diffEnd = differenceInDays(endDate, taskEndDate);
    const left = diffStart < 0 ? 0 : diffStart;
    return {
      task,
      len,
      left: left + 1,
      right: left + len,
      isStart: diffStart >= 0 || isWarning,
      isEmptyStart: !task.startDate,
      isEnd: diffEnd >=0 || isWarning,
      isEmptyEnd: !task.endDate,
      warn: isWarning,
    };
  });
  const levels: ILevelResult[][] = [];
  let j: number;
  for(let i = 0; i < rowTasks.length; i++) {
    const task = rowTasks[i];
    for (j = 0; j < levels.length; j++) {
      const isOver = levels[j].some(seg =>
        seg.left <= task.right && seg.right >= task.left
      );
      if (!isOver) {
        break;
      }
    }
    (levels[j] || (levels[j] = [])).push(task);
  }
  return levels;
};

export const formatDayValue = (month, day, lang: 'en' | 'zh', ) => {
  return lang === 'zh' ? `${month}月${day}日` : `${MONTHS[month - 1]} ${day}`;
};