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
