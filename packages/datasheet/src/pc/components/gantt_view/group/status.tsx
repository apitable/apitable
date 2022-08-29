import dynamic from 'next/dynamic';
import { Rect } from 'pc/components/konva_components';
import * as React from 'react';

const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });

const Status = (props) => {
  const { x, KONVA_DATASHEET_ID, containerHeight, theme } = props;
  return <Group
    x={x}
    listening={false}
  >
    <Rect
      name={KONVA_DATASHEET_ID.GANTT_HOVER_SPLITTER}
      width={2}
      height={containerHeight}
      fill={theme.color.primaryColor}
    />
  </Group>;
};

export default Status;
