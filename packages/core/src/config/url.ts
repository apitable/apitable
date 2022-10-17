// 主地址
export const BASE_URL = '/api/v1';

// ================ 授权相关 ======================
// 登录或注册
export const SIGN_IN_OR_SIGN_UP = '/signIn';
// 登录(废弃)
export const SIGN_IN = '/auth/signIn';
// 注册(废弃)
export const SIGN_UP = '/auth/signUp';
// 退出登录
export const SIGN_OUT = '/signOut';

// 注销
export const LOGOUT = '/user/applyForClosing';

// 撤销注销
export const UNLOGOUT = '/user/cancelClosing';

export const DINGTALK_LOGIN_CALLBACK = '/dingtalk/login/callback';
export const QQ_LOGIN_CALLBACK = '/tencent/web/callback';
export const WECHAT_LOGIN_CALLBACK = '/wechat/mp/web/callback';
export const WECOM_LOGIN_CALLBACK = '/social/wecom/user/login';

export const FEISHU_LOGIN_CALLBACK = '/social/feishu/auth/callback';
// ================ 授权相关 ======================

// ================ 公共相关 ======================
// 发送短信验证码
export const SEND_SMS_CODE = '/base/action/sms/code';
// 获取邮箱验证码
export const SEND_EMAIL_CODE = '/base/action/mail/code';
// 手机验证码校验
export const VALIDATE_SMS_CODE = '/base/action/sms/code/validate';
// 邮箱验证码校验，使用场景：无手机时更换邮箱前验证身份、更换主管理员
export const VALIDATE_EMAIL_CODE = '/base/action/email/code/validate';
// 空间站-邀请临时码校验
export const INVITE_EMAIL_VERIFY = '/base/action/invite/valid';
// 上传文件
export const UPLOAD_ATTACH = '/base/attach/upload';

// 获取附件预览地址
export const OFFICE_PREVIEW = '/base/attach/officePreview/:spaceId';
export const GET_CONTENT_DISPOSITION = '/attach/getContentDisposition';

// ================ 公共相关 ======================

// ================ 账户相关 ======================
// 获取个人信息
export const USER_ME = '/user/me';
// 获取是否能注销
export const USER_CAN_LOGOUT = '/user/checkForClosing';
// 验证手机号并校验是否已注册
export const USER_VALIDATE = '/user/validate';
// 空间站-查询用户是否与指定邮箱一致
export const EMAIL_VALIDATE = '/user/validate/email';
// 空间站-关联受邀邮箱
export const LINK_INVITE_EMAIL = '/user/link/inviteEmail';
// 空间站-查询用户是否绑定邮箱
export const EMAIL_BIND = '/user/email/bind';
// 编辑用户信息
export const UPDATE_USER = '/user/update';
// 修改密码
export const UPDATE_PWD = '/user/updatePwd';
// 找回密码
export const RETRIEVE_PWD = '/user/retrievePwd';
// 创建开发者访问令牌
export const CREATE_API_KEY = '/user/createApiKey';
// 刷新开发者访问令牌
export const REFRESH_API_KEY = '/user/refreshApiKey';
// 绑定邮箱
export const BIND_EMAIL = '/user/bindEmail';
// 绑定新手机
export const BIND_MOBILE = '/user/bindPhone';
// 解除账户绑定
export const UN_BIND = '/user/unbind';
// 查询账户积分信息
export const USER_INTEGRAL = '/user/integral';
// 分页查询积分收支明细
export const USER_INTEGRAL_RECORDS = '/user/integral/records';
// 解绑手机号
export const USER_UNBIND_MOBILE = '/user/unbindPhone';
// 解绑邮箱
export const USER_UNBIND_EMAIL = '/user/unbindEmail';
// 发送邀请码
export const SUBMIT_INVITE_CODE = '/user/invite/reward';
// ================ 账户相关 ======================

// ================ 审计相关 ======================
// 分页查询空间审计日志
export const SPACE_AUDIT = '/space/:spaceId/audit';

