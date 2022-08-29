import { useState } from 'react';
import * as React from 'react';
import { Field, Strings, t, Selectors, RowHeightLevel, IAutoNumberField } from '@vikadata/core';
import { store } from 'pc/store';
import { ICellComponentProps } from '../cell_value/interface';
import style from './style.module.less';
import classNames from 'classnames';
import { Tooltip } from 'pc/components/common';

export interface ICellAutoNumberProps extends ICellComponentProps {
  field: IAutoNumberField;
  isFromExpand?: boolean;
  rowHeightLevel?: RowHeightLevel;
}

export const CellAutoNumber: React.FC<ICellAutoNumberProps> = props => {
  const { field, cellValue, isFromExpand, className, readonly, rowHeightLevel } = props;
  const cellString = Field.bindModel(field).cellValueToString(cellValue);
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
      <div
        onDoubleClick={handleDbClick}
        className={style.autoNumberWrapper}
      >
        <span
          className={classNames('cellAutoNumber', style.cellAutoNumber, className)}
          style={{ textAlign: rowHeightLevel ? 'right' : 'left' }}
        >
          {cellString}
        </span>
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
            showTipAnyway
          >
            {renderElem()}
          </Tooltip>
        ) :
          renderElem()
      }
    </>
  );
};
