/** 组成路由pathname所需要的属性 */
import { ConfigConstant } from '@vikadata/core';

export interface IParams {
  spaceId?: string | null;
  nodeId?: string;
  viewId?: string;
  recordId?: string;
  shareId?: string;
  categoryId?: string; // 模板分类
  albumId?: string; // 模板专题
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
}

/** 组成query所需要的属性 */
export interface IQuery {
  isMobile?: boolean;
  token?: string;
  inviteMailToken?: string;
  inviteLinkToken?: string;
  loginType?: ConfigConstant.LoginTypes;
  reference?: string; // 用来记录需要源URL
  inputDisabled?: boolean;
  phoneNumber?: string;
  phoneCode?: string;
  nickname?: string;
  quickLogin?: string;
  tenantKey?: string; // 飞书登录用户的企业标识
  openId?: string; // 飞书的用户在应用的唯一标识
  appId?: string; // 飞书
  inviteCode?: string;
  key?: string; // 飞书
  platform?: string; // 表示当前平台，比如（飞书）
  msg?: string;
  domainName?: string; // 专属域名
  suiteId?: string;
  corpId?: string;
  defaultName?: string;
  bizAppId?: string;
  errorCode?: string; // 错误 code
  activeRecordId?: string;
  sourceType?: string; // 来源类型
  widgetFullScreen?: string;
  suiteid?: string;
  auth_code?: string;
  home?: number; // 跳转官网的参数
  spaceId?: string;
  client_id?: string; // 玉符私有化绑定的空间参数
  nodeId?: string;
}
