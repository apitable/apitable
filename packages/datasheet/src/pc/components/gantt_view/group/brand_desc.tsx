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
import { ILightOrDarkThemeColors } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { LogoPurpleFilled, LogoTextEnFilled, LogoTextFilled } from '@apitable/icons';
import { EXPORT_IMAGE_PADDING } from 'pc/components/gantt_view/constant';
import { Icon, Line, Text } from 'pc/components/konva_components';

const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });

const LogoPurpleFilledPath = LogoPurpleFilled.toString();
const LogoTextFilledPath = LogoTextFilled.toString();
const LogoTextEnFilledPath = LogoTextEnFilled.toString();
const LINE_WIDTH = 100;

interface IBrandDesc {
  baseX: number;
  containerHeight: number;
  isLight: boolean;
  colors: ILightOrDarkThemeColors;
  isZhCN: boolean;
}

const BrandDesc = (props: IBrandDesc) => {
  const { baseX, containerHeight, isLight, colors, isZhCN } = props;

  return (
    <Group x={baseX} y={containerHeight + EXPORT_IMAGE_PADDING * 2} listening={false}>
      <Line y={0.5} points={[0, 0, LINE_WIDTH, 0]} stroke={colors.fc5} />
      <Icon
        x={isZhCN ? 132 : 197}
        y={-8}
        scaleX={0.12}
        scaleY={0.12}
        transformsEnabled={'all'}
        data={LogoPurpleFilledPath}
        fill={colors.primaryColor}
      />
      <Icon x={isZhCN ? 150 : 215} y={-8} data={isZhCN ? LogoTextFilledPath : LogoTextEnFilledPath} fill={isLight ? '#000650' : '#ffffff'} />
      <Text x={isZhCN ? 198 : 125} y={-5} text={t(Strings.export_brand_desc)} fontSize={12} fill={colors.thirdLevelText} />
      <Line y={0.5} x={300} points={[0, 0, LINE_WIDTH, 0]} stroke={colors.fc5} />
    </Group>
  );
};
export default BrandDesc;
