import { useMemo } from 'react';
import { byteMGArr, decimalCeil, t, Strings } from '@vikadata/core';
import { getPercent } from '../utils';
import { IHooksParams, IHooksResult } from '../interface';

interface IHooksResultWithGift extends IHooksResult {
  giftUsed: number;
  giftUsedText: string;
  giftTotal: number;
  giftTotalText: string;
  giftRemain: number;
  giftUsedPercent: number;
  giftRemainPercent: number;
  giftRemainText: string;
}

type IUseCapacity = (
  hooksParams: IHooksParams,
  // Return total capacity when true, and return subscription and gift capacity when false
  isTotal: boolean
) => IHooksResultWithGift;

export const useCapacity: IUseCapacity = ({ subscription, spaceInfo }, isTotal) => {

  const { used, total, giftUsed, giftTotal } = useMemo(() => {
    return {
      used: spaceInfo?.capacityUsedSizes || 0,
      total: (isTotal ? subscription?.maxCapacitySizeInBytes : subscription?.subscriptionCapacity) || 0,
      giftUsed: spaceInfo?.giftCapacityUsedSizes || 0,
      giftTotal: subscription?.unExpireGiftCapacity || 0,
    };
  }, [subscription, spaceInfo, isTotal]);
  return useMemo(() => {
    
    // 总容量
    const remain = total - used;
    const usedArr = byteMGArr(used);
    const usedText = `${usedArr[0]}${usedArr[1]}`;
    const totalArr = byteMGArr(total);
    const totalText = `${totalArr[0]}${totalArr[1]}`;
    const usedPercent = decimalCeil(getPercent((usedArr[2]) / (totalArr[2])) * 100);
    const remainArr = byteMGArr(remain, false);
    const remainText = `${remainArr[0]}${remainArr[1]}`;
    const remainPercent = 100 - usedPercent;

    // 赠送容量
    const giftRemain = giftTotal - giftUsed;
    const giftUsedArr = byteMGArr(giftUsed);
    const giftUsedText = `${giftUsedArr[0]}${giftUsedArr[1]}`;
    const giftTotalArr = byteMGArr(giftTotal);
    const giftTotalText = `${giftTotalArr[0]}${giftTotalArr[1]}`;
    const giftUsedPercent = decimalCeil(getPercent((giftUsedArr[2]) / (giftTotalArr[2])) * 100);

    const giftRemainArr = byteMGArr(giftRemain, false);
    const giftRemainText = `${giftRemainArr[0]}${giftRemainArr[1]}`;
    const giftRemainPercent = 100 - giftUsedPercent;

    if (total === -1) {
      return {
        used,
        usedText,
        total,
        totalText: '-1',
        remain,
        usedPercent: used ? 5 : 0,
        remainPercent: used ? 95 : 100,
        remainText: t(Strings.unlimited),

        giftUsed,
        giftUsedText,
        giftTotal,
        giftTotalText: '-1',
        giftRemain,
        giftUsedPercent: giftUsed ? 5 : 0,
        giftRemainPercent: giftUsed ? 95 : 100,
        giftRemainText: t(Strings.unlimited),
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
      remainText,

      giftUsed,
      giftUsedText,
      giftTotal,
      giftTotalText,
      giftRemain,
      giftUsedPercent,
      giftRemainPercent,
      giftRemainText,
    };
  }, [total, used, giftTotal, giftUsed]);
};