// ================ 微信相关 ======================
// 获取微信公众号二维码
export const OFFICIAL_ACCOUNTS_QRCODE = '/wechat/mp/qrcode';
// 轮询
export const OFFICIAL_ACCOUNTS_POLL = '/wechat/mp/poll';
// 小程序扫码轮询接口
export const POLL = 'wechat/miniapp/poll';
// 获取小程序二维码
export const WECHAT_QR_CODE = 'wechat/miniapp/macode';
// 微信账号和维格账号之间的操作
export const WECHAT_OPERATE = 'wechat/miniapp/operate';
// 微信sdk分享
export const WECHAT_MP_SIGNATURE = '/wechat/mp/signature';
// ================ 微信相关 ======================

// ================ 空间相关 ======================
// 获取空间列表
export const SPACE_LIST = '/space/list';
// 创建空间
export const CREATE_SPACE = '/space/create';
// 删除空间
export const DELETE_SPACE = '/space/delete/:spaceId';
// 切换空间站
export const SWITCH_SPACE = '/space/:spaceId/switch';
// 立即删除空间
export const DELETE_SPACE_NOW = '/space/del';
// 编辑空间
export const UPDATE_SPACE = '/space/update';
// 移除空间列表的红点
export const REMOVE_RED_POINT = '/space/remove/';
// 退出空间
export const QUIT_SPACE = '/space/quit/';
// 空间站-主管理员-获取主管理员信息
export const MAIN_ADMIN_INFO = '/space/manager';
// 空间站-主管理员-更换主管理员
export const CHANGE_MAIN_ADMIN = '/space/changeManager';
// 空间站-子管理员-查询管理员列表
export const LIST_ROLE = '/space/listRole';
// 空间站-子管理员-获取管理员信息
export const SUB_ADMIN_PERMISSION = '/space/getRoleDetail';
// 空间站-子管理员-添加管理员
export const ADD_SUB_ADMIN = '/space/addRole';
// 空间站-子管理员-编辑子管理员
export const EDIT_SUB_ADMIN = '/space/editRole';
// 空间站-子管理员-删除管理员
export const DELETE_SUB_ADMIN = '/space/deleteRole/';
// 空间站-更改成员设置
export const UPDATE_MEMBER_SETTING = '/space/updateMemberSetting';
// 空间站-获取禁止全员导出维格表状态
export const FORBID_STATUS = '/space/getForbidStatus';
// 空间站-更改工作台设置
export const UPDATE_WORKBENCH_SETTING = '/space/updateWorkbenchSetting';
// 空间站-获取空间的特性
export const GET_SPACE_FEATURES = '/space/features';
// 空间站-获取空间的特性
export const SWITCH_NODEROLE_ASSIGNALE = '/space/updateNodeRoleAssignable';
// 空间站-获取第三方应用列表SINGLE_APP_INSTANCE
export const GET_MARKETPLACE_APPS = '/marketplace/integration/space/:spaceId/apps';

/**
 * 第三方应用集成改版
 */
// 空间站 - 获取第三方应用商店列表
export const GET_APPSTORES_APPS = '/appstores/apps';
// 空间站 - 查询/创建 应用实例
export const APP_INSTANCE = '/appInstances';
// 空间站 - 删除应用实例
export const SINGLE_APP_INSTANCE = '/appInstances/:appInstanceId';
// 空间站 - 飞书集成 - 更新基础配置
export const UPDATE_LARK_BASE_CONFIG = '/lark/appInstance/:appInstanceId/updateBaseConfig';
// 空间站 - 飞书集成 - 更新事件配置
export const UPDATE_LARK_EVENT_CONFIG = '/lark/appInstance/:appInstanceId/updateEventConfig';
/* ----- 第三方应用集成改版分割线 ----- */

// 空间站-更新企业安全设置
export const UPDATE_SECURITY_SETTING = '/space/updateSecuritySetting';

