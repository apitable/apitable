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
import { useState } from 'react';
import * as React from 'react';
import { Field, Strings, t, Selectors, ICreatedTimeField, ILastModifiedTimeField } from '@apitable/core';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'pc/components/common';
import { store } from 'pc/store';
import { ICellComponentProps } from '../cell_value/interface';
import styles from './styles.module.less';

export interface ICellCreatedTimeProps extends ICellComponentProps {
  field: ICreatedTimeField | ILastModifiedTimeField;
  isFromExpand?: boolean;
}

export const CellCreatedTime: React.FC<React.PropsWithChildren<ICellCreatedTimeProps>> = (props) => {
  const { field, isFromExpand, className, readonly, cellValue } = props;
  const cellString = Field.bindModel(field).cellValueToString(cellValue);
  const [date, time, timeRule] = cellString ? cellString.split(' ') : [];
  const [showTip, setShowTip] = useState(false);

  const handleDbClick = () => {
    const state = store.getState();
    const permissions = Selectors.getPermissions(state);
    if (permissions.cellEditable) {
      setShowTip(true);
      setTimeout(() => setShowTip(false), 2000);
    }
  };

  const renderElem = () => {
    return (
      <div className={classNames('createdTime', styles.createdTime, className)} onDoubleClick={handleDbClick}>
        {cellValue != null && (
          <>
            <span className={classNames(styles.date, !time && styles.single, 'cellDateTimeDate')}>{date}</span>
            <span className={classNames(styles.time, 'time')}>{time}</span>
            {timeRule && <span className={classNames(styles.time, 'time')}>{timeRule}</span>}
          </>
        )}
      </div>
    );
  };

  return (
    <>
      {!isFromExpand && showTip && readonly ? (
        <Tooltip title={t(Strings.uneditable_check_info)} visible={showTip} placement="top">
          {renderElem()}
        </Tooltip>
      ) : (
        renderElem()
      )}
    </>
  );
};
