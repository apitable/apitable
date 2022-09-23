import { Strings, t } from 'i18n';

export const MAX_ROBOT_COUNT_PER_DST = 30; // 单表最大机器人数量限制
export const FIRST_FILE_IN_GUIDE_CLASS = 'FIRST_FILE_IN_GUIDE_CLASS'; // 第一次点击文件时，激活新手引导，需要加上class

// 表格区域相关
export const UPPER_LEFT_REGION = 0;
export const BOTTOM_LEFT_REGION = 1;
export const UPPER_RIGHT_REGION = 2;
export const BOTTOM_RIGHT_REGION = 3;
export const GIRD_CELL_EDITOR = 'gridCellEditor';
export const CELL_EMOJI_SIZE = 16;
export const CELL_EMOJI_LARGE_SIZE = 22;

// 节点类型(添加新类型时请将值+1即可)
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
  VIEW = 9,
  ASSET_FILE = 98,
  TRASH = 99,
}

export const nodeNameMap = new Map<NodeType, string>([
  [NodeType.FOLDER, t(Strings.folder)],
  [NodeType.DATASHEET, t(Strings.datasheet)],
  [NodeType.FORM, t(Strings.form)],
  [NodeType.VIEW, t(Strings.view)],
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
    type: NodeType.FORM,
    name: t(Strings.vika_form),
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
  MIRROR = 'mir',
  WIDGET = 'wdt',
}

export enum SocialType {
  WECOM = 1,
  DINGTALK = 2,
  FEISHU = 3,
}

// 目录树
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
  // 分享专用
  shareReader: 'shareReader',
  shareEditor: 'shareEditor',
  shareSave: 'shareSave',
};

