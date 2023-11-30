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

import { IViewProperty, Selectors } from '@apitable/core';

import { useAppSelector } from 'pc/store/react-redux';

export const useShowViewLockModal = () => {
  const spaceManualSaveViewIsOpen = useAppSelector((state) => {
    return state.labs.includes('view_manual_save') || Boolean(state.share.featureViewManualSave) || Boolean(state.embedInfo?.viewManualSave);
  });
  const activeView: IViewProperty = useAppSelector((state) => Selectors.getCurrentView(state))!;
  const hasMirrorId = useAppSelector((state) => Boolean(state.pageParams.mirrorId));

  if (hasMirrorId) {
    return false;
  }

  if (!spaceManualSaveViewIsOpen || activeView.autoSave) {
    return Boolean(activeView.lockInfo);
  }

  return false;
};
