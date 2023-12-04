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

import { Navigation } from '@apitable/core';
import { Method } from 'pc/components/route_manager/const';
import { getNodeId, joinPath } from 'pc/components/route_manager/helper';
import { IParams, IQuery } from 'pc/components/route_manager/interface';
import { navigationToUrl } from 'pc/components/route_manager/navigation_to_url';
import { dashboardReg, mirrorIdReg } from 'pc/hooks/use_page_params';
import { getEnvVariables } from 'pc/utils/env';

interface IFunctionParams {
  path?: Navigation;
  params?: IParams;
  query?: IQuery;
  method?: Method;
  clearQuery?: boolean;
}

export type IFunctionResult = [string?, IQuery?, boolean?];

export type IRouterStrategy = {
  [k in Navigation]?: (info: IFunctionParams) => IFunctionResult;
};

export class RouterStrategy implements IRouterStrategy {
  static [Navigation.WORKBENCH] = ({ params, query, clearQuery }: IFunctionParams): IFunctionResult => {
    if (query?.reference) {
      navigationToUrl(query?.reference, { method: Method.Redirect, clearQuery: true });
      return [];
    }

    if (!params) {
      return ['/workbench', query, clearQuery];
    }

    const nodeId = params.nodeId || params.formId;
    let path: string;
    const defaultNodeId = getNodeId();
    const commonParams = ['/workbench', nodeId || defaultNodeId];

    if (dashboardReg.test(`/${nodeId}`)) {
      path = joinPath([...commonParams, params!.widgetId]);
    } else if (mirrorIdReg.test(`/${nodeId}`)) {
      path = joinPath([...commonParams, params.datasheetId, params.viewId, params.recordId || params.widgetId]);
    } else {
      path = joinPath([...commonParams, params.viewId, params.recordId || params.widgetId]);
    }
    return [path, query, clearQuery];
  };

  static [Navigation.SHARE_FAIL] = (): IFunctionResult => {
    return ['/share/fail'];
  };

  static [Navigation.NOT_FOUND] = (): IFunctionResult => {
    return ['/404'];
  };

  static [Navigation.MEMBER_DETAIL] = ({ params }: IFunctionParams): IFunctionResult => {
    return [`/org/${params?.memberId}`];
  };

  static [Navigation.EMBED_AI_SPACE] = ({ params }: IFunctionParams) => {
    return [`/embed/ai/${params?.shareId}/${params?.nodeId}`];
  };

  static [Navigation.SHARE_SPACE] = ({ params, query, clearQuery }: IFunctionParams) => {
    let path;
    const commonParams = ['/share', params?.shareId, params?.nodeId];
    if (dashboardReg.test(`/${params?.nodeId}`)) {
      path = joinPath([...commonParams, params!.widgetId]);
    } else if (mirrorIdReg.test(`/${params?.nodeId}`)) {
      path = joinPath([...commonParams, params!.datasheetId, params!.viewId, params!.recordId]);
    } else {
      path = joinPath([...commonParams, params?.viewId, params?.recordId || params?.widgetId]);
    }
    return [path, query, clearQuery];
  };

  static [Navigation.EMBED_SPACE] = ({ params, query, clearQuery }: IFunctionParams) => {
    let path;
    const commonParams = ['/embed', params?.embedId, params?.nodeId];
    if (dashboardReg.test(`/${params?.nodeId}`)) {
      path = joinPath([...commonParams, params!.widgetId]);
    } else if (mirrorIdReg.test(`/${params?.nodeId}`)) {
      path = joinPath([...commonParams, params!.datasheetId, params!.viewId, params!.recordId]);
    } else {
      path = joinPath([...commonParams, params?.viewId, params?.recordId || params?.widgetId]);
    }
    return [path, query, clearQuery];
  };

