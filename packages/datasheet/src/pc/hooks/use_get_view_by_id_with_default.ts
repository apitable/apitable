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

import { useMemo } from 'react';
import { Selectors } from '@apitable/core';

import { useAppSelector } from 'pc/store/react-redux';

export const useGetViewByIdWithDefault = (datasheetId: string, viewId?: string) => {
  const snapshot = useAppSelector((state) => {
    return Selectors.getSnapshot(state, datasheetId);
  });
  const mirror = useAppSelector((state) => Selectors.getMirror(state));

  const fieldPermissionMap = useAppSelector((state) => {
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
