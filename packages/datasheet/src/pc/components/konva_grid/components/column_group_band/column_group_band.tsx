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

import { KonvaEventObject } from 'konva/lib/Node';
import dynamic from 'next/dynamic';
import { FC, memo, useContext, useMemo, useRef } from 'react';
import { AutoSizerCanvas, Rect, Text } from 'pc/components/konva_components';
import { GRID_CELL_VALUE_PADDING, KonvaGridContext } from 'pc/components/konva_grid';

const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });

interface IColumnGroupBandProps {
  x?: number;
  y?: number;
  width: number;
  height: number;
  name: string;
  isFrozen?: boolean;
  onContextMenu: (event: KonvaEventObject<MouseEvent>) => void;
}

/**
 * Visual band drawn above a contiguous run of column headers that belong to the same
 * field(column) group. Rendering volume here is bounded by the (small) number of groups,
 * not by row/record count.
 */
export const ColumnGroupBand: FC<React.PropsWithChildren<IColumnGroupBandProps>> = memo((props) => {
  const { x = 0, y = 0, width, height, name, isFrozen, onContextMenu } = props;
  const { theme, setTooltipInfo, clearTooltipInfo } = useContext(KonvaGridContext);
  const textSizer = useRef(AutoSizerCanvas({ fontSize: 12, fontWeight: '500' }));
  const colors = theme.color;

  const textWidth = Math.max(width - 2 * GRID_CELL_VALUE_PADDING, 0);
  const displayName = name.replace(/\r|\n/g, ' ');
  const isOverflow = useMemo(() => textSizer.current.measureText(displayName, textWidth, 1).isOverflow, [displayName, textWidth]);

  return (
    <Group x={x} y={y} onContextMenu={onContextMenu}>
      <Rect
        x={0.5}
        y={0.5}
        width={Math.max(width - 1, 0)}
        height={height}
        fill={colors.defaultBg}
        stroke={colors.sheetLineColor}
        strokeWidth={1}
        onMouseEnter={() => {
          if (!isOverflow) return;
          setTooltipInfo({
            title: name,
            visible: true,
            width,
            height,
            x,
            y,
            coordXEnable: !isFrozen,
            coordYEnable: false,
          });
        }}
        onMouseOut={clearTooltipInfo}
      />
      <Text
        x={GRID_CELL_VALUE_PADDING}
        y={0}
        width={textWidth}
        height={height}
        text={displayName}
        fontSize={12}
        fontStyle={'500'}
        align={'center'}
        verticalAlign={'middle'}
        fill={colors.secondLevelText}
        ellipsis
        listening={false}
      />
    </Group>
  );
});
