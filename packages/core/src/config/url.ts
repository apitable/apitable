/**
 * Main API URL Address
 */
export const BASE_URL = '/api/v1';

// ================ User Authentication ====================

// login signin, register
export const SIGN_IN_OR_SIGN_UP = '/signIn';

/**
 * login, sign in, deprecated
 * 
 * @deprecate
 */
export const SIGN_IN = '/auth/signIn';

/**
 * register, sign up, deprecated
 * 
 * @deprecate
 */
export const SIGN_UP = '/auth/signUp';

// logout, sign out
export const SIGN_OUT = '/signOut';

// Close user, delete user
export const CLOSE_USER = '/user/applyForClosing';

// cancel delete user
export const CANCEL_CLOSE_USER = '/user/cancelClosing';

export const DINGTALK_LOGIN_CALLBACK = '/dingtalk/login/callback';
export const QQ_LOGIN_CALLBACK = '/tencent/web/callback';
export const WECHAT_LOGIN_CALLBACK = '/wechat/mp/web/callback';
export const WECOM_LOGIN_CALLBACK = '/social/wecom/user/login';

export const FEISHU_LOGIN_CALLBACK = '/social/feishu/auth/callback';

// ================ Authorization======================

// ================ Public stuffs ======================

/**
 * Send SMS verify code
 */
export const SEND_SMS_CODE = '/base/action/sms/code';

/**
 * Send email verify code
 */
export const SEND_EMAIL_CODE = '/base/action/mail/code';

/**
 * Validate SMS verify code
 */
export const VALIDATE_SMS_CODE = '/base/action/sms/code/validate';

/**
 * 
 * Validate email verify code.
 * 
 * When to use: 
 *   change email or space main admin when no phone number.
 * 
 */
export const VALIDATE_EMAIL_CODE = '/base/action/email/code/validate';

/**
 * Space - invite verify code validate
 */
export const INVITE_EMAIL_VERIFY = '/base/action/invite/valid';

/**
 * Upload attachments
 */
export const UPLOAD_ATTACH = '/base/attach/upload';

/**
 * The url to get attachment preview
 */
export const OFFICE_PREVIEW = '/base/attach/officePreview/:spaceId';

export const GET_CONTENT_DISPOSITION = '/attach/getContentDisposition';

// ================ Account ======================

/**
 * Get My Info (me)
 */
export const USER_ME = '/user/me';

/**
 * Check if the user can close or delete
 */
export const USER_CAN_LOGOUT = '/user/checkForClosing';

/**
 * Validate phone number and check if it has been registered
 */
export const USER_VALIDATE = '/user/validate';

/**
 * Space - check if the user's email is the same as the specified email
 */
export const EMAIL_VALIDATE = '/user/validate/email';

/**
 * Space - binding the invited email
 */
export const LINK_INVITE_EMAIL = '/user/link/inviteEmail';

/**
 * Space - check if the user has bound the email
 */
export const EMAIL_BIND = '/user/email/bind';

/**
 * Update (Edit) the user info
 */
export const UPDATE_USER = '/user/update';

/**
 * Change password
 */
export const UPDATE_PWD = '/user/updatePwd';

/**
 * Getting back the password
 */
export const RETRIEVE_PWD = '/user/retrievePwd';

/**
 * Create developer access token
 */
export const CREATE_API_KEY = '/user/createApiKey';

/**
 * Refresh developer access token
 */
export const REFRESH_API_KEY = '/user/refreshApiKey';

/**
 * Bind Email
 */
export const BIND_EMAIL = '/user/bindEmail';

/**
 * Bind phone number
 */
export const BIND_MOBILE = '/user/bindPhone';

/**
 * UnBind 3rd social account
 */
export const UN_BIND = '/user/unbind';

/**
 * Get user's points/credit
 */
export const USER_CREDIT = '/user/integral';

/**
 * query user's points/credit with with pagination
 */
export const USER_INTEGRAL_RECORDS = '/user/integral/records';

/**
 * Unbind phone number
 */
