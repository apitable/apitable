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
import { useContext, useMemo } from 'react';
import { getThemeName, ThemeName } from '@apitable/components';
import { getLanguage } from '@apitable/core';
import { KonvaGridContext } from 'pc/components/konva_grid';

const BrandDesc = dynamic(() => import('pc/components/gantt_view/group/brand_desc'), { ssr: false });

interface IUseBrandDesc {
  containerWidth: number;
  containerHeight: number;
  isExporting?: boolean;
}

export const useBrandDesc = (props: IUseBrandDesc) => {
  const { containerWidth, containerHeight, isExporting = false } = props;
  const { theme } = useContext(KonvaGridContext);
  const colors = theme.color;
  const isZhCN = getLanguage() === 'zh-CN';

  return useMemo(() => {
    if (!isExporting) return null;
    const baseX = (containerWidth - 400) / 2;
    const themeName = getThemeName();
    const isLight = themeName === ThemeName.Light;

    return <BrandDesc isLight={isLight} baseX={baseX} isZhCN={isZhCN} containerHeight={containerHeight} colors={colors} />;
  }, [colors, containerHeight, containerWidth, isExporting, isZhCN]);
};
