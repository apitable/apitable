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
import { ConfigConstant, IRatingField } from '@apitable/core';
import { Emoji } from 'pc/components/common/emoji';
import { Rate } from 'pc/components/common/rate';
import { ICellComponentProps } from '../cell_value/interface';
import styles from './style.module.less';

interface ICellRating extends ICellComponentProps {
  field: IRatingField;
}

export const CellRating: React.FC<React.PropsWithChildren<ICellRating>> = (props) => {
  const { className, field, cellValue, isActive, onChange, readonly } = props;
  // Activate the scoring cell for the first time, without updating the value. (Anti-touch)
  const [lock, setLock] = useState(true);
  const handleChange = (value: number | null) => {
    !lock && isActive && onChange && onChange(value);
  };
  return (
    <div onClickCapture={() => setLock(false)} className={classNames(className, styles.ratingCell, 'ratingCell', { [styles.activeCell]: isActive })}>
      {isActive && !readonly ? (
        <Rate
          value={cellValue as number}
          character={<Emoji emoji={field.property.icon} set="apple" size={ConfigConstant.CELL_EMOJI_SIZE} />}
          max={field.property.max}
          onChange={handleChange}
        />
      ) : (
        Boolean(cellValue) && (
          <Rate
            value={cellValue as number}
            character={<Emoji emoji={field.property.icon} set="apple" size={ConfigConstant.CELL_EMOJI_SIZE} />}
            max={field.property.max}
            disabled
          />
        )
      )}
    </div>
  );
};
