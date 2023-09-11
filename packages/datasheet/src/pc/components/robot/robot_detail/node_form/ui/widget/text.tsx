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

import { useControllableValue } from 'ahooks';
import cls from 'classnames';
import { TextInput } from '@apitable/components';
import { IWidgetProps } from '../../core/interface';
import styles from './style.module.less';

export const TextWidget = (props: IWidgetProps) => {
  // TODO: useControllableValue This hook to see if it can be changed to anti-shake
  const [state, setState] = useControllableValue<{ type: string; value: string }>(props, {
    defaultValue: {
      type: 'Literal',
      value: '',
    },
  });
  const { rawErrors, error } = props;
  const helperTextVisible = Boolean(rawErrors?.length);
  const helperText = rawErrors?.join(',');
  return (
    <>
      <TextInput
        value={state?.value || ''}
        onChange={(e) =>
          setState({
            type: 'Literal',
            value: e.target.value,
          })
        }
        block
      />
      {helperTextVisible && <div className={cls(styles.helperText, { [styles.error]: error })}>{helperText}</div>}
    </>
  );
};
