export function isPrivateDeployment() {
  return Boolean(process.env.REACT_APP_DEPLOYMENT_MODELS === 'PRIVATE');
}

export function isIdassPrivateDeployment() {
  return getCustomConfig().isIdaas && isPrivateDeployment();
}

declare let window: any;

export interface ICustomConfig {
  /**
   * 是否开启 sso 登录
   * @default false
   */
  ssoLogin?: boolean,

  /** 
   * 邀请人未认证时重定向到认证平台
   * @default undefined
   */
   redirectUrlOnUnAuthorization?: string;

   /**
    * 同步组织架构添加人员使用的 linkId
    * @default undefined
    */
  syncTeamsAndMembersLinkId?: string;

  /**
   * 登录模式: 密码登录/邮箱登录
   * @default 'identify_code_login'
   */
  loginMode?: 'password_login' | 'identify_code_login',

  /**
   * 支持的帐号类型, 不填则默认支持两者
   * @default ''
   */
  supportAccountType?: 'mobile' | 'mail',

  /**
   * 是否关闭重置密码功能
   * @default false
   */
  resetPasswordDisable?: boolean,

  /**
   * 是否在个人中心关闭帐号关联管理功能
   * @default false
   */
  socialLinkDisable?: boolean,

  /**
   * 是否关闭帐号钱包功能
   * @default false
   */
  accountWalletDisable?: boolean,

  /**
   * 是否关闭第三方应用集成
   * @default false
   */
  marketplaceDisable?: boolean,

  /**
   * 是否关闭邮箱邀请
   * @default false
   */
  emailInvitationDisable?: boolean

  /**
   * 是否在邀请 modal 中的 title 中显示 label：外部人员专用、内部人员专用
   * @default false
   */
  showLabelInInviteModal?: boolean,

  /**
   * 是否关闭首页介绍视频
   * @default false
   */
  introduceVideoDisable?: boolean,

  /**
   * 官网地址
   *
   */
  siteUrl?: string;

  /**
   * 页面标题
   */
  pageTitle?: string;

  /**
   * 首页标语
   * @default 科技新贵的协作神器
   */
  slogan?: string;

  /**
   * 页脚定制文字
   */
  footer?: string;

  /**
   * 单表允许的最大视图数量
   * @default 30
   */
  maxViewCountPerSheet?: number;

  /**
   * 允许管理的最大空间数量
   * @default 10
   */
  maxManageableSpaceCount?: number;

  /**
   *  单表允许的最大列数量
   * @default 200
   */
   maxFieldCountPerSheet?: number;

  /**
   * 屏蔽登出功能
   * @default false
   */
  logoutDisable?: boolean;
  /**
   * 是否是腾讯云IDAAS
   * @default false
   */
  isIdaas?: boolean;
}

export function getCustomConfig(): ICustomConfig {
  return typeof window === 'object' && window.__vika_custom_config__ || { loginMode: 'identify_code_login' };
  
}
