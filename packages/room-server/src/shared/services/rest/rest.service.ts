import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { 
  IFieldPermissionMap, IFieldPermissionRoleListData, INode, INodeRoleMap, ISpaceInfo, ISpacePermissionManage, IUserInfo
} from '@apitable/core';
import { CommonStatusCode, InjectLogger } from '../../common';
import { CommonException, PermissionException, ServerException } from '../../exception';
import { IAuthHeader, IHttpSuccessResponse, INotificationCreateRo, IOpAttachCiteRo, IUserBaseInfo, NodePermission } from '../../interfaces';
import { keyBy } from 'lodash';
import { DatasheetCreateRo } from '../../../fusion/ros/datasheet.create.ro';
import { AssetVo } from '../../../fusion/vos/attachment.vo';
import { InternalCreateDatasheetVo, InternalSpaceSubscriptionView, InternalSpaceUsageView, WidgetMap } from '../../../datasheet/interfaces';
import { lastValueFrom } from 'rxjs';
import { sprintf } from 'sprintf-js';
import { Logger } from 'winston';
import { HttpHelper } from '../../helpers';
import { IAssetDTO } from './rest.interface';

/**
 * RestApi 远程调用服务
 */
@Injectable()
export class RestService {

  private GET_ME = 'internal/user/get/me'; // user 基础信息
  private GET_USER_INFO = 'user/me'; // user 基础信息 + 空间成员信息
  private SESSION = 'internal/user/session';
  private GET_WIDGET = 'widget/get';
  private GET_NODE_PERMISSION = 'internal/node/%(nodeId)s/permission';
  private GET_FIELD_PERMISSION = 'internal/node/%(nodeId)s/field/permission';
  private DEL_FIELD_PERMISSION = 'internal/datasheet/%(dstId)s/field/permission/disable';
  private SPACE_CAPACITY = 'internal/space/%(spaceId)s/capacity';
  private SPACE_USAGES = 'internal/space/%(spaceId)s/usages';
  private SPACE_SUBSCRIPTION = 'internal/space/%(spaceId)s/subscription';
  private CREATE_DATASHEET_API_URL = 'internal/spaces/%(spaceId)s/datasheets';
  private DELETE_NODE_API_URL = 'internal/spaces/%(spaceId)s/nodes/%(nodeId)s/delete';
  private API_USAGES = 'internal/space/%(spaceId)s/apiUsages';
  private SPACE_RESOURCE = 'space/resource';
  private SPACE_LIST = 'space/list';
  private NODE_TREE = 'node/tree';
  private NODE_DETAIL = 'node/get';
  private NODE_CHILDREN = 'node/children';

  // 附件资源
  private GET_UPLOAD_PRESIGNED_URL = 'internal/asset/upload/preSignedUrl';
  private GET_ASSET = 'internal/asset/get';
  // 数表op附件引用计算
  private DST_ATTACH_CITE = 'base/attach/cite';
  private SUBSCRIBE_REMIND = 'internal/subscribe/remind';
  // 创建通知
  private CREATE_NOTIFICATION = 'internal/notification/create';
  // 列出拥有节点权限的角色信息
  private LIST_NODE_ROLES = 'node/listRole?nodeId=%(nodeId)s';
  // 列出拥有指定列权限的角色信息
  private LIST_FIELD_ROLES = 'datasheet/%(dstId)s/field/%(fieldId)s/listRole';

  constructor(
    private readonly httpService: HttpService,
    @InjectLogger() private readonly logger: Logger,
  ) {
    // 请求拦截
    this.httpService.axiosRef.interceptors.request.use((config) => {
      this.logger.info('远程调用地址:' + config.url);
      config.headers['X-Internal-Request'] = 'yes';
      return config;
    }, (error) => {
      this.logger.error('远程调用异常', error);
      throw new ServerException(CommonException.SERVER_ERROR);
    });
    this.httpService.axiosRef.interceptors.response.use((res) => {
      const restResponse = res.data as IHttpSuccessResponse<any>;
      if (!restResponse.success) {
        this.logger.error(`服务器调用失败,错误码:[${restResponse.code}],错误信息:[${restResponse.message}]`);
        // 403不在此空间
        if (restResponse.code === 201 || restResponse.code === 403) {
          throw new ServerException(CommonException.UNAUTHORIZED);
        }
        // 不存在节点
        if (restResponse.code === 600) {
          throw new ServerException(PermissionException.NODE_NOT_EXIST);
        }
        // 不允许访问节点
        if (restResponse.code === 601) {
          throw new ServerException(PermissionException.ACCESS_DENIED);
        }
        // 不允许操作节点
        if (restResponse.code === 602) {
          throw new ServerException(PermissionException.OPERATION_DENIED);
        }
        throw new ServerException(CommonException.SERVER_ERROR);
      }
      return restResponse;
    }, error => {
      // 调用失败，可能是网络异常或者HttpException
      this.logger.error('调用异常，可能是网络异常或服务端异常');
      this.logger.error(error);
      throw new ServerException(CommonException.SERVER_ERROR);
    });
  }

