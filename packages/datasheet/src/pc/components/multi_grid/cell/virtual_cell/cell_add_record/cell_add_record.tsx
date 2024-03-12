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

import classNames from 'classnames';
import * as React from 'react';
import { useThemeColors } from '@apitable/components';
import { IGroupInfo, IPermissions, ILinearRowAdd, RowHeight, Selectors, ILinearRowRecord } from '@apitable/core';
import { AddOutlined } from '@apitable/icons';
import { GROUP_OFFSET } from 'pc/components/multi_grid/enum';
import { useAppSelector } from 'pc/store/react-redux';
import { OPERATE_BUTTON_CLASS, ButtonOperateType } from 'pc/utils';
import { useShowKeepSortBorder } from '../../hooks/use_show_keep_sort_border';
import styles from '../../styles.module.less';
import { PRIMARY_COLOR_BORDER, GRAY_COLOR_BORDER } from '../cell_group_tab/cell_group_tab';

interface ICellAddRecord {
  row: ILinearRowAdd;
  preRow?: ILinearRowRecord;
  actualColumnIndex: number;
  style: React.CSSProperties;
  groupInfo: IGroupInfo;
  permissions: IPermissions;
  className: string;
  columnsLength: number;
  rightRegion: boolean;
  isEmptyRows: boolean;
}

const DEFAULT_ADD_RECORD_PATH = 'default';

export const CellAddRecord: React.FC<React.PropsWithChildren<ICellAddRecord>> = React.memo((props) => {
  const colors = useThemeColors();
  const { actualColumnIndex, row, style, className, preRow, columnsLength, rightRegion, isEmptyRows, groupInfo, permissions } = props;
  const showKeepSortBorder = useShowKeepSortBorder(preRow ? preRow.groupHeadRecordId : '');
  const marginTop = 0;
  const height = RowHeight.Short;
  const addIconClass = classNames(styles.addRecordIcon, OPERATE_BUTTON_CLASS);
  const hoverRowOfAddRecord = useAppSelector((state) => Selectors.getGridViewDragState(state).hoverRowOfAddRecord);
  let width = parseInt(style.width as string, 10);

  if (columnsLength > 1 && actualColumnIndex === columnsLength - 1 && groupInfo && groupInfo.length === 3) {
    width = width - GROUP_OFFSET;
  }
  if (isEmptyRows) {
    width = width + (groupInfo.length - 1) * GROUP_OFFSET;
  }

  const createAble = permissions.rowCreatable;

  function getBorderLeft() {
    if (actualColumnIndex === 0) {
      return showKeepSortBorder ? PRIMARY_COLOR_BORDER : GRAY_COLOR_BORDER;
    }
    return '';
  }

  function getBorderRight() {
    if (showKeepSortBorder && actualColumnIndex === columnsLength - 1) {
      return PRIMARY_COLOR_BORDER;
    }
    if (!isEmptyRows && actualColumnIndex === columnsLength - 1 && groupInfo.length > 1) {
      return GRAY_COLOR_BORDER;
    }
    return 'none';
  }

  const path = row && row.depth ? [row.depth].join(',') : DEFAULT_ADD_RECORD_PATH;

  return (
    <div
      style={{
        ...style,
        height,
        border: groupInfo.length === 0 ? '' : 'none',
        marginTop: marginTop + 'px',
        borderRight: getBorderRight(),
        borderLeft: getBorderLeft(),
        borderBottom: showKeepSortBorder ? PRIMARY_COLOR_BORDER : GRAY_COLOR_BORDER,
        width,
        marginLeft: !rightRegion && groupInfo.length - 1 > 0 ? (groupInfo.length - 1) * 16 : 0,
        background: createAble && hoverRowOfAddRecord === path ? colors.rowSelectedBg : '',
      }}
      className={classNames(className, actualColumnIndex === 0 && groupInfo.length && row ? styles['groupOffset' + row.depth] : '')}
    >
      <div
        className={addIconClass}
        data-operate-type={ButtonOperateType.AddRecord}
        data-record-id={preRow?.recordId || row.recordId}
        data-group-head-record-id={preRow?.groupHeadRecordId}
        data-test-id={'addRecord'}
      >
        {!rightRegion && actualColumnIndex === 0 && createAble && <AddOutlined color={colors.thirdLevelText} size={12} />}
      </div>
    </div>
  );
});
