import { Selectors } from '@apitable/core';
import { template } from 'lodash';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

export const useApplyOpenFunction = () => {
  const spaceId = useSelector(Selectors.activeSpaceId);
  return useCallback((url: string) => {
    const toUrl = template(url)({ spaceID: spaceId });
    toUrl && window.open(toUrl);
  }, [spaceId]);
};