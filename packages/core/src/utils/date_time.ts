export function getToday() {
  const today = new Date();
  return getDay(today);
}

export function getDay(day: Date, dayOffset?: number) {
  if (dayOffset != null) {
    day.setDate(day.getDate() + dayOffset);
  }

  day.setMilliseconds(0);
  day.setSeconds(0);
  day.setMinutes(0);
  day.setHours(0);
  return day;
}

export function isSameDay(day1: Date | number, day2: Date | number): boolean { // 判断是否是同一天
  day1 = new Date(day1);
  day2 = new Date(day2);
  return day1.getFullYear() === day2.getFullYear() &&
    day1.getMonth() === day2.getMonth() &&
    day1.getDate() === day2.getDate();
}

export function getDate(date: Date | number): number { // 获取时间戳精确到年月日
  date = new Date(date);
  const { getMonth, getDate, getFullYear } = Date.prototype;
  return new Date(getFullYear.call(date), getMonth.call(date), getDate.call(date)).valueOf();
}