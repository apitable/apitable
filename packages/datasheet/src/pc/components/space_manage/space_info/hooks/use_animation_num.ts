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

import { useEffect, useRef, useState } from 'react';
import { normalDecimal } from '@apitable/core';
import { Easing } from './easing';

interface IAnimationNum {
  value?: number | string;
  duration?: number;
  easing?: keyof typeof Easing;
  format?: boolean;
  isFloat?: boolean;
}

const start = 0;
const end = 1;

export const useAnimationNum = ({ value = 0, duration = 1000, easing = 'linear', isFloat, format }: IAnimationNum) => {
  const [progress, setProgress] = useState(start);
  const playing = useRef(-1);
  const startTime = useRef(Date.now());
  const numValue = useRef(0);
  const unit = useRef<any>(null);

  const play = () => {
    if (playing.current !== -1) {
      cancelAnimationFrame(playing.current);
    }
    if (!value) {
      setProgress(end);
    }
    startTime.current = Date.now();
    const loop = () => {
      const spendTime = Date.now() - startTime.current;
      const curProgress = spendTime / duration;
      if (spendTime >= duration) {
        setProgress(end);
        playing.current = -1;
      } else {
        setProgress(Easing[easing](curProgress));
        playing.current = requestAnimationFrame(loop);
      }
    };
    loop();
  };

  useEffect(() => {
    if (typeof value === 'string') {
      const formatLess = value.replace(/,/g, '');
      numValue.current = parseFloat(formatLess);
      unit.current = formatLess.replace(`${numValue.current}`, '');
    } else {
      numValue.current = value;
      unit.current = null;
    }
    play();
    // eslint-disable-next-line
  }, [value]);

  let curNum: number | string = isFloat ? normalDecimal(numValue.current * progress) : Math.floor(numValue.current * progress);
  if (format) {
    curNum = curNum.toLocaleString();
  }

  return unit.current ? `${curNum.toLocaleString()}${unit.current}` : curNum;
};