  static [Navigation.TEMPLATE] = ({ params, query, clearQuery }: IFunctionParams): IFunctionResult => {
    let path;
    const commonParams = ['/template', params?.categoryId, params?.templateId || params?.albumId, params?.nodeId];
    if (dashboardReg.test(`/${params?.nodeId}`)) {
      path = joinPath([...commonParams, params?.widgetId]);
    } else if (mirrorIdReg.test(`/${params?.nodeId}`)) {
      path = joinPath([...commonParams, params!.datasheetId, params!.viewId, params!.recordId]);
    } else {
      path = joinPath([...commonParams, params?.viewId, params?.recordId || params?.widgetId]);
    }
    return [path, query, clearQuery];
  };

  static [Navigation.SPACE_MANAGE] = ({ params, query, clearQuery }: IFunctionParams): IFunctionResult => {
    const path = joinPath(['/management', params!.pathInSpace]);
    return [path, query, clearQuery];
  };

  static [Navigation.TRASH] = (): IFunctionResult => {
    return ['/workbench/trash'];
  };

  static [Navigation.SPACE] = ({ clearQuery }: IFunctionParams): IFunctionResult => {
    return ['/workbench', undefined, clearQuery];
  };

  static [Navigation.WECOM_SHOP_CALLBACK] = ({ clearQuery, query }: IFunctionParams): IFunctionResult => {
    return ['/user/wecom_shop/callback', query, clearQuery];
  };

  static [Navigation.INVITE] = ({ params, query }: IFunctionParams): IFunctionResult => {
    if (!params!.invitePath) {
      return [];
    }
    return [`/invite/${params!.invitePath}`, query, true];
  };

  static [Navigation.WECOM] = ({ params, query, clearQuery }: IFunctionParams): IFunctionResult => {
    if (!params?.wecomPath) {
      return [];
    }
    return [`/user/wecom/${params!.wecomPath}`, query, clearQuery];
  };

  static [Navigation.FEISHU] = ({ params, query }: IFunctionParams): IFunctionResult => {
    if (!params?.feiShuPath) {
      return [];
    }
    return [`/user/feishu/${params!.feiShuPath}`, query, true];
  };

  static [Navigation.DINGTALK] = ({ params, query, clearQuery }: IFunctionParams): IFunctionResult => {
    if (!params?.dingtalkPath) {
      return ['/user/dingtalk_callback', query, clearQuery];
    }
    return [`/user/dingtalk/${params!.dingtalkPath}`, query, clearQuery];
  };

  static [Navigation.RESET_PWD] = (): IFunctionResult => {
    return ['/user/reset_password'];
  };

  static [Navigation.CREATE_SPACE] = (): IFunctionResult => {
    return ['/user/create_space'];
  };

  static [Navigation.INVITATION_VALIDATION] = ({ query }: IFunctionParams): IFunctionResult => {
    return ['/user/invitation_validation', query];
  };

  static [Navigation.IMPROVING_INFO] = ({ query }: IFunctionParams): IFunctionResult => {
    return ['/user/improving_info', query, true];
  };

  static [Navigation.SETTING_NICKNAME] = ({ query }: IFunctionParams): IFunctionResult => {
    return ['/user/set_nickname', query, true];
  };

  static [Navigation.APPLY_LOGOUT] = ({ query }: IFunctionParams): IFunctionResult => {
    return ['/user/apply_logout', query, true];
  };

  static [Navigation.LOGIN] = ({ query }: IFunctionParams): IFunctionResult => {
    const { LOGIN_ON_AUTHORIZATION_REDIRECT_TO_URL } = getEnvVariables();
    if (LOGIN_ON_AUTHORIZATION_REDIRECT_TO_URL) {
      location.href = LOGIN_ON_AUTHORIZATION_REDIRECT_TO_URL + encodeURIComponent(location.href);
      return [];
    }
    return ['/login', query, true];
  };

  static [Navigation.HOME] = ({ query }: IFunctionParams): IFunctionResult => {
    // store.dispatch(StoreActions.setActiveSpaceId(''));
    if (query?.reference) {
      navigationToUrl(query?.reference, { method: Method.Redirect, clearQuery: true });
      return [];
    }
    return ['/', query, true];
  };
}
