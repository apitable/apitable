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

import { getCustomConfig } from './env';
import { Strings, t } from '../exports/i18n';

export const MAX_ROBOT_COUNT_PER_DST = 30; // The maximum number of robots in a single table

// When you click the file for the first time, to activate the novice guide, you need to add a class
export const FIRST_FILE_IN_GUIDE_CLASS = 'FIRST_FILE_IN_GUIDE_CLASS';

export const DEFAULT_CHECK_ICON = 'white_check_mark';

// table area related
export const UPPER_LEFT_REGION = 0;
export const BOTTOM_LEFT_REGION = 1;
export const UPPER_RIGHT_REGION = 2;
export const BOTTOM_RIGHT_REGION = 3;
export const GIRD_CELL_EDITOR = 'gridCellEditor';
export const CELL_EMOJI_SIZE = 16;
export const CELL_EMOJI_LARGE_SIZE = 22;

// Node type (please +1 the value when adding a new type)
export enum NodeType {
  ROOT = 0,
  FOLDER = 1,
  DATASHEET = 2,
  FORM = 3,
  DASHBOARD = 4,
  MIRROR = 5,
  DATAPAGE = 6,
  CANVAS = 7,
  WORD_DOC = 8,
  AI = 9,
  AUTOMATION = 10,
  VIEW = 11,
  CUSTOM_PAGE = 12,
  ASSET_FILE = 98,
  TRASH = 99,
}

export const nodeNameMap = new Map<NodeType, string>([
  [NodeType.FOLDER, t(Strings.folder)],
  [NodeType.DATASHEET, t(Strings.datasheet)],
  [NodeType.FORM, t(Strings.form)],
  [NodeType.VIEW, t(Strings.view)],
  [NodeType.AUTOMATION, t(Strings.automation)],
  [NodeType.TRASH, t(Strings.trash)],
  [NodeType.MIRROR, t(Strings.mirror)],
  [NodeType.DASHBOARD, t(Strings.dashboard)],
]);

export const orderedNode = [
  {
    type: NodeType.FOLDER,
    name: t(Strings.folder),
  },
  {
    type: NodeType.DATASHEET,
    name: t(Strings.file),
  },
  {
    type: NodeType.AUTOMATION,
    name: t(Strings.automation),
  },
  {
    type: NodeType.FORM,
    name: t(Strings.view_form),
  },
  {
    type: NodeType.DASHBOARD,
    name: t(Strings.dashboard),
  },
];

export enum NodeTypeReg {
  FOLDER = 'fod',
  DATASHEET = 'dst',
  FORM = 'fom',
  DASHBOARD = 'dsb',
  AUTOMATION = 'aut',
  MIRROR = 'mir',
  WIDGET = 'wdt',
  AI = 'ai_',
}

export const nodePrefixNameMap = new Map<NodeTypeReg, string>([
  [NodeTypeReg.FOLDER, t(Strings.folder)],
  [NodeTypeReg.DATASHEET, t(Strings.datasheet)],
  [NodeTypeReg.FORM, t(Strings.form)],
  [NodeTypeReg.AUTOMATION, t(Strings.automation)],
  [NodeTypeReg.MIRROR, t(Strings.mirror)],
  [NodeTypeReg.DASHBOARD, t(Strings.dashboard)],
  [NodeTypeReg.AI, t(Strings.ai_chat)],
]);

export enum SocialType {
  WECOM = 1,
  DINGTALK = 2,
  FEISHU = 3,
  WOA = 10,
}

// catalog tree
export const NODE_CONTEXT_MENU_ID = 'NODE_CONTEXT_MENU_ID';

export enum WorkbenchSidePanels {
  FAVORITE,
  CATALOG,
}

export const EXPORT_ALL_SHEET_NAME = t(Strings.form_the_full);
export const EXPORT_TYPE_XLSX = 'xlsx';
export const EXPORT_TYPE_CSV = 'csv';

export enum Role {
  Administrator = 'administrator',
  Manager = 'manager',
  Editor = 'editor',
  Reader = 'reader',
  None = 'none',
  Member = 'member',
  Guest = 'guest',
  Foreigner = 'foreigner',
}

