import { useState } from 'react';
import * as React from 'react';
import { Field, Strings, t, Selectors, ICreatedTimeField, ILastModifiedTimeField } from '@apitable/core';
import { store } from 'pc/store';
import styles from './styles.module.less';
import classNames from 'classnames';
import { ICellComponentProps } from '../cell_value/interface';
import { Tooltip } from 'pc/components/common';

export interface ICellCreatedTimeProps extends ICellComponentProps {
  field: ICreatedTimeField | ILastModifiedTimeField;
  isFromExpand?: boolean;
}

export const CellCreatedTime: React.FC< ICellCreatedTimeProps> = props => {
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
      {
        (!isFromExpand && showTip && readonly) ? (
          <Tooltip
            title={t(Strings.uneditable_check_info)}
            visible={showTip}
            placement="top"
          >
            {renderElem()}
          </Tooltip>
        ) : renderElem()
      }
    </>
  );
};
