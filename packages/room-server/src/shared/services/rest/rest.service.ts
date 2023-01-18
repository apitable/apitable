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
  IDatasheetFieldPermission,
  IFieldPermissionMap,
  IFieldPermissionRoleListData,
  INode,
  INodeRoleMap,
  ISpaceInfo,
  ISpacePermissionManage,
  IUnitValue,
  IUserInfo,
} from '@apitable/core';
import { ILoadOrSearchArg } from '@apitable/core/dist/modules/shared/api/api.interface';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InternalCreateDatasheetVo, InternalSpaceSubscriptionView, InternalSpaceUsageView, WidgetMap } from 'database/interfaces';
import { DatasheetCreateRo } from 'fusion/ros/datasheet.create.ro';
import { AssetVo } from 'fusion/vos/attachment.vo';
import { keyBy } from 'lodash';
import { lastValueFrom } from 'rxjs';
import { CommonStatusCode, InjectLogger } from 'shared/common';
import { CommonException, PermissionException, ServerException } from 'shared/exception';
import { HttpHelper } from 'shared/helpers';
import { IAuthHeader, IHttpSuccessResponse, INotificationCreateRo, IOpAttachCiteRo, IUserBaseInfo, NodePermission } from 'shared/interfaces';
import { IAssetDTO } from 'shared/services/rest/rest.interface';
import { sprintf } from 'sprintf-js';
import { Logger } from 'winston';

/**
 * RestApi service
 */
@Injectable()
export class RestService {
  private GET_ME = 'internal/user/get/me'; // user basic profile
  private GET_USER_INFO = 'user/me'; // user basic profile + space member profile
  private SESSION = 'internal/user/session';
  private GET_WIDGET = 'widget/get';
  private GET_NODE_PERMISSION = 'internal/node/%(nodeId)s/permission';
  private GET_FIELD_PERMISSION = 'internal/node/%(nodeId)s/field/permission';
  private GET_MULTI_NODE_PERMISSION = 'internal/node/field/permission';
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

  // Get attachment asset
  private GET_UPLOAD_PRESIGNED_URL = 'internal/asset/upload/preSignedUrl';
  private GET_ASSET = 'internal/asset/get';
  // Calculate the references to datasheet OP attachments
  private DST_ATTACH_CITE = 'base/attach/cite';
  private SUBSCRIBE_REMIND = 'internal/subscribe/remind';
  // Create notification
  private CREATE_NOTIFICATION = 'internal/notification/create';
  // List user infos with node permission
  private LIST_NODE_ROLES = 'node/listRole?nodeId=%(nodeId)s';
  // List user infos with the given column permission
  private LIST_FIELD_ROLES = 'datasheet/%(dstId)s/field/%(fieldId)s/listRole';
  private UNIT_LOAD_OR_SEARCH = 'internal/org/loadOrSearch';

  constructor(private readonly httpService: HttpService, @InjectLogger() private readonly logger: Logger) {
    // Intercept request
    this.httpService.axiosRef.interceptors.request.use(
      config => {
        this.logger.info('Remote call address:' + config.url);
        config.headers!['X-Internal-Request'] = 'yes';
        return config;
      },
      error => {
        this.logger.error('Remote call failed', error);
        throw new ServerException(CommonException.SERVER_ERROR);
      },
    );
    this.httpService.axiosRef.interceptors.response.use(
      res => {
        const restResponse = res.data as IHttpSuccessResponse<any>;
        if (!restResponse.success) {
          this.logger.error(`Server request failed, error code:[${restResponse.code}], error:[${restResponse.message}]`);
          // 403 not in this space
          if (restResponse.code === 201 || restResponse.code === 403) {
            throw new ServerException(CommonException.UNAUTHORIZED);
          }
          // node not exist
          if (restResponse.code === 600) {
            throw new ServerException(PermissionException.NODE_NOT_EXIST);
          }
          // access to node is denied
          if (restResponse.code === 601) {
            throw new ServerException(PermissionException.ACCESS_DENIED);
          }
          // operation on node is denied
          if (restResponse.code === 602) {
            throw new ServerException(PermissionException.OPERATION_DENIED);
          }
          if (restResponse.code === PermissionException.SPACE_NOT_EXIST.code) {
            throw new ServerException(PermissionException.SPACE_NOT_EXIST);
          }
          if (restResponse.code === PermissionException.NO_ALLOW_OPERATE.code) {
            throw new ServerException(PermissionException.NO_ALLOW_OPERATE);
          }
          throw new ServerException(CommonException.SERVER_ERROR);
        }
        return restResponse;
      },
      error => {
        // Request failed, may be network issue or HttpException
        this.logger.error('Request failed, may be network issue or server issue.');
        this.logger.error(error);
        throw new ServerException(CommonException.SERVER_ERROR);
      },
    );
  }