export const USER_UNBIND_MOBILE = '/user/unbindPhone';

/**
 * Unbind email
 */
export const USER_UNBIND_EMAIL = '/user/unbindEmail';

/**
 * invite code reward
 */
export const INVITE_CODE_REWARD = '/user/invite/reward';

// ================ Audit ======================

/**
 * Query space audit logs with pagination
 */
export const SPACE_AUDIT = '/space/:spaceId/audit';

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

// =============== Space related =======================
// get the space list
export const SPACE_LIST = '/space/list';
// create space
export const CREATE_SPACE = '/space/create';
// delete space
export const DELETE_SPACE = '/space/delete/:spaceId';
// switch space station
export const SWITCH_SPACE = '/space/:spaceId/switch';
// immediately delete the space
export const DELETE_SPACE_NOW = '/space/del';
// edit space
export const UPDATE_SPACE = '/space/update';
// remove the red dot from the space list
export const REMOVE_RED_POINT = '/space/remove/';
// exit space
export const QUIT_SPACE = '/space/quit/';
// space station-main administrator-get main administrator information
export const MAIN_ADMIN_INFO = '/space/manager';
// space station-main administrator-change main administrator
export const CHANGE_MAIN_ADMIN = '/space/changeManager';
// Space Station-Sub-Administrator-Query the list of administrators
export const LIST_ROLE = '/space/listRole';
// space station-sub-admin-get administrator information
export const SUB_ADMIN_PERMISSION = '/space/getRoleDetail';
// space station-sub-admin-add admin
export const ADD_SUB_ADMIN = '/space/addRole';
// space station-sub-admin-edit sub-admin
export const EDIT_SUB_ADMIN = '/space/editRole';
// space station-sub-admin-delete-admin
export const DELETE_SUB_ADMIN = '/space/deleteRole/';
// space station - change member settings
export const UPDATE_MEMBER_SETTING = '/space/updateMemberSetting';
// Space Station - Get the status of prohibiting all members from exporting the Wig table
export const FORBID_STATUS = '/space/getForbidStatus';
// space station - change workbench settings
export const UPDATE_WORKBENCH_SETTING = '/space/updateWorkbenchSetting';
// space station - get the properties of space
export const GET_SPACE_FEATURES = '/space/features';
// space station - get the properties of space
export const SWITCH_NODEROLE_ASSIGNALE = '/space/updateNodeRoleAssignable';
// Space Station - Get a list of third-party apps SINGLE_APP_INSTANCE
export const GET_MARKETPLACE_APPS = '/marketplace/integration/space/:spaceId/apps';
/**
  * Third-party application integration revision
  */
// space station - get a list of 3rd party app stores
export const GET_APPSTORES_APPS = '/appstores/apps';
// space station - query/create application instance
export const APP_INSTANCE = '/appInstances';
// space station - delete application instance
export const SINGLE_APP_INSTANCE = '/appInstances/:appInstanceId';
// Space Station - Feishu Integration - Update Basic Configuration
export const UPDATE_LARK_BASE_CONFIG = '/lark/appInstance/:appInstanceId/updateBaseConfig';
// Space Station - Feishu Integration - Update Event Configuration
export const UPDATE_LARK_EVENT_CONFIG = '/lark/appInstance/:appInstanceId/updateEventConfig';
/* ----- Third-party application integration revision dividing line ----- */

// space station - update enterprise security settings
export const UPDATE_SECURITY_SETTING = '/space/updateSecuritySetting';

