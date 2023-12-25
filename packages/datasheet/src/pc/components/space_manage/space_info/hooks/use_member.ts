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
import { decimalCeil } from '@apitable/core';
import { IHooksParams, IHooksResult } from '../interface';
import { getPercent } from '../utils';

export const useMember = ({ subscription, spaceInfo }: IHooksParams): IHooksResult => {
  const { seatUsage, total } = useMemo(() => {
    return {
      seatUsage: spaceInfo?.seatUsage || { total: 0, chatBotCount: 0, memberCount: 0 },
      total: subscription?.maxSeats || 0,
    };
  }, [subscription, spaceInfo]);

  return useMemo(() => {
    const remain = Math.max(0, total - seatUsage.total);
    const usedText = seatUsage.total.toLocaleString();
    const totalText = total.toLocaleString();
    const usedPercent = decimalCeil(getPercent(seatUsage.total / total) * 100);
    const remainText = remain.toLocaleString();
    const remainPercent = Math.max(0, 100 - usedPercent);

    return {
      used: seatUsage.total,
      usedText,
      total,
      totalText,
      remain,
      usedPercent,
      remainPercent,
      remainText,
    };
  }, [seatUsage, total]);
};
