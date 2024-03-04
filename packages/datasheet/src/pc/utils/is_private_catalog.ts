import { ConfigConstant } from '@apitable/core';

export const isPrivateCatalog = (spaceId: string | null) => {
  const catalogKey = localStorage.getItem('vika_workbench_active_key');
  if (!spaceId) {
    return false;
  }
  return catalogKey ?
    JSON.parse(catalogKey).some(item => item.spaceId === spaceId && item.activeKey === ConfigConstant.Modules.PRIVATE) : false;
};