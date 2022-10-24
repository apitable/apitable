import { Role, Selectors } from '@apitable/core';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

// 拿到有权限（也可以拿到没权限的，目前需要区分）能看到的所有字段，字段顺序和默认视图的字段顺序一样，可以看到隐藏的字段。
/**
 * 
 * @param dstId 
 * @param withNoPermissionField 
 */
export const useAllColumns = (dstId: string, withNoPermissionField?: boolean) => {
  const snapshot = useSelector(state => {
    return Selectors.getSnapshot(state, dstId);
  });
  const fieldPermissionMap = useSelector(state => {
    return Selectors.getFieldPermissionMap(state, dstId);
  });
  const firstView = snapshot?.meta.views[0];
  return useMemo(() => {
    return firstView?.columns.filter(col => {
      if (withNoPermissionField) {
        return true;
      }
      const fieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, col.fieldId);
      return fieldRole !== Role.None;
    });
  }, [firstView, fieldPermissionMap, withNoPermissionField]);
};