// space station - start the application
export const APP_ENABLE = '/marketplace/integration/space/:spaceId/app/:appId/open';
// space station - close the app
export const APP_DISABLE = 'marketplace/integration/space/:spaceId/app/:appId/stop';
// get the space content
export const SPACE_CONTENT = '/space/content/';
// Spatial information
export const SPACE_INFO = '/space/info/';
// restore space
export const RECOVER_SPACE = '/space/cancel/';
// space capacity
export const SPACE_MEMORY = '/space/capacity';
// Toggle the working directory to be visible to all members
export const UPDATE_ALL_VISIBLE = '/space/updateNodeVisibleStatus';
// Query the visibility status of all members of the working directory
export const GET_ALL_VISIBLE = '/space/getNodeVisible';
// spatial statistics
export const SPACE_STATISTICS = '/space/statistics';
// subscribe
export const SUBSCRIBE_INFO = '/space/subscribe/';
export const SUBSCRIBE_REMIND = '/player/notification/subscribe/remind';
export const SUBSCRIBE_ACTIVE_EVENT = '/events/active';
// permission related
export const SPACE_RESOURCE = '/space/resource';
export const NO_PERMISSION_MEMBER = '/node/remind/units/noPermission';
// Give attachment space capacity details
export const CAPACITY_REWARD_LIST = '/space/capacity/detail';
// link invite
export const CREATE_LINK = '/space/link/generate';
export const LINK_LIST = '/space/link/list';
export const DELETE_LINK = '/space/link/delete';
export const LINK_VALID = '/space/link/valid';
export const JOIN_VIA_LINK = '/space/link/join';
// apply to join the space
export const APPLY_JOIN_SPACE = '/space/apply/join';
// =============== Space related =======================

// =============== Node related =======================
// get the root node
export const GET_ROOT_NODE = '/node/root';
// Query the list of child nodes
export const GET_NODE_LIST = '/node/children';
// Get whether you can manage the visible state of all members
export const ALLOW_VISIBLE_SETTING = '/node/allowManageWorkbenchSetting';
// Query the chain from parent node to root node
export const GET_PARENTS = '/node/parents';
// Query the node tree of the workbench, limit the query to two layers
export const GET_NODE_TREE = '/node/tree';
// Query node information
export const GET_NODE_INFO = '/node/get';
// Query the child node to which it belongs based on the parent node id
export const SELECTBYPARENTID = '/node/selectByParentId/';
// move node
export const MOVE_NODE = '/node/move';
// add node
export const ADD_NODE = '/node/create';
// delete node
export const DELETE_NODE = '/node/delete/';
// edit node
export const EDIT_NODE = '/node/update/';
// copy node
export const COPY_NODE = '/node/copy';
// Get the table ID
export const GET_DST_ID = '/node/getDstId/';
// record active table tab
export const KEEP_TAB_BAR = '/node/active';
// directory tree location
export const POSITION_NODE = '/node/position/';
// retrieve node

// TODO: to be discarded
export const FIND_NODE = '/node/select';
// search node
export const SEARCH_NODE = '/node/search';
// import datasheet
export const IMPORT_FILE = '/node/import';
// Get the number of folders and files
export const NODE_NUMBER = '/node/count';
// modify the character
export const UPDATE_ROLE = '/node/updateRole';
// close node sharing
export const DISABLE_SHARE = '/node/disableShare/';
// Refresh the node share link
export const REGENERATE_SHARE_LINK = '/node/regenerateShareLink/';
// Get node sharing settings
export const SHARE_SETTINGS = '/node/shareSettings/';
// update node description
export const CHANGE_NODE_DESC = '/node/updateDesc';
// Get the information of the shared node
export const READ_SHARE_INFO = '/node/readShareInfo';
// dump node
export const STORE_SHARE_DATA = '/node/storeShareData';
// Change node sharing settings
export const UPDATE_SHARE = ​​'/node/updateShare/';
export const NODE_SHOWCASE = '/node/showcase';
// Member field mentions other records
export const COMMIT_REMIND = '/node/remind';
// Enable node inheritance mode
export const ENABLE_ROLE_EXTEND = '/node/enableRoleExtend';
// Turn off node inheritance mode
export const DISABLE_ROLE_EXTEND = '/node/disableRoleExtend';
// delete node role
export const DELETE_ROLE = '/node/deleteRole';
// Query the list of node roles
export const NODE_LIST_ROLE = '/node/listRole';
// Modify the role of the node's organizational unit
export const EDIT_ROLE = '/node/editRole';
// Batch modify node permissions
export const BATCH_EDIT_ROLE = '/node/batchEditRole';
// delete node permissions
export const BATCH_DELETE_ROLE = 'node/batchDeleteRole';
// Add the organizational unit of the specified role of the node
export const ADD_ROLE = '/node/addRole';
// Query the node list of the recycle bin
export const TRASH_LIST = '/node/rubbish/list';
// restore node
export const TRASH_RECOVER = '/node/rubbish/recover';
// delete the node from the recycle bin
export const TRASH_DELETE = '/node/rubbish/delete/';
// Change the node collection state
export const UPDATE_NODE_FAVORITE_STATUS = '/node/favorite/updateStatus/';
// Move the collection node position
export const MOVE_FAVORITE_NODE = '/node/favorite/move';
// Query the list of favorite nodes
export const FAVORITE_NODE_LIST = '/node/favorite/list';
// Query the magic form/mirror associated with the data table node
export const DATASHEET_FOREIGN_FORM = '/node/getRelNode';
// Get the node of the specified type in the directory tree
export const GET_SPECIFY_NODE_LIST = '/node/list';
// =============== Node related =======================

