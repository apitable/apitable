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

import { Selectors } from '@apitable/core';
import { useState, useEffect } from 'react';
import { isObject } from 'lodash';
import { useSelector } from 'react-redux';
// @ts-ignore
import { WecomOpenDataType, isSocialWecom } from 'enterprise';

interface IWxTitleMap {
  userNames?: { name: string, unitId: string }[];
}

// Enterprise Wecom members canvas name collection
export const useWxTitleMap = (props: IWxTitleMap = {}) => {
  const { userNames } = props;
  const unitMap = useSelector(Selectors.getUnitMap);
  const spaceInfo = useSelector(state => state.space.curSpaceInfo);
  // Enterprise Wecom member name collection
  const [unitTitleMap, setUnitTitleMap] = useState<object>({});
  const WWOpenData: {
    initCanvas?: () => void;
    prefetch: (e, t) => void;
  } = (window as any).WWOpenData;
  useEffect(() => {
    const units = userNames || (unitMap && Object.values(unitMap));
    if (isSocialWecom?.(spaceInfo) && Array.isArray(units) && isObject(WWOpenData)) {
      // IOS system probability undefined
      if (WWOpenData.initCanvas) {
        WWOpenData.initCanvas();
        const items = units.map(item => ({ type: WecomOpenDataType.UserName, id: item.name }));
        const fetchData = async() => {
          const result: { items: { data: string }[] } = await new Promise((resolve, reject) => {
            WWOpenData.prefetch({ items }, (err, data) => {
              if (err) {
                return reject(err);
              }
              resolve(data);
            });
          });
          const newTitles = {};
          result?.items.forEach((r, idx) => {
            newTitles[units[idx]?.unitId] = r.data;
          });
          setUnitTitleMap(newTitles);
        };
        fetchData();
      }
    }
  // eslint-disable-next-line
  }, [unitMap, WWOpenData, spaceInfo]);
  return {
    unitTitleMap,
  };
};