export const permission = {
  manager: 'manager',
  editor: 'editor',
  reader: 'reader',
  updater: 'updater',
  templateVisitor: 'templateVisitor',
  owner: 'manager',
  anonymous: 'reader',
  foreigner: 'reader',
  // for share
  shareReader: 'shareReader',
  shareEditor: 'shareEditor',
  shareSave: 'shareSave',
};

export const nodePermissionMap = new Map<NodeType, { [key: string]: string }>([
  [
    NodeType.AUTOMATION,
    {
      [permission.manager]: t(Strings.automation_manager_label),
      [permission.editor]: t(Strings.automation_editor_label),
      [permission.updater]: t(Strings.automation_updater_label),
      [permission.reader]: t(Strings.automation_reader_label),
    },
  ],
  [
    NodeType.DATASHEET,
    {
      [permission.manager]: t(Strings.add_datasheet_manager),
      [permission.editor]: t(Strings.add_datasheet_editor),
      [permission.reader]: t(Strings.add_datasheet_reader),
      [permission.updater]: t(Strings.add_datasheet_updater),
    },
  ],
  [
    NodeType.FOLDER,
    {
      [permission.manager]: t(Strings.add_folder_manager),
      [permission.editor]: t(Strings.add_folder_editor),
      [permission.reader]: t(Strings.add_folder_reader),
      [permission.updater]: t(Strings.add_folder_updater),
    },
  ],
  [
    NodeType.FORM,
    {
      [permission.manager]: t(Strings.form_manager_label),
      [permission.editor]: t(Strings.form_editor_label),
      [permission.reader]: t(Strings.form_reader_label),
      [permission.updater]: t(Strings.form_updater_label),
    },
  ],
  [
    NodeType.DASHBOARD,
    {
      [permission.manager]: t(Strings.dashboard_manager_label),
      [permission.editor]: t(Strings.dashboard_editor_label),
      [permission.reader]: t(Strings.dashboard_reader_label),
      [permission.updater]: t(Strings.dashboard_updater_label),
    },
  ],
  [
    NodeType.MIRROR,
    {
      [permission.manager]: t(Strings.mirror_manager_label),
      [permission.editor]: t(Strings.mirror_editor_label),
      [permission.reader]: t(Strings.mirror_reader_label),
      [permission.updater]: t(Strings.mirror_uploader_label),
    },
  ],
  [
    NodeType.AI,
    {
      [permission.manager]: '在「只可阅读」基础上，还可以编辑小程序和分享仪表盘',
      [permission.editor]: '在「只可阅读」基础上，还可以编辑小程序和分享仪表盘',
      [permission.reader]: '在「只可阅读」基础上，还可以编辑小程序和分享仪表盘',
      [permission.updater]: '在「只可阅读」基础上，还可以编辑小程序和分享仪表盘',
    },
  ],
  [
    NodeType.CUSTOM_PAGE,
    {
      [permission.manager]: t(Strings.embed_page_node_permission_manager),
      [permission.editor]: t(Strings.embed_page_node_permission_editor),
      [permission.reader]: t(Strings.embed_page_node_permission_reader),
      [permission.updater]: t(Strings.embed_page_node_permission_updater),
    },
  ],
]);

export const permissionText = {
  manager: t(Strings.can_control),
  editor: t(Strings.can_edit),
  reader: t(Strings.can_read),
  member: t(Strings.ordinary_members),
  updater: t(Strings.can_updater),
  templateVisitor: t(Strings.permission_template_visitor),
  shareReader: t(Strings.share_reader),
  shareEditor: t(Strings.share_editor),
  shareSave: t(Strings.share_save),
};

export const FormPermissionTip = {
  manager: t(Strings.form_manager_label),
  editor: t(Strings.form_editor_label),
  reader: t(Strings.form_reader_label),
};

export const DatasheetPermissionTip = {
  manager: t(Strings.datasheet_manager_label),
  editor: t(Strings.datasheet_editor_label),
  reader: t(Strings.datasheet_reader_label),
  templateVisitor: t(Strings.datasheet_experience_label),
  shareReader: t(Strings.share_reader_label),
  shareEditor: t(Strings.share_editor_label),
  shareSave: t(Strings.share_save_label),
};

