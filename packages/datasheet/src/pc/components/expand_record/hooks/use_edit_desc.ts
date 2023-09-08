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

import { useDispatch } from 'react-redux';
import { FieldOperateType, SetFieldFrom, StoreActions } from '@apitable/core';

export const useEditDesc = ({ colIndex, datasheetId, fieldId }: { datasheetId: string; fieldId: string; colIndex?: number }) => {
  const dispatch = useDispatch();

  return (e: MouseEvent) => {
    if (typeof colIndex !== 'number') return;

    const { clientX, clientY } = e;
    const fieldRectLeft = clientX - 410;
    const fieldRectBottom = window.innerHeight - clientY >= 165 ? clientY : clientY - 165;

    dispatch(
      StoreActions.setActiveFieldState(datasheetId, {
        from: SetFieldFrom.EXPAND_RECORD,
        fieldId,
        fieldIndex: colIndex,
        fieldRectLeft: fieldRectLeft,
        fieldRectBottom: fieldRectBottom,
        clickLogOffsetX: 0,
        operate: FieldOperateType.FieldDesc,
      }),
    );
  };
};
