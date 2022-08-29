import { Injectable } from '@nestjs/common';
import { InjectLogger } from 'common';
import { ServerException } from 'exception/server.exception';
import { Logger } from 'winston';
import { IAuthHeader, NodePermission } from 'interfaces/axios.interfaces';
import { PermissionException } from 'exception/permission.exception';
import { ConfigConstant, DEFAULT_READ_ONLY_PERMISSION, DEFAULT_EDITOR_PERMISSION, 
  DEFAULT_PERMISSION, DEFAULT_MANAGER_PERMISSION } from '@vikadata/core';
import { getConnection } from 'typeorm';
import { NodeShareSettingService } from './node.share.setting.service';
import { UserService } from '../user/user.service';
import { IFetchDataOriginOptions } from 'interfaces';
import { RestService } from '../../rest/rest.service';

/**
 * 节点权限服务
 */
@Injectable()
export class NodePermissionService {

  constructor(
    private readonly restService: RestService,
    @InjectLogger() private readonly logger: Logger,
    private readonly userService: UserService,
    private readonly nodeShareSettingService: NodeShareSettingService,
  ) {}

  /**
   * 获取节点的权限
   * 站内访问 -- 空间站内访问
   * 站外访问 -- 模版访问或分享访问
   * @param nodeId  节点ID
   * @param auth    用户授权信息
   * @param origin  来源的参数选项
   */
  async getNodePermission(nodeId: string, auth: IAuthHeader, origin: IFetchDataOriginOptions): Promise<NodePermission> {
    if (origin.internal) {
      this.logger.info('站内访问');
      // 站内神奇表单
      if (origin.form) {
        const fieldPermissionMap = await this.restService.getFieldPermission(auth, nodeId, origin.shareId);
        return { hasRole: true, role: ConfigConstant.permission.editor, fieldPermissionMap, ...DEFAULT_EDITOR_PERMISSION };
      }
      const permission = await this.restService.getNodePermission(auth, nodeId);
      if (origin.main) {
        // 主表权限必须校验操作权限
        this.logger.info(`加载主节点权限[${nodeId}]`);
        if (!permission.hasRole || !permission.readable) {
          throw new ServerException(PermissionException.ACCESS_DENIED);
        }
      }
      return permission;
    }
    // 站外访问：模版或分享
    if (!origin.shareId) {
      this.logger.info('模版访问');
      return { hasRole: true, role: ConfigConstant.permission.templateVisitor, ...DEFAULT_READ_ONLY_PERMISSION };
    }
    const hasLogin = await this.userService.session(auth.cookie);
    // 未登录，匿名者操作权限
    if (!hasLogin) {
      this.logger.info('分享访问，用户访问状态: 未登录');
      const fieldPermissionMap = await this.restService.getFieldPermission(auth, nodeId, origin.shareId);
      if (origin.main) {
        // 主表权限直接返回可查看
        return { hasRole: true, role: ConfigConstant.permission.anonymous, fieldPermissionMap, ...DEFAULT_READ_ONLY_PERMISSION };
      }
      // 关联表权限判断是否在分享之列
      const props = await this.nodeShareSettingService.getNodeShareProps(origin.shareId, nodeId);
      if (props) {
        return { hasRole: true, role: ConfigConstant.permission.anonymous, fieldPermissionMap, ...DEFAULT_READ_ONLY_PERMISSION };
      }
      return { hasRole: true, role: ConfigConstant.permission.anonymous, fieldPermissionMap, ...DEFAULT_PERMISSION };
    }
    this.logger.info('分享访问，用户访问状态: 已登录');
    return await this.getNodeRole(nodeId, auth, origin.shareId);
  }

  /**
   * 获取节点的权限设置状态
   */
  async getNodePermissionSetStatus(nodeId: string): Promise<boolean> {
    const nodePermitSetCount = await getConnection().createQueryBuilder()
      .select('COUNT(1)', 'count')
      .from('vika_node_permission', 'vnp')
      .where('vnp.node_id = :nodeId', { nodeId })
      .getRawOne();
    return +nodePermitSetCount.count > 0;
  }

  async getNodeRole(nodeId: string, auth: IAuthHeader, shareId?: string): Promise<NodePermission> {
    // 站内权限直接返回
    if (!shareId) {
      return await this.restService.getNodePermission(auth, nodeId);
    }
    // 获取分享选项参数。节点不在分享之列（例如加载分享文件外部的关联表），返回默认权限
    const props = await this.nodeShareSettingService.getNodeShareProps(shareId, nodeId);
    if (!props) {
      const fieldPermissionMap = await this.restService.getFieldPermission(auth, nodeId, shareId);
      return { hasRole: false, role: ConfigConstant.permission.foreigner, fieldPermissionMap, ...DEFAULT_PERMISSION };
    }
    // 分享的节点权限体系，是以分享最后编辑人的权限为准
    const { editable, readable, userId, uuid, fieldPermissionMap } = await this.restService.getNodePermission(auth, nodeId, shareId);
    // 分享可编辑。若分享者无可编辑权限，只返回默认权限
    if (props.canBeEdited) {
      if (!editable) {
        return { hasRole: false, role: ConfigConstant.permission.foreigner, userId, uuid, fieldPermissionMap, ...DEFAULT_PERMISSION };
      }
      return { hasRole: true, role: ConfigConstant.permission.editor, userId, uuid, fieldPermissionMap, ...DEFAULT_EDITOR_PERMISSION };
    }
    // 非分享可编辑。若分享者无查看权限，只返回默认权限
    if (!readable) {
      return { hasRole: false, role: ConfigConstant.permission.foreigner, userId, uuid, fieldPermissionMap, ...DEFAULT_PERMISSION };
    }
    return { hasRole: true, role: ConfigConstant.permission.foreigner, userId, uuid, fieldPermissionMap, ...DEFAULT_READ_ONLY_PERMISSION };
  }

  getDefaultManagerPermission() {
    return { hasRole: true, role: ConfigConstant.permission.manager, ...DEFAULT_MANAGER_PERMISSION, fieldPropertyEditable: true };
  }
}
