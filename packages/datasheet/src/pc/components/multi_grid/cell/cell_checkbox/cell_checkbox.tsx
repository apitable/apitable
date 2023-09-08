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
import { ConfigConstant, Field, FieldType, ICheckboxField, IFormulaField, ILookUpField } from '@apitable/core';
import { Emoji } from 'pc/components/common/emoji';
import { KeyCode, stopPropagation } from 'pc/utils';
import { ICellComponentProps } from '../cell_value/interface';
import styles from './style.module.less';

interface ICellCheckbox extends ICellComponentProps {
  field: ICheckboxField | IFormulaField | ILookUpField;
}

export const CellCheckbox: React.FC<React.PropsWithChildren<ICellCheckbox>> = (props) => {
  const { className, field, cellValue, isActive, onChange } = props;

  const icon = field.type === FieldType.Checkbox ? field.property.icon : Field.bindModel(field).isComputed ? ConfigConstant.DEFAULT_CHECK_ICON : '';

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
    <div className={classNames(className, styles.checkboxCell, 'checkboxCell')} onClick={handleClick} onKeyDown={handleKeyDown}>
      {cellValue ? (
        <Emoji emoji={icon} size={ConfigConstant.CELL_EMOJI_SIZE} />
      ) : (
        <div className={isActive ? styles.unChecked : styles.hidden} style={{ height: ConfigConstant.CELL_EMOJI_SIZE }}>
          <Emoji emoji={icon} size={ConfigConstant.CELL_EMOJI_SIZE} />
        </div>
      )}
    </div>
  );
};
