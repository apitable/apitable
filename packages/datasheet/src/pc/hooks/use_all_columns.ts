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
import { IReduxState, Role, Selectors } from '@apitable/core';

import { useAppSelector } from 'pc/store/react-redux';

/**
 *
 * @param dstId
 * @param withNoPermissionField
 */
export const getAllColumnsFp = (state: IReduxState, dstId: string, withNoPermissionField?: boolean) => {
  const snapshot = Selectors.getSnapshot(state, dstId);
  const fieldPermissionMap = Selectors.getFieldPermissionMap(state, dstId);
  const firstView = snapshot?.meta.views[0];
  return firstView?.columns.filter((col) => {
    if (withNoPermissionField) {
      return true;
    }
    if (!col) {
      return false;
    }
    const fieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, col.fieldId);
    return fieldRole !== Role.None;
  });
};

/**
 *
 * @param dstId
 * @param withNoPermissionField
 */
export const useAllColumnsFp1 = (state: IReduxState, dstId: string, withNoPermissionField?: boolean) => {
  const snapshot = Selectors.getSnapshot(state, dstId);
  const fieldPermissionMap = Selectors.getFieldPermissionMap(state, dstId);
  const firstView = snapshot?.meta.views[0];
  return firstView?.columns.filter((col) => {
    if (withNoPermissionField) {
      return true;
    }
    if (!col) {
      return false;
    }
    const fieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, col.fieldId);
    return fieldRole !== Role.None;
  });
};

/**
 *
 * @param dstId
 * @param withNoPermissionField
 */
export const useAllColumns = (dstId: string, withNoPermissionField?: boolean) => {
  const snapshot = useAppSelector((state) => {
    return Selectors.getSnapshot(state, dstId);
  });
  const fieldPermissionMap = useAppSelector((state) => {
    return Selectors.getFieldPermissionMap(state, dstId);
  });
  const firstView = snapshot?.meta.views[0];
  return useMemo(() => {
    return firstView?.columns.filter((col) => {
      if (withNoPermissionField) {
        return true;
      }
      if (!col) {
        return false;
      }
      const fieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, col.fieldId);
      return fieldRole !== Role.None;
    });
  }, [firstView, fieldPermissionMap, withNoPermissionField]);
};

export const useAllColumnsOrEmpty = (dstId?: string, withNoPermissionField?: boolean) => {
  const value = useAllColumns(dstId ?? '', withNoPermissionField);
  if(!dstId) {
    return [];
  }

  return value;
};
