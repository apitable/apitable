import {
  memo,
  ChangeEvent,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useEffect,
} from 'react';

import * as React from 'react';
import { IBaseEditorProps, IEditor } from '../interface';
import {
  FieldType, t, Strings, number2str, str2NumericStr, numberToShow,
  str2Currency, str2number, times, divide, digitLength, numberThresholdValue,
} from '@vikadata/core';
import style from './style.module.less';
import classnames from 'classnames';
import { printableKey, isNumeralKey, stopPropagation } from 'pc/utils';
import { Input } from 'antd';
import { Tooltip } from 'pc/components/common';
import isNumber from 'lodash/isNumber';
import { useThemeColors } from '@vikadata/components';
import { useDebounceFn } from 'ahooks';

export interface INumberEditorProps extends IBaseEditorProps {
  style: React.CSSProperties;
  editable: boolean;
  editing: boolean;
  commandFn?: (data: string) => void;
  isFromFormat?: boolean;
  isFromFieldEditor?: boolean;
  onBlur?: (...args: any) => void;
}

const NumberEditorBase: React.ForwardRefRenderFunction<IEditor, INumberEditorProps> = (props, ref) => {
  const {
    isFromFieldEditor, field, editing, commandFn, onSave, onBlur,
    editable, isFromFormat, disabled, style: propStyle, height, onChange
  } = props;
  const colors = useThemeColors();
  const [value, setValue] = useState('');
  const [canInput, setCanInput] = useState<boolean>(true);
  const editorRef = useRef<HTMLInputElement>(null);
  const [showTip, setShowTip] = useState(false);
  const fieldType = field.type;
  const { run: hideTipDebounce } = useDebounceFn(
    () => setShowTip(false),
    {
      wait: 2000,
    },
  );

  useImperativeHandle(ref, (): IEditor => ({
    focus: (preventScroll) => { focus(preventScroll); },
    blur: () => { blur(); },
    onEndEdit: (cancel: boolean) => { onEndEdit(cancel); },
    onStartEdit: (value?: number | null) => { onStartEdit(value); },
    setValue: (value?: number | null) => { 
      setEditorValue( isNumber(value) ? value : null, true);
    },
    saveValue: () => { saveValue(); },
  }));

  /**
   * 输入态数据
   * 单元格数据存储格式是 number，但是用户输入的时候需要转成字符串。
   * 这样才能允许输入 e 之类的数学符号
   */
  const setEditorValue = (value: number | null, showSymbol = false) => {
    let tempVal: string | number | null = null;

    if (value != null) {
      tempVal = value;

      const digitLen = digitLength(tempVal);
      let precision = field.property.precision;

      if (fieldType === FieldType.Percent) {
        precision = digitLen - 2 > precision ? digitLen - 2 : precision;
        tempVal = times(tempVal, 100);
      } else {
        precision = digitLen > precision ? digitLen : precision;
      }
      // !!! 对于整数
      // 位数小于 17 位时，根据 precision 展示小数位，如 "1000.00"
      // 位数大于等于 17 位时，如小数位为 0，则不展示小数位
      tempVal = tempVal >= numberThresholdValue ? number2str(String(tempVal)) : numberToShow(tempVal, precision);

      // 编辑的时候统一不显示单位
      if (showSymbol) {
        if (fieldType === FieldType.Currency) {
          tempVal = str2Currency(tempVal, field.property.symbol, 3, ',', field.property.symbolAlign);
        } else if (fieldType === FieldType.Percent) {
          tempVal = tempVal == null ? null : tempVal + '%';
        }
      }
    }
    setValue(tempVal || '');
  };

  const focus = (preventScroll?: boolean) => {
    editorRef.current && editorRef.current.focus({ preventScroll: preventScroll });
  };

  const blur = () => {
    editorRef.current && editorRef.current.blur();
  };

  useEffect(() => {
    setShowTip(false);
  }, [editing]);

  // 用于单元格 编辑 和 筛选 操作
  const updateValue = (event: ChangeEvent<HTMLInputElement>) => {
    if (editing && canInput) {
      let tempVal: string | null = event.target.value;

      setValue(tempVal);
      tempVal = str2NumericStr(tempVal);
      tempVal = tempVal == null ? '' : tempVal;
      if (fieldType === FieldType.Percent) {
        tempVal = tempVal == null ? '' : String(divide(Number(tempVal), 100));
      }
      commandFn && commandFn(tempVal);
      onChange && onChange(tempVal);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const printable = printableKey(event.nativeEvent);
    // 目前检查， safari，Windows中的 Chrome等在调用系统的中文输入法时（如，mac的中文和微软自带的中文）
    // 会将所有的按键 KeyCode 处理成 229。如果是通过 KeyUp 事件监听的 KeyCode 则能返回正确的值。不过 KeyUp 有两个问题：
    // 1. 频繁触发会有遗漏
    // 2. KeyUp 的事件触发的太晚，依旧会有不合格的字符输入。
    // 因此这里完全参考 AirTable 的处理，不检查 KeyCode 为 229 的输入。
    const acceptable = isNumeralKey(event.nativeEvent);
    if (printable && !acceptable) {
      event.preventDefault();
      setCanInput(false);
      setShowTip(true);
      hideTipDebounce();
    } else {
      setCanInput(true);
    }
  };

  // 给 parent 组件调用的回调
  const onEndEdit = (cancel: boolean) => {
    if (!cancel) {
      saveValue();
    }
    setEditorValue(null);
  };

  // 设置态数据 —— 纯数字字符串
  const saveValue = () => {
    let tempVal: string | number | null = str2NumericStr(value);

    // 保存时需要进行数据过滤，例如多次输入汉字，tempVal 一直为 null，
    // 此时不会发送 ChangeSet，需要在组件内进行过滤
    if (tempVal == null) {
      setValue(tempVal || '');
    }

    // 考虑到其它字段 “填充” 和 “复制” 到百分比时，若在 set_records 中处理，
    // 会出现问题，因此直接在这做 “值还原” 处理
    if (fieldType === FieldType.Percent) {
      tempVal = tempVal == null ? null : str2number(tempVal);
      tempVal = tempVal == null ? null : divide(tempVal, 100);
    }
    onSave && onSave(tempVal);
  };

  // 给 parent 组件调用的回调
  const onStartEdit = (value?: number | null) => {
    if (value === undefined) return;
    setEditorValue(value);
  };

  const toolTip = useMemo(() => {
    switch (fieldType) {
      case FieldType.Number:
        return t(Strings.number_cell_input_tips);
      case FieldType.Currency:
        return t(Strings.currency_cell_input_tips);
      case FieldType.Percent:
        return t(Strings.percent_cell_input_tips);
      default:
        return t(Strings.number_cell_input_tips);
    }
  }, [fieldType]);

  const commonProps = {
    disabled,
    value,
    onKeyDown,
    readOnly: !editable,
    onChange: updateValue,
  };

  return (
    <div
      className={style.numberEditor}
      style={{
        boxShadow: (isFromFormat || isFromFieldEditor || commandFn) ? 'none' : `0px 0px 0px 2px ${colors.primaryColor}`,
        ...propStyle,
        height,
      }}
      onMouseMove={stopPropagation}
    >
      {/* 这里将判断逻辑套在外层，否则会引起 Tooltip 定位错误 */}
      {!isFromFormat && <Tooltip
        visible={showTip}
        title={toolTip}
        placement="top"
      >
        <div
          style={{ width: '100%' }}
        >
          <input
            className={classnames(style.numberInput, 'numberEditorInput')}
            style={{ textAlign: isFromFieldEditor ? 'left' : 'right' }}
            ref={editorRef}
            onBlur={onBlur}
            {...commonProps}
          />
        </div>
      </Tooltip>}

      {isFromFormat && <Tooltip
        visible={showTip}
        title={toolTip}
        placement="top"
      >
        <Input
          {...commonProps}
          onBlur={onBlur}
          placeholder={t(Strings.currency_field_configuration_default_placeholder)}
        />
      </Tooltip>}
    </div>
  );
};

export const NumberEditor = memo(forwardRef(NumberEditorBase));
