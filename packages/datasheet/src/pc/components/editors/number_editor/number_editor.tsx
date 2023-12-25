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

import { useDebounceFn } from 'ahooks';
import { Input } from 'antd';
import classnames from 'classnames';
import isNumber from 'lodash/isNumber';
import { memo, ChangeEvent, useState, useRef, forwardRef, useImperativeHandle, useMemo, useEffect } from 'react';

import * as React from 'react';
import { useThemeColors } from '@apitable/components';
import {
  FieldType,
  t,
  Strings,
  number2str,
  str2NumericStr,
  numberToShow,
  str2Currency,
  str2number,
  times,
  divide,
  digitLength,
  numberThresholdValue,
} from '@apitable/core';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'pc/components/common';
import { printableKey, isNumeralKey, stopPropagation } from 'pc/utils';
import { IBaseEditorProps, IEditor } from '../interface';
import style from './style.module.less';

export interface INumberEditorProps extends IBaseEditorProps {
  style: React.CSSProperties;
  editing: boolean;

  commandFn?: (data: string) => void;
  isFromFormat?: boolean;
  isLeftTextAlign?: boolean;
  onBlur?: (...args: any) => void;
}

const NumberEditorBase: React.ForwardRefRenderFunction<IEditor, INumberEditorProps> = (props, ref) => {
  const { isLeftTextAlign, field, editing, commandFn, onSave, onBlur, isFromFormat, disabled = false, style: propStyle, height, onChange } = props;
  const colors = useThemeColors();
  const [value, setValue] = useState('');
  const [canInput, setCanInput] = useState<boolean>(true);
  const editorRef = useRef<HTMLInputElement>(null);
  const [showTip, setShowTip] = useState(false);
  const fieldType = field.type;
  const { run: hideTipDebounce } = useDebounceFn(() => setShowTip(false), {
    wait: 2000,
  });

  useImperativeHandle(
    ref,
    (): IEditor => ({
      focus: (preventScroll) => {
        focus(preventScroll);
      },
      blur: () => {
        blur();
      },
      onEndEdit: (cancel: boolean) => {
        onEndEdit(cancel);
      },
      onStartEdit: (value?: number | null) => {
        onStartEdit(value);
      },
      setValue: (value?: number | null) => {
        setEditorValue(isNumber(value) ? value : null, true);
      },
      saveValue: () => {
        saveValue();
      },
    }),
  );

  /**
   * Input state data
   * The cell data is stored in number format, but needs to be converted to a string when entered by the user.
   * This allows mathematical symbols such as e to be entered
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
      // !!! For integers
      // If the number of digits is less than 17, show the decimal places according to precision, e.g. "1000.00"
      // If the number of decimal places is greater than or equal to 17, no decimal places will be displayed if the decimal place is 0
      tempVal = tempVal >= numberThresholdValue ? number2str(String(tempVal)) : numberToShow(tempVal, precision);

      // No units are displayed uniformly when editing
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

  // For cell editing and filtering operations
  const updateValue = (event: ChangeEvent<HTMLInputElement>) => {
    if (editing && canInput) {
      let tempVal: string | null = event.target.value;

      setValue(tempVal);
      tempVal = str2NumericStr(tempVal);
      tempVal = tempVal == null ? '' : tempVal;
      if (fieldType === FieldType.Percent) {
        tempVal = tempVal === '' ? '' : String(divide(Number(tempVal), 100));
      }
      commandFn && commandFn(tempVal);
      onChange && onChange(tempVal);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const printable = printableKey(event.nativeEvent);
    // Currently checking, safari, Chrome in Windows, etc.
    // when calling the system's Chinese input method (e.g., mac's Chinese and Microsoft's own Chinese)
    // If the KeyCode is listened to via the KeyUp event, the correct value is returned. However, there are two problems with KeyUp.
    // 1. Frequent triggers can be missed
    // 2. The KeyUp event is triggered too late and there will still be unqualified characters entered.
    // Therefore, the treatment of AirTable is fully referenced here and no input with a KeyCode of 229 is checked.
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

  const onEndEdit = (cancel: boolean) => {
    if (!cancel) {
      saveValue();
    }
    setEditorValue(null);
  };

  // Set state data - pure numeric strings
  const saveValue = () => {
    let tempVal: string | number | null = str2NumericStr(value);

    // Data filtering is required when saving, e.g. if a Chinese character is entered several times, tempVal will always be null.
    // ChangeSet will not be sent at this point and will need to be filtered within the component
    if (tempVal == null) {
      setValue('');
    }

    // Consider the other fields "populated" and "copied" to the percentage if handled in set_records
    // There will be problems, so do the "value restore" process here directly
    if (fieldType === FieldType.Percent) {
      tempVal = tempVal == null ? null : str2number(tempVal);
      tempVal = tempVal == null ? null : divide(tempVal, 100);
    }
    onSave && onSave(tempVal);
  };

  // Callbacks called on parent components
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
    readOnly: disabled,
    onChange: updateValue,
  };

  return (
    <div
      className={style.numberEditor}
      style={{
        boxShadow: isFromFormat || isLeftTextAlign || commandFn ? 'none' : `0px 0px 0px 2px ${colors.primaryColor}`,
        ...propStyle,
        height,
      }}
      onMouseMove={stopPropagation}
    >
      {/* Here the judgement logic is wrapped in an outer layer, otherwise it would cause a Tooltip positioning error */}
      {!isFromFormat && (
        <Tooltip visible={showTip} title={toolTip} placement="top">
          <div style={{ width: '100%' }}>
            <input
              className={classnames(style.numberInput, 'numberEditorInput', { [style.numberEditorDisabled]: disabled })}
              style={{ textAlign: isLeftTextAlign ? 'left' : 'right' }}
              ref={editorRef}
              onBlur={onBlur}
              {...commonProps}
            />
          </div>
        </Tooltip>
      )}

      {isFromFormat && (
        <Tooltip visible={showTip} title={toolTip} placement="top">
          <Input {...commonProps} onBlur={onBlur} placeholder={t(Strings.currency_field_configuration_default_placeholder)} />
        </Tooltip>
      )}
    </div>
  );
};

export const NumberEditor = memo(forwardRef(NumberEditorBase));