// 空间站-开启应用
export const APP_ENABLE = '/marketplace/integration/space/:spaceId/app/:appId/open';
// 空间站-关闭应用
export const APP_DISABLE = 'marketplace/integration/space/:spaceId/app/:appId/stop';

// 获取空间内容
export const SPACE_CONTENT = '/space/content/';
// 空间信息
export const SPACE_INFO = '/space/info/';
// 恢复空间
export const RECOVER_SPACE = '/space/cancel/';
// 空间容量
export const SPACE_MEMORY = '/space/capacity';
// 切换工作目录全员可见状态
export const UPDATE_ALL_VISIBLE = '/space/updateNodeVisibleStatus';
// 查询工作目录的全员可见状态
export const GET_ALL_VISIBLE = '/space/getNodeVisible';
// 空间统计
export const SPACE_STATISTICS = '/space/statistics';
// 订阅
export const SUBSCRIBE_INFO = '/space/subscribe/';
export const SUBSCRIBE_REMIND = '/player/notification/subscribe/remind';
export const SUBSCRIBE_ACTIVE_EVENT = '/events/active';
// 权限相关
export const SPACE_RESOURCE = '/space/resource';
export const NO_PERMISSION_MEMBER = '/node/remind/units/noPermission';
// 赠送附件空间容量明细
export const CAPACITY_REWARD_LIST = '/space/capacity/detail';
// 链接邀请
export const CREATE_LINK = '/space/link/generate';
export const LINK_LIST = '/space/link/list';
export const DELETE_LINK = '/space/link/delete';
export const LINK_VALID = '/space/link/valid';
export const JOIN_VIA_LINK = '/space/link/join';
// 申请加入空间
export const APPLY_JOIN_SPACE = '/space/apply/join';
// ================ 空间相关 ======================

// ================ 节点相关 ======================
// 获取根节点
export const GET_ROOT_NODE = '/node/root';
// 查询子节点列表
export const GET_NODE_LIST = '/node/children';
// 获取是否可以管理全员可见状态
export const ALLOW_VISIBLE_SETTING = '/node/allowManageWorkbenchSetting';
// 查询父节点到根节点的链条
export const GET_PARENTS = '/node/parents';
// 查询工作台的节点树，限制查询两层
export const GET_NODE_TREE = '/node/tree';
// 查询节点信息
export const GET_NODE_INFO = '/node/get';
// 根据父节点id查询所属的子节点
export const SELECTBYPARENTID = '/node/selectByParentId/';
// 移动节点
export const MOVE_NODE = '/node/move';
// 新增节点
export const ADD_NODE = '/node/create';
// 删除节点
export const DELETE_NODE = '/node/delete/';
// 编辑节点
export const EDIT_NODE = '/node/update/';
// 复制节点
export const COPY_NODE = '/node/copy';
// 获取数表ID
export const GET_DST_ID = '/node/getDstId/';
// 记录活动的数表标签页
export const KEEP_TAB_BAR = '/node/active';
// 目录树定位
export const POSITION_NODE = '/node/position/';
// 检索节点
// TODO: 待废弃
export const FIND_NODE = '/node/select';
// 搜索节点
export const SEARCH_NODE = '/node/search';
// 导入数表
export const IMPORT_FILE = '/node/import';
// 获取文件夹和文件的数量
export const NODE_NUMBER = '/node/count';
// 修改角色
export const UPDATE_ROLE = '/node/updateRole';
// 关闭节点分享
export const DISABLE_SHARE = '/node/disableShare/';
// 刷新节点分享链接
export const REGENERATE_SHARE_LINK = '/node/regenerateShareLink/';
// 获取节点分享设置
export const SHARE_SETTINGS = '/node/shareSettings/';
// 更新节点描述
export const CHANGE_NODE_DESC = '/node/updateDesc';
// 获取分享节点的信息
export const READ_SHARE_INFO = '/node/readShareInfo';
// 转存节点
export const STORE_SHARE_DATA = '/node/storeShareData';
// 更改节点分享设置
export const UPDATE_SHARE = '/node/updateShare/';
export const NODE_SHOWCASE = '/node/showcase';
// 成员字段提及其他人记录
export const COMMIT_REMIND = '/node/remind';
// 开启节点继承模式
export const ENABLE_ROLE_EXTEND = '/node/enableRoleExtend';
// 关闭节点继承模式
export const DISABLE_ROLE_EXTEND = '/node/disableRoleExtend';
// 删除节点角色
export const DELETE_ROLE = '/node/deleteRole';
// 查询节点角色列表
export const NODE_LIST_ROLE = '/node/listRole';
// 修改节点的组织单元所属角色
export const EDIT_ROLE = '/node/editRole';
// 批量修改节点权限
export const BATCH_EDIT_ROLE = '/node/batchEditRole';
// 删除节点权限
export const BATCH_DELETE_ROLE = 'node/batchDeleteRole';
// 添加节点指定角色的组织单元
export const ADD_ROLE = '/node/addRole';
// 查询回收站的节点列表
export const TRASH_LIST = '/node/rubbish/list';
// 恢复节点
export const TRASH_RECOVER = '/node/rubbish/recover';
// 删除回收站的节点
export const TRASH_DELETE = '/node/rubbish/delete/';
// 更改节点收藏状态
export const UPDATE_NODE_FAVORITE_STATUS = '/node/favorite/updateStatus/';
// 移动收藏节点位置
export const MOVE_FAVORITE_NODE = '/node/favorite/move';
// 查询收藏的节点列表
export const FAVORITE_NODE_LIST = '/node/favorite/list';
// 查询数表节点关联的神奇表单/镜像
export const DATASHEET_FOREIGN_FORM = '/node/getRelNode';
// 获取目录树中指定类型的节点
export const GET_SPECIFY_NODE_LIST = '/node/list';
// ================ 节点相关 ======================

