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

import { ReactNode, useContext, useMemo, useRef } from 'react';
import { autoSizerCanvas, Text } from 'pc/components/konva_components';
import { KonvaGridContext } from 'pc/components/konva_grid';
import { store } from 'pc/store';
// @ts-ignore
import { getWatermarkText } from 'enterprise/watermark/use_watermark';

interface IUseViewWatermark {
  containerWidth: number;
  containerHeight: number;
  isExporting?: boolean;
}

const DEFAULT_GAP = 80;

export const useViewWatermark = (props: IUseViewWatermark) => {
  const { containerWidth, containerHeight, isExporting = false } = props;
  const textSizer = useRef(autoSizerCanvas);
  const { theme } = useContext(KonvaGridContext);
  const colors = theme.color;

  return useMemo(() => {
    if (!isExporting) return null;
    const state = store.getState();
    const watermarkEnable = state.space.spaceFeatures?.watermarkEnable;
    if (!watermarkEnable) return null;
    const userInfo = state.user.info;
    if (!userInfo) return null;

    const text = getWatermarkText ? getWatermarkText(userInfo) : '';
    textSizer.current.setFont({ fontSize: 12 });
    const { width, height } = textSizer.current.measureText(text);
    const countX = Math.ceil(containerWidth / (width + DEFAULT_GAP));
    const countY = Math.ceil(containerHeight / (height + DEFAULT_GAP));
    const texts: ReactNode[] = [];

    for (let i = 0; i < countX; i++) {
      for (let j = 0; j < countY; j++) {
        const isEven = j % 2 === 0;
        const x = (width + DEFAULT_GAP) * i;
        const y = (height + DEFAULT_GAP) * j;
        texts.push(
          <Text
            key={`${i}-${j}`}
            x={isEven ? x + width : x}
            y={y + height}
            text={text}
            fill={colors.thirdLevelText}
            opacity={0.1}
            transformsEnabled={'all'}
            rotation={-15}
          />,
        );
      }
    }
    return texts;
  }, [colors.thirdLevelText, containerHeight, containerWidth, isExporting]);
};
