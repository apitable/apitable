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

import { useAtomValue } from 'jotai';
import { nanoid } from 'nanoid';
import qs from 'qs';
import { useCallback, useContext, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import { automationStateAtom } from '../../../automation/controller/atoms';
import { ShareContext } from '../../../share';
import { checkObject, getRobotApiHistoryList } from '../../api';
import { RobotRunStatusEnums } from '../../interface';

export const PAGE_SIZE = 20;

export interface IRunHistoryDatum {
  robotId: string;
  taskId: string;
  createdAt: string;
  status: RobotRunStatusEnums;
  executedActions: ExecutedAction[];
}

export interface ExecutedAction {
  actionId: string;
  actionTypeId: string;
  success: boolean;
}

export const useGetTaskHistory = () => {

  const { shareInfo } = useContext(ShareContext);
  const automationState = useAtomValue(automationStateAtom);

  const options = {
    shareId: shareInfo?.shareId,
  };
  const query = checkObject(options) ? qs.stringify(options) : '';

  const [key, setKey] = useState(() => nanoid());
  const { data, isLoading, isValidating, error, size, setSize, mutate } = useSWRInfinite(
    (index) => `/automation/${automationState?.resourceId}/roots/${automationState?.currentRobotId}/run-history?pageNum=${index + 1}&pageSize=${PAGE_SIZE}&key=${key}&${query}`,
    getRobotApiHistoryList
  );

  const reset = useCallback(() => {
    setKey(nanoid());
    mutate();
  }, [mutate]);

  const items = data ? data.flat() : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore = isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === 'undefined');
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);
  // const isRefreshing = isValidating && data && data.length === size;
  const canLoadMore = !isReachingEnd && !isLoadingMore;
  return {
    canLoadMore,
    items,
    isEmpty,
    size,
    error,
    isLoadingData: isLoading,
    isLoading: isValidating,
    isLoadingMore,
    isLoadingInitialData,
    isReachingEnd,
    reset,
    setSize,
  };
};
