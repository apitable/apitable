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

export function isSameDay(day1: Date | number, day2: Date | number): boolean { // Determine if it is the same day
  day1 = new Date(day1);
  day2 = new Date(day2);
  return day1.getFullYear() === day2.getFullYear() &&
    day1.getMonth() === day2.getMonth() &&
    day1.getDate() === day2.getDate();
}

export function getDate(date: Date | number): number { // Get timestamp accurate to year month day
  date = new Date(date);
  const { getMonth, getDate, getFullYear } = Date.prototype;
  return new Date(getFullYear.call(date), getMonth.call(date), getDate.call(date)).valueOf();
}