import { useInterval } from 'ahooks';
import { useState } from 'react';

export const usePercent = (
  startValue = 0,
  endValue = 100,
  delay = 1000,
  options?: {
    immediate?: boolean;
  }) => {
  // Progress values
  const [percent, setPercent] = useState(startValue);
  // Whether to start the countdown
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
