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

import { shallowEqual } from 'react-redux';
import { Selectors } from '@apitable/core';

import { useAppSelector } from 'pc/store/react-redux';

export const useShowKeepSortBorder = (groupHeadRecordId: string) => {
  const { gridViewDragState, keepSort } = useAppSelector((state) => {
    return {
      gridViewDragState: Selectors.getGridViewDragState(state),
      keepSort: Selectors.getActiveViewSortInfo(state)?.keepSort,
    };
  }, shallowEqual);

  if (keepSort && gridViewDragState.dragTarget && groupHeadRecordId && gridViewDragState.hoverGroupHeadRecordId === groupHeadRecordId) {
    return true;
  }
  return false;
};