// ================ 通讯录相关 ======================
// 通讯录-查询指定空间的部门列表
export const TEAM_LIST = '/org/team/branch';
// 通讯录-查询指定部门的成员列表
export const MEMBER_LIST = '/org/member/list';
// 通讯录-获取成员详情
export const MEMBER_INFO = '/org/member/read';
// 空间站-通讯录管理-成员管理-分页查询指定部门的成员列表
export const MEMBER_LIST_IN_SPACE = '/org/member/page';
// 空间站-通讯录管理-成员管理-修改部门信息
export const UPDATE_TEAM = '/org/team/update';
// 空间站-通讯录管理-成员管理-添加子部门
export const CREATE_TEAM = '/org/team/create';
// 空间站-通讯录管理-成员管理-查询部门信息
export const READ_TEAM = '/org/team/read';
// 通讯录-查询部门下的成员
export const TEAM_MEMBERS = '/org/team/members';
// 空间站-通讯录管理-成员管理-查询直属子部门列表
export const READ_SUB_TEAMS = '/org/team/subTeams';
// 空间站-通讯录管理-成员管理-删除部门
export const DELETE_TEAM = '/org/team/delete/';
// 空间站-通讯录管理-成员管理-编辑成员信息
export const UPDATE_MEMBER = '/org/member/updateInfo';
// 空间站-通讯录管理-成员管理-单个删除成员
export const SINGLE_DELETE_MEMBER = '/org/member/delete';
// 空间站-通讯录管理-成员管理-批量删除成员
export const BATCH_DELETE_MEMBER = '/org/member/deleteBatch';
// 空间站-通讯录管理-成员管理-搜索部门或成员
export const SEARCH_TEAM_MEMBER = '/org/search';
// 空间站-通讯录管理-成员管理-调整成员所属部门
export const UPDATE_MEMBER_TEAM = '/org/member/updateMemberTeam';
// 空间站-通讯录管理-成员管理-部门添加成员
export const TEAM_ADD_MEMBER = '/org/member/addMember';
// 空间站-通讯录管理-成员管理-搜索组织资源/添加部门成员modal中的搜索
export const GET_ADD_MEMBERS = '/org/search/unit';
// 空间站-判断空间内成员邮箱是否存在
export const EXIST_EMAIL = '/org/member/checkEmail';
// 空间站-邮件首次邀请外部成员
export const SEND_INVITE = '/org/member/sendInvite';
// 空间站-邮件再次邀请外部成员
export const RESEND_INVITE = '/org/member/sendInviteSingle';
// 空间站-下载员工信息表模版
export const DOWNLOAD_MEMBER_FILE = BASE_URL + '/org/member/downloadTemplate';
// 空间站-上传员工信息表
export const UPLOAD_MEMBER_FILE = '/org/member/uploadExcel';
// 空间站-子管理员-模糊搜索成员
export const MEMBER_SEARCH = '/org/member/search';
// 搜索组织资源
export const SEARCH_UNIT = '/org/searchUnit';
// 查询部门下的子部门和成员
export const GET_SUB_UNIT_LIST = '/org/getSubUnitList';
// 查询在空间内所属组织单元列表
export const MEMBER_UNITS = '/org/member/units';
// 编辑自己成员信息
export const MEMBER_UPDATE = '/org/member/update';
// 加载或者搜索成员
export const LOAD_OR_SEARCH = '/org/loadOrSearch';
// 根据提供的 name ，精确查找用户信息
export const SEARCH_UNIT_INFO_VO = 'org/searchUnitInfoVo';
// 处理“某人加入空间站”的消息
export const PROCESS_SPACE_JOIN = '/space/apply/process';
// ================ 通讯录相关 ======================

