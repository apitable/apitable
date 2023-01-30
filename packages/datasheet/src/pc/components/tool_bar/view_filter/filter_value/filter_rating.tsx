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

import { useThemeColors } from '@apitable/components';
import { Selectors } from '@apitable/core';
import { useDebounceFn } from 'ahooks';
import { IEditor } from 'pc/components/editors/interface';
import { RatingEditor } from 'pc/components/editors/rating_editor';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { IFilterNumberProps } from '../interface';
import styles from './style.module.less';

export const FilterRating: React.FC<Omit<IFilterNumberProps, 'execute'>> = props => {
  const { condition, onChange, field } = props;
  const colors = useThemeColors();
  const datasheetId = useSelector(state => Selectors.getActiveDatasheetId(state))!;
  const numberRef = useRef<IEditor>(null);

  useEffect(() => {
    numberRef.current!.onStartEdit(condition.value ? Number(condition.value[0]) : null);
    // eslint-disable-next-line
  }, []);

  const { run: commandNumberFn } = useDebounceFn((value: number | null) => {
    onChange(value ? [value.toString()] : '');
  }, { wait: 500 });

  return (
    <div className={styles.ratingContainer}>
      <RatingEditor
        style={{ height: '100%', boxShadow: 'none', background: colors.lowestBg }}
        ref={numberRef}
        editable
        editing
        width={160}
        datasheetId={datasheetId}
        height={35}
        field={field}
        commandFn={commandNumberFn}
        filtering
      />
    </div>
  );
};
