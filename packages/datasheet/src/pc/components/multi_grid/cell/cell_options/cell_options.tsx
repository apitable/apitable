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

import { Button, useThemeColors, Typography } from '@apitable/components';
import { FieldType, IField, IMultiSelectedIds, RowHeightLevel, Selectors, ThemeName } from '@apitable/core';
import { AddOutlined, CloseSmallOutlined } from '@apitable/icons';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { ButtonPlus } from 'pc/components/common';
import { MouseDownType } from 'pc/components/selection_wrapper';
import { store } from 'pc/store';
import { COLOR_INDEX_THRESHOLD, stopPropagation } from 'pc/utils';
import { useCallback } from 'react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { setColor } from '../../format';
import { ICellComponentProps } from '../cell_value/interface';
import { OptionalCellContainer } from '../optional_cell_container/optional_cell_container';
import optionalStyle from '../optional_cell_container/style.module.less';
import styles from './style.module.less';

export function inquiryValueByKey(key: 'name' | 'color', id: string, field: IField, theme: ThemeName) {
  const item = field.property.options.find(item => item.id === id);
  if (!item) {
    return '';
  }
  if (key === 'color') {
    return setColor(item[key], theme);
  }
  return item[key];
}

interface ICellOptionsProps extends ICellComponentProps {
  keyPrefix?: string;
  deletable?: boolean; 
  rowHeightLevel?: RowHeightLevel
}

export const CellOptions: React.FC<ICellOptionsProps> = props => {
  const { field: propsField, cellValue, isActive, className, onChange, toggleEdit, readonly, rowHeightLevel, deletable = true } = props;
  const isSingleSelect = !Array.isArray(cellValue);
  const field = Selectors.findRealField(store.getState(), propsField);

  const colors = useThemeColors();
  const cacheTheme = useSelector(Selectors.getTheme);
  const getOptionNameColor = useCallback((id: string, field: IField)=> {
    const item = field.property.options.find(item => item.id === id);
    return item && item.color >= COLOR_INDEX_THRESHOLD ? colors.defaultBg : colors.firstLevelText;
  }, [colors]);

  function returnSingle(content: string) {
    if (typeof content !== 'string' || !content.length || !field) {
      return <></>;
    }
    const color = cacheTheme === ThemeName.Light ? getOptionNameColor(content, field) : colors.staticWhite0;
    const iconColor = color === colors.firstLevelText ? colors.secondLevelText : colors.defaultBg;
    const style: React.CSSProperties = {
      background: inquiryValueByKey('color', content, field, cacheTheme),
      color,
    };
    return (
      <div style={style} className={classNames('tabItem', styles.tabItem, styles.single)}>
        <div className={classNames('optionText', styles.optionText)}>
          <Typography variant="body4" className={styles.name} color={color} ellipsis>
            {inquiryValueByKey('name', content, field, cacheTheme)}
          </Typography>
        </div>
        {
          showDeleteIcon(iconColor, inquiryValueByKey('color', content, field, cacheTheme))
        }
      </div>
    );
  }

  function deleteItem(e: React.MouseEvent, index?: number) {
    stopPropagation(e);
    let value: string | string[] | null = null;
    if (!isSingleSelect) {
      value = (cellValue as string[]).filter((item, idx) => {
        return idx !== index;
      });
      if (value.length === 0) {
        value = null;
      }
    }

    onChange && onChange(value);
  }

  function showDeleteIcon(color: string, bgColor: string, index?: number) {
    if (!deletable) return null;
    if (isActive && !readonly) {
      return (
        <Button
          onClick={e => deleteItem(e, index)}
          onMouseDown={stopPropagation}
          className={styles.close}
          style={{
            width: 16,
            height: 16,
            padding: 0,
            borderRadius: 2,
            marginLeft: 4,
            transition: 'none',
          }}
          variant="fill"
          color={bgColor}
        >
          <CloseSmallOutlined size={16} color={color} />
        </Button>
      );
    }
    return null;
  }

  function onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    if (e.button === MouseDownType.Right) {
      return;
    }
    isActive && toggleEdit && toggleEdit();
  }

  function returnMulti(content: IMultiSelectedIds) {
    if (isEmpty(content) || !field) {
      return <></>;
    }
    return (
      <>
        {
          content.map((item, index) => {
            if (!field) {
              return null;
            }
            const color = cacheTheme === ThemeName.Light ? getOptionNameColor(item, field) : colors.staticWhite0;
            const style: React.CSSProperties = {
              background: inquiryValueByKey('color', item, field, cacheTheme),
              color,
            };
            const classname = classNames('tabItem', styles.tabItem, styles.multi);
            const iconColor = color === colors.firstLevelText ? colors.secondLevelText : colors.defaultBg;
            return (
              <div
                style={style}
                className={classname}
                id={props.keyPrefix}
                key={props.keyPrefix ? `${props.keyPrefix}-${index}` : item + index}
              >
                <div className={classNames('optionText', styles.optionText)} style={{ color }}>
                  <Typography variant="body4" className={styles.name} color={color} ellipsis>
                    {inquiryValueByKey('name', item, field, cacheTheme)}
                  </Typography>
                </div>
                {
                  showDeleteIcon(iconColor, inquiryValueByKey('color', item, field, cacheTheme), index)
                }
              </div>
            );
          })
        }
      </>
    );
  }

  const showAddIcon = (isActive && !readonly) &&
    ((field?.type === FieldType.MultiSelect) || (field?.type === FieldType.SingleSelect && !cellValue));

  return (
    <OptionalCellContainer
      onMouseDown={onMouseDown}
      className={className}
      displayMinWidth={Boolean(isActive && !isSingleSelect && !readonly)}
      viewRowHeight={rowHeightLevel}
    >
      {
        showAddIcon &&
        <ButtonPlus.Icon size={'x-small'} className={optionalStyle.iconAdd} icon={<AddOutlined color={colors.fourthLevelText} />} />
      }
      {isSingleSelect ? returnSingle(cellValue as string) : returnMulti(cellValue as IMultiSelectedIds)}
    </OptionalCellContainer>
  );
};
