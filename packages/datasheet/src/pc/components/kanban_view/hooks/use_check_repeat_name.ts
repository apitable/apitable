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
import { Selectors, Strings, t } from '@apitable/core';

import { useAppSelector } from 'pc/store/react-redux';

export const useCheckRepeatName = () => {
  const [errTip, setErrTip] = useState('');
  const [value, setValue] = useState('');
  const exitFieldName = useAppSelector((state) => {
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
