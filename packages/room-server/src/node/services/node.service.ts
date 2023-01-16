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

import { IFormProps, IPermissions, Role } from '@apitable/core';
import { Injectable } from '@nestjs/common';
import { NodeDescriptionService } from 'node/services/node.description.service';
import { get, omit } from 'lodash';
import { NodeExtraConstant } from 'shared/common';
import { DatasheetException, PermissionException, ServerException } from 'shared/exception';
import { IBaseException } from 'shared/exception/base.exception';
import { IAuthHeader, IFetchDataOriginOptions } from 'shared/interfaces';
import { NodeDetailInfo, NodeRelInfo } from '../../database/interfaces';
import { DatasheetRepository } from '../../database/datasheet/repositories/datasheet.repository';
import { NodeRelRepository } from '../repositories/node.rel.repository';
import { NodeRepository } from '../repositories/node.repository';
import { ResourceMetaRepository } from 'database/resource/repositories/resource.meta.repository';
import { UnitMemberService } from 'unit/services/unit.member.service';
import { NodePermissionService } from './node.permission.service';
import { NodeShareSettingService } from './node.share.setting.service';

@Injectable()
export class NodeService {
  constructor(
    private readonly memberService: UnitMemberService,
    private readonly nodeDescService: NodeDescriptionService,
    private readonly nodeShareSettingService: NodeShareSettingService,
    private readonly nodePermissionService: NodePermissionService,
    private readonly nodeRepository: NodeRepository,
    private readonly nodeRelRepository: NodeRelRepository,
    private readonly datasheetRepository: DatasheetRepository,
    private readonly resourceMetaRepository: ResourceMetaRepository,
  ) {}

  async checkNodeIfExist(nodeId: string, exception?: IBaseException) {
    const count = await this.nodeRepository.selectCountByNodeId(nodeId);
    if (!count) {
      throw new ServerException(exception ? exception : PermissionException.NODE_NOT_EXIST);
    }
  }

  async checkUserForNode(userId: string, nodeId: string): Promise<string> {
    // Get the space ID which the node belongs to
    const spaceId = await this.getSpaceIdByNodeId(nodeId);
    // Check if the user is in this space
    await this.memberService.checkUserIfInSpace(userId, spaceId);
    return spaceId;
  }

  async checkNodePermission(nodeId: string, auth: IAuthHeader): Promise<void> {
    const permission = await this.nodePermissionService.getNodeRole(nodeId, auth);
    if (!permission?.readable) {
      throw new ServerException(PermissionException.ACCESS_DENIED);
    }
  }

  async getMainNodeId(nodeId: string): Promise<string> {
    const raw = await this.nodeRelRepository.selectMainNodeIdByRelNodeId(nodeId);
    if (raw?.mainNodeId) {
      return raw.mainNodeId;
    }
    throw new ServerException(DatasheetException.DATASHEET_NOT_EXIST);
  }

  async getRelNodeIds(nodeId: string): Promise<string[]> {
    const raw = await this.nodeRelRepository.selectRelNodeIdByMainNodeId(nodeId);
    return raw.reduce<string[]>((pre, cur) => {
      pre.push(cur.relNodeId);
      return pre;
    }, []);
  }

  /**
   * Get node linking info
   */
  async getNodeRelInfo(nodeId: string): Promise<NodeRelInfo> {
    const raw = await this.nodeRelRepository.selectNodeRelInfo(nodeId);
    if (raw) {
      raw.datasheetRevision = Number(raw.datasheetRevision);
      return raw;
    }
    throw new ServerException(DatasheetException.DATASHEET_NOT_EXIST);
  }

  /**
   * Batch obtain node linking info
   */
  async getNodeRelInfoByIds(nodeIds: string[]): Promise<NodeRelInfo[]> {
    return (await this.nodeRelRepository.selectNodeRelInfoByIds(nodeIds))!;
  }

