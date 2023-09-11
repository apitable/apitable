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

import { useState } from 'react';

interface ICheckInputOption {
  checkLength?: ICheckLength;
  checkRepeat?: any;
}

interface ICheckLength {
  max: number;
  min: number;
  tip: string;
  trim?: boolean;
}

interface ICheckRepeat {
  existValue: string[];
  tip: string;
}

export const useCheckInput = (options: ICheckInputOption) => {
  const [errTip, setErrTip] = useState('');

  const strategy = {
    checkLength(option: ICheckLength, value: string) {
      if (option.trim) {
        value = value.trim();
      }
      if (value.length >= option.max || value.length <= option.min) {
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
      if (!pass) {
        return;
      }
    }
  };

  return {
    errTip,
    setErrTip,
    onCheck: onCheck,
  };
};