// ================ 模板相关 ======================
export const CREATE_TEMPLATE = '/template/create';
export const OFFICIAL_TEMPLATE_CATEGORY = '/template/categoryList';
export const TEMPLATE_LIST = '/template/list';
/*
* 获取官方模板分类内容
 */
export const TEMPLATE_CATEGORIES = '/template/categories/:categoryCode';
/*
* 加载空间站全部模板
 */
export const SPACE_TEMPLATES = '/spaces/:spaceId/templates';
export const DELETE_TEMPLATE = '/template/delete/';
export const TEMPLATE_DIRECTORY = '/template/directory';
/*
 * 模板专题内容
 */
export const TEMPLATE_ALBUMS = '/template/albums/:albumId';
/*
 * 模板专题推荐
 */
export const TEMPLATE_ALBUMS_RECOMMEND = '/template/albums/recommend';
export const USE_TEMPLATE = '/template/quote';
export const TEMPLATE_NAME_VALIDATE = '/template/validate';
export const TEMPLATE_RECOMMEND = '/template/recommend';
export const TEMPLATE_SEARCH = '/template/global/search';
// 新手引导
export const TRIGGER_WIZARD = '/player/activity/triggerWizard';
// 消息中心
export const NOTIFICATION_PAGE = '/player/notification/page';
export const NOTIFICATION_LIST = '/player/notification/list';
export const CREATE_NOTIFICATION = '/player/notification/create';
export const NOTIFICATION_STATISTICS = '/player/notification/statistics';
export const TRANSFER_NOTICE_TO_READ = '/player/notification/read';
// ================ V码 ======================
export const CODE_EXCHANGE = '/vcode/exchange/';
// ================ 第三方平台应用相关 ======================
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
// 获取集成租户环境配置
export const SOCIAL_TENANT_ENV = '/social/tenant/env';

// 钉钉扫码登陆回调
export const DINGTALK_H5_USER_LOGIN = '/social/dingtalk/agent/:agentId/user/login';
export const DINGTALK_H5_BIND_SPACE = '/social/dingtalk/agent/:agentId/bindSpace';
export const DINGTALK_REFRESH_ORG = '/social/dingtalk/agent/refresh/contact';
// ================ player相关 ======================

