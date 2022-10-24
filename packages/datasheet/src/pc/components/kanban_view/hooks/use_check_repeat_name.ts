import { useSelector } from 'react-redux';
import { Selectors, Strings, t } from '@apitable/core';
import { useState } from 'react';

export const useCheckRepeatName = () => {
  const [errTip, setErrTip] = useState('');
  const [value, setValue] = useState('');
  const exitFieldName = useSelector(state => {
    const fieldMap = Selectors.getFieldMap(state, state.pageParams.datasheetId!)!;
    return Object.entries(fieldMap).map(([, field]) => {
      return field.name;
    });

  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue(value);
    if (!value || !exitFieldName.includes(value)) {
      setErrTip('');
      return;
    }
    setErrTip(t(Strings.is_repeat_column_name));
  };

  return {
    onChange,
    errTip,
    value,
  };
};