// ================ Contacts related =======================
// Address Book - Query the department list of the specified space
export const TEAM_LIST = '/org/team/branch';
// Address Book - Query the member list of the specified department
export const MEMBER_LIST = '/org/member/list';
// address book - get member details
export const MEMBER_INFO = '/org/member/read';
// Space Station-Address Book Management-Member Management-Pagination to query the member list of the specified department
export const MEMBER_LIST_IN_SPACE = '/org/member/page';
// Space station - address book management - member management - modify department information
export const UPDATE_TEAM = '/org/team/update';
// Space station - address book management - member management - add sub-departments
export const CREATE_TEAM = '/org/team/create';
// Space station - address book management - member management - query department information
export const READ_TEAM = '/org/team/read';
// address book - query the members under the department
export const TEAM_MEMBERS = '/org/team/members';
// Space station - address book management - member management - query the list of subordinate departments
export const READ_SUB_TEAMS = '/org/team/subTeams';
// Space station - address book management - member management - delete department
export const DELETE_TEAM = '/org/team/delete/';
// Space station - address book management - member management - edit member information
export const UPDATE_MEMBER = '/org/member/updateInfo';
// Space station - address book management - member management - single delete member
export const SINGLE_DELETE_MEMBER = '/org/member/delete';
// Space station - address book management - member management - batch delete members
export const BATCH_DELETE_MEMBER = '/org/member/deleteBatch';
// Space station - address book management - member management - search department or member
export const SEARCH_TEAM_MEMBER = '/org/search';
// Space station - address book management - member management - adjust the department to which members belong
export const UPDATE_MEMBER_TEAM = '/org/member/updateMemberTeam';
// Space station - address book management - member management - department adding members
export const TEAM_ADD_MEMBER = '/org/member/addMember';
// Space station - address book management - 
// member management - search for organizational resources / search in the modal of adding department members
export const GET_ADD_MEMBERS = '/org/search/unit';
// Space station - determine whether member mailboxes exist in the space
export const EXIST_EMAIL = '/org/member/checkEmail';
// Space Station - Mail invites external members for the first time
export const SEND_INVITE = '/org/member/sendInvite';
// space station-mail invites external members again
export const RESEND_INVITE = '/org/member/sendInviteSingle';
// Space station - download employee information form template
export const DOWNLOAD_MEMBER_FILE = BASE_URL + '/org/member/downloadTemplate';
// space station - upload employee information form
export const UPLOAD_MEMBER_FILE = '/org/member/uploadExcel';
// space station-sub-admin-fuzzy search member
export const MEMBER_SEARCH = '/org/member/search';
// search for org resources
export const SEARCH_UNIT = '/org/searchUnit';
// Query the sub-departments and members under the department
export const GET_SUB_UNIT_LIST = '/org/getSubUnitList';
// Query the list of organizational units that belong to the space
export const MEMBER_UNITS = '/org/member/units';

