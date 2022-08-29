import { useState, useEffect } from 'react';

export const useTimeInterval = (size?: number) => {
  const tempSize = size ? size : 60;
  const [startTiming, setStartTiming] = useState(false);
  const [timeNumber, setTimeNumber] = useState(tempSize);
  const [isAgain, setIsAgain] = useState(false);
  useEffect(() => {
    let interval;
    if (startTiming) {
      setIsAgain(true);
      interval = setInterval(() => {
        setTimeNumber(preSecond => {
          if (preSecond <= 1) {
            setStartTiming(false);
            clearInterval(interval);
            // 重置秒数
            return tempSize;
          } 
          return preSecond - 1;
          
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTiming, tempSize]);
  return { timeNumber, startTiming, setStartTiming, isAgain };
};
