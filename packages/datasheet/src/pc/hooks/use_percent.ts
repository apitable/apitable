import { useInterval } from 'ahooks';
import { useState } from 'react';

export const usePercent = (
  startValue = 0,
  endValue = 100,
  delay = 1000,
  options?: {
    immediate?: boolean;
  }) => {
  // 进度值
  const [percent, setPercent] = useState(startValue);
  // 是否开始倒计时
  const [isStart, setIsStart] = useState(false);

  useInterval(() => {
    if (percent === endValue) {
      setIsStart(false);
      return;
    }
    setPercent(percent + 1);
  }, isStart ? delay : undefined, options);

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