// ================ 风控相关 ======================
//  内容风控
export const CREATE_REPORTS = '/censor/createReports';
// ================ 风控相关 ======================

// ================ 资源相关 ======================
// 获取资源指定变更集列表
export const READ_CHANGESET = '/resource/:resourceId/changesets';
// 获取资源的关联表数据
export const READ_FOREIGN_DATASHEET_PACK = '/resource/:resourceId/foreignDatasheet/:foreignDatasheetId/dataPack';
// 获取分享资源的关联表数据
export const READ_SHARE_FOREIGN_DATASHEET_PACK = '/share/:shareId/resource/:resourceId/foreignDatasheet/:foreignDatasheetId/dataPack';
// 获取单条记录的评论和历史记录
export const GET_RECORD_ACTIVITY_LIST = '/resources/:resourceId/records/:recId/activity';

// ================ 数表相关 ======================
// 加载数表数据包
export const DATAPACK = '/datasheet/:dstId/dataPack';
// 获取数表指定记录列表
export const READ_RECORDS = '/datasheet/:dstId/records';
// 获取分享页面的表格数据
export const READ_SHARE_DATAPACK = '/share/:shareId/datasheet/:dstId/dataPack';
// 模版数据包
export const READ_TEMPLATE_DATAPACK = '/template/datasheet/:dstId/dataPack';
// 获取用户列表
export const GET_USER_LIST = '/datasheet/:nodeId/users';
// 获取数表对应的 Meta
export const READ_DATASHEET_META = '/datasheet/:dstId/meta';
export const GET_DATASHEET_SUBSCRIPTIONS = '/datasheets/:dstId/records/subscriptions'; // 获取数表被关注的record IDs GET
export const SUBSCRIBE_DATASHEET_RECORDS = '/datasheets/:dstId/records/subscriptions'; // 关注数表中的数据 POST
export const UNSUBSCRIBE_DATASHEET_RECORDS = '/datasheets/:dstId/records/subscriptions'; // 取消关注数表中的数据
// ================ 数表相关 ======================

// ================ 神奇表单相关 ================
// 加载表单数据
export const FORMPACK = '/form/:formId/dataPack';
// 获取表单分享页面数据
export const READ_SHARE_FORMPACK = '/share/:shareId/form/:formId/dataPack';
// 获取表单模版页面数据
export const READ_TEMPLATE_FORMPACK = '/template/:templateId/form/:formId/dataPack';
// 空间站内表单提交数据
export const FORM_ADD_RECORD = '/form/:formId/addRecord';
// 表单分享页面提交数据
export const SHARE_FORM_ADD_RECORD = '/share/:shareId/form/:formId/addRecord';
// 空间站内更新表单相关属性
export const UPDATE_FORM_PROPS = '/form/:formId/props';
// 空间站内获取表单所有属性
export const READ_FORM_PROPS = '/form/:formId/props';
// 空间站内更新表单相关属性
export const READ_FORM_SUBMIT_STATUS = '/form/:formId/submitStatus';
// ================ 神奇表单相关 ================

// ================ Socket相关 ======================
// 数表长链接
export const WEBSOCKET_NAMESPACE = '/room';
// 数表-协同操作长链接
export const ROOM_PATH = '/room';
// 消息通知长链接
export const NOTIFICATION_PATH = '/notification';
// ================ Socket相关 ======================

// ================ Widget 相关 ======================
export const INSTALLATION_WIDGETS = '/widget/get';
export const WIDGET_CENTER_LIST = '/widget/package/store/list';
export const INSTALL_WIDGET = '/widget/create';
export const COPY_WIDGET = '/widget/copy';
export const RECENT_INSTALL_WIDGET = '/space/:spaceId/widget';
export const GET_NODE_WIDGETS = '/node/:nodeId/widgetPack';
export const CREATE_WIDGET = '/widget/package/create';
// 获取节点安装的小组件信息，仅提供给预览所用，不包含完整的数据
export const GET_NODE_WIDGETS_PREVIOUS = '/node/:nodeId/widget';
// 获取小组件模版列表
export const GET_TEMPLATE_LIST = '/widget/template/package/list';
// 下架小组件
export const UNPUBLISH_WIDGET = '/widget/package/unpublish';
// 移交小组件
export const TRANSFER_OWNER = '/widget/package/transfer/owner';