export const DashboardPermissionTip = {
  manager: t(Strings.dashboard_manager_label),
  editor: t(Strings.dashboard_editor_label),
  reader: t(Strings.dashboard_reader_label),
  // templateVisitor this can be shared
  templateVisitor: t(Strings.datasheet_experience_label),
  shareReader: t(Strings.share_reader_label),
  shareEditor: t(Strings.share_editor_label),
  shareSave: t(Strings.share_save_label),
};

export const FolderPermissionTip = {
  manager: t(Strings.folder_manager_label),
  editor: t(Strings.folder_editor_label),
  reader: t(Strings.folder_reader_label),
  templateVisitor: t(Strings.datasheet_experience_label),
};

// TODO(remove eslint disable)
export enum RolePriority {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  manager = 0,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  editor = 1,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  reader = 2,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  updater = 3,
}

export enum UnitTypes {
  Teams = 'teams',
  Tags = 'tags',
  Members = 'members',
}

/** Indicates the module where the menu is located */
export enum Modules {
  FAVORITE = 'FAVORITE',
  CATALOG = 'CATALOG',
  SHARE = 'SHARE',
  TEAM_TREE = 'TEAM_TREE',
  PRIVATE = 'PRIVATE',
}

/** Indicates the type of menu, each different type of menu corresponds to a different menu list */
export enum ContextMenuType {
  DEFAULT = 'DEFAULT', // default menu for working directory
  DATASHEET = 'DATASHEET', // right-click table menu for working directory
  AUTOMATION = 'AUTOMATION', // right-click table menu for working directory
  FORM = 'FORM', // right-click magic form menu for working directory
  DASHBOARD = 'DASHBOARD', // DASHBOARD
  FOLDER = 'FOLDER', // right-click folder menu for working directory
  FOLDER_SHOWCASE = 'FOLDER_SHOWCASE', // More action menu for folder_showcase
  VIEW_TABBAR = 'VIEW_TABBAR', // Action menu for view tab bar
  MIRROR = 'MIRROR', // Action menu for view tab bar
  FORM_FIELD_OP = 'FORM_FIELD_OP', // Magical form field operation menu
  EXPAND_RECORD_FIELD = 'EXPAND_RECORD_FIELD', // Expand the operation field configuration in the card
  AI = 'AI',
  CUSTOM_PAGE = 'CUSTOM_PAGE',
}

export const NODE_DESCRIPTION_EDITOR_ID = 'folderDescribeEditor';
export const BREAD_CRUMB_SCROLL_DIST = 100;

// tabbar
export const TAB_ARROW_LEFT = 'left';
export const TAB_ARROW_RIGHT = 'right';
export const TAB_ITEM_WIDTH = 180;
export const MOUSE_LEFT_CLICK = 0;

// login/register
export const REGISTER_ACCOUNT = 1;
export const LOGIN_ACCOUNT = 2;
export const MODIFY_PASSWORD = 3;
export const BIND_DINGDING = 4;
export const BIND_MOBILE = 5;
export const UNBIND_MOBILE = 6;
export const MODIFY_EMAIL = 7;
export const DEL_SPACE = 8;
export const CHANGE_MAIN_ADMIN = 9;
export const GENERAL_VALIDATION = 10;

export enum SmsTypes {
  REGISTER_ACCOUNT = 1,
  LOGIN_ACCOUNT = 2,
  MODIFY_PASSWORD = 3,
  BIND_DINGDING = 4,
  BIND_MOBILE = 5,
  UNBIND_MOBILE = 6,
  MODIFY_EMAIL = 7,
  DEL_SPACE = 8,
  CHANGE_MAIN_ADMIN = 9,
  GENERAL_VALIDATION = 10,
  CHANGE_DEVELOPER_CONFIG = 11,
  BIND_SOCIAL_USER = 12,
}

export enum CodeTypes {
  SMS_CODE = 'sms_code',
  EMAIL_CODE = 'email_code',
}

export enum EmailCodeType {
  BIND = 1,
  REGISTER = 2,
  COMMON = 3,
}

