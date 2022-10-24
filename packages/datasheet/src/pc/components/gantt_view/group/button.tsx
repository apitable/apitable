import { Strings, t } from '@apitable/core';
import dynamic from 'next/dynamic';
import { GANTT_TAB_BAR_HEIGHT } from 'pc/components/gantt_view/constant';
import { Rect, Text } from 'pc/components/konva_components';
import * as React from 'react';

const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });

const Button = (props) => {
  const { containerWidth, marginRight, btnHeight, KONVA_DATASHEET_ID, btnWidth, colors, cornerRadius } = props;
  return <Group
    x={containerWidth - marginRight + 0.5}
    y={(GANTT_TAB_BAR_HEIGHT - btnHeight) / 2 + 0.5}
  >
    <Rect
      name={KONVA_DATASHEET_ID.GANTT_BACK_TO_NOW_BUTTON}
      width={btnWidth}
      height={btnHeight}
      fill={colors.white}
      stroke={colors.primaryColor}
      cornerRadius={cornerRadius}
      strokeWidth={1}
    />
    <Text
      text={t(Strings.gantt_back_to_now_button)}
      width={btnWidth}
      height={btnHeight}
      fill={colors.primaryColor}
      align={'center'}
    />
  </Group>;
};

export default Button;