export const nodePermissionMap = new Map<NodeType, { [key: string]: string }>([
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
  // templateVisitor 这个可以共用
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

/** 表示菜单所在的模块 */
export enum Modules {
  FAVORITE = 'FAVORITE',
  CATALOG = 'CATALOG',
  SHARE = 'SHARE',
  TEAM_TREE = 'TEAM_TREE',
}

/** 表示菜单的类型，每种不同类型的菜单对应不同的菜单列表 */
export enum ContextMenuType {
  DEFAULT = 'DEFAULT', // 工作目录的默认菜单
  DATASHEET = 'DATASHEET', // 工作目录的右击数表的菜单
  FORM = 'FORM', // 工作目录的右击神奇表单的菜单
  DASHBOARD = 'DASHBOARD', // DASHBOARD
  FOLDER = 'FOLDER', // 工作目录的右击文件夹的菜单
  FOLDER_SHOWCASE = 'FOLDER_SHOWCASE', // folder_showcase的更多操作菜单
  VIEW_TABBAR = 'VIEW_TABBAR', // 视图标签栏的操作菜单
  MIRROR = 'MIRROR', // 视图标签栏的操作菜单
  FORM_FIELD_OP = 'FORM_FIELD_OP', // 神奇表单field操作菜单
  EXPAND_RECORD_FIELD = 'EXPAND_RECORD_FIELD', // 展开卡片中操作字段配置
}

export const NODE_DESCRIPTION_EDITOR_ID = 'folderDescribeEditor';
export const BREAD_CRUMB_SCROLL_DIST = 100;

// tabbar
export const TAB_ARROW_LEFT = 'left';
export const TAB_ARROW_RIGHT = 'right';
export const TAB_ITEM_WIDTH = 180;
export const MOUSE_LEFT_CLICK = 0;

// 登录/注册相关
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
  PASSWORD = 'password', // 密码
  IDENTIFYING_CODE = 'identifying_code', // 验证码
  MAIL = 'mail', // 邮箱账号
  PHONE = 'phone', // 手机号
  OTHER = 'other',
}

export enum LoginTypes {
  SMS = 'sms_code',
  EMAIL = 'email_code',
  PASSWORD = 'password',
  SSO_AUTH = 'sso_auth',
}

// 扫码所要执行的操作
export enum ScanQrType {
  Login,
  Binding,
}

export const IDENTIFY_CODE_LOGIN = 'identify_code_login'; // 验证码登录
export const PASSWORD_LOGIN = 'password_login'; // 密码登录
export const SSO_LOGIN = 'sso_login'; // sso登录
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 24;
// export const PASSWORD_LENGTH_ERR = t(Strings.password_length_err); // '密码长度必须在8-24之间';
// export const PASSWORD_PATTERN_ERR = t(Strings.password_pattern_err); // '密码必须同时存在数字和字母';

// export const PASSWORD_NOT_IDENTICAL_ERR = t(Strings.password_not_identical_err); // '与第一次输入的密码不同';
// export const PHONE_ERR = t(Strings.phone_err); //  '手机号格式不正确';
// export const EMAIL_ERR = t(Strings.email_err); // '邮箱格式不正确';
// export const BIND_PHONE_SAME = t(Strings.bind_phone_same); // '无法更改为相同的手机号';
// export const BIND_EMAIL_SAME = t(Strings.bind_email_same); // '无法更改为相同的邮箱';
// export const PHONE_CODE_ERR = t(Strings.phone_code_err); // '验证码错误';
export const RESET_PWD_BY_PHONE = 0;
export const RESET_PWD_BY_EMAIL = 1;

export const RESET_PWD_STEP_SELECT_MODE = 0;
export const RESET_PWD_STEP_VERITY_IDENTITY = 1;
export const RESET_PWD_STEP_SET_PASSWORD = 2;
export const RESET_PWD_STEP_FINISH = 3;

export const GLASS_FILTER = 'blur(8px)';

export const PROGRESS_NORMAL = 'normal';
export const PROGRESS_EXCEPTION = 'exception';

// 空间管理-空间基本信息
export const ROOT_TEAM_ID = '0'; // 根部门id
export const SPACE_NAME_LENGTH = 100;

// 空间管理-成员管理-成员列表查询页数
export const MEMBER_LIST_PAGE_SIZE = 13;
// 空间管理-子管理员-子管理员列表查询页数
export const SUB_ADMIN_LIST_PAGE_SIZE = 12;

// 赠送空间查询页数
export const CAPACITY_REWARD_LIST_PAGE_SIZE = 12;

// 个人中心
export const DINGDING = 0;
export const WECHAT = 1;
export const MEMBER_NAME_LENGTH = 32; // 空间内的站内昵称不超过32个字
export const USER_INTEGRAL_RECORDS_PAGE_SIZE = 4; // 账户钱包收支分页数据页数
// 数据排序规则
export const SORT_DESC = 'desc';
export const SORT_ASC = 'asc';
export const ORDER_CREATE_TIME = 'createdAt';
export const ORDER_UPDATE_TIME = 'updatedAt';

// 个人头像与空间logo相关
// 属性不能简写, https://blog.csdn.net/weixin_45936690/article/details/108386544
export const ACCEPT_FILE_TYPE = 'image/jpeg,image/png,image/gif';

// localStorage 的命名空间
// https://github.com/nbubna/store
export const LS_DATASHEET_NAMESPACE = '_datasheet';

// 操作权限id
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

// notification通知中心
export const NOTICE_LIST_SIZE = 10; // 通知列表，一次请求的通知数量

// 模板中心
export const TEMPLATE_CHOICE_CATEGORY_ID = 'tpc000';
export const TEMPLATE_NAME_MAX = 100;

export enum BannerType {
  LARGE = 'large',
  MIDDLE = 'middle',
}

// socket连接ping的超时时间，实际为120000+25000
export const PINT_TIMEOUT = 150000;
// 检查最大次数
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
  ADD_FIRST_CHILD = 57, // 架构视图智能引导 - 添加首个节点 TODO: 架构视图的都在上线后移出
  DRAG_TO_UNHANDLED_LIST = 58, // 架构视图智能引导 - 清除子集
  CREATE_WIDGET_GUIDE = 40,
  RELEASE_WIDGET_GUIDE = 47,
  CONTACT_US_GUIDE = 64,
  VIKABY_UPDATE_LOGS_HISTORY = 67,
  AGREE_TERMS_OF_SERVICE = 76,

  // 架构视图相关
  ORG_VIEW_CREATE = 78, // 点击 “创建架构视图按钮” -> 显示视频 “架构视图使用方法”
  ORG_VIEW_PANEL = 79, // 架构视图中，右侧面板高亮，提示添加卡片到画布中
  ORG_VIEW_ADD_FIRST_NODE = 80, // 架构视图中，添加一个节点
  ORG_VIEW_DRAG_TO_UNHANDLED_LIST = 81, // 架构视图中，给节点添加了一个关联节点

  // 节点权限相关
  PERMISSION_SETTING_EXTEND = 95, // 打开权限设置，继承状态
  PERMISSION_SETTING_OPENED = 96, // 打开权限设置，非继承状态
}

export const DASHBOARD_MAX_WIDGET_COUNT = 30;

export const WIDGET_PANEL_MAX_WIDGET_COUNT = 30;

// 0 => 全部
// 1 => 修改历史
// 2 => 评论
export enum ActivityListParamsType {
  ALL = 0,
  HISTORY = 1,
  COMMENT = 2,
}

export enum ShowRecordHistory {
  CLOSE = 0,
  OPEN = 1,
}

// 平台信息
export enum PlatFormTypes {
  Web = 'Web',
  Desktop = 'Desktop',
  App = 'App',
}

// 无痕验证的 appkey
export const nvcAppkey = 'FFFF0N00000000008B7D';

// 区分跳转（企微应用商店应用）授权页的入口来源
export enum AuthReference {
  CAMERA = 'camera', // 扫码登陆
  APPLICATION = 'application', // 点击app内的应用跳转授权页
}

export const MOBILE_APP_UA = 'vikaApp';

export enum JSBridgeMethod {
  OpenAppFeedback = 'openAppFeedback',
}

export enum DefaultStatusMessage {
  OK_MSG = 'SUCCESS',
  SERVER_ERROR_MSG = 'SERVER_ERROR',
}

// 批量复制URL单元格时最大支持批量识别数
export const MAX_URL_COPY_RECOG_NUM = 100;
