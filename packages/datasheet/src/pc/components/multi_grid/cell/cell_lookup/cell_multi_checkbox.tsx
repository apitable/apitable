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
import { ConfigConstant, Selectors } from '@apitable/core';
import { Emoji } from 'pc/components/common/emoji';
import { store } from 'pc/store';
import styles from '../cell_checkbox/style.module.less';
import { ICellComponentProps } from '../cell_value/interface';

export const CellMultiCheckbox: React.FC<React.PropsWithChildren<ICellComponentProps>> = (props) => {
  const { className, field: propsField, cellValue } = props;
  const field = Selectors.findRealField(store.getState(), propsField);

  if (!field) {
    return null;
  }

  return (
    <div
      className={classNames(className, styles.checkboxCell)}
      style={{
        paddingLeft: 8,
        justifyContent: 'flex-start',
      }}
    >
      {field &&
        (cellValue as boolean[])
          .filter((i) => i)
          .map((_i, index) => (
            <span key={index} style={{ padding: '0 2px' }}>
              <Emoji emoji={field.property.icon} size={ConfigConstant.CELL_EMOJI_SIZE} />
            </span>
          ))}
    </div>
  );
};
