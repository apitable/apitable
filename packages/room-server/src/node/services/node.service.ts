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
import { Span } from '@metinseylan/nestjs-opentelemetry';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { NodeBaseInfo, NodeDetailInfo, NodeRelInfo } from 'database/interfaces';
import { MetaService } from 'database/resource/services/meta.service';
import { get, keyBy, omit } from 'lodash';
import { NodeDescriptionService } from 'node/services/node.description.service';
import { NodeExtraConstant } from 'shared/common';
import { DatasheetException, PermissionException, ServerException } from 'shared/exception';
import { IBaseException } from 'shared/exception/base.exception';
import { IAuthHeader, IFetchDataOriginOptions } from 'shared/interfaces';
import { UnitMemberService } from 'unit/services/unit.member.service';
import { NodeRelRepository } from '../repositories/node.rel.repository';
import { NodeRepository } from '../repositories/node.repository';
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
    // @ts-ignore
    @Inject(forwardRef(() => MetaService))
    private readonly resourceMetaService: MetaService,
  ) {}

  async checkNodeIfExist(nodeId: string, exception?: IBaseException) {
    const count = await this.nodeRepository.selectCountByNodeId(nodeId);
    if (!count) {
      throw new ServerException(exception ? exception : PermissionException.NODE_NOT_EXIST);
    }
  }

  async getFolderLastChildren(fldId: string): Promise<string> {
    const nodes = await this.nodeRepository.find({
      where: {
        parentId: fldId,
      },
    });
    if (!nodes) {
      return '';
    }
    const nodeIdSet = new Map<string, boolean>();
    nodes.forEach((node) => {
      nodeIdSet.set(node.nodeId, false);
    });
    nodes.forEach((node) => {
      if (node.preNodeId && nodeIdSet.has(node.preNodeId)) {
        nodeIdSet.set(node.preNodeId, true);
      }
    });
    for (const [key, value] of nodeIdSet) {
      if (!value) {
        return key;
      }
    }
    return '';
  }

  async getNodeIcon(nodeId: string): Promise<string | undefined> {
    const node = await this.nodeRepository.findOne({
      where: {
        nodeId,
      },
    });
    if (!node) {
      return undefined;
    }
    return node.icon;
  }

  async batchSave(nodes: any[]) {
    return await this.nodeRepository.createQueryBuilder().insert().values(nodes).execute();
  }

  @Span()
  async checkUserForNode(userId: string, nodeId: string): Promise<string> {
    // Get the space ID which the node belongs to
    const spaceId = await this.getSpaceIdByNodeId(nodeId);
    // Check if the user is in this space
    await this.memberService.checkUserIfInSpace(userId, spaceId);
    return spaceId;
  }

  @Span()
  async checkNodePermission(nodeId: string, auth: IAuthHeader): Promise<void> {
    const permission = await this.nodePermissionService.getNodeRole(nodeId, auth);
    if (!permission?.readable) {
      throw new ServerException(PermissionException.ACCESS_DENIED);
    }
  }

  @Span()
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

  @Span()
  async getNodeDetailInfo(nodeId: string, auth: IAuthHeader, origin: IFetchDataOriginOptions): Promise<NodeDetailInfo> {
    // Node permission view. If no auth is given, it is template access or share access.
    const permission = await this.nodePermissionService.getNodePermission(nodeId, auth, origin);
    // Node base info
    const nodeInfo = await this.nodeRepository.getNodeInfo(nodeId);
    // Node description
    const description = await this.nodeDescService.getDescription(nodeId);
    // Node revision
    const revision = origin.notDst ? await this.getRevisionByResourceId(nodeId) : await this.resourceMetaService.getRevisionByDstId(nodeId);
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
        nodePrivate: nodeInfo?.unitId != '0',
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

  async getNameByNodeId(nodeId: string): Promise<string> {
    return await this.nodeRepository.selectNameByNodeId(nodeId);
  }

  async isTemplate(nodeId: string): Promise<boolean> {
    return (await this.nodeRepository.selectTemplateCountByNodeId(nodeId)) > 0;
  }

  async getRevisionByResourceId(resourceId: string): Promise<number | undefined> {
    const entity = await this.resourceMetaService.selectRevisionByResourceId(resourceId);
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

  async selectNodeBaseInfoByNodeId(nodeId: string): Promise<NodeBaseInfo | undefined> {
    return await this.nodeRepository.selectNodeBaseInfoByNodeId(nodeId);
  }

  async selectSpaceIdByNodeId(nodeId: string): Promise<{ spaceId: string } | undefined> {
    return await this.nodeRepository.selectSpaceIdByNodeId(nodeId);
  }

  async getRelNodeIdsByMainNodeIds(mainNodeIds: string[]): Promise<string[]> {
    return await this.nodeRelRepository.selectRelNodeIdsByMainNodeIds(mainNodeIds);
  }

  async getNodeInfoMapByNodeIds(nodeIds: string[]): Promise<Map<string, { nodeName: string; relNodeId?: string }>> {
    const nodeMap: Map<string, any> = new Map<string, any>();
    if (!nodeIds.length) {
      return nodeMap;
    }
    const nodes = await this.nodeRepository.selectNodeNameByNodeIds(nodeIds);
    const nodeRel = await this.nodeRelRepository.selectRelNodeInfoByMainNodeIds(nodeIds);
    const nodeRelMap = keyBy(nodeRel, 'mainNodeId');
    for (const node of nodes) {
      const info = {
        nodeName: node.nodeName,
        relNodeId: nodeRelMap[node.nodeId]?.relNodeId,
      };
      nodeMap.set(node.nodeId, info);
    }
    return nodeMap;
  }

  async nodePrivate(nodeId: string): Promise<boolean> {
    return (await this.nodeRepository.selectUnitCountByNodeId(nodeId)) > 0;
  }

  async filterPrivateNode(nodeIds: string[]): Promise<string[]> {
    if (!nodeIds.length) {
      return [];
    }
    const nodes = await this.nodeRepository.selectTeamNodeByNodeIds(nodeIds);
    if (!nodes || !nodes.length) {
      return [];
    }
    return nodes.map((i) => i.nodeId);
  }
}
