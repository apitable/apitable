import { ConfigConstant, INode } from '@apitable/core';
import { DISABLE_TIP } from 'pc/components/datasheet_search_panel/const';

/**
 * @description To determine if the current node can be selected, check the node's permissions
 */
export const checkNodeDisable = (node: INode, needPermission?: 'manageable' | 'editable') => {
  if (node.type === ConfigConstant.NodeType.VIEW) {
    return;
  }
  let disable: { budget: string; message: string } | undefined;

  if(needPermission == 'manageable') {
    if (!node.permissions.manageable) {
      disable = DISABLE_TIP.manageablePermission;
    }
  }

  if(needPermission == 'editable') {
    if (!node.permissions.editable) {
      disable = DISABLE_TIP.permission;
    }
  }

  if (!node.permissions.editable) {
    disable = DISABLE_TIP.permission;
  }

  if (node.columnLimit) {
    disable = DISABLE_TIP.fieldLimit;
  }
  return disable;

};
