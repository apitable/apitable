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

import { Strings, t } from '@apitable/core';
import { Tooltip } from 'antd';
import { RenameInput } from 'pc/components/common/rename_input';
import * as React from 'react';
import DeleteIcon from 'static/icon/common/common_icon_delete.svg';
import CopyIcon from 'static/icon/datasheet/rightclick/datasheet_icon_copy.svg';
import RenameIcon from 'static/icon/datasheet/rightclick/datasheet_icon_rename.svg';
import styles from './style.module.less';
import { DragOutlined } from '@apitable/icons';
import { stopPropagation, useThemeColors } from '@apitable/components';
import { useResponsive } from 'pc/hooks/use_responsive';
import { ScreenSize } from 'pc/components/common/component_display';

interface IOperateData {
  delete?: {
    show: boolean;
    tooltip: string;
    onClick(e: React.MouseEvent, id: string): void;
  };
  rename?: {
    show: boolean;
    tooltip: string;
    onClick(e: React.MouseEvent, id: string): void;
  };
  duplicate?: {
    show: boolean;
    tooltip: string;
    onClick(e: React.MouseEvent, id: string): void;
  };
}

interface IOperateItemProps {
  allowSort: boolean;
  editing: boolean;
  prefixIcon: JSX.Element;
  isActive: boolean;
  onItemClick(e?: React.MouseEvent): void;
  operateData: IOperateData;
  id: string;
  inputData: {
    errMsg: string;
    value: string;
    onEnter(e?: React.KeyboardEvent | React.FocusEvent): void;
    onChange(e?: React.ChangeEvent): void;
  };
  suffixIcon?: JSX.Element;
}

export const OperateItem: React.FC<React.PropsWithChildren<IOperateItemProps>> = props => {
  const { editing, allowSort, prefixIcon, isActive, onItemClick, operateData, id, inputData, suffixIcon } = props;
  const colors = useThemeColors();

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const operateIconColor = isMobile ? colors.thirdLevelText : colors.secondLevelText;
  return (
    <div className={styles.operateItem}>
      {allowSort && (
        <div className={styles.iconMove}>
          <DragOutlined size={10} color={colors.secondLevelText} />
        </div>
      )}
      {!editing && (
        <div className={styles.iconType}>
          {/* {prefixIcon} */}
          {React.cloneElement(prefixIcon, {
            fill: isActive ? colors.primaryColor : colors.thirdLevelText,
          })}
          {/* <ViewIcon viewType={viewType} width={16} height={16} fill={viewIconFill} onClick={stopPropagation} /> */}
        </div>
      )}
      <div style={isActive ? { color: colors.primaryColor } : {}} className={styles.text}>
        {editing ? (
          <RenameInput
            errorMsg={inputData.errMsg}
            customStyle={styles.editViewNameInput}
            defaultValue={inputData.value}
            onChange={inputData.onChange}
            onClick={stopPropagation}
            onPressEnter={inputData.onEnter}
            prefix={React.cloneElement(prefixIcon, {
              fill: colors.secondLevelText,
            })}
            onBlur={inputData.onEnter}
            autoFocus
          />
        ) : (
          <span onClick={onItemClick} className={styles.name}>
            {inputData.value}
            {suffixIcon}
          </span>
        )}
      </div>
      {operateData.duplicate && operateData.duplicate.show && (
        <div
          className={styles.iconRename}
          onClick={e => {
            operateData.duplicate!.onClick(e, id);
          }}
          data-test-id={'copyViewIcon'}
        >
          {!isMobile ? (
            <Tooltip title={t(Strings.duplicate)} placement="bottom">
              <CopyIcon width={16} height={16} fill={operateIconColor} />
            </Tooltip>
          ) : (
            <CopyIcon width={16} height={16} fill={operateIconColor} />
          )}
        </div>
      )}
      {operateData.rename && operateData.rename.show && (
        <div
          className={styles.iconRename}
          onClick={e => {
            operateData.rename!.onClick(e, id);
          }}
          data-test-id={'renameViewIcon'}
        >
          {!isMobile ? (
            <Tooltip title={t(Strings.rename)} placement="bottom">
              <RenameIcon width={16} height={16} fill={operateIconColor} />
            </Tooltip>
          ) : (
            <RenameIcon width={16} height={16} fill={operateIconColor} />
          )}
        </div>
      )}
      {operateData.delete && operateData.delete.show && (
        <div
          className={styles.iconDelete}
          onClick={e => {
            operateData.delete!.onClick(e, id);
          }}
          data-test-id={'deleteViewIcon'}
        >
          {!isMobile ? (
            <Tooltip title={t(Strings.delete)} placement="bottom">
              <DeleteIcon width={16} height={16} fill={operateIconColor} />
            </Tooltip>
          ) : (
            <DeleteIcon width={16} height={16} fill={operateIconColor} />
          )}
        </div>
      )}
    </div>
  );
};
