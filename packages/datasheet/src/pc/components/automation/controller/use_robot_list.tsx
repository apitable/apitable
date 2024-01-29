import { useMemo } from 'react';
import useSWR from 'swr';
import { Selectors } from '@apitable/core';
import { useAppSelector } from 'pc/store/react-redux';
import { getResourceAutomations } from '../../robot/api';

export const useAutomationList = () => {
  const datasheetId = useAppSelector(Selectors.getActiveDatasheetId);
  const { data: automationList, error, mutate: mutateRefresh }
        = useSWR(`getResourceAutomations-${datasheetId}`, () => getResourceAutomations(datasheetId!));

  return useMemo(() => (
    {
      state: {
        data: automationList,
        error
      },
      api: {
        refresh: mutateRefresh,
      }
    }
  ), [automationList, error, mutateRefresh]);

};
