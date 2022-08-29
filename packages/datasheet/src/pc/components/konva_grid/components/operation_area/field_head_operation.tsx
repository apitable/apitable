import { KONVA_DATASHEET_ID } from '@vikadata/core';
import dynamic from 'next/dynamic';
import { Icon, IconType, Rect } from 'pc/components/konva_components';
import { FC, memo, useContext } from 'react';
import { KonvaGridContext } from '../..';
import { GRID_ICON_COMMON_SIZE } from '../../constant';

const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });
interface IFieldHeadOperationProps {
  x: number;
  y: number;
  width: number;
  height: number;
  isChecked: boolean;
}

export const FieldHeadOperation: FC<IFieldHeadOperationProps> = memo((props) => {
  const { x, y, width, height, isChecked } = props;
  const { theme } = useContext(KonvaGridContext);
  const colors = theme.color;
  return (
    <Group
      x={x}
      y={y}
    >
      <Rect
        width={width}
        height={height}
        fill={colors.defaultBg}
        cornerRadius={[8, 0, 0, 0]}
      />
      <Icon
        name={KONVA_DATASHEET_ID.GRID_FIELD_HEAD_SELECT_CHECKBOX}
        type={isChecked ? IconType.Checked : IconType.Unchecked}
        fill={isChecked ? colors.primaryColor : colors.thirdLevelText}
        x={28}
        y={(height - GRID_ICON_COMMON_SIZE) / 2}
      />
    </Group>
  );
});
