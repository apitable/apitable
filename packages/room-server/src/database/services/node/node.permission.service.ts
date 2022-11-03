import { Injectable } from '@nestjs/common';
import { InjectLogger } from '../../../shared/common';
import { ServerException } from '../../../shared/exception/server.exception';
import { Logger } from 'winston';
import { IAuthHeader, NodePermission } from 'shared/interfaces/axios.interfaces';
import { PermissionException } from '../../../shared/exception/permission.exception';
import { ConfigConstant, DEFAULT_READ_ONLY_PERMISSION, DEFAULT_EDITOR_PERMISSION, 
  DEFAULT_PERMISSION, DEFAULT_MANAGER_PERMISSION } from '@apitable/core';
import { getConnection } from 'typeorm';
import { NodeShareSettingService } from './node.share.setting.service';
import { UserService } from '../user/user.service';
import { IFetchDataOriginOptions } from '../../../shared/interfaces';
import { RestService } from '../../../shared/services/rest/rest.service';

@Injectable()
export class NodePermissionService {

  constructor(
    private readonly restService: RestService,
    @InjectLogger() private readonly logger: Logger,
    private readonly userService: UserService,
    private readonly nodeShareSettingService: NodeShareSettingService,
  ) {}

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
      this.logger.info('On-space access');
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
      this.logger.info('template access');
      return { hasRole: true, role: ConfigConstant.permission.templateVisitor, ...DEFAULT_READ_ONLY_PERMISSION };
    }
    const hasLogin = await this.userService.session(auth.cookie);
    // Unlogged-in, anonymous user permission
    if (!hasLogin) {
      this.logger.info('Share acces, user state: unlogged-in');
      const fieldPermissionMap = await this.restService.getFieldPermission(auth, nodeId, origin.shareId);
      if (origin.main) {
        // Main datasheet returns read-only permission
        return { hasRole: true, role: ConfigConstant.permission.anonymous, fieldPermissionMap, ...DEFAULT_READ_ONLY_PERMISSION };
      }
      // Check if linked datasheet is in sharing
      const props = await this.nodeShareSettingService.getNodeShareProps(origin.shareId, nodeId);
      if (props) {
        return { hasRole: true, role: ConfigConstant.permission.anonymous, fieldPermissionMap, ...DEFAULT_READ_ONLY_PERMISSION };
      }
      return { hasRole: true, role: ConfigConstant.permission.anonymous, fieldPermissionMap, ...DEFAULT_PERMISSION };
    }
    this.logger.info('Share access, user state: logged-in');
    return await this.getNodeRole(nodeId, auth, origin.shareId);
  }

  async getNodePermissionSetStatus(nodeId: string): Promise<boolean> {
    const nodePermitSetCount = await getConnection().createQueryBuilder()
      .select('COUNT(1)', 'count')
      .from('vika_node_permission', 'vnp')
      .where('vnp.node_id = :nodeId', { nodeId })
      .getRawOne();
    return +nodePermitSetCount.count > 0;
  }

  async getNodeRole(nodeId: string, auth: IAuthHeader, shareId?: string): Promise<NodePermission> {
    // On-space permission
    if (!shareId) {
      return await this.restService.getNodePermission(auth, nodeId);
    }
    // Obtain share options. If the node is not in sharing (e.g. linked datasheet of shared datasheet), returns default permission
    const props = await this.nodeShareSettingService.getNodeShareProps(shareId, nodeId);
    if (!props) {
      const fieldPermissionMap = await this.restService.getFieldPermission(auth, nodeId, shareId);
      return { hasRole: false, role: ConfigConstant.permission.foreigner, fieldPermissionMap, ...DEFAULT_PERMISSION };
    }
    // Permissions of shared node is based on last modifier of the shared node
    const { editable, readable, userId, uuid, fieldPermissionMap, isDeleted } = await this.restService.getNodePermission(auth, nodeId, shareId);
    // Sharing editable. If the sharer does not have editable permission, return default permission.
    if (props.canBeEdited) {
      if( editable || isDeleted ){
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
