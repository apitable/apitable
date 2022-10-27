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
   * 根据分享ID获取分享设置
   * @param shareId 分享id
   */
  async getByShareId(shareId: string): Promise<NodeShareSettingEntity | undefined> {
    return await this.repository.selectByShareId(shareId);
  }

  /**
   * 查询指定节点是否设置分享
   * 不包含上级目录
   */
  async getShareStatusByNodeId(nodeId: string): Promise<boolean> {
    const nodeShareSetting = await this.repository.selectByNodeId(nodeId);
    return !!nodeShareSetting?.isEnabled;
  }

  /**
   * 检查节点是否开启分享
   * 包含上级目录
   */
  async checkNodeHasOpenShare(shareId: string, nodeId: string): Promise<void> {
    // 节点分享设置信息
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
   * 检查节点是否为分享可编辑
   *
   * @param shareId 分享ID
   * @param nodeId  节点ID
   */
  async checkNodeShareCanBeEdited(shareId: string, nodeId: string): Promise<void> {
    const props = await this.getNodeShareProps(shareId, nodeId);
    if (!props?.canBeEdited) {
      throw new ServerException(CommonException.NODE_SHARE_NO_ALLOW_EDIT);
    }
  }

  /**
   * 获取分享选项参数。节点不在分享之列返回 null
   * 
   * @param shareId 分享id
   * @param nodeId 节点id
   */
  async getNodeShareProps(shareId: string, nodeId: string): Promise<INodeShareProps | null> {
    // 节点分享设置信息
    const shareSetting = await this.getByShareId(shareId);
    if (isEmpty(shareSetting) || !shareSetting?.isEnabled) {
      return null;
    }
    // 判断是否是指定开启分享的节点
    if (shareSetting.nodeId === nodeId) {
      return shareSetting.props;
    }
    // 判断是否有子节点
    const hasChildren = await this.nodeRepository.selectCountByParentId(shareSetting.nodeId);
    if (hasChildren) {
      // 存在子节点
      const childrenNodes = await this.nodeRepository.selectAllSubNodeIds(shareSetting.nodeId);
      if (childrenNodes.includes(nodeId)) {
        return shareSetting.props;
      }
    }
    return null;
  }
}
