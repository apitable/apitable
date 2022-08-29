export const STATUS_OK = 200;
export const UN_AUTHORIZED = 201;
export const RESOURCE_NOT_EXIST = 210;
export const NVC_FAIL = 250;
export const SECONDARY_VALIDATION = 251;
export const PHONE_VALIDATION = 252;
export const OPERATION_FREQUENT = 233;
export const ACCOUNT_ERROR = 303;
export const TIME_OUT = 303;
export const EMAIL_ERR = 304;
export const PASSWORD_ERR = 305;
export const LOGIN_OUT_NUMBER = 306;
export const SMS_GET_ERR = 230;
export const SMS_CHECK_ERR = 231;
export const SMS_CODE_NOT_CHECK = 232;
export const PHONE_COMMON_ERR = 303;
export const NAME_AND_PWD_ERR = 302;
export const BINDING_WECHAT = 332; // 手机号已绑定微信
export const MOVE_FORM_SPACE = 403; // 被移出空间
export const SPACE_NOT_EXIST = 404; // 被邀请的空间不存在
export const NODE_NUMBER_ERR = 412;
export const TEMPLATE_NOT_EXIST = 431;
export const FREQUENTLY_QR = 324; // 验证码刷新的过于频繁
export const COMMON_ERR = 500; // 一般错误
export const MEMBER_NOT_EXIST = 508; // 成员不存在
export const BINDING_ACCOUNT_ERR = [320, 332];
// 切换空间，空间未激活
export const INVALID_SPACE = 406;
// 邮件邀请，邀请人点击链接，空间已删除，message为空间不存在
export const SPACE_DELETED = 404;

// 公开链接邀请-邀请人的空间人数达到上限，暂时无法加入
export const INVITER_SPACE_MEMBER_LIMIT = 407;
// 公开链接邀请-邀请链接已失效
export const LINK_INVALID = 517;
// 公开链接邀请-空间数量已达上限
export const SPACE_LIMIT = 405;

export const NODE_DELETED = 600; // 节点被删除
export const NODE_NOT_EXIST = 601; // 无权限访问 - 无访问权限
export const NOT_PERMISSION = 602; // 无权限操作 -  无编辑权限
export const PAYMENT_PLAN = 951;
export const LOG_OUT_UNSATISFIED = 962; // 不满足注销条件，不允许用户注销

// 神奇表单映射的数表不存在
export const FORM_DATASHEET_NOT_EXIST = 301;
export const FORM_FOREIGN_DATASHEET_NOT_EXIST = 302;

// 前端自定义错误码
export const USER_DEFINED_PASSWORD_ERR = 1001;
export const FEISHU_ACCOUNT_NOT_BOUND = 1110;

export const WECOM_NOT_BIND_SPACE = 1106;

export const DINGTALK_NOT_BIND_SPACE = 1106; // 企业未绑定空间 
export const DINGTALK_TENANT_NOT_EXIST = 1107; // 租户不存在
export const DINGTALK_USER_NOT_EXIST = 1109; // 租户用户未授权
export const DINGTALK_USER_CONTACT_SYNCING = 1131; // 通讯录正在同步中

// 企业微信应用商店错误码
export const WECOM_SHOP_USER_NOT_EXIST = 1115; // 租户不在应用可见范围内

// 专属域名未绑定
export const WECOM_NOT_BIND_DOMAIN = 1122;
export const WECOM_HAS_BIND = 338; // 账号已绑定企业微信账号
export const WECOM_NO_EXIST = 1107; // 企业未安装过第三方应用
export const WECOM_NO_INSTALL = 1114; // 企业应用被删除
export const WECOM_OUT_OF_RANGE = 1109; // 租户未授权，即用户不在企业的可见范围内
export const WECOM_NOT_ADMIN = 1113; // 不是管理员

export const SPACE_CAPACITY_OVER_LIMIT = 4008; // 空间容量超过限制

export const FRONT_VERSION_ERROR = 3005; //前端版本不匹配

export enum SmsErrCode {
  GetErr = 230,
  CheckErr = 231,
  CodeNotCheck = 232,
  NormalErr = 500,
}

export enum PhoneErr {
  CommonErr = 303,
  PhoneLengthErr = 500,
}

export enum AccountErr {
  UserNameErr = 302,
  CommonErr = 303,
  EmailErr = 304,
  PhoneLengthErr = 500,
}

export enum PasswordErr {
  NameAndPwdErr = 302,
  PasswordEmptyErr = 305,
}
