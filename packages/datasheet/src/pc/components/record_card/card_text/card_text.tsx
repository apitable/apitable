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

import classnames from 'classnames';
import * as React from 'react';
import { Field, FieldType, IField } from '@apitable/core';
import { getFieldHeight, getShowFieldType, getVietualFieldHeight } from 'pc/components/gallery_view/utils';
import { UrlDiscern } from 'pc/components/multi_grid/cell/cell_text/url_discern';
import styles from './style.module.less';

interface ICardTextProps {
  cellValue: string;
  field: IField;
  maxLine: number;
  autoHeight?: boolean;
  isColNameVisible?: boolean;
  isVirtual?: boolean;
}

export const EACH_TEXT_LINE_HEIGHT = 21;

export const CardText: React.FC<React.PropsWithChildren<ICardTextProps>> = ({
  cellValue,
  field,
  maxLine,
  autoHeight,
  isColNameVisible,
  isVirtual,
}) => {
  const isMultiLine = getShowFieldType(field) === FieldType.Text;
  const text = Field.bindModel(field).cellValueToString(cellValue);
  const style: React.CSSProperties = { width: '100%' };
  if (autoHeight) {
    style.height = getVietualFieldHeight(field, maxLine);
    style.marginTop = isColNameVisible ? 4 : 0;
    style.marginBottom = 8;
    style.lineHeight = '21px';
    style.overflow = 'hidden';
  } else {
    const contentHeight = getFieldHeight(field, maxLine);
    style.height = contentHeight + 4 + 12;
    style.paddingTop = 4;
    style.paddingBottom = 12;
  }
  return (
    <div
      className={classnames({
        [styles.multi!]: isMultiLine,
        [styles.single!]: !isMultiLine,
        [styles.isVirtual!]: isVirtual,
      })}
      style={style}
    >
      <UrlDiscern value={text} />
    </div>
  );
};
