import { useEffect, useRef, useState } from 'react';
import { normalDecimal } from '@vikadata/core';
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
  const [progress, setProgress]= useState(start);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  let curNum: number | string = isFloat ? normalDecimal(numValue.current * progress) : Math.floor(numValue.current * progress);
  if (format) {
    curNum = curNum.toLocaleString();
  }

  return unit.current ? `${curNum.toLocaleString()}${unit.current}` : curNum;

};