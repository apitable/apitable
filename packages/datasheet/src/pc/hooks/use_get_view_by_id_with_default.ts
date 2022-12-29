import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Selectors } from '@apitable/core';

export const useGetViewByIdWithDefault = (datasheetId: string, viewId?: string) => {
  const snapshot = useSelector(state => {
    return Selectors.getSnapshot(state, datasheetId);
  });
  const mirror = useSelector(state => Selectors.getMirror(state));

  const fieldPermissionMap = useSelector(state => {
    return Selectors.getFieldPermissionMap(state, datasheetId);
  });

  return useMemo(() => {
    if (!snapshot) {
      return;
    }

    const firstViewId = snapshot.meta.views[0].id;

    let defaultView = Selectors.getCurrentViewBase(snapshot, firstViewId, datasheetId, fieldPermissionMap, mirror);
    if (viewId) {
      defaultView = Selectors.getCurrentViewBase(snapshot, viewId, datasheetId, fieldPermissionMap, mirror) || defaultView;
    }

    return defaultView;
  }, [fieldPermissionMap, snapshot, viewId, datasheetId, mirror]);
};
