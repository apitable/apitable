import { INode, IPermissions } from '@apitable/core';
import { DISABLE_TIP } from 'pc/components/data_source_selector_enhanced/data_source_selector_for_node/const';

export const nodeStatusLoader = (node: INode, permissionRequired: keyof IPermissions) => {
  let disable:
    | {
        budget: string;
        message: string;
      }
    | undefined;

  if (permissionRequired === 'manageable' && !node.permissions.manageable) {
    disable = DISABLE_TIP.manageablePermission;
  }

  if (permissionRequired === 'editable' && !node.permissions.editable) {
    disable = DISABLE_TIP.permission;
  }

  if (node.columnLimit) {
    disable = DISABLE_TIP.fieldLimit;
  }
  return disable;
};
