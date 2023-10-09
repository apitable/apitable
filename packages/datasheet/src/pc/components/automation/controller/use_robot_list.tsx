import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import useSWR from 'swr';
import { Selectors } from '@apitable/core';
import { getResourceAutomations } from '../../robot/api';

export const useAutomationList = () => {
  const datasheetId = useSelector(Selectors.getActiveDatasheetId);
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