  async getPermissions(nodeId: string, auth: IAuthHeader, origin: IFetchDataOriginOptions): Promise<IPermissions> {
    const permission = await this.nodePermissionService.getNodePermission(nodeId, auth, origin);
    // Exclude property copy
    return omit(permission, ['userId', 'uuid', 'role', 'hasRole', 'isGhostNode', 'nodeFavorite', 'fieldPermissionMap']);
  }

  async getNodeDetailInfo(nodeId: string, auth: IAuthHeader, origin: IFetchDataOriginOptions): Promise<NodeDetailInfo> {
    // Node permission view. If no auth is given, it is template access or share access.
    const permission = await this.nodePermissionService.getNodePermission(nodeId, auth, origin);
    // Node base info
    const nodeInfo = await this.nodeRepository.getNodeInfo(nodeId);
    // Node description
    const description = await this.nodeDescService.getDescription(nodeId);
    // Node revisoin
    const revision = origin.notDst ? await this.getReversionByResourceId(nodeId) : await this.getRevisionByDstId(nodeId);
    // Obtain node sharing state
    const nodeShared = await this.nodeShareSettingService.getShareStatusByNodeId(nodeId);
    // Obtain node permissions
    const nodePermitSet = await this.nodePermissionService.getNodePermissionSetStatus(nodeId);
    // Exclude property copy
    const permissions = omit(permission, ['userId', 'uuid', 'role', 'hasRole', 'isGhostNode', 'nodeFavorite', 'fieldPermissionMap']);

    return {
      node: {
        id: nodeId,
        name: nodeInfo?.nodeName || '',
        description: description || '{}',
        parentId: nodeInfo?.parentId || '',
        icon: nodeInfo?.icon || '',
        nodeShared: nodeShared,
        nodePermitSet: nodePermitSet,
        revision: revision == null ? 0 : revision,
        spaceId: nodeInfo?.spaceId || '',
        role: permission.role as Role,
        permissions,
        nodeFavorite: permission.nodeFavorite || false,
        extra: this.formatNodeExtra(nodeInfo?.extra),
        isGhostNode: permission.isGhostNode,
      },
      fieldPermissionMap: permission.fieldPermissionMap || undefined,
    };
  }

  async getSpaceIdByNodeId(nodeId: string): Promise<string> {
    // Obtain the space ID which the node belongs to
    const rawResult = await this.nodeRepository.selectSpaceIdByNodeId(nodeId);
    if (!rawResult?.spaceId) {
      throw new ServerException(PermissionException.NODE_NOT_EXIST);
    }
    return rawResult.spaceId;
  }

  async isTemplate(nodeId: string): Promise<boolean> {
    return (await this.nodeRepository.selectTemplateCountByNodeId(nodeId)) > 0;
  }

  async getRevisionByDstId(dstId: string): Promise<number | undefined> {
    const rawData = await this.datasheetRepository.selectRevisionByDstId(dstId);
    return rawData && Number(rawData.revision);
  }

  async getReversionByResourceId(resourceId: string): Promise<number | undefined> {
    const entity = await this.resourceMetaRepository.selectReversionByResourceId(resourceId);
    return entity && Number(entity.revision);
  }

  formatNodeExtra(extra: any): IFormProps & { showRecordHistory: boolean } {
    if (extra) {
      if (extra.hasOwnProperty(NodeExtraConstant.SHOW_RECORD_HISTORY)) {
        return { ...extra, showRecordHistory: !!extra.showRecordHistory };
      }
      // Default to show both
      return { ...extra, showRecordHistory: true };
    }
    return { showRecordHistory: true };
  }

  async showRecordHistory(nodeId: string, throwError = false): Promise<boolean> {
    const rawData = await this.nodeRepository.selectExtraByNodeId(nodeId);
    const showRecordHistory = get(rawData, 'extra.showRecordHistory', true);
    if (throwError && !showRecordHistory) {
      throw new ServerException(DatasheetException.SHOW_RECORD_HISTORY_NOT_PERMISSION);
    }
    return showRecordHistory;
  }
}
