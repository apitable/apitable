import { useState } from 'react';

interface ICheckInputOption {
  checkLength?: ICheckLength;
  checkRepeat?: any
}

interface ICheckLength {
  max: number;
  min: number;
  tip: string;
  trim?: boolean
}

interface ICheckRepeat {
  existValue: string[]
  tip: string;
}

export const useCheckInput = (options: ICheckInputOption) => {
  const [errTip, setErrTip] = useState('');

  const strategy = {
    checkLength(option: ICheckLength, value: string) {
      if (option.trim) {
        value = value.trim();
      }
      if (
        value.length >= option.max || value.length <= option.min
      ) {
        setErrTip(option.tip);
        return false;
      }
      return true;
    },
    checkRepeat(option: ICheckRepeat, value: string) {
      if (option.existValue.includes(value)) {
        setErrTip(option.tip);
        return false;
      }
      return true;
    },
  };

  const onCheck = (value: string) => {
    if (!Object.keys(options).length) {
      return;
    }
    setErrTip('');
    for (const [k, v] of Object.entries(options)) {
      const pass = strategy[k](v, value);
      if (!pass) { return; }
    }
  };

  return {
    errTip,
    setErrTip,
    onCheck: onCheck,
  };
};