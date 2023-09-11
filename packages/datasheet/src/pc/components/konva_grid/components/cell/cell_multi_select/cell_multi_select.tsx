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

import dynamic from 'next/dynamic';
import { FC, useContext, useState } from 'react';
import { colors, getNextShadeColor } from '@apitable/components';
import { IField, KONVA_DATASHEET_ID, ThemeName } from '@apitable/core';
import { AddOutlined, CloseOutlined } from '@apitable/icons';
import { generateTargetName } from 'pc/components/gantt_view';
import { Icon, Rect, Text } from 'pc/components/konva_components';
import {
  GRID_CELL_DELETE_ITEM_BUTTON_SIZE,
  GRID_CELL_DELETE_ITEM_BUTTON_SIZE_OFFSET,
  GRID_CELL_VALUE_PADDING,
  GRID_OPTION_ITEM_PADDING,
  KonvaGridContext,
  KonvaGridViewContext,
} from 'pc/components/konva_grid';
import { setColor } from 'pc/components/multi_grid/format';
import { COLOR_INDEX_THRESHOLD } from 'pc/utils';
import { CellScrollContainer } from '../../cell_scroll_container';
import { ICellProps } from '../cell_value';
import { IRenderContentBase } from '../interface';

const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });
export function inquiryValueByKey(key: 'name' | 'color', id: string, field: IField, theme: ThemeName) {
  const item = field.property.options.find((item: { id: string }) => item.id === id);
  if (!item) return '';
  if (key === 'color') return setColor(item[key], theme);
  return item[key]?.replace(/\r|\n/g, ' ');
}

export function getOptionNameColor(id: string, field: IField) {
  const item = field.property.options.find((item: { id: string }) => item.id === id);
  if (item == null) return colors.firstLevelText;
  return item.color >= COLOR_INDEX_THRESHOLD ? colors.defaultBg : colors.firstLevelText;
}

const AddOutlinedPath = AddOutlined.toString();
const CloseSmallOutlinedPath = CloseOutlined.toString();

export const CellMultiSelect: FC<React.PropsWithChildren<ICellProps>> = (props) => {
  const { x, y, recordId, cellValue, field, rowHeight, columnWidth, renderData, isActive, editable, onChange, toggleEdit } = props;
  const { theme } = useContext(KonvaGridContext);
  const colors = theme.color;
  const { cacheTheme } = useContext(KonvaGridViewContext);
  const isLightTheme = cacheTheme === ThemeName.Light;
  const operatingEnable = isActive && editable;
  const { setCellDown } = useContext(KonvaGridContext);
  const fieldId = field?.id;
  const name = generateTargetName({
    targetName: KONVA_DATASHEET_ID.GRID_CELL,
    fieldId,
    recordId,
    mouseStyle: 'pointer',
  });
  const [isAddIconHover, setAddIconHover] = useState(false);
  const [closeIconHoverId, setCloseIconHoverId] = useState<null | string>(null);
  const [closeIconDownId, setCloseIconDownId] = useState<null | string>(null);
  const { renderContent } = renderData;

  function deleteItem(index?: number) {
    let value: string[] | null = (cellValue as string[]).filter((_, idx) => idx !== index);
    if (value.length === 0) {
      value = null;
    }
    onChange?.(value);
  }

  return (
    <CellScrollContainer x={x} y={y} columnWidth={columnWidth} rowHeight={rowHeight} fieldId={fieldId} recordId={recordId} renderData={renderData}>
      {isActive && operatingEnable && (
        <Icon
          name={name}
          x={GRID_CELL_VALUE_PADDING}
          y={5}
          data={AddOutlinedPath}
          shape={'circle'}
          backgroundWidth={22}
          backgroundHeight={22}
          background={isAddIconHover ? colors.rowSelectedBgSolid : 'transparent'}
          onMouseEnter={() => setAddIconHover(true)}
          onMouseOut={() => setAddIconHover(false)}
          onClick={toggleEdit}
          onTap={toggleEdit}
        />
      )}
      {isActive &&
        renderContent != null &&
        (renderContent as IRenderContentBase[]).map((item, index) => {
          const { x, y, width, height, text, style } = item;
          const { background, color } = style;
          const iconColor = isLightTheme ? (color === colors.firstLevelText ? colors.secondLevelText : colors.defaultBg) : colors.textStaticPrimary;
          let iconBg = 'transparent';
          if (closeIconHoverId === cellValue![index]) {
            iconBg = getNextShadeColor(background!, 1);
          }
          if (closeIconDownId === cellValue![index]) {
            iconBg = getNextShadeColor(background!, 2);
          }

          return (
            <Group x={x} y={y} listening={isActive} key={index}>
              <Rect width={width} height={height} fill={background} cornerRadius={16} listening={false} />
              <Text x={GRID_OPTION_ITEM_PADDING} height={height} text={text} fill={color} fontSize={12} />
              {operatingEnable && (
                <Icon
                  name={name}
                  x={width - GRID_OPTION_ITEM_PADDING - GRID_CELL_DELETE_ITEM_BUTTON_SIZE - GRID_CELL_DELETE_ITEM_BUTTON_SIZE_OFFSET}
                  y={2}
                  data={CloseSmallOutlinedPath}
                  fill={iconColor}
                  scaleX={0.75}
                  scaleY={0.75}
                  transformsEnabled={'all'}
                  background={iconBg}
                  backgroundHeight={16}
                  backgroundWidth={16}
                  cornerRadius={2}
                  onTap={() => deleteItem(index)}
                  onMouseDown={() => {
                    setCloseIconDownId(cellValue![index]);
                  }}
                  onMouseUp={() => {
                    if (closeIconDownId) {
                      deleteItem(index);
                    }
                    setCellDown(false);
                    setCloseIconDownId(null);
                  }}
                  onMouseEnter={() => setCloseIconHoverId(cellValue![index])}
                  onMouseOut={() => {
                    setCloseIconDownId(null);
                    setCloseIconHoverId(null);
                  }}
                />
              )}
            </Group>
          );
        })}
    </CellScrollContainer>
  );
};
