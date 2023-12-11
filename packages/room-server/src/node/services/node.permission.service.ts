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

import {
  ConfigConstant, DEFAULT_EDITOR_PERMISSION, DEFAULT_MANAGER_PERMISSION, DEFAULT_PERMISSION, DEFAULT_READ_ONLY_PERMISSION, IDPrefix,
} from '@apitable/core';
import { Span } from '@metinseylan/nestjs-opentelemetry';
import { Injectable } from '@nestjs/common';
import { MetaService } from 'database/resource/services/meta.service';
import { NodeRepository } from 'node/repositories/node.repository';
import { InjectLogger } from 'shared/common';
import { ServerException, PermissionException } from 'shared/exception';
import { IAuthHeader, IFetchDataOriginOptions, NodePermission } from 'shared/interfaces';
import { RestService } from 'shared/services/rest/rest.service';
import { getConnection } from 'typeorm';
import { UserService } from 'user/services/user.service';
import { Logger } from 'winston';
import { NodeShareSettingService } from './node.share.setting.service';

@Injectable()
export class NodePermissionService {
  constructor(
    // @ts-ignore
    @InjectLogger() private readonly logger: Logger,
    private readonly userService: UserService,
    private readonly nodeShareSettingService: NodeShareSettingService,
    private readonly nodeRepository: NodeRepository,
    private readonly resourceMetaService: MetaService,
    private readonly restService: RestService,
  ) {}

  async getEmbedNodePermission(nodeId: string, auth: IAuthHeader, embedId: string): Promise<NodePermission> {
    const fieldPermissionMap = await this.restService.getFieldPermission(auth, nodeId, embedId);
    if (!auth.userId) {
      return { hasRole: true, role: ConfigConstant.permission.anonymous, fieldPermissionMap, ...DEFAULT_READ_ONLY_PERMISSION };
    }
    return { hasRole: true, role: ConfigConstant.permission.editor, fieldPermissionMap, ...DEFAULT_EDITOR_PERMISSION };
  }

  /**
   * Obtain node permissions.
   *
   * - On-space access: access node in space
   * - Off-space access: template access or share access
   *
   * @param nodeId  node ID
   * @param auth    authorization
   * @param origin  origin options
   */
  async getNodePermission(nodeId: string, auth: IAuthHeader, origin: IFetchDataOriginOptions): Promise<NodePermission> {
    if (origin.internal) {
      this.logger.info(`On-space access nodeId: ${nodeId}`);
      // On-space form
      if (origin.form) {
        const fieldPermissionMap = await this.restService.getFieldPermission(auth, nodeId, origin.shareId);
        return { hasRole: true, role: ConfigConstant.permission.editor, fieldPermissionMap, ...DEFAULT_EDITOR_PERMISSION };
      }
      const permission = await this.restService.getNodePermission(auth, nodeId);
      if (origin.main) {
        // Main datasheet must check permission
        this.logger.info(`Loading main node permission [${nodeId}]`);
        if (!permission.hasRole || !permission.readable) {
          throw new ServerException(PermissionException.ACCESS_DENIED);
        }
      }
      return permission;
    }
    // Off-space access: template or share
    if (!origin.shareId) {
      this.logger.info(`template access ${nodeId}`);
      return { hasRole: true, role: ConfigConstant.permission.templateVisitor, ...DEFAULT_READ_ONLY_PERMISSION };
    }
    const hasLogin = await this.userService.session(auth.cookie!);
    // Unlogged-in, anonymous user permission
    if (!hasLogin) {
      this.logger.info(`Share access ${origin.shareId}, node ${nodeId}, user state: unlogged-in`);
      const fieldPermissionMap = await this.restService.getFieldPermission(auth, nodeId, origin.shareId);
      if (origin.main) {
        // Main datasheet returns read-only permission
        return { hasRole: true, role: ConfigConstant.permission.anonymous, fieldPermissionMap, ...DEFAULT_READ_ONLY_PERMISSION };
      }
      // Check if linked datasheet is in sharing
      const props = await this.nodeShareSettingService.getNodeShareProps(origin.shareId, nodeId);
      if (props) {
        if (origin.form) {
          const { fillAnonymous } = await this.resourceMetaService.selectMetaByResourceId(nodeId);
          if (Boolean(fillAnonymous)) {
            return { hasRole: true, role: ConfigConstant.permission.editor, fieldPermissionMap, ...DEFAULT_EDITOR_PERMISSION };
          }
        }
        return { hasRole: true, role: ConfigConstant.permission.anonymous, fieldPermissionMap, ...DEFAULT_READ_ONLY_PERMISSION };
      }
      return { hasRole: true, role: ConfigConstant.permission.anonymous, fieldPermissionMap, ...DEFAULT_PERMISSION };
    }
    this.logger.info(`Share access ${origin.shareId}, node ${nodeId}, user state: logged-in`);
    return await this.getNodeRole(nodeId, auth, origin.shareId);
  }

  async getNodePermissionSetStatus(nodeId: string): Promise<boolean> {
    const nodePermitSetCount = await getConnection()
      .createQueryBuilder()
      .select('COUNT(1)', 'count')
      .from(`${this.nodeRepository.manager.connection.options.entityPrefix}node_permission`, 'vnp')
      .where('vnp.node_id = :nodeId', { nodeId })
      .getRawOne();
    return +nodePermitSetCount.count > 0;
  }

  @Span()
  async getNodeRole(nodeId: string, auth: IAuthHeader, shareId?: string): Promise<NodePermission> {
    // On-space permission
    if (!shareId) {
      return await this.restService.getNodePermission(auth, nodeId);
    }
    // Obtain share options. If the node is not in sharing (e.g. linked datasheet of shared datasheet), returns default permission
    let shareProps;
    if (!shareId.startsWith(IDPrefix.EmbedLink)) {
      shareProps = await this.nodeShareSettingService.getNodeShareProps(shareId, nodeId);
      if (!shareProps) {
        const fieldPermissionMap = await this.restService.getFieldPermission(auth, nodeId, shareId);
        return { hasRole: false, role: ConfigConstant.permission.foreigner, fieldPermissionMap, ...DEFAULT_PERMISSION };
      }
    }
    // Permissions of shared node is based on last modifier of the shared node
    const { editable, readable, userId, uuid, fieldPermissionMap, isDeleted } = await this.restService.getNodePermission(auth, nodeId, shareId);
    // Sharing editable. If the sharer does not have editable permission, return default permission.
    if (shareProps?.canBeEdited) {
      if (editable || isDeleted) {
        return { hasRole: true, role: ConfigConstant.permission.editor, userId, uuid, fieldPermissionMap, ...DEFAULT_EDITOR_PERMISSION };
      }
      return { hasRole: false, role: ConfigConstant.permission.foreigner, userId, uuid, fieldPermissionMap, ...DEFAULT_PERMISSION };
    }
    // Not sharing editable. If the sharer does not have editable permission, return default permission
    if (!readable) {
      return { hasRole: false, role: ConfigConstant.permission.foreigner, userId, uuid, fieldPermissionMap, ...DEFAULT_PERMISSION };
    }
    return { hasRole: true, role: ConfigConstant.permission.foreigner, userId, uuid, fieldPermissionMap, ...DEFAULT_READ_ONLY_PERMISSION };
  }

  getDefaultManagerPermission() {
    return { hasRole: true, role: ConfigConstant.permission.manager, ...DEFAULT_MANAGER_PERMISSION, fieldPropertyEditable: true };
  }
}
