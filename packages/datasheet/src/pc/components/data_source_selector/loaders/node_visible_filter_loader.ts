import { IPermissions } from '@apitable/core';

export const nodeVisibleFilterLoader = (node, permissionRequired: keyof IPermissions) => {
  return node['permissions'] ? Boolean(node['permissions'][permissionRequired]) : true;
};
