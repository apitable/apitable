import { useMemo } from 'react';
import { decimalCeil } from '@apitable/core';
import { getPercent } from '../utils';
import { IHooksParams, IHooksResult } from '../interface';

export const useMember = ({ subscription, spaceInfo }: IHooksParams): IHooksResult => {
  const { used, total } = useMemo(() => {
    return {
      used: spaceInfo?.seats || 0,
      total: subscription?.maxSeats || 0,
    };
  }, [subscription, spaceInfo]);
  return useMemo(() => {
    const remain = Math.max(0, total - used);
    const usedText = used.toLocaleString();
    const totalText = total.toLocaleString();
    const usedPercent = decimalCeil(getPercent(used / total) * 100);
    const remainText = remain.toLocaleString();
    const remainPercent = Math.max(0, 100 - usedPercent);
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