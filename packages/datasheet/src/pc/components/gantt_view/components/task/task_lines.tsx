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
import { FC, useRef, useContext } from 'react';
import { KONVA_DATASHEET_ID, t, Strings } from '@apitable/core';
import { generateTargetName, PointPosition } from 'pc/components/gantt_view';
import { KonvaGridContext } from 'pc/components/konva_grid';

const Arrow = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/arrow'), { ssr: false });
const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });

interface ITaskLineProps {
  points: number[];
  fillColor: string;
  dashEnabled: boolean;
  sourceId: string;
  targetId: string;
  setLineTooltipInfo: (info: any) => void;
  pointPosition: PointPosition;
  isCycleLine: boolean;
}

enum HoverType {
  Hover = 'hover',
  Out = 'out',
}

export const TaskLine: FC<React.PropsWithChildren<ITaskLineProps>> = (props) => {
  const { points, fillColor, dashEnabled, sourceId, targetId, setLineTooltipInfo, pointPosition, isCycleLine } = props;
  const { theme } = useContext(KonvaGridContext);
  const colors = theme.color;
  const arrowRef = useRef<any>();
  const { x: pointX, y: pointY } = pointPosition;

  const lineHover = (hoverType: HoverType) => {
    arrowRef.current.strokeWidth(hoverType === HoverType.Hover ? 2 : 1);

    if (hoverType === HoverType.Hover && dashEnabled) {
      setLineTooltipInfo({
        visible: true,
        text: isCycleLine ? t(Strings.gantt_cycle_connection_warning) : t(Strings.gantt_invalid_fs_dependency_warning),
        x: pointX,
        y: pointY - 4,
        pointerDirection: 'down',
        pointerWidth: 10,
        pointerHeight: 5,
        background: colors.fc13,
        fill: colors.defaultBg,
      });
    } else {
      setLineTooltipInfo({
        visible: false,
      });
    }
  };
  return (
    <Group>
      <Arrow
        _ref={arrowRef}
        points={points}
        fill={fillColor}
        stroke={fillColor}
        strokeWidth={1}
        hitStrokeWidth={2.5}
        lineCap="round"
        pointerLength={5}
        pointerWidth={5}
        dash={[2, 5]}
        dashEnabled={dashEnabled}
      />
      <Arrow
        name={generateTargetName({
          targetName: KONVA_DATASHEET_ID.GANTT_LINE_TASK,
          recordId: sourceId,
        })}
        sourceId={sourceId}
        targetId={targetId}
        fillColor={fillColor}
        points={points}
        fill={fillColor}
        stroke={fillColor}
        opacity={0}
        strokeWidth={4}
        lineCap="round"
        pointerLength={5}
        pointerWidth={5}
        dash={[2, 5]}
        dashEnabled={dashEnabled}
        onMouseEnter={() => lineHover(HoverType.Hover)}
        onMouseOut={() => lineHover(HoverType.Out)}
      />
    </Group>
  );
};
