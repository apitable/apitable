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
  api,
  IDashboardWidgetMap,
  IDatasheetFieldPermission,
  IFieldPermissionMap,
  IFieldPermissionRoleListData,
  INode,
  ISpaceInfo,
  IUnitValue,
  IUserInfo,
} from '@apitable/core';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { skipUsageVerification } from 'app.environment';
import {
  InternalCreateDatasheetVo, InternalSpaceCreditUsageView,
  InternalSpaceAutomationRunsMessageView,
  InternalSpaceInfoVo,
  InternalSpaceStatisticsRo,
  InternalSpaceSubscriptionView,
  InternalSpaceUsageView,
} from 'database/interfaces';
import { DatasheetCreateRo } from 'fusion/ros/datasheet.create.ro';
import { AssetVo } from 'fusion/vos/attachment.vo';
import { keyBy } from 'lodash';
import { lastValueFrom } from 'rxjs';
import { CommonStatusCode } from 'shared/common';
import { CommonException, ServerException } from 'shared/exception';
import { HttpHelper } from 'shared/helpers';
import {
  IApiUsage,
  IAuthHeader,
  IHttpSuccessResponse,
  INotificationCreateRo,
  IOpAttachCiteRo,
  IUserBaseInfo,
  NodePermission,
  UserNodePermissionMap,
} from 'shared/interfaces';
import { IAssetDTO } from 'shared/services/rest/rest.interface';
import { sprintf } from 'sprintf-js';
import { responseCodeHandler } from './response.code.handler';
import { Method } from 'axios';
import { AttachmentTypeEnum } from '../../enums/attachment.enum';
import fs from 'fs';
import * as os from 'os';
import { SUBSCRIBE_INFO } from '@apitable/core/dist/modules/space/api/url.space';
const util = require('util');
const stream = require('stream');
const pipeline = util.promisify(stream.pipeline);

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
  private GET_USERS_NODE_PERMISSION = 'internal/nodes/%(nodeId)s/users/permissions';
  private GET_FIELD_PERMISSION = 'internal/node/%(nodeId)s/field/permission';
  private GET_MULTI_NODE_PERMISSION = 'internal/node/field/permission';
  private DEL_FIELD_PERMISSION = 'internal/datasheet/%(dstId)s/field/permission/disable';
  private SPACE_CAPACITY = 'internal/space/%(spaceId)s/capacity';
  private SPACE_USAGES = 'internal/space/%(spaceId)s/usages';
  private SPACE_CREDIT_USAGES = 'internal/space/%(spaceId)s/credit/usages';
  private SPACE_AUTOMATION_RUNS_MESSAGE = 'internal/space/%(spaceId)s/automation/run/message';
  private SPACE_SUBSCRIPTION = 'internal/space/%(spaceId)s/subscription';
  private CREATE_DATASHEET_API_URL = 'internal/spaces/%(spaceId)s/datasheets';
  private DELETE_NODE_API_URL = 'internal/spaces/%(spaceId)s/nodes/%(nodeId)s/delete';
  private API_USAGES = 'internal/space/%(spaceId)s/apiUsages';
  private API_RATE_LIMIT = 'internal/space/%(spaceId)s/apiRateLimit';
  private SPACE_LIST = 'space/list';
  private NODE_LIST = 'internal/spaces/%(spaceId)s/nodes';
  private NODE_CREATE = 'node/create';
  private NODE_TREE = 'node/tree';
  private NODE_DETAIL = 'node/get';
  private NODE_CHILDREN = 'node/children';

  // Get attachment asset
  private GET_UPLOAD_PRESIGNED_URL = 'internal/asset/upload/preSignedUrl';
  private GET_UPLOAD_CALLBACK = 'asset/upload/callback';
  private GET_ASSET = 'internal/asset/get';
  private GET_ASSET_SIGNATURES = 'internal/asset/signatures';
  // Calculate the references to datasheet OP attachments
  private DST_ATTACH_CITE = 'base/attach/cite';
  // Create notification
  private CREATE_NOTIFICATION = 'internal/notification/create';
  // List user infos with node permission
  // List user infos with the given column permission
  private LIST_FIELD_ROLES = 'datasheet/%(dstId)s/field/%(fieldId)s/listRole';
  private UNIT_LOAD_OR_SEARCH = 'internal/org/loadOrSearch';

  private SPACE_INFO = 'internal/space/%(spaceId)s';

  private SPACE_STATISTICS = 'internal/space/%(spaceId)s/statistics';

  private readonly logger = new Logger(RestService.name);

  constructor(private readonly httpService: HttpService) {
    // Intercept request
    this.httpService.axiosRef.interceptors.request.use(
      (config) => {
        config.headers!['X-Internal-Request'] = 'yes';
        config.headers!['X-Request-Start-Time'] = new Date().toISOString();
        return config;
      },
      (error) => {
        this.logger.error('Remote call failed', error);
        throw new ServerException(CommonException.SERVER_ERROR);
      },
    );
    this.httpService.axiosRef.interceptors.response.use(
      (res) => {
        const startTimeHeader = res.config.headers!['X-Request-Start-Time'];
        if (startTimeHeader) {
          const startTime = new Date(startTimeHeader);
          const duration = new Date().getTime() - startTime.getTime();
          // 在这里你可以记录或处理请求的耗时信息
          this.logger.log(`RPC Request uri:${res.config.url}, took duration: ${duration}ms`);
        }
        const restResponse = res.data as IHttpSuccessResponse<any>;
        if(containSkipHeader(res.config.headers)) {
          return res;
        }
        function containSkipHeader( headers: any) {
          if (!headers) {
            return false;
          }
          return headers['Skip-Interceptor'];
        }
        if (!restResponse.success) {
          this.logger.error(`Server request ${res.config.url} failed, error code:[${restResponse.code}], error:[${restResponse.message}]`);
          responseCodeHandler(restResponse.code);
        }
        return restResponse;
      },
      (error) => {
        // Request failed, may be network issue or HttpException
        this.logger.error('Request failed, may be network issue or server issue', error);
        throw new ServerException(CommonException.SERVER_ERROR);
      },
    );
  }

  /**
   * Obtain user info of the current user in a given space, including basic info and member info in the space.
   */
  async getUserInfoBySpaceId(headers: IAuthHeader, spaceId: string): Promise<IUserInfo> {
    const response = await lastValueFrom(
      this.httpService.get(this.GET_USER_INFO, {
        headers: HttpHelper.createAuthHeaders(headers),
        params: {
          spaceId,
        },
      }),
    );
    return response!.data;
  }

  async fetchMe(headers: IAuthHeader): Promise<IUserBaseInfo> {
    const response = await lastValueFrom(
      this.httpService.get(this.GET_ME, {
        headers: HttpHelper.createAuthHeaders(headers),
      }),
    );
    return response!.data;
  }

  async hasLogin(cookie: string): Promise<boolean> {
    const response = await lastValueFrom(
      this.httpService.get(this.SESSION, {
        headers: HttpHelper.createAuthHeaders({ cookie }),
      }),
    );
    return response!.data;
  }

  async getNodePermission(headers: IAuthHeader, nodeId: string, shareId?: string): Promise<NodePermission> {
    const response = await lastValueFrom(
      this.httpService.get(sprintf(this.GET_NODE_PERMISSION, { nodeId }), {
        headers: HttpHelper.createAuthHeaders(headers),
        params: { shareId },
      }),
    );
    return response!.data;
  }

  async getUsersNodePermission(headers: IAuthHeader, nodeId: string, userIds: string[]): Promise<UserNodePermissionMap> {
    const response = await lastValueFrom(
      this.httpService.post(
        sprintf(this.GET_USERS_NODE_PERMISSION, { nodeId }),
        {
          userIds,
        },
        {
          headers: HttpHelper.createAuthHeaders(headers),
        },
      ),
    );
    return response!.data;
  }

  async getFieldPermission(headers: IAuthHeader, nodeId: string, shareId?: string): Promise<IFieldPermissionMap> {
    const response = await lastValueFrom(
      this.httpService.get(sprintf(this.GET_FIELD_PERMISSION, { nodeId }), {
        headers: HttpHelper.createAuthHeaders(headers),
        params: { shareId, userId: headers.userId },
      }),
    );
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
    await lastValueFrom(
      this.httpService.post(sprintf(this.DEL_FIELD_PERMISSION, { dstId }), null, {
        headers: HttpHelper.createAuthHeaders(headers),
        params: { fieldIds: fieldIds.join(',') },
      }),
    );
  }

  async capacityOverLimit(headers: IAuthHeader, spaceId: string): Promise<boolean> {
    if (skipUsageVerification) {
      this.logger.log(`skipCapacityOverLimit:${spaceId}`);
      return false;
    }
    const authHeaders = HttpHelper.createAuthHeaders(headers);
    // No headers, internal request does not relate to attachment field temporarily
    if (!authHeaders) {
      return false;
    }
    authHeaders['X-Space-Id'] = spaceId;
    const response = await lastValueFrom(
      this.httpService.get(sprintf(this.SPACE_CAPACITY, { spaceId }), {
        headers: authHeaders,
      }),
    );
    if (response!.data?.isAllowOverLimit) {
      return false;
    }
    return response!.data.currentBundleCapacity - response!.data.usedCapacity < 0;
  }

  async uploadFile(buffer: any, uploadUrl: string, uploadRequestMethod: string, fileSize: number) {
    const r = await this.httpService.axiosRef.request({
      method: uploadRequestMethod as Method,
      url: uploadUrl,
      baseURL: '',
      data: buffer,
      validateStatus: null,
      headers: {
        'Skip-Interceptor': 'true',
        'Content-Length': fileSize.toString(),
      },
    });
    return r.status;
  }

  async downloadFile(host: string, url: string, fileName: string) {
    const response = await this.httpService.axiosRef.request(
      {
        url: host + '/' + url,
        method: 'GET',
        responseType: 'stream',
        baseURL: host,
        validateStatus: null,
        headers: {
          'Skip-Interceptor': 'true'
        },
      });
    const filePath = `${os.tmpdir()}/${fileName}`; // Replace with the desired file path and name
    const writer = fs.createWriteStream(filePath);
    await pipeline(response.data, writer);
    return filePath;
  }

  async getUploadPresignedUrl(headers: IAuthHeader, nodeId: string, count: number | undefined,
    type: number = AttachmentTypeEnum.DATASHEET_ATTACH): Promise<AssetVo[]> {
    const response = await lastValueFrom(
      this.httpService.get(this.GET_UPLOAD_PRESIGNED_URL, {
        headers: HttpHelper.createAuthHeaders(headers),
        params: { nodeId, count, type },
      }),
    );
    return response.data;
  }

  async getUploadCallBack(headers: IAuthHeader, resourceKeys: string[], type: number): Promise<AssetVo[]> {
    const response = await lastValueFrom(
      this.httpService.post(this.GET_UPLOAD_CALLBACK, { resourceKeys, type },
        {
          headers: HttpHelper.createAuthHeaders(headers),
        }
      )
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

  async fetchWidget(headers: IAuthHeader, widgetIds: string | string[], linkId?: string): Promise<IDashboardWidgetMap> {
    const response = await lastValueFrom(
      this.httpService.get(this.GET_WIDGET, {
        headers: HttpHelper.createAuthHeaders(headers),
        params: {
          widgetIds,
          linkId,
          userId: headers.userId,
        },
      }),
    );
    const data = response!.data;
    return keyBy(data, 'id');
  }

  /**
   * Calculates the number of references of attachments in a datasheet
   *
   * @param _auth Authorization info
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
        const res: any = await lastValueFrom(this.httpService.post(this.DST_ATTACH_CITE, ro));
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
  async getApiUsage(headers: IAuthHeader, spaceId: string): Promise<IApiUsage> {
    if (skipUsageVerification) {
      this.logger.log(`skipApiUsage:${spaceId}`);
      return Promise.resolve({
        isAllowOverLimit: true
      });
    }
    const res = await lastValueFrom(
      this.httpService.get(sprintf(this.API_USAGES, { spaceId }), {
        headers: HttpHelper.createAuthHeaders(headers),
      }),
    );

    return res.data;
  }

  /**
   * Obtain the api qps info of the given space
   *
   * @param headers Authorization info
   * @param spaceId space ID
   */
  async getApiRateLimit(headers: IAuthHeader, spaceId: string): Promise<any> {
    const response = await lastValueFrom(
      this.httpService.get(sprintf(this.API_RATE_LIMIT, { spaceId }), {
        headers: HttpHelper.createAuthHeaders(headers),
      }),
    );
    return response!.data;
  }

  async getSpaceList(headers: IAuthHeader): Promise<ISpaceInfo[]> {
    const response = await lastValueFrom(
      this.httpService.get(this.SPACE_LIST, {
        headers: HttpHelper.createAuthHeaders(headers),
      }),
    );
    return response!.data;
  }

  async createNode(headers: IAuthHeader, spaceId: string, payload: any): Promise<INode> {
    // create node
    const res = await lastValueFrom(
      this.httpService.post<INode>(this.NODE_CREATE, payload, {
        headers: HttpHelper.withSpaceIdHeader(HttpHelper.createAuthHeaders(headers), spaceId),
      })
    );
    return res.data;
  }

  async getNodeDetail(headers: IAuthHeader, nodeId: string, spaceId?: string): Promise<INode> {
    // node detail
    const nodeInfo = await lastValueFrom(
      this.httpService.get<INode>(this.NODE_DETAIL, {
        headers: HttpHelper.withSpaceIdHeader(HttpHelper.createAuthHeaders(headers), spaceId),
        params: {
          nodeIds: nodeId,
        },
      }),
    );

    const res = nodeInfo!.data[0];
    // children nodes of a directory
    if (res.hasChildren) {
      const nodeChildren = await lastValueFrom(
        this.httpService.get<INode[]>(this.NODE_CHILDREN, {
          headers: HttpHelper.withSpaceIdHeader(HttpHelper.createAuthHeaders(headers), spaceId),
          params: {
            nodeId,
          },
        }),
      );
      res.children = nodeChildren!.data;
    }
    return res;
  }

  async getNodesList(headers: IAuthHeader, spaceId: string, type: number, nodePermissions: number[], keyword?: string): Promise<INode[]> {
    // Obtain node list
    const url = sprintf(this.NODE_LIST, { spaceId });
    const response = await lastValueFrom(
      this.httpService.get<INode>(url, {
        headers: HttpHelper.createAuthHeaders(headers),
        params: {
          type,
          nodePermissions: nodePermissions.join(','),
          keyword,
        },
      }),
    );
    return response!.data as any;
  }

  async getNodeList(headers: IAuthHeader, spaceId: string): Promise<INode[] | undefined> {
    // Obtain node list
    const response = await lastValueFrom(
      this.httpService.get<INode>(this.NODE_TREE, {
        headers: HttpHelper.withSpaceIdHeader(HttpHelper.createAuthHeaders(headers), spaceId),
        params: {
          depth: 1,
        },
      }),
    );
    return response!.data.children;
  }

  /**
   * Gets subscription information for the space.
   *
   * @param {string} cookie
   * @param {string} spaceId
   * @returns {Promise<any>}
   */
  async getSpaceSubscriptionInfo(cookie: string, spaceId: string): Promise<any> {
    const response = await lastValueFrom(
      this.httpService.get<any>(SUBSCRIBE_INFO + spaceId, {
        headers: HttpHelper.withSpaceIdHeader(HttpHelper.createAuthHeaders({ cookie }), spaceId)
      })
    );
    return response!.data;
  }

  /**
   * Obtain the subscription of the space
   *
   * @param {string} spaceId
   * @returns {Promise<InternalSpaceSubscriptionView>}
   */
  async getSpaceSubscription(spaceId: string): Promise<InternalSpaceSubscriptionView> {
    if (skipUsageVerification) {
      this.logger.log(`skipSpaceSubscription:${spaceId}`);
      return {
        maxRowsPerSheet: -1,
        maxArchivedRowsPerSheet: -1,
        maxRowsInSpace: -1,
        maxGalleryViewsInSpace: -1,
        maxKanbanViewsInSpace: -1,
        maxGanttViewsInSpace: -1,
        maxCalendarViewsInSpace: -1,
        maxMessageCredits: 0,
        maxWidgetNums: -1,
        maxAutomationRunsNums: -1,
        allowEmbed: true,
        allowOrgApi: true,
      };
    }
    const response = await lastValueFrom(this.httpService.get<InternalSpaceSubscriptionView>(sprintf(this.SPACE_SUBSCRIPTION, { spaceId })));
    return response!.data;
  }

  /**
   * Obtain the usage of the space
   *
   * @param {string} spaceId
   * @returns {Promise<InternalSpaceUsageView>}
   */
  async getSpaceUsage(spaceId: string): Promise<InternalSpaceUsageView> {
    if (skipUsageVerification) {
      this.logger.log(`skipSpaceUsage:${spaceId}`);
      return {
        recordNums: 0,
        galleryViewNums: 0,
        kanbanViewNums: 0,
        ganttViewNums: 0,
        calendarViewNums: 0,
        usedCredit: 0,
      };
    }
    const response = await lastValueFrom(this.httpService.get<InternalSpaceUsageView>(sprintf(this.SPACE_USAGES, { spaceId })));
    return response!.data;
  }

  /**
   * Obtain the credit usage of the space
   * @param spaceId space id
   */
  async getSpaceCreditUsage(spaceId: string): Promise<InternalSpaceCreditUsageView> {
    const response = await lastValueFrom(this.httpService.get<InternalSpaceCreditUsageView>(sprintf(this.SPACE_CREDIT_USAGES, { spaceId })));
    return response!.data;
  }

  public async getSpaceAutomationRunsMessage(spaceId: string): Promise<InternalSpaceAutomationRunsMessageView> {
    const response = await lastValueFrom(this.httpService.get<InternalSpaceAutomationRunsMessageView>(sprintf(this.SPACE_AUTOMATION_RUNS_MESSAGE, { spaceId })));
    return response!.data;
  }

  public async createDatasheet(spaceId: string, headers: IAuthHeader, creareDatasheetRo: DatasheetCreateRo): Promise<InternalCreateDatasheetVo> {
    const url = sprintf(this.CREATE_DATASHEET_API_URL, { spaceId });
    const response = await lastValueFrom(
      this.httpService.post<InternalCreateDatasheetVo>(url, creareDatasheetRo, {
        headers: HttpHelper.withSpaceIdHeader(HttpHelper.createAuthHeaders(headers)),
      }),
    );
    return response!.data;
  }

  public async deleteNode(spaceId: string, datasheetId: string, headers: IAuthHeader): Promise<InternalCreateDatasheetVo> {
    const url = sprintf(this.DELETE_NODE_API_URL, { spaceId, nodeId: datasheetId });
    const response = await lastValueFrom(
      this.httpService.post<InternalCreateDatasheetVo>(
        url,
        {},
        {
          headers: HttpHelper.withSpaceIdHeader(HttpHelper.createAuthHeaders(headers)),
        },
      ),
    );
    return response!.data;
  }

  /**
   * Create notification
   *
   * @param _auth token
   * @param ro notification parameters
   * @return boolean
   */
  async createNotification(_auth: IAuthHeader, ro: INotificationCreateRo[]) {
    try {
      const res: any = await lastValueFrom(this.httpService.post(this.CREATE_NOTIFICATION, ro));
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
   * Obtain the node rules of the given field
   *
   * @param {IAuthHeader} auth header
   * @param {string} dstId datasheet ID
   * @param {string} fieldId field ID
   * @returns {Promise<IFieldPermissionRoleListData>}
   */
  async getFieldPermissionRoleList(auth: IAuthHeader, dstId: string, fieldId: string): Promise<IFieldPermissionRoleListData> {
    const url = sprintf(this.LIST_FIELD_ROLES, { dstId, fieldId });
    const response = await lastValueFrom(this.httpService.get(url, { headers: HttpHelper.createAuthHeaders(auth) }));
    return response!.data;
  }

  async unitLoadOrSearch(auth: IAuthHeader, spaceId: string, params: api.ILoadOrSearchArg & { userId: string }): Promise<IUnitValue[]> {
    const response = await lastValueFrom(
      this.httpService.get(this.UNIT_LOAD_OR_SEARCH, {
        headers: HttpHelper.withSpaceIdHeader(HttpHelper.createAuthHeaders(auth), spaceId),
        params,
      }),
    );
    return response.data;
  }

  async getSpaceInfo(spaceId: string): Promise<InternalSpaceInfoVo> {
    const response = await lastValueFrom(this.httpService.get(sprintf(this.SPACE_INFO, { spaceId })));
    return response.data;
  }

  async updateSpaceStatistics(spaceId: string, ro: InternalSpaceStatisticsRo): Promise<void> {
    await lastValueFrom(this.httpService.post(sprintf(this.SPACE_STATISTICS, { spaceId }), ro));
  }

  public async getSignatures(keys: string[]): Promise<Array<{ resourceKey: string; url: string }>> {
    const queryParams = new URLSearchParams();
    keys.forEach(key => queryParams.append('resourceKeys', key));

    const url = `${this.GET_ASSET_SIGNATURES}?${queryParams.toString()}`;

    const response = await lastValueFrom(
      this.httpService.get<Array<{ resourceKey: string; url: string }>>(url),
    );
    return response.data;
  }

}
