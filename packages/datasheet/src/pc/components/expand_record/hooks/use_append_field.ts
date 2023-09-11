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
import { ButtonOperateType } from 'pc/utils';

export const useAppendField = (datasheetId: string) => {
  const dispatch = useDispatch();

  return (e: MouseEvent, realColIndex: number, hiddenColumn?: boolean) => {
    if (typeof realColIndex !== 'number' || realColIndex < 0) return;

    const { clientX, clientY } = e;
    const fieldRectLeft = clientX - 340;
    const fieldRectBottom = window.innerHeight - clientY >= 360 ? clientY : clientY - 360;
    dispatch(
      StoreActions.setActiveFieldState(datasheetId, {
        from: SetFieldFrom.EXPAND_RECORD,
        fieldId: ButtonOperateType.AddField,
        fieldRectLeft: fieldRectLeft,
        fieldRectBottom: fieldRectBottom,
        clickLogOffsetX: 0,
        fieldIndex: realColIndex + 1,
        operate: FieldOperateType.FieldSetting,
        hiddenColumn,
      }),
    );
  };
};
