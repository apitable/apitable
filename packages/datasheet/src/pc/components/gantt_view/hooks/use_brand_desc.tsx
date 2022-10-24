import { getThemeName, ThemeName } from '@vikadata/components';
import { getLanguage } from '@apitable/core';
import dynamic from 'next/dynamic';
import { KonvaGridContext } from 'pc/components/konva_grid';
import { useContext, useMemo } from 'react';

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
