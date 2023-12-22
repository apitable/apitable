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

import { ConfigConstant } from '@apitable/core';

export interface IParams {
  spaceId?: string | null;
  nodeId?: string;
  viewId?: string;
  automationId?: string;
  recordId?: string;
  shareId?: string;
  categoryId?: string; // Template Category
  albumId?: string; // Template Topics
  templateId?: string;
  memberId?: string;
  formId?: string;
  pathInSpace?: string;
  feiShuPath?: 'admin_login' | 'bind_space' | 'bind_user' | 'err';
  invitePath?: 'mail/bindphone' | 'mail/mismatch' | 'mail/invalid' | 'link/invalid' | 'link/confirm' | 'mail/login' | 'link/login' | 'link' | 'mail';
  widgetId?: string;
  dingtalkPath?: 'login' | 'unbound_err' | 'social_login';
  dashboardId?: string;
  datasheetId?: string;
  wecomPath?: 'error' | 'integration' | 'integration/bind_success';
  wecomShopPath?: 'login' | 'unbound_err' | 'social_login';
  embedId?: string;
}

export interface IQuery {
  isMobile?: boolean;
  token?: string;
  inviteMailToken?: string;
  inviteLinkToken?: string;
  inviteLinkData?: string;
  loginType?: ConfigConstant.LoginTypes;
  reference?: string;
  inputDisabled?: boolean;
  phoneNumber?: string;
  phoneCode?: string;
  nickname?: string;
  quickLogin?: string;
  tenantKey?: string; // Corporate logo for Feishu logged-in users
  openId?: string; // Unique identification of the user in the application for Feishu
  appId?: string; // appId for Feishu
  inviteCode?: string;
  key?: string; // key for Feishu
  platform?: string; // Indicates the current platform, like Feishu
  msg?: string;
  domainName?: string; // Exclusive domain name
  suiteId?: string;
  corpId?: string;
  defaultName?: string;
  bizAppId?: string;
  errorCode?: string;
  activeRecordId?: string;
  sourceType?: string;
  widgetFullScreen?: string;
  suiteid?: string;
  auth_code?: string;
  home?: number; // Jump to the official website for parameters
  spaceId?: string;
  client_id?: string; // Spatial parameters of the privatized binding of Yufu
  nodeId?: string;
  comment?: number;
  improveType?: ConfigConstant.ImproveType;
  via?: string;
  recordId?: string;
  fieldId?: string;
}

export interface IOptions {
  shallow?: boolean;
}
