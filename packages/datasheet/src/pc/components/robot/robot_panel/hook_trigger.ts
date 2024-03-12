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

import axios from 'axios';
import { useAtomValue } from 'jotai';
import { atomsWithQuery } from 'jotai-tanstack-query';
import { getLanguage } from '@apitable/core';

import { getFilterActionTypes } from 'pc/components/robot/helper';
import { IActionType, ITriggerType } from 'pc/components/robot/interface';
import { loadableWithDefault } from 'pc/components/robot/robot_detail/api';
import { covertThemeIcon } from 'pc/components/robot/utils';
import { useAppSelector } from 'pc/store/react-redux';

const nestReq = axios.create({
  baseURL: '/nest/v1/',
});

const [triggerTypesAtom] = atomsWithQuery((get) => ({
  queryKey: [`/automation/trigger-types?lang=${getLanguage()}`],
  queryFn: async ({ queryKey: [url] }) => {
    const resp = await nestReq.get(String(url));
    return resp?.data?.data;
  },
  cacheTime: Infinity,
}));

const loadableTriggerAtom = loadableWithDefault(triggerTypesAtom, []);

const [actionTypesAtom] = atomsWithQuery((get) => ({
  queryKey: [`/automation/action-types?lang=${getLanguage()}`],
  queryFn: async ({ queryKey: [url] }) => {
    const r = await nestReq.get(String(url));
    return r?.data?.data;
  },
  cacheTime: Infinity,
}));

const loadableActionTypesAtom = loadableWithDefault(actionTypesAtom, []);

export const useTriggerTypes = (): { loading: boolean; data: ITriggerType[] } => {
  const themeName = useAppSelector((state) => state.theme);
  const value = useAtomValue(loadableTriggerAtom);

  if (value.loading) {
    return {
      loading: true,
      data: [],
    };
  }

  return {
    loading: false,
    // @ts-ignore
    data: covertThemeIcon(value.data, themeName),
  };
};

export const useActionTypes = (): { loading: boolean; originData: IActionType[]; data: IActionType[] } => {
  const themeName = useAppSelector((state) => state.theme);
  const actionTypeData = useAtomValue(loadableActionTypesAtom);
  const themedList = covertThemeIcon(actionTypeData?.data, themeName);
  if (actionTypeData.loading) {
    return {
      loading: true,
      data: [],
      originData: [],
    };
  }
  return {
    loading: false,
    originData: themedList,
    // @ts-ignore
    data: getFilterActionTypes(themedList),
  };
};
