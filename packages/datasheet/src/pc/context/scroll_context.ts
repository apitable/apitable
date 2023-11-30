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

import { createContext, RefObject, useContext } from 'react';

import { useAppSelector } from 'pc/store/react-redux';

// Cache page location object
export interface IScrollOffset {
  scrollTop?: number;
  scrollLeft?: number;
}

export interface ICacheScroll {
  // Key = 'datasheetID,viewId'
  [key: string]: IScrollOffset;
}

export interface IScrollContextProps {
  cacheScrollMap: RefObject<ICacheScroll>;
  changeCacheScroll: (value: IScrollOffset, datasheetId?: string, viewId?: string) => void;
}

export const ScrollContext = createContext<IScrollContextProps>({
  cacheScrollMap: { current: {} },
  changeCacheScroll: () => {},
} as IScrollContextProps);

export const useCacheScroll = (): Required<IScrollOffset> & Pick<IScrollContextProps, 'changeCacheScroll'> => {
  const { cacheScrollMap, changeCacheScroll } = useContext(ScrollContext) || {};
  const { datasheetId, viewId } = useAppSelector((state) => state.pageParams);
  const defaultValue = { scrollLeft: 0, scrollTop: 0, changeCacheScroll };
  return cacheScrollMap.current && cacheScrollMap.current[`${datasheetId},${viewId}`]
    ? {
      ...defaultValue,
      ...cacheScrollMap.current[`${datasheetId},${viewId}`],
    }
    : defaultValue;
};
