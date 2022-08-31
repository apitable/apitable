import { FC, useRef, useContext } from 'react';
import dynamic from 'next/dynamic';
import { KONVA_DATASHEET_ID, t, Strings } from '@vikadata/core';
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
  setLineTooltipInfo: (info) => void;
  pointPosition: PointPosition;
  isCycleLine: boolean;
}

enum HoverType {
  Hover = 'hover',
  Out = 'out'
}

export const TaskLine : FC<ITaskLineProps> = (props) => {
  const { points, fillColor, dashEnabled, sourceId, targetId, setLineTooltipInfo, pointPosition, isCycleLine } = props;
  const { theme } = useContext(KonvaGridContext);
  const colors = theme.color;
  const arrowRef = useRef<any>();
  const {
    x: pointX,
    y: pointY
  } = pointPosition;

  const lineHover = (hoverType: HoverType) => {
    arrowRef.current.strokeWidth(hoverType === HoverType.Hover ? 2 : 1);
   
    if(hoverType === HoverType.Hover && dashEnabled) {
      setLineTooltipInfo({ 
        visible: true,
        text: isCycleLine ? t(Strings.gantt_cycle_connection_warning) : t(Strings.gantt_invalid_fs_dependency_warning),
        x: pointX,
        y: pointY - 4,
        pointerDirection: 'down',
        pointerWidth: 10,
        pointerHeight: 10,
        background: colors.black[900],
        fill: colors.black[50]
      });
    } else {
      setLineTooltipInfo({
        visible: false
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
        lineCap='round'
        pointerLength={5}
        pointerWidth={5}
        dash={[2, 5]}
        dashEnabled={dashEnabled}
      />
      <Arrow
        name={generateTargetName({
          targetName: KONVA_DATASHEET_ID.GANTT_LINE_TASK,
          recordId : sourceId
        })}
        sourceId={sourceId}
        targetId={targetId}
        fillColor={fillColor}
        points={points}
        fill={fillColor}
        stroke={fillColor}
        opacity={0}
        strokeWidth={4}
        lineCap='round'
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