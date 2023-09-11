import { ConfigConstant } from '@apitable/core';

export interface IShareContentProps {
  /** Information about the node being operated on */
  data: {
    nodeId: string;
    type: ConfigConstant.NodeType;
    icon: string;
    name: string;
  };
  defaultActiveKey?: 'Invite' | 'Publish';
}
