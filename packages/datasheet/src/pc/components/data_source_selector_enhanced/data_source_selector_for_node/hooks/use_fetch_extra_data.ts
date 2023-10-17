import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Selectors, StoreActions } from '@apitable/core';

export const useFetchExtraData = () => {
  const [process, setProcess] = useState<{
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
    datasheetId?: string;
    mirrorId?: string;
      } | null>(null);
  const dispatch = useDispatch();
  const mirror = useSelector((state) => {
    return process?.mirrorId ? Selectors.getMirror(state, process.mirrorId) : undefined;
  });
  const datasheet = useSelector((state) => {
    return process?.datasheetId ? Selectors.getDatasheet(state, process.datasheetId) : undefined;
  });

  const fetch = ({ datasheetId, mirrorId }: { datasheetId?: string; mirrorId?: string }) => {
    return new Promise((resolve, reject) => {
      if (!datasheetId && !mirrorId) {
        resolve(null);
        return;
      }

      setProcess({
        resolve,
        reject,
        mirrorId,
        datasheetId,
      });

      if (datasheetId) {
        dispatch(StoreActions.fetchDatasheet(datasheetId) as any);
        return;
      }

      dispatch(StoreActions.fetchMirrorPack(mirrorId!) as any);
    });
  };

  const isLoadingExtraData = useMemo(() => {
    if (!process) return false;

    if (process.datasheetId && process.datasheetId === datasheet?.id) {
      process.resolve(null);
      // return false;
    }

    if (process.mirrorId && process.mirrorId === mirror?.id) {
      process.resolve(null);
      // return false;
    }

    return true;
  }, [process, mirror, datasheet]);

  return {
    fetchExtraData: fetch,
    isLoadingExtraData,
  };
};
