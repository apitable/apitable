import { usePlatform } from 'pc/hooks/use_platform';
import { DependencyList, EffectCallback, useEffect } from 'react';

export const useFocusEffect = (focusFn: EffectCallback, deps?: DependencyList) => {
  const { mobile } = usePlatform();
  
  useEffect(() => { 
    if (mobile) {
      return;
    }
    focusFn();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};