export enum CaptchaIds {
  LOGIN = 'login',
  DEFAULT = 'nc',
}

export enum LoginMode {
  PASSWORD = 'password',
  IDENTIFYING_CODE = 'identifying_code', // verify coe
  MAIL = 'mail', // email account
  PHONE = 'phone', // mobile phone number
  OTHER = 'other',
}

export enum LoginTypes {
  SMS = 'sms_code',
  EMAIL = 'email_code',
  PASSWORD = 'password',
  SSO_AUTH = 'sso_auth',
}

// Scan QRCode operations
export enum ScanQrType {
  Login,
  Binding,
}

export enum ImproveType {
  Phone = 'phone',
  Email = 'email',
}

export const IDENTIFY_CODE_LOGIN = 'identify_code_login'; // login verify code
export const PASSWORD_LOGIN = 'password_login'; // password login
export const SSO_LOGIN = 'sso_login'; // sso login
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 24;
// export const PASSWORD_LENGTH_ERR = t(Strings.password_length_err); // 'Password length must be between 8-24';
// export const PASSWORD_PATTERN_ERR = t(Strings.password_pattern_err); // 'Password must contain both numbers and letters';

// export const PASSWORD_NOT_IDENTICAL_ERR = t(Strings.password_not_identical_err); // 'different from the first entered password';
// export const PHONE_ERR = t(Strings.phone_err); // 'The phone number format is incorrect';
// export const EMAIL_ERR = t(Strings.email_err); // 'The email format is incorrect';
// export const BIND_PHONE_SAME = t(Strings.bind_phone_same); // 'Cannot change to the same phone number';
// export const BIND_EMAIL_SAME = t(Strings.bind_email_same); // 'Cannot change to the same email';
// export const PHONE_CODE_ERR = t(Strings.phone_code_err); // 'Verification code error';
export const RESET_PWD_BY_PHONE = 0;
export const RESET_PWD_BY_EMAIL = 1;

export const RESET_PWD_STEP_SELECT_MODE = 0;
export const RESET_PWD_STEP_VERITY_IDENTITY = 1;
export const RESET_PWD_STEP_SET_PASSWORD = 2;
export const RESET_PWD_STEP_FINISH = 3;

export const GLASS_FILTER = 'blur(8px)';

export const PROGRESS_NORMAL = 'normal';
export const PROGRESS_EXCEPTION = 'exception';

// space - basic space information
export const ROOT_TEAM_ID = '0';
export const SPACE_NAME_LENGTH = 100;

// space-members-members list query pages number
export const MEMBER_LIST_PAGE_SIZE = 20;
// space - sub admin - sub admin list query pages number
export const SUB_ADMIN_LIST_PAGE_SIZE = 20;

// gifted space query page number
export const CAPACITY_REWARD_LIST_PAGE_SIZE = 12;

// personal center
export const DINGDING = 0;
export const WECHAT = 1;
export const MEMBER_NAME_LENGTH = 32; // space nickname length cannot exceed 32 characters
export const USER_INTEGRAL_RECORDS_PAGE_SIZE = 4; // account wallet orders number per page

// data sorting rule
export const SORT_DESC = 'desc';
export const SORT_ASC = 'asc';
export const ORDER_CREATE_TIME = 'createdAt';
export const ORDER_UPDATE_TIME = 'updatedAt';

// personal avatar relates to space log
// attributes can not use short name, https://blog.csdn.net/weixin_45936690/article/details/108386544
export const ACCEPT_FILE_TYPE = 'image/jpeg,image/png,image/gif';

// localStorage 's namespace
// https://github.com/nbubna/store
export const LS_DATASHEET_NAMESPACE = '_datasheet';

// operation permission id
export enum PermissionCode {
  WORKBENCH = 'MANAGE_WORKBENCH',
  TEAM = 'MANAGE_TEAM',
  MEMBER = 'MANAGE_MEMBER',
  NORMAL_MEMBER = 'MANAGE_NORMAL_MEMBER',
  TEMPLATE = 'MANAGE_TEMPLATE',
  MANAGE_WIDGET = 'MANAGE_WIDGET',
  SECURITY = 'MANAGE_SECURITY',
  MANAGE_ROLE = 'MANAGE_ROLE',
}

