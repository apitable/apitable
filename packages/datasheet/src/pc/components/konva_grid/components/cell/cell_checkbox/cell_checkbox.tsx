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

import * as React from 'react';
import { KONVA_DATASHEET_ID } from '@apitable/core';
import { generateTargetName } from 'pc/components/gantt_view';
import { Rect } from 'pc/components/konva_components';
import { stopPropagation, KeyCode } from 'pc/utils';
import { CellScrollContainer } from '../../cell_scroll_container';
import { ICellProps } from '../cell_value';
import { IRenderData } from '../interface';

export const CellCheckbox: React.FC<React.PropsWithChildren<ICellProps>> = (props) => {
  const { x, y, isActive, recordId, field, cellValue, columnWidth, rowHeight, onChange } = props;
  const fieldId = field.id;
  const name = generateTargetName({
    targetName: KONVA_DATASHEET_ID.GRID_CELL,
    fieldId,
    recordId,
    mouseStyle: 'pointer',
  });

  const onClick = () => {
    onChange && onChange(!cellValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.metaKey) return;
    if (e.keyCode === KeyCode.Enter) {
      isActive && onChange && onChange(!cellValue);
      stopPropagation(e);
    }
  };

  return (
    <CellScrollContainer
      x={x}
      y={y}
      columnWidth={columnWidth}
      rowHeight={rowHeight}
      fieldId={fieldId}
      recordId={recordId}
      renderData={{} as IRenderData}
      onKeyDown={handleKeyDown}
      onClick={onClick}
      onTap={onClick}
    >
      {isActive && <Rect name={name} width={columnWidth} height={rowHeight} fill={'transparent'} />}
    </CellScrollContainer>
  );
};
