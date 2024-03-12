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

import debounce from 'lodash/debounce';
import * as React from 'react';
import { useContext, useEffect, useRef } from 'react';
import { useThemeColors } from '@apitable/components';
import { FieldType, IField, Selectors } from '@apitable/core';
import { ScreenSize } from 'pc/components/common/component_display';
import { IEditor } from 'pc/components/editors/interface';
import { NumberEditor } from 'pc/components/editors/number_editor';
import { ViewFilterContext } from 'pc/components/tool_bar/view_filter/view_filter_context';
import { useResponsive } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { IFilterNumberProps } from '../interface';
import styles from './style.module.less';

export const FilterNumber: React.FC<React.PropsWithChildren<Omit<IFilterNumberProps, 'execute'>>> = (props) => {
  const { condition, onChange, field, disabled } = props;
  const datasheetId = useAppSelector((state) => Selectors.getActiveDatasheetId(state))!;
  const numberRef = useRef<IEditor>(null);
  const defaultValue = condition.value;
  const { isViewLock } = useContext(ViewFilterContext);
  const color = useThemeColors();

  useEffect(() => {
    numberRef.current && numberRef.current.onStartEdit(defaultValue ? defaultValue[0] : null);
    // eslint-disable-next-line
  }, []);

  const debounceCommandNumberFn = debounce((value: string) => {
    onChange(value ? [value] : null);
  }, 500);

  function commandNumberFn(value: string) {
    debounceCommandNumberFn(value);
  }

  function getFieldTypeByProperty(field: IField) {
    const { formatType } = field.property;

    if (formatType === FieldType.Currency) {
      return FieldType.Currency;
    } else if (formatType === FieldType.Percent) {
      return FieldType.Percent;
    }
    return field.type;
  }

  const fieldType = getFieldTypeByProperty(field);
  const numberTypes = new Set([FieldType.Number, FieldType.Currency, FieldType.Percent, FieldType.AutoNumber]);

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const editorHeight = isMobile ? 48 : 40;

  return (
    <div className={styles.numberContainer}>
      {numberTypes.has(fieldType) && (
        <NumberEditor
          style={{
            color: color.thirdLevelText,
            cursor: isViewLock ? 'not-allowed' : 'pointer',
          }}
          ref={numberRef}
          editing
          isLeftTextAlign
          width={160}
          datasheetId={datasheetId}
          height={editorHeight}
          field={field}
          commandFn={commandNumberFn}
          disabled={isViewLock || disabled}
        />
      )}
    </div>
  );
};