/**
 * Edit Member Info
 */
export const MEMBER_UPDATE = '/org/member/update';
// load or search for members
export const LOAD_OR_SEARCH = '/org/loadOrSearch';
// Accurately find user information based on the provided name
export const SEARCH_UNIT_INFO_VO = 'org/searchUnitInfoVo';
// handle the "someone joined the space station" message
export const PROCESS_SPACE_JOIN = '/space/apply/process';
// ================ Contacts related =======================

// =============== Template related =======================
export const CREATE_TEMPLATE = '/template/create';
export const OFFICIAL_TEMPLATE_CATEGORY = '/template/categoryList';
export const TEMPLATE_LIST = '/template/list';
/*
* Get official template category content
 */
export const TEMPLATE_CATEGORIES = '/template/categories/:categoryCode';
/*
* Load all templates of space station
 */
export const SPACE_TEMPLATES = '/spaces/:spaceId/templates';
export const DELETE_TEMPLATE = '/template/delete/';
export const TEMPLATE_DIRECTORY = '/template/directory';
/*
  * Template topic content
  */
export const TEMPLATE_ALBUMS = '/template/albums/:albumId';
/*
  * Template topic recommendation
  */
export const TEMPLATE_ALBUMS_RECOMMEND = '/template/albums/recommend';
export const USE_TEMPLATE = '/template/quote';
export const TEMPLATE_NAME_VALIDATE = '/template/validate';
export const TEMPLATE_RECOMMEND = '/template/recommend';
export const TEMPLATE_SEARCH = '/template/global/search';
// Beginner's guide
export const TRIGGER_WIZARD = '/player/activity/triggerWizard';

// Message Center
export const NOTIFICATION_PAGE = '/player/notification/page';
export const NOTIFICATION_LIST = '/player/notification/list';
export const CREATE_NOTIFICATION = '/player/notification/create';
export const NOTIFICATION_STATISTICS = '/player/notification/statistics';
export const TRANSFER_NOTICE_TO_READ = '/player/notification/read';

// =============== V code =======================
export const CODE_EXCHANGE = '/vcode/exchange/';

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
// =============== player related =======================

// ================ Risk control related =======================
// Content risk control
export const CREATE_REPORTS = '/censor/createReports';
// ================ Risk control related =======================

// =============== Resource related =======================
// Get a list of resource-specific changesets
export const READ_CHANGESET = '/resource/:resourceId/changesets';
// Get the associated table data of the resource
export const READ_FOREIGN_DATASHEET_PACK = '/resource/:resourceId/foreignDatasheet/:foreignDatasheetId/dataPack';
// Get the associated table data of the shared resource
export const READ_SHARE_FOREIGN_DATASHEET_PACK = '/share/:shareId/resource/:resourceId/foreignDatasheet/:foreignDatasheetId/dataPack';
// Get comments and history for a single record
export const GET_RECORD_ACTIVITY_LIST = '/resources/:resourceId/records/:recId/activity';

// =============== datasheet related =======================
// load table data package
export const DATAPACK = '/datasheet/:dstId/dataPack';
// Get the list of specified records in the datasheet
export const READ_RECORDS = '/datasheet/:dstId/records';
// Get the form data of the share page
export const READ_SHARE_DATAPACK = '/share/:shareId/datasheet/:dstId/dataPack';
// template packet
export const READ_TEMPLATE_DATAPACK = '/template/datasheet/:dstId/dataPack';
// get user list
export const GET_USER_LIST = '/datasheet/:nodeId/users';
// Get the Meta corresponding to the datasheet
export const READ_DATASHEET_META = '/datasheet/:dstId/meta';
export const GET_DATASHEET_SUBSCRIPTIONS = '/datasheets/:dstId/records/subscriptions'; // Get the concerned record IDs of the datasheet GET
export const SUBSCRIBE_DATASHEET_RECORDS = '/datasheets/:dstId/records/subscriptions'; // Follow the data in the datasheet POST
export const UNSUBSCRIBE_DATASHEET_RECORDS = '/datasheets/:dstId/records/subscriptions'; // Unfollow the data in the datasheets

