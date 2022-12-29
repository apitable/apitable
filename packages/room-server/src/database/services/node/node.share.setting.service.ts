import { Injectable } from '@nestjs/common';
import { NodeShareSettingEntity } from '../../entities/node.share.setting.entity';
import { CommonException } from '../../../shared/exception/common.exception';
import { PermissionException } from '../../../shared/exception/permission.exception';
import { ServerException } from '../../../shared/exception/server.exception';
import { isEmpty } from 'lodash';
import { NodeRepository } from '../../repositories/node.repository';
import { INodeShareProps } from '../../../shared/interfaces';
import { NodeShareSettingRepository } from '../../repositories/node.share.setting.repository';

@Injectable()
export class NodeShareSettingService {
  constructor(private repository: NodeShareSettingRepository, private nodeRepository: NodeRepository) {}

  /**
   * Obtain share settings by share ID
   */
  async getByShareId(shareId: string): Promise<NodeShareSettingEntity | undefined> {
    return await this.repository.selectByShareId(shareId);
  }

  /**
   * Check if the node enables sharing, regardless of ancestor nodes.
   */
  async getShareStatusByNodeId(nodeId: string): Promise<boolean> {
    const nodeShareSetting = await this.repository.selectByNodeId(nodeId);
    return !!nodeShareSetting?.isEnabled;
  }

  /**
   * Check if the node enables sharing, including ancestor nodes.
   */
  async checkNodeHasOpenShare(shareId: string, nodeId: string): Promise<void> {
    const shareSetting = await this.getByShareId(shareId);
    if (isEmpty(shareSetting) || !shareSetting?.isEnabled) {
      throw new ServerException(PermissionException.ACCESS_DENIED);
    }
    if (shareSetting.nodeId === nodeId) {
      return;
    }
    const parentPaths = await this.nodeRepository.selectParentPathByNodeId(nodeId);
    if (parentPaths.includes(shareSetting.nodeId)) {
      return;
    }
    throw new ServerException(PermissionException.ACCESS_DENIED);
  }

  /**
   * Check if the node is share editable.
   *
   * @param shareId share ID
   * @param nodeId  node ID
   */
  async checkNodeShareCanBeEdited(shareId: string, nodeId: string): Promise<void> {
    const props = await this.getNodeShareProps(shareId, nodeId);
    if (!props?.canBeEdited) {
      throw new ServerException(CommonException.NODE_SHARE_NO_ALLOW_EDIT);
    }
  }

  /**
   * Obtain node sharing options. If the node is not shared, return null.
   * 
   * @param shareId share id
   * @param nodeId node id
   */
  async getNodeShareProps(shareId: string, nodeId: string): Promise<INodeShareProps | null> {
    const shareSetting = await this.getByShareId(shareId);
    if (isEmpty(shareSetting) || !shareSetting?.isEnabled) {
      return null;
    }
    // Check if the node enables sharing
    if (shareSetting.nodeId === nodeId) {
      return shareSetting.props;
    }
    // Check if the node has children nodes
    const hasChildren = await this.nodeRepository.selectCountByParentId(shareSetting.nodeId);
    if (hasChildren) {
      // Children nodes exist
      const childrenNodes = await this.nodeRepository.selectAllSubNodeIds(shareSetting.nodeId);
      if (childrenNodes.includes(nodeId)) {
        return shareSetting.props;
      }
    }
    return null;
  }
}
