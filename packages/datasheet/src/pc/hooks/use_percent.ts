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

import { useInterval } from 'ahooks';
import { useState } from 'react';

export const usePercent = (
  startValue = 0,
  endValue = 100,
  delay = 1000,
  options?: {
    immediate?: boolean;
  },
) => {
  // Progress values
  const [percent, setPercent] = useState(startValue);
  // Whether to start the countdown
  const [isStart, setIsStart] = useState(false);

  useInterval(
    () => {
      if (percent === endValue) {
        setIsStart(false);
        return;
      }
      setPercent(percent + 1);
    },
    isStart ? delay : undefined,
    options,
  );

  return {
    percent,
    start: () => setIsStart(true),
    stop: () => setIsStart(false),
    reset: () => {
      setPercent(startValue);
      setIsStart(false);
    },
  };
};
