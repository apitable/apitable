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

import { useMemo } from 'react';
import { byteMGArr, decimalCeil, t, Strings } from '@apitable/core';
import { IHooksParams, IHooksResult } from '../interface';
import { getPercent } from '../utils';

interface IHooksResultWithGift extends IHooksResult {
  allUsed: number;
  allUsedText: string;
  allTotal: number;
  allTotalText: string;
  allRemain: number;
  allUsedPercent: number;
  allRemainPercent: number;
  allRemainText: string;

  giftUsed: number;
  giftUsedText: string;
  giftTotal: number;
  giftTotalText: string;
  giftRemain: number;
  giftUsedPercent: number;
  giftRemainPercent: number;
  giftRemainText: string;
}

type IUseCapacity = (hooksParams: IHooksParams) => IHooksResultWithGift;

export const useCapacity: IUseCapacity = ({ subscription, spaceInfo }) => {
  const { allUsed, allTotal, used, total, giftUsed, giftTotal } = useMemo(() => {
    const allUsed = spaceInfo?.capacityUsedSizes || 0;
    const giftUsed = spaceInfo?.giftCapacityUsedSizes || 0;
    return {
      used: Math.max(allUsed - giftUsed, 0),
      total: subscription?.subscriptionCapacity || 0,

      giftUsed,
      giftTotal: subscription?.unExpireGiftCapacity || 0,

      allUsed,
      allTotal: subscription?.maxCapacitySizeInBytes || 0,
    };
  }, [subscription, spaceInfo]);
  return useMemo(() => {
    // Total
    const allRemain = allTotal - allUsed;
    const allUsedArr = byteMGArr(allUsed);
    const allUsedText = `${allUsedArr[0]}${allUsedArr[1]}`;
    const allTotalArr = byteMGArr(allTotal);
    const allTotalText = `${allTotalArr[0]}${allTotalArr[1]}`;
    const allUsedPercent = decimalCeil(getPercent(allUsedArr[2] / allTotalArr[2]) * 100);
    const allRemainArr = byteMGArr(allRemain, false);
    const allRemainText = `${allRemainArr[0]}${allRemainArr[1]}`;
    const allRemainPercent = 100 - allUsedPercent;

    // Subscription
    const remain = total - used;
    const usedArr = byteMGArr(used);
    const usedText = `${usedArr[0]}${usedArr[1]}`;
    const totalArr = byteMGArr(total);
    const totalText = `${totalArr[0]}${totalArr[1]}`;
    const usedPercent = decimalCeil(getPercent(usedArr[2] / totalArr[2]) * 100);
    const remainArr = byteMGArr(remain, false);
    const remainText = `${remainArr[0]}${remainArr[1]}`;
    const remainPercent = 100 - usedPercent;

    // Gift
    const giftRemain = giftTotal - giftUsed;
    const giftUsedArr = byteMGArr(giftUsed);
    const giftUsedText = `${giftUsedArr[0]}${giftUsedArr[1]}`;
    const giftTotalArr = byteMGArr(giftTotal);
    const giftTotalText = `${giftTotalArr[0]}${giftTotalArr[1]}`;
    const giftUsedPercent = decimalCeil(getPercent(giftUsedArr[2] / giftTotalArr[2]) * 100);

    const giftRemainArr = byteMGArr(giftRemain, false);
    const giftRemainText = `${giftRemainArr[0]}${giftRemainArr[1]}`;
    const giftRemainPercent = 100 - giftUsedPercent;

    if (allTotal === -1) {
      return {
        allUsed,
        allUsedText,
        allTotal,
        allTotalText: '-1',
        allRemain,
        allUsedPercent: allUsed ? 5 : 0,
        allRemainPercent: allUsed ? 95 : 100,
        allRemainText: t(Strings.unlimited),

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
      allUsed,
      allUsedText,
      allTotal,
      allTotalText,
      allRemain,
      allUsedPercent,
      allRemainPercent,
      allRemainText,

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
  }, [total, used, giftTotal, giftUsed, allUsed, allTotal]);
};
