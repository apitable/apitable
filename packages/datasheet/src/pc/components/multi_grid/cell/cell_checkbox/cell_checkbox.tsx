import classNames from 'classnames';
import * as React from 'react';
import { ICellComponentProps } from '../cell_value/interface';
import styles from './style.module.less';
import { Emoji } from 'pc/components/common/emoji';
import { ConfigConstant, Field, FieldType, ICheckboxField, IFormulaField, ILookUpField } from '@vikadata/core';
import { DEFAULT_CHECK_ICON } from 'pc/utils/constant';
import { KeyCode, stopPropagation } from 'pc/utils';

interface ICellCheckbox extends ICellComponentProps {
  field: ICheckboxField | IFormulaField | ILookUpField;
}

export const CellCheckbox: React.FC<ICellCheckbox> = props => {
  const { className, field, cellValue, isActive, onChange } = props;
  
  const icon = field.type === FieldType.Checkbox ? field.property.icon :
    Field.bindModel(field).isComputed ? DEFAULT_CHECK_ICON : '';

  const handleClick = () => {
    isActive && onChange && onChange(!cellValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.metaKey) return;
    if (e.keyCode === KeyCode.Enter) {
      handleClick();
      stopPropagation(e);
    }
  };

  return (
    <div
      className={classNames(className, styles.checkboxCell, 'checkboxCell')}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {
        cellValue ? <Emoji emoji={icon} size={ConfigConstant.CELL_EMOJI_SIZE} /> :
          <div
            className={isActive ? styles.unChecked : styles.hidden}
            style={{ height: ConfigConstant.CELL_EMOJI_SIZE }}
          >
            <Emoji emoji={icon} size={ConfigConstant.CELL_EMOJI_SIZE} />
          </div>
      }
    </div>
  );
};