  /**
   * Obtain user info of the current user in a given space, including basic info and member info in the space.
   */
  async getUserInfoBySpaceId(headers: IAuthHeader, spaceId: string): Promise<IUserInfo> {
    const response = await this.httpService
      .get(this.GET_USER_INFO, {
        headers: HttpHelper.createAuthHeaders(headers),
        params: {
          spaceId,
        },
      })
      .toPromise();
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`Obtain self user info in a space : ${JSON.stringify(response!.data)}`);
    }
    return response!.data;
  }

  async fetchMe(headers: IAuthHeader): Promise<IUserBaseInfo> {
    const response = await this.httpService
      .get(this.GET_ME, {
        headers: HttpHelper.createAuthHeaders(headers),
      })
      .toPromise();
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`Obtain self own info: ${JSON.stringify(response!.data)}`);
    }
    return response!.data;
  }

  async hasLogin(cookie: string): Promise<boolean> {
    const response = await this.httpService
      .get(this.SESSION, {
        headers: HttpHelper.createAuthHeaders({ cookie }),
      })
      .toPromise();
    return response!.data;
  }

  async getNodePermission(headers: IAuthHeader, nodeId: string, shareId?: string): Promise<NodePermission> {
    const response = await this.httpService
      .get(sprintf(this.GET_NODE_PERMISSION, { nodeId }), {
        headers: HttpHelper.createAuthHeaders(headers),
        params: { shareId },
      })
      .toPromise();
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${nodeId}] Obtain node permission: ${JSON.stringify(response!.data)}`);
    }
    return response!.data;
  }

  async getFieldPermission(headers: IAuthHeader, nodeId: string, shareId?: string): Promise<IFieldPermissionMap> {
    const response = await this.httpService
      .get(sprintf(this.GET_FIELD_PERMISSION, { nodeId }), {
        headers: HttpHelper.createAuthHeaders(headers),
        params: { shareId, userId: headers.userId },
      })
      .toPromise();
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${nodeId}] Obtain field permission: ${JSON.stringify(response!.data)}`);
    }
    return response!.data?.fieldPermissionMap;
  }

  async getNodesFieldPermission(headers: IAuthHeader, nodeIds: string[]): Promise<IDatasheetFieldPermission[]> {
    const response = await lastValueFrom(
      this.httpService.post(
        this.GET_MULTI_NODE_PERMISSION,
        { nodeIds, userId: headers.userId },
        {
          headers: HttpHelper.createAuthHeaders(headers),
        },
      ),
    );
    return response.data;
  }

  async delFieldPermission(headers: IAuthHeader, dstId: string, fieldIds: string[]) {
    await this.httpService
      .post(sprintf(this.DEL_FIELD_PERMISSION, { dstId }), null, {
        headers: HttpHelper.createAuthHeaders(headers),
        params: { fieldIds: fieldIds.join(',') },
      })
      .toPromise();
  }

  async capacityOverLimit(headers: IAuthHeader, spaceId: string): Promise<boolean> {
    const authHeaders = HttpHelper.createAuthHeaders(headers);
    // No headers, internal request does not relate to attachment field temporarily
    if (!authHeaders) {
      return false;
    }
    authHeaders['X-Space-Id'] = spaceId;
    const response = await this.httpService
      .get(sprintf(this.SPACE_CAPACITY, { spaceId }), {
        headers: authHeaders,
      })
      .toPromise();
    if (response!.data?.isAllowOverLimit) {
      return false;
    }
    return response!.data.currentBundleCapacity - response!.data.usedCapacity < 0;
  }

  async getUploadPresignedUrl(headers: IAuthHeader, nodeId: string, count: number | undefined): Promise<AssetVo[]> {
    const response = await lastValueFrom(
      this.httpService.get(this.GET_UPLOAD_PRESIGNED_URL, {
        headers: HttpHelper.createAuthHeaders(headers),
        params: { nodeId, count },
      }),
    );
    return response.data;
  }

  async getAssetInfo(token: string): Promise<IAssetDTO | undefined> {
    const response = await lastValueFrom(
      this.httpService.get(this.GET_ASSET, {
        params: { token },
      }),
    );
    return response.data;
  }

  async checkSpacePermission(headers: IAuthHeader): Promise<boolean> {
    const response = await this.httpService
      .get(this.SPACE_RESOURCE, {
        headers: HttpHelper.createAuthHeaders(headers),
      })
      .toPromise();
    const data: ISpacePermissionManage = response!.data;
    if (!data.spaceResource) {
      return false;
    }
    const spacePermissions = data.spaceResource.permissions;
    return spacePermissions && spacePermissions.includes('MANAGE_WORKBENCH');
  }

  async fetchWidget(headers: IAuthHeader, widgetIds: string | string[], linkId?: string): Promise<WidgetMap> {
    const response = await this.httpService
      .get(this.GET_WIDGET, {
        headers: HttpHelper.createAuthHeaders(headers),
        params: {
          widgetIds,
          linkId,
        },
      })
      .toPromise();
    const data = response!.data;
    return keyBy(data, 'id');
  }

  /**
   * Calculates the number of references of attachments in a datasheet
   *
   * @param auth Authorization info
   * @param ro request parameters
   * @return
   * @author Zoe Zheng
   * @date 2021/5/31 2:11 PM
   */
  async calDstAttachCite(_auth: IAuthHeader, ro: IOpAttachCiteRo) {
    // retry once
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
        // Successful response, quit retry
        if (res.code && res.code == CommonStatusCode.DEFAULT_SUCCESS_CODE) {
          break;
        }
        error = res.data || res;
      } catch (e) {
        this.logger.error('Datasheet attachment reference calculation failed', { stack: (e as any)?.stack, code: (e as any)?.code, retryTimes: i });
        error = e;
      }
    }
    if (error) {
      return error;
    }
    return null;
  }

  /**
   * Obtain the capacity info of the given space
   *
   * @param headers Authorization info
   * @param spaceId space ID
   */
  getApiUsage(headers: IAuthHeader, spaceId: string): Promise<any> {
    return this.httpService
      .get(sprintf(this.API_USAGES, { spaceId }), {
        headers: HttpHelper.createAuthHeaders(headers),
      })
      .toPromise();
  }

  async getSpaceList(headers: IAuthHeader): Promise<ISpaceInfo[]> {
    const response = await this.httpService
      .get(this.SPACE_LIST, {
        headers: HttpHelper.createAuthHeaders(headers),
      })
      .toPromise();
    return response!.data;
  }

  async getNodeDetail(headers: IAuthHeader, nodeId: string, spaceId?: string): Promise<INode> {
    // node detail
    const nodeInfo = await this.httpService
      .get<INode>(this.NODE_DETAIL, {
        headers: HttpHelper.withSpaceIdHeader(HttpHelper.createAuthHeaders(headers), spaceId),
        params: {
          nodeIds: nodeId,
        },
      })
      .toPromise();

    const res = nodeInfo!.data[0];
    // children nodes of a directory
    if (res.hasChildren) {
      const nodeChildren = await this.httpService
        .get<INode[]>(this.NODE_CHILDREN, {
          headers: HttpHelper.withSpaceIdHeader(HttpHelper.createAuthHeaders(headers), spaceId),
          params: {
            nodeId,
          },
        })
        .toPromise();
      res.children = nodeChildren!.data;
    }
    return res;
  }

  async getNodeList(headers: IAuthHeader, spaceId: string): Promise<INode[] | undefined> {
    // Obtain node list
    const response = await this.httpService
      .get<INode>(this.NODE_TREE, {
        headers: HttpHelper.withSpaceIdHeader(HttpHelper.createAuthHeaders(headers), spaceId),
        params: {
          depth: 1,
        },
      })
      .toPromise();
    return response!.data.children;
  }

  /**
   * Obtain the subscription of the space
   *
   * @param {string} spaceId
   * @returns {Promise<InternalSpaceSubscriptionView>}
   */
  async getSpaceSubscription(spaceId: string): Promise<InternalSpaceSubscriptionView> {
    const response = await this.httpService.get<InternalSpaceSubscriptionView>(sprintf(this.SPACE_SUBSCRIPTION, { spaceId })).toPromise();
    return response!.data;
  }

  /**
   * Obtain the usage of the space
   *
   * @param {string} spaceId
   * @returns {Promise<InternalSpaceUsageView>}
   */
  async getSpaceUsage(spaceId: string): Promise<InternalSpaceUsageView> {
    const response = await this.httpService.get<InternalSpaceUsageView>(sprintf(this.SPACE_USAGES, { spaceId })).toPromise();
    return response!.data;
  }

  public async createDatasheet(spaceId: string, headers: IAuthHeader, creareDatasheetRo: DatasheetCreateRo): Promise<InternalCreateDatasheetVo> {
    const url = sprintf(this.CREATE_DATASHEET_API_URL, { spaceId });
    const response = await this.httpService
      .post<InternalCreateDatasheetVo>(url, creareDatasheetRo, {
        headers: HttpHelper.withSpaceIdHeader(HttpHelper.createAuthHeaders(headers)),
      })
      .toPromise();
    return response!.data;
  }

  public async deleteNode(spaceId: string, datasheetId: string, headers: IAuthHeader): Promise<InternalCreateDatasheetVo> {
    const url = sprintf(this.DELETE_NODE_API_URL, { spaceId, nodeId: datasheetId });
    const response = await this.httpService
      .post<InternalCreateDatasheetVo>(
        url,
        {},
        {
          headers: HttpHelper.withSpaceIdHeader(HttpHelper.createAuthHeaders(headers)),
        },
      )
      .toPromise();
    return response!.data;
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
    templateId:
      | 'space_record_limit'
      | 'datasheet_record_limit'
      | 'max_gallery_views_in_space'
      | 'max_kanban_views_in_space'
      | 'space_gantt_limit'
      | 'space_calendar_limit',
    specification: number,
    usage: number,
  ) {
    this.httpService
      .post<any>(
        this.SUBSCRIBE_REMIND,
        {
          nodeId,
          spaceId,
          specification: specification + '',
          templateId,
          usage: usage + '',
        },
        {
          headers: HttpHelper.withSpaceIdHeader(HttpHelper.createAuthHeaders(headers)),
        },
      )
      .toPromise();
  }

  /**
   * Create notification
   *
   * @param auth token
   * @param ro notification parameters
   * @return boolean
   */
  async createNotification(_auth: IAuthHeader, ro: INotificationCreateRo[]) {
    try {
      const res: any = await this.httpService.post(this.CREATE_NOTIFICATION, ro).toPromise();
      // Successful response, quit retry
      if (res.code && res.code == CommonStatusCode.DEFAULT_SUCCESS_CODE) {
        return true;
      }
    } catch (e) {
      this.logger.error('Creating notification failed', { stack: (e as any)?.stack, code: (e as any)?.code });
    }
    return false;
  }

  /**
   * Create a notification about that the number of record is about to exceed limit.
   *
   * @param auth authorization
   * @param templateId notified template ID
   * @param toUserId notified user ID
   * @param spaceId space ID
   * @param nodeId datasheet ID
   * @param usage usage
   * @param count usage capacity
   */
  createRecordLimitRemind(auth: IAuthHeader, templateId: string, toUserId: string[], spaceId: string, nodeId: string, count: number, usage?: number) {
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
   * Obtain the node rules of the given node
   *
   * @param {IAuthHeader} auth header
   * @param {string} spaceId space ID
   * @param {string} nodeId node ID
   * @returns {Promise<INodeRoleMap>}
   */
  async getNodePermissionRoleList(auth: IAuthHeader, spaceId: string, nodeId: string): Promise<INodeRoleMap> {
    const url = sprintf(this.LIST_NODE_ROLES, { nodeId });
    const response = await this.httpService
      .get(url, { headers: HttpHelper.withSpaceIdHeader(HttpHelper.createAuthHeaders(auth), spaceId) })
      .toPromise();
    return response!.data;
  }

  /**
   * Obtain the node rules of the given field
   *
   * @param {IAuthHeader} auth header
   * @param {string} dstId datasheet ID
   * @param {string} fieldId field ID
   * @returns {Promise<IFieldPermissionRoleListData>}
   */
  async getFieldPermissionRoleList(auth: IAuthHeader, dstId: string, fieldId: string): Promise<IFieldPermissionRoleListData> {
    const url = sprintf(this.LIST_FIELD_ROLES, { dstId, fieldId });
    const response = await this.httpService.get(url, { headers: HttpHelper.createAuthHeaders(auth) }).toPromise();
    return response!.data;
  }

  async unitLoadOrSearch(auth: IAuthHeader, spaceId: string, params: ILoadOrSearchArg & { userId: string }): Promise<IUnitValue[]> {
    const response = await lastValueFrom(
      this.httpService.get(this.UNIT_LOAD_OR_SEARCH, {
        headers: HttpHelper.withSpaceIdHeader(HttpHelper.createAuthHeaders(auth), spaceId),
        params,
      }),
    );
    return response.data;
  }
}