// notification center
export const NOTICE_LIST_SIZE = 10; // notification list, one request notification count

// template center
export const TEMPLATE_CHOICE_CATEGORY_ID = 'tpc000';
export const TEMPLATE_NAME_MAX = 100;
export const TEMPLATE_UNCATEGORIZED = 'tpc_uncategorized';

export enum BannerType {
  LARGE = 'large',
  MIDDLE = 'middle',
}

// the timeout of socket ping, actually 120000+25000
export const PINT_TIMEOUT = 150000;
// max check times
export const MAX_CHECK_TIMES = 10;

// export const NODE_INTRODUCE_MAP = new Map([
//   [
//     NodeType.FORM,
//     {
//       title: t(Strings.form_view),
//       desc: t(Strings.form_view_desc),
//       videoGuide: integrateCdnHost(Settings.form_guide_video.value),
//     },
//   ],
// ]);
// wizardId
export enum WizardIdConstant {
  EMAIL_BIND = 20,
  INTRODUCTION_VIDEO_14_SERVER = 24,
  FUNCTION_GUIDANCE = 18,
  REPLAY_GANTT_VIDEO = 34,
  REPLAY_CALENDAR_VIDEO = 37,
  REPLAY_ORG_CHART_VIDEO = 54,
  ADD_FIRST_CHILD = 57, // Architecture view smart boot - add first node TODO: Architecture view is moved out after going online
  DRAG_TO_UNHANDLED_LIST = 58, // Architecture View Smart Boot - clear subset
  CREATE_WIDGET_GUIDE = 40,
  RELEASE_WIDGET_GUIDE = 47,
  CONTACT_US_GUIDE = 64,
  VIKABY_UPDATE_LOGS_HISTORY = 67,
  AGREE_TERMS_OF_SERVICE = Number(getCustomConfig().LOGIN_AGREE_TERMS_OF_SERVICE_WIZARD_ID),

  AUTOMATION_TRIGGER = 117,
  AUTOMATION_BUTTON_TRIGGER = 118,

  // org chart view
  ORG_VIEW_CREATE = 78, // Click the "Create Schema View button" -> show the video "How to use Schema View"
  ORG_VIEW_PANEL = 79, // In the schema view, the right panel is highlighted, prompting to add cards to the canvas
  ORG_VIEW_ADD_FIRST_NODE = 80, // Add a node to the architecture view
  ORG_VIEW_DRAG_TO_UNHANDLED_LIST = 81, // In the schema view, an associated node is added to the node

  // node permissions
  PERMISSION_SETTING_EXTEND = 95, // Open permission settings, inherit state
  PERMISSION_SETTING_OPENED = 96, // Open permission settings, non-inherited state

  CREATE_MIRROR_TIP = 106,
  PRICE_MODAL = 104,
  AI_TABLE_VIDEO = 115,
}

export const WIDGET_PANEL_MAX_WIDGET_COUNT = 30;

// 0 => all
// 1 => changelog history
// 2 => comments
export enum ActivityListParamsType {
  ALL = 0,
  HISTORY = 1,
  COMMENT = 2,
}

export enum ShowRecordHistory {
  CLOSE = 0,
  OPEN = 1,
}

// platform information
export enum PlatFormTypes {
  Web = 'Web',
  Desktop = 'Desktop',
  App = 'App',
}

// captcha appkey
export const nvcAppkey = 'FFFF0N00000000008B7D';

// Distinguish the entry source of the jump (Wecom App Store application) authorization page
export enum AuthReference {
  CAMERA = 'camera', // scan qrcode
  APPLICATION = 'application', // Click the application in the app to jump to the authorization page
}

export const MOBILE_APP_UA = 'vikaApp';

export enum JSBridgeMethod {
  OpenAppFeedback = 'openAppFeedback',
}

export enum DefaultStatusMessage {
  OK_MSG = 'SUCCESS',
  SERVER_ERROR_MSG = 'SERVER_ERROR',
}

// batch copy URL cell, max support batch recognize count
export const MAX_URL_COPY_RECOG_NUM = 100;
