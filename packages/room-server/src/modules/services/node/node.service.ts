import { Injectable } from '@nestjs/common';
import { IFormProps, IPermissions, Role } from '@apitable/core';
import { NodeExtraConstant } from 'common';
import { DatasheetException, PermissionException, ServerException } from 'exception';
import { IBaseException } from 'exception/base.exception';
import { IFetchDataOriginOptions, IAuthHeader } from 'interfaces';
import { get, omit } from 'lodash';
import { NodeDetailInfo, NodeRelInfo } from 'models';
import { DatasheetRepository } from 'modules/repository/datasheet.repository';
import { NodeRelRepository } from 'modules/repository/node.rel.repository';
import { NodeRepository } from 'modules/repository/node.repository';
import { ResourceMetaRepository } from 'modules/repository/resource.meta.repository';
import { NodeDescriptionService } from 'modules/services/node/node.description.service';
import { UnitMemberService } from '../unit/unit.member.service';
import { NodePermissionService } from './node.permission.service';
import { NodeShareSettingService } from './node.share.setting.service';

/**
 * 节点服务
 */
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
    // 获取节点所在空间ID
    const spaceId = await this.getSpaceIdByNodeId(nodeId);
    // 获取用户是否存在此空间
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
   * 获取节点关联信息
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
   * 批量获取节点关联信息
   * @param nodeIds 
   */
  async getNodeRelInfoByIds(nodeIds: string[]): Promise<NodeRelInfo[]> {
    return await this.nodeRelRepository.selectNodeRelInfoByIds(nodeIds);
  }

  async getPermissions(nodeId: string, auth: IAuthHeader, origin: IFetchDataOriginOptions): Promise<IPermissions> {
    const permission = await this.nodePermissionService.getNodePermission(nodeId, auth, origin);
    // 排除属性拷贝
    return omit(permission, ['userId', 'uuid', 'role', 'hasRole', 'isGhostNode', 'nodeFavorite', 'fieldPermissionMap']);
  }

  async getNodeDetailInfo(nodeId: string, auth: IAuthHeader, origin: IFetchDataOriginOptions): Promise<NodeDetailInfo> {
    // 节点权限视图，如果没有传递用户授权信息，则可能是模版访问和分享访问
    const permission = await this.nodePermissionService.getNodePermission(nodeId, auth, origin);
    // 节点基本信息
    const nodeInfo = await this.nodeRepository.getNodeInfo(nodeId);
    // 节点描述
    const description = await this.nodeDescService.getDescription(nodeId);
    // 节点版本号
    const revision = origin.notDst ? await this.getReversionByResourceId(nodeId) : await this.getRevisionByDstId(nodeId);
    // 查询节点分享状态
    const nodeShared = await this.nodeShareSettingService.getShareStatusByNodeId(nodeId);
    // 查询节点权限
    const nodePermitSet = await this.nodePermissionService.getNodePermissionSetStatus(nodeId);
    // 排除属性拷贝
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
    // 获取节点所在空间ID
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

  async getReversionByResourceId(resourceId: string): Promise<number> {
    const entity = await this.resourceMetaRepository.selectReversionByResourceId(resourceId);
    return entity && Number(entity.revision);
  }

  formatNodeExtra(extra: any): IFormProps & { showRecordHistory: boolean } {
    if (extra) {
      if (extra.hasOwnProperty(NodeExtraConstant.SHOW_RECORD_HISTORY)) {
        return { ...extra, showRecordHistory: !!extra.showRecordHistory };
      }
      // 默认都展示
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
