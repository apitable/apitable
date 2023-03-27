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

import {
  IField, IFieldRanges, IFilterInfo, IGridViewProperty,
  IGroupInfo, IReduxState, ISortInfo, Selectors, DATASHEET_ID, t, Strings,
} from '@apitable/core';
import { areEqual, GridChildComponentProps } from 'react-window';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import { TComponent } from 'pc/components/common/t_component';
import { useThemeColors } from '@apitable/components';
import { FIELD_HEAD_CLASS, OPERATE_HEAD_CLASS, OPERATE_BUTTON_CLASS, ButtonOperateType, GHOST_RECORD_ID } from 'pc/utils';
import * as React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { getAddFieldWidth } from '../cell/virtual_cell/cell_add_field/cell_add_field';
import { OperateColumn } from '../operate_column';
import { HeaderInner } from './header_inner';
import styles from './styles.module.less';
import { AddOutlined } from '@apitable/icons';

const HeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
};

interface IHeaderFuncProps {
  columnCount: number;
  fieldRanges: IFieldRanges | undefined | null;
  activeFilterInfo: IFilterInfo | undefined;
  groupInfo: IGroupInfo;
  sortInfo: ISortInfo | undefined;
  field: IField;
  curColumnIndex: number;
  fieldCreatable: boolean;
}

const HeaderFunc: React.FC<React.PropsWithChildren<GridChildComponentProps & { rightRegion: boolean }>> = (
  { columnIndex, style, rightRegion },
) => {
  const colors = useThemeColors();
  const {
    columnCount,
    fieldRanges,
    activeFilterInfo,
    field,
    curColumnIndex,
    fieldCreatable,
    sortInfo,
    groupInfo,
  } = useSelector((state: IReduxState): IHeaderFuncProps => {
    const view = Selectors.getCurrentView(state)! as IGridViewProperty;
    let curColumnIndex = columnIndex;
    if (rightRegion) {
      curColumnIndex += view.frozenColumnCount;
    }
    const columns = Selectors.getVisibleColumns(state);
    const fieldId = columns[curColumnIndex] && columns[curColumnIndex].fieldId;
    const field = Selectors.getField(state, fieldId);
    const permission = Selectors.getPermissions(state);
    return {
      columnCount: columns.length,
      fieldRanges: Selectors.getFieldRanges(state),
      activeFilterInfo: Selectors.getFilterInfo(state),
      sortInfo: Selectors.getActiveViewSortInfo(state)!,
      groupInfo: Selectors.getActiveViewGroupInfo(state),
      field,
      curColumnIndex,
      fieldCreatable: permission.fieldCreatable,
    };
  }, shallowEqual);

  const addIconClass = classNames(styles.addIcon, OPERATE_BUTTON_CLASS);

  let fieldClass = classNames(FIELD_HEAD_CLASS, styles.fieldHeader);

  if (curColumnIndex === columnCount) {
    return (
      <div
        style={{
          ...style,
          ...HeaderStyle,
          width: getAddFieldWidth(fieldCreatable, groupInfo),
          borderTopRightRadius: 8,
          padding: fieldCreatable ? '' : 0,
        }}
        className={fieldClass}
        data-column-index={curColumnIndex}
      >
        <div
          className={addIconClass}
          style={{
            cursor: fieldCreatable ? '' : 'default',
          }}
          data-operate-type={ButtonOperateType.AddField}
          id={DATASHEET_ID.ADD_COLUMN_BTN}
        >
          {
            fieldCreatable && <AddOutlined size={15} color={colors.thirdLevelText} />
          }
        </div>
      </div>
    );
  }

  let isSelected = false;

  if (fieldRanges != null) {
    isSelected = fieldRanges.includes(field.id);
  }

  if (isSelected) {
    fieldClass = classNames(fieldClass, styles.select);
  }

  if (!field) {
    return <></>;
  }

  const isFilterField = activeFilterInfo ? activeFilterInfo.conditions.some(item => item.fieldId === field.id) : false;
  const isSortField = sortInfo && sortInfo.keepSort ? sortInfo.rules.some(sort => sort.fieldId === field.id) : false;
  const isShowHighLight = isFilterField || isSortField;

  if (isShowHighLight) {
    fieldClass = classNames(fieldClass, styles.highLight);
  }

  function setDataset() {
    return {
      'data-column-index': curColumnIndex,
      'data-field-id': field.id,
      'data-field-name': field.name,
    };
  }

  return (
    <div
      style={{
        ...style,
        ...HeaderStyle,
        borderTopLeftRadius: curColumnIndex === 0 ? '8px' : '',
      }}
      className={(!rightRegion) ? '' : fieldClass}
      {...setDataset()}
    >
      {
        !rightRegion && curColumnIndex === 0 && (
          <div
            className={OPERATE_HEAD_CLASS}
            style={{ height: '100%' }}
            data-record-id={GHOST_RECORD_ID}
          >
            <OperateColumn isHeader />
          </div>
        )
      }
      {
        (!rightRegion) ?
          (
            <div
              className={fieldClass}
              {...setDataset()}
            >
              {curColumnIndex === 0 && (
                <Tooltip title={
                  <TComponent tkey={t(Strings.tip_primary_field_frozen)} 
                    params={{
                      tag: <br/>
                    }}
                  />
                }>
                  <div className={styles.firstHeaderTip} />
                </Tooltip>                
              )}
              <HeaderInner isShowHighLight={isShowHighLight} field={field} curColumnIndex={curColumnIndex} isSelected={isSelected} />
            </div>
          ) :
          <HeaderInner isShowHighLight={isShowHighLight} field={field} curColumnIndex={curColumnIndex} isSelected={isSelected} />
      }
    </div>
  );
};

export const HeaderRight = React.memo((props: GridChildComponentProps) => {
  return HeaderFunc({ ...props, rightRegion: true });
}, areEqual);

export const HeaderLeft = React.memo((props: GridChildComponentProps) => {
  return HeaderFunc({ ...props, rightRegion: false });
}, areEqual);
