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

import { RecordMoveType, Selectors } from '@apitable/core';
import { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

export const useIsRecordWillMove = (recordId: string) => {
  const { activeRecordId, recordMoveType } = useSelector(state => {
    return {
      activeRecordId: Selectors.getActiveRecordId(state),
      recordMoveType: Selectors.getRecordMoveType(state),
    };
  }, shallowEqual);

  const [willMove, setWillMove] = useState(false);
  useEffect(() => {
    const _willMove = recordId === activeRecordId && recordMoveType !== RecordMoveType.NotMove;
    setWillMove(_willMove);
  }, [recordId, activeRecordId, recordMoveType]);
  return willMove;
};