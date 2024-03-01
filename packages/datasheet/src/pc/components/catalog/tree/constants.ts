import { ConfigConstant } from '@apitable/core';

export const LEAF_NODES = new Set([
  ConfigConstant.NodeType.DATASHEET,
  ConfigConstant.NodeType.FORM,
  ConfigConstant.NodeType.AUTOMATION,
  ConfigConstant.NodeType.DASHBOARD,
  ConfigConstant.NodeType.MIRROR,
  ConfigConstant.NodeType.AI,
  ConfigConstant.NodeType.CUSTOM_PAGE,
]);