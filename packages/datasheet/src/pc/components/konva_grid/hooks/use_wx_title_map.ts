import { Selectors } from '@apitable/core';
import { WecomOpenDataType } from 'pc/components/address_list';
import { useState, useEffect } from 'react';
import { isObject } from 'lodash';
import { isSocialWecom } from 'pc/components/home/social_platform';
import { useSelector } from 'react-redux';

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
    if (isSocialWecom(spaceInfo) && Array.isArray(units) && isObject(WWOpenData)) {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitMap, WWOpenData, spaceInfo]);
  return {
    unitTitleMap,
  };
};