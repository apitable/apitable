export function isPrivateDeployment() {
  return Boolean(process.env.REACT_APP_DEPLOYMENT_MODELS === 'PRIVATE');
}

export function isIdassPrivateDeployment() {
  return getCustomConfig().isIdaas && isPrivateDeployment();
}

declare let window: any;

export interface ICustomConfig {
  /**
   * Whether to enable sso login
   * @default false
   */
  ssoLogin?: boolean,

  /**
   * Redirect to the authentication platform when the inviter is not authenticated
   * @default undefined
   */
   redirectUrlOnUnAuthorization?: string;

   /**
    * Synchronize the linkId used by the added personnel in the organization structure
    * @default undefined
    */
  syncTeamsAndMembersLinkId?: string;

  /**
   * Login mode: password login/email login
   * @default 'identify_code_login'
   */
  loginMode?: 'password_login' | 'identify_code_login',

  /**
   * Supported account types, if not filled, both are supported by default
   * @default ''
   */
  supportAccountType?: 'mobile' | 'mail',

  /**
   * Whether to turn off the reset password function
   * @default false
   */
  resetPasswordDisable?: boolean,

  /**
   * Whether to turn off the account association management function in the personal center
   * @default false
   */
  socialLinkDisable?: boolean,

  /**
   * Whether to close the account wallet function
   * @default false
   */
  accountWalletDisable?: boolean,

  /**
   * Whether to turn off third-party application integration
   * @default false
   */
  marketplaceDisable?: boolean,

  /**
   * Whether to close the mailbox invitation
   * @default false
   */
  emailInvitationDisable?: boolean

  /**
   * Whether to display the label in the title in the invitation modal: only for external staff, only for internal staff
   * @default false
   */
  showLabelInInviteModal?: boolean,

  /**
   * Whether to close the homepage introduction video
   * @default false
   */
  introduceVideoDisable?: boolean,

  /**
   * Official website address
   *
   */
  siteUrl?: string;

  /**
   * page title
   */
  pageTitle?: string;

  /**
   * Homepage slogan
   * @default tech upstart collaboration artifact
   */
  slogan?: string;

  /**
   * Footer custom text
   */
  footer?: string;

  /**
   * Maximum number of views allowed for a single table
   * @default 30
   */
  maxViewCountPerSheet?: number;

  /**
   * The maximum amount of space allowed to manage
   * @default 10
   */
  maxManageableSpaceCount?: number;

  /**
   * Maximum number of columns allowed in a single table
   * @default 200
   */
   maxFieldCountPerSheet?: number;

  /**
   * Block logout function
   * @default false
   */
  logoutDisable?: boolean;
  /**
   * Whether it is Tencent Cloud IDAAS
   * @default false
   */
  isIdaas?: boolean;
}
export function getCustomConfig(): ICustomConfig {
  return typeof window === 'object' && window.__vika_custom_config__ || { loginMode: 'identify_code_login' };
  
}
