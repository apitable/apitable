import { useMemo } from 'react';
import { byteMGArr, decimalCeil, t, Strings } from '@vikadata/core';
import { getPercent } from '../utils';
import { IHooksParams, IHooksResult } from '../interface';

export const useCapacity = ({ subscription, spaceInfo }: IHooksParams): IHooksResult => {
  const { used, total } = useMemo(() => {
    return {
      used: spaceInfo?.capacityUsedSizes || 0,
      total: subscription?.maxCapacitySizeInBytes || 0,
    };
  }, [subscription, spaceInfo]);
  return useMemo(() => {
    
    const remain = total - used;
    const usedArr = byteMGArr(used);
    const usedText = `${usedArr[0]}${usedArr[1]}`;
    const totalArr = byteMGArr(total);
    const totalText = `${totalArr[0]}${totalArr[1]}`;
    const usedPercent = decimalCeil(getPercent((usedArr[2] as number) / (totalArr[2] as number)) * 100);
    const remainArr = byteMGArr(remain, false);
    const remainText = `${remainArr[0]}${remainArr[1]}`;
    const remainPercent = 100 - usedPercent;
    if (total === -1) {
      return {
        used,
        usedText,
        total,
        totalText: '-1',
        remain,
        usedPercent: used ? 5 : 0,
        remainPercent: used ? 95 : 100,
        remainText: t(Strings.unlimited)
      };
    }
    return {
      used,
      usedText,
      total,
      totalText,
      remain,
      usedPercent,
      remainPercent,
      remainText
    };
  }, [used, total]);
};