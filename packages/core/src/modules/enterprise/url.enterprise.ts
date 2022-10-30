
export const DINGTALK_LOGIN_CALLBACK = '/dingtalk/login/callback';
export const QQ_LOGIN_CALLBACK = '/tencent/web/callback';
export const WECHAT_LOGIN_CALLBACK = '/wechat/mp/web/callback';
export const WECOM_LOGIN_CALLBACK = '/social/wecom/user/login';

export const FEISHU_LOGIN_CALLBACK = '/social/feishu/auth/callback';

// ================ Wechat ======================

/**
 * Get wechat public account QR code
 */
export const OFFICIAL_ACCOUNTS_QRCODE = '/wechat/mp/qrcode';

/**
  * Poll check wechat public account QR code
  */
export const OFFICIAL_ACCOUNTS_POLL = '/wechat/mp/poll';
 
/**
  * Poll check wechat mini program QR code
  */
export const POLL = 'wechat/miniapp/poll';
 
/**
  * Get wechat mini program QR code
  */
export const WECHAT_QR_CODE = 'wechat/miniapp/macode';
 
/**
  * Wechat miniapp operation page
  */
export const WECHAT_OPERATE = 'wechat/miniapp/operate';
 
/**
  * Get Wechat Signature
  */
export const WECHAT_MP_SIGNATURE = '/wechat/mp/signature';
// ================ WeChat related =======================

// =============== Third-party platform application related =======================
export const SOCIAL_FEISHU_USER_AUTH = '/social/feishu/user/auth';
export const SOCIAL_FEISHU_CHECK_ADMIN = '/social/feishu/checkUserAdmin';
export const SOCIAL_FEISHU_CHECK_TENANT_BIND = '/social/feishu/checkTenantBind';
export const SOCIAL_FEISHU_BIND_USER = '/social/feishu/bindUser';
export const SOCIAL_FEISHU_TENANT_INFO = '/social/feishu/tenant/:tenantKey/info';
export const SOCIAL_FEISHU_BIND_SPACE = '/social/feishu/tenant/:tenantKey/bindSpace';
export const SOCIAL_FEISHU_USER_LOGIN = '/social/feishu/user/login';
export const SOCIAL_FEISHU_TENANT_BIND_DETAIL = '/social/feishu/tenant/:tenantKey/bind/detail';

export const SOCIAL_FEISHU_TENANT = '/social/feishu/tenant/:tenantKey';
export const SOCIAL_CHANGE_ADMIN = '/social/feishu/changeAdmin';
export const SOCIAL_WECOM_CHECK_CONFIG = '/social/wecom/check/config';
export const SOCIAL_WECOM_BIND_CONFIG = '/social/wecom/bind/:configSha/config';
export const SOCIAL_WECOM_DOMAIN_CHECK = '/social/wecom/hotsTransformIp';
export const SOCIAL_WECOM_GET_CONFIG = '/social/wecom/get/config';
export const WECOM_REFRESH_ORG = '/social/wecom/refresh/contact';
export const WECOM_AGENT_BINDSPACE = '/social/wecom/agent/get/bindSpace';

export const SOCIAL_DINGTALK_USER_LOGIN = '/social/dingtalk/suite/:suiteId/user/login';
export const SOCIAL_DINGTALK_BIND_SPACE = '/social/dingtalk/suite/:suiteId/bindSpace';
export const SOCIAL_DINGTALK_ADMIN_DETAIL = '/social/dingtalk/suite/:suiteId/detail';
export const SOCIAL_DINGTALK_ADMIN_LOGIN = '/social/dingtalk/suite/:suiteId/admin/login';
export const SOCIAL_DINGTALK_CHANGE_ADMIN = '/social/dingtalk/suite/:suiteId/changeAdmin';
export const SOCIAL_DINGTALK_SKU = '/social/dingtalk/skuPage';
export const SOCIAL_DINGTALK_CONFIG = '/social/dingtalk/ddconfig';
// Get the integrated tenant environment configuration
export const SOCIAL_TENANT_ENV = '/social/tenant/env';

// DingTalk scan code login callback
export const DINGTALK_H5_USER_LOGIN = '/social/dingtalk/agent/:agentId/user/login';
export const DINGTALK_H5_BIND_SPACE = '/social/dingtalk/agent/:agentId/bindSpace';
export const DINGTALK_REFRESH_ORG = '/social/dingtalk/agent/refresh/contact'; 

// ============ Tencent iDaaS related start =====================//
export const GET_IDASS_LOGIN_URL = '/idaas/auth/login'; // Get IDass login jump address
export const IDAAS_LOGIN_CALLBACK = '/idaas/auth/callback';
export const IDAAS_CONTACT_SYNC = 'idaas/contact/sync';
export const IDAAS_GET_SPACE_BIND_INFO = '/idaas/auth/:spaceId/bindInfo';
// ============ Tencent iDaaSrelated end =====================//

// ================ Wecom App Store related start =======================

// poc version synchronization organization structure members
export const SYNC_ORG_MEMBERS = 'social/oneaccess/copyTeamAndMembers';

export const GET_WECOM_TENANT_INFO = 'social/wecom/isv/datasheet/tenant/info'; // Get tenant binding information
// Get the space station information bound by the third-party application of WECOM
export const GET_WECOM_SPACE_INFO = 'social/wecom/isv/datasheet/login/info'; 
export const POST_WECOM_AUTO_LOGIN = 'social/wecom/isv/datasheet/login/code'; // Wecom third-party jump automatic login
export const POST_WECOM_SCAN_LOGIN = 'social/wecom/isv/datasheet/login/authCode'; // Enterprise WeChat scan code login
export const POST_WECOM_LOGIN_ADMIN = 'social/wecom/isv/datasheet/login/adminCode'; // Automatically log in to the management page of Qiwei Jump
export const POST_WECOM_CHANGE_ADMIN = 'social/wecom/isv/datasheet/admin/change'; // Wecom changes the main administrator of the space station
export const POST_WECOM_UNAUTHMEMBER_INVITE = 'social/wecom/isv/datasheet/invite/unauthMember'; // Invite members in authorization mode
// ================ Wecom App Store related end =======================

// ================ Enterprise and micro address book transformation related start =====================
export const GET_WECOM_AGENT_CONFIG = 'social/wecom/isv/datasheet/jsSdk/agentConfig';
export const GET_WECOM_CONFIG = 'social/wecom/isv/datasheet/jsSdk/config';
// ================ Enterprise and micro address book transformation related end =====================

/**
  * Third-party application integration revision
  */
// Space Station - Feishu Integration - Update Basic Configuration
export const UPDATE_LARK_BASE_CONFIG = '/lark/appInstance/:appInstanceId/updateBaseConfig';
// Space Station - Feishu Integration - Update Event Configuration
export const UPDATE_LARK_EVENT_CONFIG = '/lark/appInstance/:appInstanceId/updateEventConfig';
/* ----- Third-party application integration revision dividing line ----- */