// ================ Widget 相关 ======================

// ================ Dashboard 相关 ======================
export const FETCH_DASHBOARD = '/dashboard/:dashboardId/dataPack';
export const FETCH_SHARE_DASHBOARD = '/share/:shareId/dashboard/:dashboardId/dataPck';
export const FETCH_TEMPLATE_DASHBOARD = '/template/:templateId/dashboard/:dashboardId/dataPck';
// ================ Dashboard 相关 ======================

// ================ 列权限 相关 start ======================
export const FIELD_PERMISSION_ADD_ROLE = 'datasheet/:dstId/field/:fieldId/addRole';
export const FIELD_PERMISSION_DELETE_ROLE = 'datasheet/:dstId/field/:fieldId/deleteRole';
export const FIELD_PERMISSION_EDIT_ROLE = 'datasheet/:dstId/field/:fieldId/editRole';
export const FIELD_PERMISSION_ROLE_LIST = 'datasheet/:dstId/field/:fieldId/listRole';
export const FIELD_PERMISSION_STATUS = 'datasheet/:dstId/field/:fieldId/permission/:status';
export const FIELD_PERMISSION_UPDATE_SETTING = 'datasheet/:dstId/field/:fieldId/updateRoleSetting';
export const GET_FIELD_PERMISSION_MAP = 'datasheet/field/permission';
export const BATCH_EDIT_PERMISSION_ROLE = 'datasheet/:dstId/field/:fieldId/batchEditRole';
export const BATCH_DELETE_PERMISSION_ROLE = 'datasheet/:dstId/field/:fieldId/batchDeleteRole';
// ================ 列权限 相关 end ======================

// ================ mirror 相关 start ======================
export const READ_MIRROR_INFO = 'mirror/:mirrorId/info'; // 请求 mirror 本身的数据
export const READ_MIRROR_DATA_PACK = 'mirror/:mirrorId/dataPack'; // 请求 mirror 相关的数表的数据
export const READ_SHARE_MIRROR_INFO = 'share/:shareId/mirror/:mirrorId/info'; // 请求 mirror 相关的数表的数据
export const READ_SHARE_MIRROR_DATA_PACK = 'share/:shareId/mirror/:mirrorId/dataPack'; // 请求 mirror 相关的数表的数据
export const GET_MIRROR_SUBSCRIPTIONS = '/mirrors/:mirrorId/records/subscriptions'; // 获取Mirror数表被关注的record IDs
export const SUBSCRIBE_MIRROR_RECORDS = '/mirrors/:mirrorNodeId/records/subscriptions'; // 关注Mirror数表中的数据
export const UNSUBSCRIBE_MIRROR_RECORDS = '/mirrors/:mirrorNodeId/records/subscriptions'; // 取消关注Mirror数表中的数据
// ================ mirror 相关 end ======================
// ================ 视图开关 相关 start ======================
export const GET_DST_VIEW_DATA_PACK = 'datasheet/:dstId/view/:viewId/dataPack';
export const GET_SHARE_DST_VIEW_DATA_PACK = 'share/:shareId/datasheet/:dstId/view/:viewId/dataPack';
// ================ 视图开关 相关 end ======================

// 获取已开启实验性功能
export const GET_LABS_FEATURE = 'user/labs/features';
// 获取实验性功能列表
export const GET_LABS_FEATURE_LIST = 'labs/features';

export const GET_COMMENTS_BY_IDS = 'datasheet/:dstId/record/:recordId/comments';

