import React, { useState } from 'react';
import { TextInput, Tooltip } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { useDebounceFn } from 'ahooks';

interface IEditorNumber {
  tooltip?: string;
  /** Whether to check the number */
  validate?: boolean;
  value?: string;
  placeholder?: string;
  onChange?: (value: string | null) => void;
}

export const EditorNumber: React.FC<IEditorNumber> = (props) => {
  const {
    tooltip = t(Strings.number_cell_input_tips),
    validate,
    value,
    onChange,
    placeholder
  } = props;
  const [input, setInput] = useState<string | undefined>(value);
  const [isFormat, setIsFormat] = useState<boolean | undefined>(true);
  const { run: hideTipDebounce } = useDebounceFn(
    () => setIsFormat(true),
    {
      wait: 2000,
    },
  );

  const validateValue = (value: any) => {
    // allow null & undefined
    if (value == null) {
      return true;
    }
    const numV = Number(value);
    return !isNaN(numV);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    const validateRes = !validate || validateValue(value);
    if (!validateRes) {
      setIsFormat(validateRes);
      hideTipDebounce();
      return;
    }
    setInput(value);
    onChange && onChange(value || null);
  };

  return <Tooltip
    visible={!isFormat}
    content={tooltip}
    placement="top"
  >
    <TextInput
      className={'widgetFilterTextInput'}
      style={{ textAlign: 'right' }}
      block
      value={input}
      onChange={onInputChange}
      placeholder={placeholder}
    />
  </Tooltip>;
};
