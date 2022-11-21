import { ConfigConstant } from '@apitable/core';

export interface IParams {
  spaceId?: string | null;
  nodeId?: string;
  viewId?: string;
  recordId?: string;
  shareId?: string;
  categoryId?: string; // Template Category
  albumId?: string; // Template Topics
  templateId?: string;
  memberId?: string;
  formId?: string;
  pathInSpace?: string;
  feiShuPath?: 'admin_login' | 'bind_space' | 'bind_user' | 'err';
  invitePath?:
    | 'mail/bindphone'
    | 'mail/mismatch'
    | 'mail/invalid'
    | 'link/invalid'
    | 'link/confirm'
    | 'mail/login'
    | 'link/login'
    | 'link'
    | 'mail';
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
}
