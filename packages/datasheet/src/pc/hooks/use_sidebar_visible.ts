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

import { isNull } from 'lodash';
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { StoreActions } from '@apitable/core';
import { ScreenSize } from 'pc/components/common/component_display';
import { useResponsive } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { getStorage, setStorage, StorageMethod, StorageName } from 'pc/utils/storage/storage';

export const useSideBarVisible = () => {
  const sideBarVisible = useAppSelector((state) => state.space.sideBarVisible);
  const { screenIsAtMost } = useResponsive();
  const dispatch = useDispatch();
  const setSideBarVisible = useCallback(
    (sideBarVisible: boolean) => {
      // It is necessary to ensure that the useEffect tampers with the sideBarVisible before the loc is dispatched
      setStorage(StorageName.IsPanelClosed, sideBarVisible, StorageMethod.Set);
      dispatch(StoreActions.setSideBarVisible(sideBarVisible));
    },
    [dispatch],
  );

  useEffect(() => {
    if (screenIsAtMost(ScreenSize.md)) return;
    // big screen device
    const localPanelClose = getStorage(StorageName.IsPanelClosed);
    if (isNull(localPanelClose)) {
      setSideBarVisible(true);
      return;
    }
    setSideBarVisible(localPanelClose);
  }, [setSideBarVisible, screenIsAtMost]);

  return {
    sideBarVisible,
    setSideBarVisible,
  };
};
