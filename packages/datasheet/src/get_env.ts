/**
 * 获取系统环境变量
 */
export const getEnvVars = () => {
  return {
    DINGTALK_LOGIN_APPID: process.env.DINGTALK_LOGIN_APPID,
    QQ_CONNECT_WEB_APPID: process.env.QQ_CONNECT_WEB_APPID,
    FEISHU_LOGIN_APPID: process.env.FEISHU_LOGIN_APPID,
    WECHAT_MP_APPID: process.env.WECHAT_MP_APPID,
    WECOM_SHOP_SUITEID: process.env.WECOM_SHOP_SUITEID,
    WECOM_SHOP_CORPID: process.env.WECOM_SHOP_CORPID,
    WECHAT_MP_QR_CODE: process.env.WECHAT_MP_QR_CODE,
    INTERCOM_APPID: process.env.INTERCOM_APPID,
    FORCE_HTTPS: process.env.FORCE_HTTPS,
    SENTRY_DSN: process.env.SENTRY_DSN,
    SHOW_RECORD_CARD_SETTING: process.env.SHOW_RECORD_CARD_SETTING,
    ENV: process.env.ENV,
    THEME: process.env.THEME,
    HIDDEN_USER_CHANGE_PASSWORD: process.env.HIDDEN_USER_CHANGE_PASSWORD === 'true',
    HIDDEN_ACCOUNT_LINK_MANAGER: process.env.HIDDEN_ACCOUNT_LINK_MANAGER === 'true',
    HIDDEN_CHANGE_SPACE_ADMIN: process.env.HIDDEN_CHANGE_SPACE_ADMIN === 'true',
    HIDDEN_BIND_PHONE: process.env.HIDDEN_BIND_PHONE === 'true',
    HIDDEN_BIND_MAIL: process.env.HIDDEN_BIND_MAIL === 'true',
    HIDDEN_BATCH_IMPORT_USER: process.env.HIDDEN_BATCH_IMPORT_USER === 'true',
    HIDDEN_QRCODE: process.env.HIDDEN_QRCODE === 'true',
    USE_CUSTOM_PUBLIC_FILES: process.env.USE_CUSTOM_PUBLIC_FILES === 'true',
    HIDDEN_UPGRADE_SPACE: process.env.HIDDEN_UPGRADE_SPACE === 'true',
    HIDDEN_THIRD_PARTY_INTEGRATION: process.env.HIDDEN_THIRD_PARTY_INTEGRATION === 'true',
    // TODO：这里是临时操作，上线前删了
    ...process.env,
  };
};