export const APPLY_RESOURCE_CHANGESETS = 'resource/apply/changesets';

// poc 版本同步组织架构成员
export const SYNC_ORG_MEMBERS = 'social/oneaccess/copyTeamAndMembers';

// 获取节点信息 - 文件信息窗
export const GET_NODE_INFO_WINDOW = 'node/window';

// ================ 企微应用商店 相关 start ======================
export const GET_WECOM_TENANT_INFO = 'social/wecom/isv/datasheet/tenant/info'; // 获取租户绑定信息
export const GET_WECOM_SPACE_INFO = 'social/wecom/isv/datasheet/login/info'; // 获取企微第三方应用绑定的空间站信息
export const POST_WECOM_AUTO_LOGIN = 'social/wecom/isv/datasheet/login/code'; // 企微第三方跳转自动登录
export const POST_WECOM_SCAN_LOGIN = 'social/wecom/isv/datasheet/login/authCode'; // 企微扫码登录
export const POST_WECOM_LOGIN_ADMIN = 'social/wecom/isv/datasheet/login/adminCode'; // 企微跳转管理页自动登录
export const POST_WECOM_CHANGE_ADMIN = 'social/wecom/isv/datasheet/admin/change'; // 企微更换空间站主管理员
export const POST_WECOM_UNAUTHMEMBER_INVITE = 'social/wecom/isv/datasheet/invite/unauthMember'; // 授权模式邀请成员
// ================ 企微应用商店 相关 end ======================

// ================ 企微通讯录改造相关 start ====================
export const GET_WECOM_AGENT_CONFIG = 'social/wecom/isv/datasheet/jsSdk/agentConfig';
export const GET_WECOM_CONFIG = 'social/wecom/isv/datasheet/jsSdk/config';
// ================ 企微通讯录改造相关 end ====================

/* 订单模块相关的接口 start */
export const ORDER_PRICE = 'shop/prices';
export const ORDER_CREATE = 'orders';
export const ORDER_PAYMENT = 'orders/:orderId/payment';
export const ORDER_STATUS = 'orders/:orderId/paid';
export const DRY_RUN = 'orders/dryRun/generate';
export const PAID_CHECK = 'orders/:orderId/paidCheck\n';
/* 订单模块相关的接口 end */

// ============= 腾讯云玉符相关 start ====================//
export const GET_IDASS_LOGIN_URL = '/idaas/auth/login'; // 获取玉符IDass 登录跳转地址
export const IDAAS_LOGIN_CALLBACK = '/idaas/auth/callback';
export const IDAAS_CONTACT_SYNC = 'idaas/contact/sync';
export const IDAAS_GET_SPACE_BIND_INFO = '/idaas/auth/:spaceId/bindInfo';
// ============= 腾讯云玉符相关 end ====================//

// 获取URL相关信息, URL列识别用
export const GET_URL_META = '/internal/field/url/awareContent';
export const GET_URL_META_BATCH = '/internal/field/url/awareContents';

// 附件直传
export const UPLOAD_PRESIGNED_URL = '/asset/upload/preSignedUrl';
export const UPLOAD_CALLBACK = 'asset/upload/callback';

// ============= 角色相关 start ====================//
export const GET_ROLE_LIST = '/org/roles';
export const CREATE_NEW_ROLE = '/org/roles';
export const DELETE_ORG_ROLE = '/org/roles/:roleId';
export const UPDATE_ORG_ROLE = '/org/roles/:roleId';
export const GET_MEMBER_LIST_BY_ROLE = '/org/roles/:roleId/members';
export const ADD_ROLE_MEMBER = '/org/roles/:roleId/members';
export const DELETE_ROLE_MEMBER = '/org/roles/:roleId/members';
export const INIT_ROLE = '/org/roles/init';
// ============= 角色相关 end ====================//

// recently browsed folder
export const NODE_RECENTLY_BROWSED = '/node/recentList';