// =============== datasheet related =======================
// ================ form ================
// load form data
export const FORMPACK = '/form/:formId/dataPack';
// Get form share page data
export const READ_SHARE_FORMPACK = '/share/:shareId/form/:formId/dataPack';
// Get form template page data
export const READ_TEMPLATE_FORMPACK = '/template/:templateId/form/:formId/dataPack';
// Form submission data in the space station
export const FORM_ADD_RECORD = '/form/:formId/addRecord';
// form share page submit data
export const SHARE_FORM_ADD_RECORD = '/share/:shareId/form/:formId/addRecord';
// Update form related properties in the space station
export const UPDATE_FORM_PROPS = '/form/:formId/props';
// Get all the properties of the form in the space station
export const READ_FORM_PROPS = '/form/:formId/props';
// Update form related properties in the space station
export const READ_FORM_SUBMIT_STATUS = '/form/:formId/submitStatus';
// =============== Magic form related ===============

// =============== Socket =======================
// datasheet long link
export const WEBSOCKET_NAMESPACE = '/room';
// datasheet - collaborative operation long link
export const ROOM_PATH = '/room';
// message notification long link
export const NOTIFICATION_PATH = '/notification';
// =============== Socket related =======================

// ================ Widget related =======================
export const INSTALLATION_WIDGETS = '/widget/get';
export const WIDGET_CENTER_LIST = '/widget/package/store/list';
export const INSTALL_WIDGET = '/widget/create';
export const COPY_WIDGET = '/widget/copy';
export const RECENT_INSTALL_WIDGET = '/space/:spaceId/widget';
export const GET_NODE_WIDGETS = '/node/:nodeId/widgetPack';
export const CREATE_WIDGET = '/widget/package/create';
// Get the widget information installed by the node, which is only provided for preview, does not contain complete data
export const GET_NODE_WIDGETS_PREVIOUS = '/node/:nodeId/widget';
// Get a list of widget templates
export const GET_TEMPLATE_LIST = '/widget/template/package/list';
// remove widget
export const UNPUBLISH_WIDGET = '/widget/package/unpublish';
// hand over widget
export const TRANSFER_OWNER = '/widget/package/transfer/owner';

// ================ Widget related =======================

// =============== Dashboard related =======================
export const FETCH_DASHBOARD = '/dashboard/:dashboardId/dataPack';
export const FETCH_SHARE_DASHBOARD = '/share/:shareId/dashboard/:dashboardId/dataPck';
export const FETCH_TEMPLATE_DASHBOARD = '/template/:templateId/dashboard/:dashboardId/dataPck';
// =============== Dashboard related =======================

// =============== Column permissions related start =======================
export const FIELD_PERMISSION_ADD_ROLE = 'datasheet/:dstId/field/:fieldId/addRole';
export const FIELD_PERMISSION_DELETE_ROLE = 'datasheet/:dstId/field/:fieldId/deleteRole';
export const FIELD_PERMISSION_EDIT_ROLE = 'datasheet/:dstId/field/:fieldId/editRole';
export const FIELD_PERMISSION_ROLE_LIST = 'datasheet/:dstId/field/:fieldId/listRole';
export const FIELD_PERMISSION_STATUS = 'datasheet/:dstId/field/:fieldId/permission/:status';
export const FIELD_PERMISSION_UPDATE_SETTING = 'datasheet/:dstId/field/:fieldId/updateRoleSetting';
export const GET_FIELD_PERMISSION_MAP = 'datasheet/field/permission';
export const BATCH_EDIT_PERMISSION_ROLE = 'datasheet/:dstId/field/:fieldId/batchEditRole';
export const BATCH_DELETE_PERMISSION_ROLE = 'datasheet/:dstId/field/:fieldId/batchDeleteRole';
// =============== Column permissions related end =======================

