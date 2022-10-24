import { memo, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import * as React from 'react';
import { Field, getDay, getToday, ICellValue } from '@apitable/core';
import { IDateTimeEditorProps } from '..';
import { useState } from 'react';
import { forwardRef } from 'react';
import { IEditor } from '../../interface';
import { PickerContent } from './picker_content';

const noop = () => { };

enum OptionType {
  ONCHANGE,
  BACKTONOW,
}

const DatePickerMobileBase: React.ForwardRefRenderFunction<IEditor, IDateTimeEditorProps> = (props, ref) => {
  const {
    field,
    editable,
    onClose,
    onSave,
    commandFn,
    curAlarm,
  } = props;

  const { dateFormat } = Field.bindModel(field);

  const mode = field.property.includeTime ? 'datetime' : 'date';

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

  useImperativeHandle(ref, (): IEditor => ({
    focus: noop,
    onEndEdit: noop,
    onStartEdit: noop,
    setValue: setEditorValue,
    saveValue: () => onSave?.(value?.getTime(), curAlarm),
  }));

  const onVisibleChange = useCallback(visible => {
    setVisible(visible);
  }, [setVisible]);

  useEffect(() => {
    if (!visible && onClose) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const onChange = useCallback((val: Date, option: OptionType = OptionType.ONCHANGE) => {
    const nextOptions = [...options.current, option];

    options.current = (nextOptions);

    let _val = val;

    const [lastPrev, last] = nextOptions.slice(-2);

    if (
      value &&
      last === OptionType.ONCHANGE
      && lastPrev === OptionType.BACKTONOW
    ) {
      // 用户最近的 2 个操作是 backToNow 和 onChange,
      // 那么此时应用 state.value 的值而不是这个回调内部的 val
      _val = value;
    }

    setValue(_val);
    // commandFn 是筛选调用的函数, 目前筛选仅用精确到天
    commandFn?.(getDay(_val).getTime());
    onSave?.(_val.getTime(), curAlarm);
  }, [value, commandFn, onSave, curAlarm]);

  // 存在一个 bug, 用户点击今天再点击确定, 保存的是上一次的值
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
    options.current = (nextOptions);
  }, [options]);

  return (
    <PickerContent
      value={value}
      mode={mode}
      editable={editable}
      visible={visible}
      onVisibleChange={onVisibleChange}
      onChange={onChange}
      onBackToNow={onBackToNow}
      onValueChange={onValueChange}
      onClear={onClear}
      dateFormat={dateFormat}
      dateTimeFormat={dateTimeFormat}
      alarm={curAlarm}
    />
  );
};

export const DatePickerMobile = memo(forwardRef(DatePickerMobileBase));