  /**
   * 获取指定空间站的用户信息，包含用户基础信息+用户所在空间站的成员信息
   * @param headers
   * @param spaceId
   */
  async getUserInfoBySpaceId(headers: IAuthHeader, spaceId: string): Promise<IUserInfo> {
    const response = await this.httpService.get(this.GET_USER_INFO, {
      headers: HttpHelper.createAuthHeaders(headers),
      params: {
        spaceId,
      },
    }).toPromise();
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`获取自己所在空间站的信息: ${JSON.stringify(response.data)}`);
    }
    return response.data;
  }

  async fetchMe(headers: IAuthHeader): Promise<IUserBaseInfo> {
    const response = await this.httpService.get(this.GET_ME, {
      headers: HttpHelper.createAuthHeaders(headers),
    }).toPromise();
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`获取自己信息: ${JSON.stringify(response.data)}`);
    }
    return response.data;
  }

  async hasLogin(cookie: string): Promise<boolean> {
    const response = await this.httpService.get(this.SESSION, {
      headers: HttpHelper.createAuthHeaders({ cookie }),
    }).toPromise();
    return response.data;
  }

  async getNodePermission(headers: IAuthHeader, nodeId: string, shareId?: string): Promise<NodePermission> {
    // 获取数表的角色
    const response = await this.httpService.get(sprintf(this.GET_NODE_PERMISSION, { nodeId }), {
      headers: HttpHelper.createAuthHeaders(headers),
      params: { shareId },
    }).toPromise();
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${nodeId}]获取节点权限: ${JSON.stringify(response.data)}`);
    }
    return response.data;
  }

  async getFieldPermission(headers: IAuthHeader, nodeId: string, shareId?: string): Promise<IFieldPermissionMap> {
    // 获取字段权限
    const response = await this.httpService.get(sprintf(this.GET_FIELD_PERMISSION, { nodeId }), {
      headers: HttpHelper.createAuthHeaders(headers),
      params: { shareId },
    }).toPromise();
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${nodeId}]获取字段权限: ${JSON.stringify(response.data)}`);
    }
    return response.data?.fieldPermissionMap;
  }

  async delFieldPermission(headers: IAuthHeader, dstId: string, fieldIds: string[]) {
    // 删除字段权限
    await this.httpService.post(sprintf(this.DEL_FIELD_PERMISSION, { dstId }), null,
      { headers: HttpHelper.createAuthHeaders(headers), params: { fieldIds: fieldIds.join(',') }}).toPromise();
  }

  async capacityOverLimit(headers: IAuthHeader, spaceId: string): Promise<boolean> {
    const authHeaders = HttpHelper.createAuthHeaders(headers);
    // 没有头部, 内部调用暂时不涉及附件字段
    if (!authHeaders) {
      return false;
    }
    authHeaders['X-Space-Id'] = spaceId;
    const response = await this.httpService.get(sprintf(this.SPACE_CAPACITY, { spaceId }), {
      headers: authHeaders,
    }).toPromise();
    if (response.data?.isAllowOverLimit) {
      return false;
    }
    return response.data.totalCapacity - response.data.usedCapacity < 0;
  }

  async getUploadPresignedUrl(headers: IAuthHeader, nodeId: string, count: number): Promise<AssetVo[]> {
    const response = await lastValueFrom(this.httpService.get(this.GET_UPLOAD_PRESIGNED_URL, {
      headers: HttpHelper.createAuthHeaders(headers),
      params: { nodeId, count },
    }));
    return response.data;
  }

  async getAssetInfo(token: string): Promise<IAssetDTO | undefined> {
    const response = await lastValueFrom(this.httpService.get(this.GET_ASSET, {
      params: { token },
    }));
    return response.data;
  }

  async checkSpacePermission(headers: IAuthHeader): Promise<boolean> {
    const response = await this.httpService.get(this.SPACE_RESOURCE, {
      headers: HttpHelper.createAuthHeaders(headers),
    }).toPromise();
    const data: ISpacePermissionManage = response.data;
    if (!data.spaceResource) {
      return false;
    }
    const spacePermissions = data.spaceResource.permissions;
    return spacePermissions && spacePermissions.includes('MANAGE_WORKBENCH');
  }

  async fetchWidget(headers: IAuthHeader, widgetIds: string | string[], linkId?: string): Promise<WidgetMap> {
    const response = await this.httpService.get(this.GET_WIDGET, {
      headers: HttpHelper.createAuthHeaders(headers),
      params: {
        widgetIds,
        linkId,
      },
    }).toPromise();
    const data = response.data;
    return keyBy(data, 'id');
  }

  /**
   * 计算数表附件引用数
   * @param auth 客户端授权信息
   * @param ro 请求数据
   * @return
   * @author Zoe Zheng
   * @date 2021/5/31 2:11 下午
   */
  async calDstAttachCite(auth: IAuthHeader, ro: IOpAttachCiteRo) {
    // 重试一次
    if (!ro) {
      return null;
    }
    if (!ro.addToken?.length && !ro.removeToken?.length) {
      return null;
    }
    let error;
    const retryTimes = 1;
    for (let i = 0; i <= retryTimes; i++) {
      try {
        const res: any = await this.httpService.post(this.DST_ATTACH_CITE, ro).toPromise();
        // 返回code处理正常，直接退出，不重试
        if (res.code && res.code == CommonStatusCode.DEFAULT_SUCCESS_CODE) {
          break;
        }
        error = res.data || res;
      } catch (e) {
        this.logger.error('数表附件资源计算失败', { stack: e?.stack, code: e?.code, retryTimes: i });
        error = e;
      }
    }
    if (error) {
      return error;
    }
    return null;
  }

  /**
   * 获取指定空间的API用量信息
   * @param headers 授权信息
   * @param spaceId 空间站ID
   */
  getApiUsage(headers: IAuthHeader, spaceId: string): Promise<any> {
    return this.httpService.get(sprintf(this.API_USAGES, { spaceId }), {
      headers: HttpHelper.createAuthHeaders(headers),
    }).toPromise();
  }

  /**
   * 获取空间站列表
   * @param headers
   */
  async getSpaceList(headers: IAuthHeader): Promise<ISpaceInfo[]> {
    const response = await this.httpService.get(this.SPACE_LIST, {
      headers: HttpHelper.createAuthHeaders(headers),
    }).toPromise();
    return response.data;
  }

  /**
   * 获取文件节点详情
   * @param headers
   * @param spaceId
   * @param nodeId
   */
  async getNodeDetail(headers: IAuthHeader, nodeId: string, spaceId?: string): Promise<INode> {
    // 节点详情
    const nodeInfo = await this.httpService.get<INode>(this.NODE_DETAIL, {
      headers: HttpHelper.withSpaceIdHeader(
        HttpHelper.createAuthHeaders(headers),
        spaceId,
      ),
      params: {
        nodeIds: nodeId,
      },
    }).toPromise();

    const res = nodeInfo.data[0];
    // 文件夹子节点
    if (res.hasChildren) {
      const nodeChildren = await this.httpService.get<INode[]>(this.NODE_CHILDREN, {
        headers: HttpHelper.withSpaceIdHeader(
          HttpHelper.createAuthHeaders(headers),
          spaceId,
        ),
        params: {
          nodeId,
        },
      }).toPromise();
      res.children = nodeChildren.data;
    }
    return res;
  }

  /**
   * 获取文件路金
   * @param headers
   * @param spaceId
   */
  async getNodeList(headers: IAuthHeader, spaceId: string): Promise<INode[] | undefined> {
    // 查询 node list
    const response = await this.httpService.get<INode>(this.NODE_TREE, {
      headers: HttpHelper.withSpaceIdHeader(
        HttpHelper.createAuthHeaders(headers),
        spaceId,
      ),
      params: {
        depth: 1,
      },
    }).toPromise();
    return response.data.children;
  }

  /**
   * 获取空间的订阅信息视图
   * @param {string} spaceId
   * @returns {Promise<InternalSpaceSubscriptionView>}
   */
  async getSpaceSubscriptionView(spaceId: string): Promise<InternalSpaceSubscriptionView> {
    const response = await this.httpService.get<InternalSpaceSubscriptionView>(sprintf(this.SPACE_SUBSCRIPTION, { spaceId })).toPromise();
    return response.data;
  }

  /**
   * @description 获取空间站的详细信息
   * @param {string} spaceId
   * @returns {Promise<InternalSpaceUsageView>}
   */
  async getSpaceUsageView(spaceId: string): Promise<InternalSpaceUsageView> {
    const response = await this.httpService.get<InternalSpaceUsageView>(sprintf(this.SPACE_USAGES, { spaceId })).toPromise();
    return response.data;
  }

  public async createDatasheet(spaceId: string, headers: IAuthHeader,
    creareDatasheetRo: DatasheetCreateRo): Promise<InternalCreateDatasheetVo> {
    const url = sprintf(this.CREATE_DATASHEET_API_URL, { spaceId });
    const response = await this.httpService.post<InternalCreateDatasheetVo>(url, creareDatasheetRo, {
      headers: HttpHelper.withSpaceIdHeader(
        HttpHelper.createAuthHeaders(headers),
      )
    }).toPromise();
    return response.data;
  }

  public async deleteNode(spaceId: string, datasheetId: string, headers: IAuthHeader): Promise<InternalCreateDatasheetVo> {
    const url = sprintf(this.DELETE_NODE_API_URL, { spaceId, nodeId: datasheetId });
    const response = await this.httpService.post<InternalCreateDatasheetVo>(url, {}, {
      headers: HttpHelper.withSpaceIdHeader(
        HttpHelper.createAuthHeaders(headers),
      )
    }).toPromise();
    return response.data;
  }

  /**
   *
   * @param {IAuthHeader} headers
   * @param {string} spaceId
   * @param {string} nodeId
   * @param {"space_record_limit" | "datasheet_record_limit" | "max_gallery_views_in_space" |
   *  "max_kanban_views_in_space" | "space_gantt_limit" | "space_calendar_limit"} templateId
   * @param {number} specification
   * @param {number} usage
   */
  sendSubscribeRemind(
    headers: IAuthHeader,
    spaceId: string,
    nodeId: string,
    templateId: 'space_record_limit' |
      'datasheet_record_limit' |
      'max_gallery_views_in_space' |
      'max_kanban_views_in_space' |
      'space_gantt_limit' |
      'space_calendar_limit',
    specification: number,
    usage: number,
  ) {
    this.httpService.post<any>(this.SUBSCRIBE_REMIND, {
      nodeId,
      spaceId,
      specification: specification + '',
      templateId,
      usage: usage + '',
    }, {
      headers: HttpHelper.withSpaceIdHeader(
        HttpHelper.createAuthHeaders(headers),
      ),
    }).toPromise();
  }

  /**
   * 创建消息提醒
   * @param auth token
   * @param ro 通知参数
   * @return boolean
   */
  async createNotification(auth: IAuthHeader, ro: INotificationCreateRo[]) {
    try {
      const res: any = await this.httpService.post(this.CREATE_NOTIFICATION, ro).toPromise();
      // 返回code处理正常，直接退出，不重试
      if (res.code && res.code == CommonStatusCode.DEFAULT_SUCCESS_CODE) {
        return true;
      }
    } catch (e) {
      this.logger.error('创建通知失败', { stack: e?.stack, code: e?.code });
    }
    return false;
  }

  /**
   * 创建记录即将超限提醒
   * @param auth 头信息
   * @param templateId 通知模版ID
   * @param toUserId 通知用户ID
   * @param spaceId 空间ID
   * @param nodeId 数表ID
   * @param usage 用量
   * @param count 总量
   */
  createRecordLimitRemind(auth: IAuthHeader, templateId: string, toUserId: string[],
    spaceId: string, nodeId: string, count: number, usage?: number) {
    const ro: INotificationCreateRo = {
      spaceId,
      nodeId,
      toUserId,
      body: {
        extras: {
          usage,
          count,
        },
      },
      templateId,
    };
    return this.createNotification(auth, [ro]);
  }

  /**
   * @description 获取指定列的角色信息
   * @param {IAuthHeader} auth header
   * @param {string} spaceId 空间站ID
   * @param {string} nodeId 节点ID
   * @returns {Promise<INodeRoleMap>}
   */
  async getNodePermissionRoleList(auth: IAuthHeader, spaceId: string, nodeId: string): Promise<INodeRoleMap> {
    const url = sprintf(this.LIST_NODE_ROLES, { nodeId });
    const response = await this.httpService.get(
      url,
      { headers: HttpHelper.withSpaceIdHeader(HttpHelper.createAuthHeaders(auth), spaceId) }
    ).toPromise();
    return response.data;
  }

  /**
   * @description 获取指定列的角色信息
   * @param {IAuthHeader} auth header
   * @param {string} dstId 数表ID
   * @param {string} fieldId 列ID
   * @returns {Promise<IFieldPermissionRoleListData>}
   */
  async getFieldPermissionRoleList(auth: IAuthHeader, dstId: string, fieldId: string): Promise<IFieldPermissionRoleListData> {
    const url = sprintf(this.LIST_FIELD_ROLES, { dstId, fieldId });
    const response = await this.httpService.get(url, { headers: HttpHelper.createAuthHeaders(auth) }).toPromise();
    return response.data;
  }
}