// ================ mirror related start =======================
export const READ_MIRROR_INFO = 'mirror/:mirrorId/info'; // Request mirror data
export const READ_MIRROR_DATA_PACK = 'mirror/:mirrorId/dataPack'; // Request the data of the mirror-related table
export const READ_SHARE_MIRROR_INFO = 'share/:shareId/mirror/:mirrorId/info'; // Request the data of mirror-related tables
export const READ_SHARE_MIRROR_DATA_PACK = 'share/:shareId/mirror/:mirrorId/dataPack'; // Request the data of the mirror-related table
export const GET_MIRROR_SUBSCRIPTIONS = '/mirrors/:mirrorId/records/subscriptions'; // Get the concerned record IDs of the mirror table
export const SUBSCRIBE_MIRROR_RECORDS = '/mirrors/:mirrorNodeId/records/subscriptions'; // Pay attention to the data in the mirror table
export const UNSUBSCRIBE_MIRROR_RECORDS = '/mirrors/:mirrorNodeId/records/subscriptions'; // Unfollow the data in the mirror table
// =============== mirror related end =======================

// ================ View switch related start =======================
export const GET_DST_VIEW_DATA_PACK = 'datasheet/:dstId/view/:viewId/dataPack';
export const GET_SHARE_DST_VIEW_DATA_PACK = 'share/:shareId/datasheet/:dstId/view/:viewId/dataPack';
// =============== View switch related end =======================

// Get the experimental features that are enabled
export const GET_LABS_FEATURE = 'user/labs/features';
// Get a list of experimental features
export const GET_LABS_FEATURE_LIST = 'labs/features';

export const GET_COMMENTS_BY_IDS = 'datasheet/:dstId/record/:recordId/comments';

export const APPLY_RESOURCE_CHANGESETS = 'resource/apply/changesets';

// poc version synchronization organization structure members
export const SYNC_ORG_MEMBERS = 'social/oneaccess/copyTeamAndMembers';

// Get node information - file information window
export const GET_NODE_INFO_WINDOW = 'node/window';

// ================ Wecom App Store related start =======================
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

/* Order module related interface start */
export const ORDER_PRICE = 'shop/prices';
export const ORDER_CREATE = 'orders';
export const ORDER_PAYMENT = 'orders/:orderId/payment';
export const ORDER_STATUS = 'orders/:orderId/paid';
export const DRY_RUN = 'orders/dryRun/generate';
export const PAID_CHECK = 'orders/:orderId/paidCheck\n';
/* Order module related interface end */
// ============ Tencent iDaaS related start =====================//
export const GET_IDASS_LOGIN_URL = '/idaas/auth/login'; // Get IDass login jump address
export const IDAAS_LOGIN_CALLBACK = '/idaas/auth/callback';
export const IDAAS_CONTACT_SYNC = 'idaas/contact/sync';
export const IDAAS_GET_SPACE_BIND_INFO = '/idaas/auth/:spaceId/bindInfo';
// ============ Tencent iDaaSrelated end =====================//

// Get URL related information, used for URL column identification
export const GET_URL_META = '/internal/field/url/awareContent';
export const GET_URL_META_BATCH = '/internal/field/url/awareContents';

// Attachment direct upload
export const UPLOAD_PRESIGNED_URL = '/asset/upload/preSignedUrl';
export const UPLOAD_CALLBACK = 'asset/upload/callback';

// ============ Character related start =====================//
export const GET_ROLE_LIST = '/org/roles';
export const CREATE_NEW_ROLE = '/org/roles';
export const DELETE_ORG_ROLE = '/org/roles/:roleId';
export const UPDATE_ORG_ROLE = '/org/roles/:roleId';
export const GET_MEMBER_LIST_BY_ROLE = '/org/roles/:roleId/members';
export const ADD_ROLE_MEMBER = '/org/roles/:roleId/members';
export const DELETE_ROLE_MEMBER = '/org/roles/:roleId/members';
export const INIT_ROLE = '/org/roles/init';
// ============ Character related end =====================//

// recently browsed folder
export const NODE_RECENTLY_BROWSED = '/node/recentList';