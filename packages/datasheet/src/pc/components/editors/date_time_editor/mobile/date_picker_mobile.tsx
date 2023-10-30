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

import dayjs from 'dayjs';
import { memo, useCallback, useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react';
import * as React from 'react';
import { diffTimeZone, Field, getDay, getToday, ICellValue } from '@apitable/core';
import { IDateTimeEditorProps } from '..';
import { IEditor } from '../../interface';
import { PickerContent } from './picker_content';

const noop = () => {};

enum OptionType {
  ONCHANGE,
  BACKTONOW,
}

const DatePickerMobileBase: React.ForwardRefRenderFunction<IEditor, IDateTimeEditorProps> = (props, ref) => {
  const { field, editable, onClose, onSave, commandFn, curAlarm, disabled, userTimeZone } = props;

  const { dateFormat, timeZone = userTimeZone, includeTimeZone } = Field.bindModel(field);

  const mode = field.property.includeTime ? 'minute' : 'day';

  const [visible, setVisible] = useState(false);

  const [value, setValue] = useState<Date>();

  const options = useRef<OptionType[]>([]);

  const setEditorValue = (cellValue?: ICellValue) => {
    if (!cellValue) {
      setValue(undefined);
      return;
    }
    setValue(new Date(cellValue as number));
  };

  useImperativeHandle(
    ref,
    (): IEditor => ({
      focus: noop,
      onEndEdit: noop,
      onStartEdit: noop,
      setValue: setEditorValue,
      saveValue: () => onSave?.(value?.getTime(), curAlarm),
    }),
  );

  useEffect(() => {
    if (!visible && onClose) {
      onClose();
    }
    // eslint-disable-next-line
  }, [visible]);

  const onChange = useCallback(
    (val: Date, option: OptionType = OptionType.ONCHANGE) => {
      const nextOptions = [...options.current, option];

      options.current = nextOptions;

      let _val = val;

      const [lastPrev, last] = nextOptions.slice(-2);

      if (value && last === OptionType.ONCHANGE && lastPrev === OptionType.BACKTONOW) {
        _val = value;
      }
      if (timeZone && option !== OptionType.BACKTONOW) {
        const diff = diffTimeZone(timeZone);
        _val = dayjs.tz(dayjs.tz(_val).valueOf() + diff).toDate();
      }

      setValue(_val);
      commandFn?.(getDay(_val).getTime());
      onSave?.(_val.getTime(), curAlarm);
    },
    [value, timeZone, commandFn, onSave, curAlarm],
  );

  const onBackToNow = useCallback(() => {
    let now = new Date();
    if (value?.getTime()) {
      const timestamp = value?.getTime();
      const timeValue = timestamp - getDay(new Date(timestamp)).getTime();
      now = new Date(getToday().getTime() + timeValue);
    }
    onChange(now, OptionType.BACKTONOW);
  }, [onChange, value]);

  const onClear = useCallback(() => {
    setValue(undefined);
    commandFn?.(null);
    setVisible(false);
    onSave?.(null);
  }, [setValue, commandFn, onSave]);

  const timeFormat = 'HH:mm';
  const dateTimeFormat = dateFormat + ' ' + timeFormat;

  const onValueChange = useCallback(() => {
    const nextOptions = [...options.current, OptionType.ONCHANGE];
    options.current = nextOptions;
  }, [options]);

  return (
    <PickerContent
      value={value}
      mode={mode}
      editable={editable}
      visible={visible}
      onChange={onChange}
      onBackToNow={onBackToNow}
      onValueChange={onValueChange}
      onClear={onClear}
      dateFormat={dateFormat}
      dateTimeFormat={dateTimeFormat}
      alarm={curAlarm}
      setVisible={setVisible}
      timeZone={timeZone}
      includeTimeZone={includeTimeZone}
      disabled={disabled}
    />
  );
};

export const DatePickerMobile = memo(forwardRef(DatePickerMobileBase));
