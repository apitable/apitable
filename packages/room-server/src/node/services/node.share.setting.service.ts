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

import { Span } from '@metinseylan/nestjs-opentelemetry';
import { Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { InternalServiceNodeInterfaceService } from 'shared/backend_client/api/internal-service-node-interface.service';
import { CommonException, PermissionException, ServerException } from 'shared/exception';
import { HttpHelper } from 'shared/helpers';
import { INodeShareProps } from 'shared/interfaces';
import { NodeShareSettingEntity } from '../entities/node.share.setting.entity';
import { NodeShareSettingRepository } from '../repositories/node.share.setting.repository';

@Injectable()
export class NodeShareSettingService {
  constructor(
    private nodeInterfaceService: InternalServiceNodeInterfaceService,
    private repository: NodeShareSettingRepository,
  ) {}

  /**
   * Obtain share settings by share ID
   */
  async getByShareId(shareId: string): Promise<NodeShareSettingEntity | undefined> {
    return await this.repository.selectByShareId(shareId);
  }

  /**
   * Check if the node enables sharing, regardless of ancestor nodes.
   * @deprecated Use `getNodeShareStatus` instead
   */
  async getShareStatusByNodeId(nodeId: string): Promise<boolean> {
    const nodeShareSetting = await this.repository.selectByNodeId(nodeId);
    return !!nodeShareSetting?.isEnabled;
  }

  /**
   * Check if the node enables sharing, including ancestor nodes.
   * @param nodeId node ID
   */
  async getNodeShareStatus(nodeId: string): Promise<boolean> {
    const shareSetting = await this.repository.selectByNodeId(nodeId);
    if (!shareSetting) {
      return false;
    }
    if (shareSetting.isEnabled) {
      return true;
    }
    return await this.getNodeContainsStatus(shareSetting.nodeId, nodeId);
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
    const containsStatus = await this.getNodeContainsStatus(shareSetting.nodeId, nodeId);
    if (containsStatus) {
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
  @Span()
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
  async getNodeShareProps(shareId: string, nodeId: string): Promise<INodeShareProps | null | undefined> {
    const shareSetting = await this.getByShareId(shareId);
    if (isEmpty(shareSetting) || !shareSetting?.isEnabled) {
      return null;
    }
    // Check if the node enables sharing
    if (shareSetting.nodeId === nodeId) {
      return shareSetting.props;
    }
    // Check if the node has children nodes
    const containsStatus = await this.getNodeContainsStatus(shareSetting.nodeId, nodeId);
    return containsStatus ? shareSetting.props : null;
  }

  private async getNodeContainsStatus(folderId: string, nodeId: string): Promise<boolean> {
    return await HttpHelper.getResponseData(this.nodeInterfaceService.getContainsStatus(folderId, nodeId));
  }
}
