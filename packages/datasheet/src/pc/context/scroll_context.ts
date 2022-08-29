import { createContext, RefObject, useContext } from 'react';
import { useSelector } from 'react-redux';

// 缓存页面位置对象
export interface IScrollOffset {
  scrollTop?: number;
  scrollLeft?: number;
}

export interface ICacheScroll {
  // Key = 'datasheetID,viewId'
  [key: string]: IScrollOffset
}

export interface IScrollContextProps {
  cacheScrollMap: RefObject<ICacheScroll>;
  changeCacheScroll: (value: IScrollOffset, datasheetId?: string, viewId?: string) => void
}

export const ScrollContext = createContext<IScrollContextProps>({
  cacheScrollMap: { current: {}},
  changeCacheScroll: () => {}
} as IScrollContextProps);

export const useCacheScroll = (): Required<IScrollOffset> & Pick<IScrollContextProps, 'changeCacheScroll'> => {
  const { cacheScrollMap, changeCacheScroll } = useContext(ScrollContext) || {};
  const { datasheetId, viewId } = useSelector(state => state.pageParams);
  const defaultValue = { scrollLeft: 0, scrollTop: 0, changeCacheScroll };
  return cacheScrollMap.current && cacheScrollMap.current[`${datasheetId},${viewId}`] ? {
    ...defaultValue,
    ...cacheScrollMap.current[`${datasheetId},${viewId}`]
  } : defaultValue;
};
