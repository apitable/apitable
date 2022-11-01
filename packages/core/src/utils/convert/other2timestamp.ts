import dayjs from 'dayjs';
import { IDateTimeField, ITimestamp } from 'types/field_types';
import duration from 'dayjs/plugin/duration';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(duration);
dayjs.extend(customParseFormat);

export function str2timestamp(
  value: string | null,
): ITimestamp | null {
  if (!value) {
    return null;
  }
  const dateTime = dayjs(value);

  return dateTime.isValid() ? dateTime.valueOf() : null;
}

/**
 *
 * Returns the number of milliseconds from 13:45 to 00:00
 * @export
 * @param {string} value 12:34
 * @param {IDateTimeField} [_field]
 * @returns
 */
export function str2time(value: string, _field?: IDateTimeField) {
  // const format = (field && field.property.timeFormat) || DateTimeField.defaultTimeFormat;
  // let dateTime = dayjs(value, format);
  // if (!dateTime.isValid()) {
  //   const format2 = format.replace(':', '');
  //   if (format2 !== format) {
  //     dateTime = dayjs(value, format2);
  //   }
  // }

  // if (!dateTime.isValid()) {
  //   return null;
  // }
  const [hh, mm] = value.split(':');
  const hours = parseInt(hh, 10);
  const minutes = parseInt(mm, 10);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return;
  }
  return dayjs.duration({
    hours,
    minutes,
    // seconds: parseInt(s, 10),
    // milliseconds: dateTime.millisecond(),
  }).asMilliseconds();
}
