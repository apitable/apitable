import { IGetCommentsByIdsResponse } from 'api/datasheet_api.interface';
import axios from 'axios';
import { ConfigConstant, Url } from 'config';
import { ILocalChangeset } from 'engine';
import {
  BindAccount,
  IAddIsActivedMemberInfo,
  IApiWrapper,
  IInviteMemberList,
  ILocateIdMap,
  ILogoutResult,
  IMemberInfoInAddressList,
  INode,
  INodesMapItem,
  IParent,
  IRubbishListParams,
  IUpdateMemberInfo,
  IUpdateRoleData,
  IUserInfo,
  QrAction,
} from 'store';
import { IAxiosResponse } from 'types';
import urlcat from 'urlcat';
import { NodeType, ShowRecordHistory } from '../config/constant';
import {
  IAdData,
  ICommitRemind,
  ICreateNotification,
  ICreateOrderResponse,
  IGetSpaceAuditReq,
  IGetUploadCertificateResponse,
  ILabsFeatureListResponse,
  ILoadOrSearchArg,
  INodeInfoWindowResponse,
  INoPermissionMemberResponse,
  IPayOrderResponse,
  IQueryOrderDiscountResponse,
  IQueryOrderPriceResponse,
  IQueryOrderStatusResponse,
  ISignIn,
  ISocialWecomGetConfigResponse,
  ISubscribeActiveEventResponse,
  ISyncMemberRequest,
  ITemplateRecommendResponse,
  IUpdateSecuritySetting,
  IWecomAgentBindSpaceResponse,
} from './api.interface';

axios.defaults.baseURL = Url.BASE_URL;
const CancelToken = axios.CancelToken;
const nestBaseURL = process.env.NEXT_PUBLIC_NEXT_API;

// 登录/注册（直接拿到身份 token）
export function signInOrSignUp(data: ISignIn) {
  return axios.post(Url.SIGN_IN_OR_SIGN_UP, { ...data });
}

// 登录
export function signIn(data: ISignIn) {
  return axios.post(Url.SIGN_IN, { ...data });
}

// 登出
export function signOut() {
  return axios.post<IApiWrapper & { data: ILogoutResult }>(Url.SIGN_OUT);
}

// 注销
export function logout() {
  return axios.post(Url.LOGOUT);
}

// 撤销注销
export function revokeLogout() {
  return axios.post(Url.UNLOGOUT);
}

/**
 * 注册
 * @param phone 手机号码
 * @param password 密码
 * @param code 手机验证码
 */
export function signUp(token?: string, inviteCode?: string) {
  return axios.post(Url.SIGN_UP, {
    token,
    inviteCode,
  });
}

export function dingtalkLoginCallback(state: string, code: string, type = 0) {
  return axios.get(Url.DINGTALK_LOGIN_CALLBACK, {
    params: {
      state,
      code,
      type,
    },
  });
}

export function qqLoginCallback(code: string, accessToken: string, expiresIn: string, type = 0) {
  return axios.get(Url.QQ_LOGIN_CALLBACK, {
    params: {
      code,
      accessToken,
      expiresIn,
      type,
    },
  });
}

export function wechatLoginCallback(code: string, state: string) {
  return axios.get(Url.WECHAT_LOGIN_CALLBACK, {
    params: {
      code,
      state,
    },
  });
}

export function wecomLoginCallback(code: string, agentId: string, corpId: string) {
  return axios.post(Url.WECOM_LOGIN_CALLBACK, { code, agentId, corpId });
}

// 获取/刷新公众号二维码
export function getOfficialAccountsQrCode(type: number) {
  return axios.get(Url.OFFICIAL_ACCOUNTS_QRCODE, {
    params: {
      type,
    },
  });
}

// 公众号轮询
export function officialAccountsPoll(mark: string, type: number) {
  return axios.get(Url.OFFICIAL_ACCOUNTS_POLL, {
    params: {
      mark,
      type,
    },
  });
}

/**
 * 获取手机验证码
 * @param phone 手机号码
 * @param type 使用场景类型，如1：注册、  3：修改密码
 * @param data 无痕验证的风控参数
 */
export function getSmsCode(areaCode: string, phone: string, type: number, data?: string) {
  return axios.post(Url.SEND_SMS_CODE, {
    areaCode,
    phone,
    type,
    data,
  });
}

// 获取个人信息
export function getUserMe(locateIdMap: ILocateIdMap = { spaceId: '', nodeId: '' }, filter = false, headers?: Record<string, string>) {
  return axios.get<IApiWrapper & { data: IUserInfo }>(Url.USER_ME, {
    params: {
      ...locateIdMap,
      filter,
    },
    headers,
  });
}

// 获取个人信息
export function getUserCanLogout() {
  return axios.get<IApiWrapper & { data: boolean }>(Url.USER_CAN_LOGOUT);
}

// 查询用户是否与指定邮箱一致
export function validateEmail(email: string) {
  return axios.post(Url.EMAIL_VALIDATE, { email });
}

// 关联受邀邮箱
export function linkInviteEmail(spaceId: string, email: string) {
  return axios.post(Url.LINK_INVITE_EMAIL, { spaceId, email });
}

export function submitInviteCode(inviteCode: string) {
  return axios.post(Url.SUBMIT_INVITE_CODE, { inviteCode });
}

// 查询用户是否绑定邮箱
export function emailBind() {
  return axios.get(Url.EMAIL_BIND);
}

/**
 * 编辑用户信息
 * @param info 要设置的信息
 */
export function updateUser(info: { avatar?: string; nickName?: string | null; locale?: string; init?: boolean }) {
  return axios.post(Url.UPDATE_USER, info);
}

/**
 * 编辑用户信息
 * @param info 要设置的信息
 */
export function updateOwnerMemberInfo(memberName: string) {
  return axios.post(Url.MEMBER_UPDATE, { memberName });
}

// 查询工作台的节点树，限制查询两层
export function getNodeTree(depth?: number) {
  return axios.get(Url.GET_NODE_TREE, {
    params: {
      depth,
    },
  });
}

// 获取根节点
export function getRootNode() {
  return axios.get(Url.GET_ROOT_NODE);
}

// 查询子节点列表
export function getChildNodeList(nodeId: string) {
  return axios.get<IApiWrapper & { data: Omit<INodesMapItem, 'children'>[] }>(Url.GET_NODE_LIST, {
    params: {
      nodeId,
    },
  });
}

export function getParents(nodeId: string) {
  return axios.get<IApiWrapper & { data: IParent[] }>(Url.GET_PARENTS, {
    params: {
      nodeId,
    },
  });
}

// 查询节点信息
export function getNodeInfo(nodeIds: string) {
  return axios.get(Url.GET_NODE_INFO, {
    params: {
      nodeIds,
    },
  });
}

/**
 * 根据父节点id查询所属的子节点
 * @param parentId 父节点的ID
 */
export function getNodeListByParentId(parentId: string) {
  return axios.get(Url.SELECTBYPARENTID + parentId);
}

/**
 * 查询数表节点关联的神奇表单/镜像
 * @param dstId 数表的ID
 * @param viewId 视图的ID。未指定时查询所有视图的关联节点
 * @param type   关联节点类型。未指定时查询所有关联类型
 */
export function getRelateNodeByDstId(dstId: string, viewId?: string, type?: number) {
  return axios.get(Url.DATASHEET_FOREIGN_FORM, {
    params: {
      nodeId: dstId,
      viewId,
      type,
    },
  });
}

/**
 * 创建空间
 * @param name 空间名称
 * @param isFirst 是否是初创空间
 */
export function createSpace(name: string) {
  return axios.post(Url.CREATE_SPACE, {
    name,
  });
}

/**
 * 移动节点
 * @param nodeId 被移动的节点ID
 * @param parentId 拖放位置的父节点ID
 * @param index 索引
 */
export function nodeMove(nodeId: string, parentId: string, preNodeId?: string) {
  return axios.post(Url.MOVE_NODE, {
    nodeId,
    parentId,
    preNodeId,
  });
}

/**
 * 添加节点
 * @param nodeName 节点名称
 * @param type 节点类型
 * @param index 添加位置
 * @param parentId 父节点ID
 * @param spaceId 空间ID
 */
export function addNode(nodeInfo: { parentId: string; type: number; nodeName?: string; preNodeId?: string; extra?: { [key: string]: any } }) {
  return axios.post(Url.ADD_NODE, nodeInfo);
}

/**
 * 删除节点
 * @param nodeId 节点ID
 */
export function delNode(nodeId: string) {
  return axios.delete(Url.DELETE_NODE + nodeId);
}

export function getSpecifyNodeList(nodeType: NodeType) {
  return axios.get(Url.GET_SPECIFY_NODE_LIST, {
    params: {
      type: nodeType,
    },
  });
}

/**
 * 编辑节点
 * @param nodeId 节点ID
 * @param nodeName 节点名称
 */
export function editNode(nodeId: string, data: { nodeName?: string; icon?: string; cover?: string; showRecordHistory?: ShowRecordHistory }) {
  return axios.post(Url.EDIT_NODE + nodeId, data);
}

/**
 * 复制数表
 * @param {string} nodeId 节点ID
 * @param {number} index 节点插入的位置
 */
export function copyNode(nodeId: string, copyAll: boolean) {
  return axios.post(Url.COPY_NODE, {
    nodeId,
    data: copyAll,
  });
}

/**
 * 获取数表ID
 * @param nodeId 节点ID
 */
export function getDstId(nodeId: string) {
  return axios.get(Url.GET_DST_ID + nodeId);
}

/**
 * 记录活动的数表标签页
 * @param activeNodeId 当前活动item ID
 * @param activeNodes 标签栏数组
 */
export function keepTabbar(data: { nodeId?: string; viewId?: string }) {
  return axios.post(Url.KEEP_TAB_BAR, data);
}

/**
 * 定位节点
 * @param nodeId 节点ID
 */
export function positionNode(nodeId: string) {
  return axios.get(Url.POSITION_NODE + nodeId);
}

// 查询在空间内所属组织单元列表
export function getUnitsByMember() {
  return axios.get(Url.MEMBER_UNITS);
}

/**
 * 通讯录-部门列表
 * 空间站-通讯录管理-成员管理
 * 查询指定空间的部门列表
 */
export function getTeamList() {
  return axios.get(Url.TEAM_LIST);
}

/**
 * 通讯录-成员列表
 * 查询指定部门的成员列表
 * @param teamId 部门ID，根部门可不填，默认为0
 */
export function getMemberList(teamId?: string): Promise<IAxiosResponse<IMemberInfoInAddressList[]>> {
  return axios.get(Url.MEMBER_LIST, {
    params: {
      teamId,
    },
  });
}

/**
 * 通讯录-成员信息
 * 获取成员详情
 * @param memberId  成员ID
 * @param userId    用户ID
 */
export function getMemberInfo({ memberId, uuid }: { memberId?: string; uuid?: string }) {
  return axios.get<IApiWrapper & { data: IMemberInfoInAddressList }>(Url.MEMBER_INFO, {
    params: {
      memberId,
      uuid,
    },
  });
}

/**
 * 获取空间列表
 */
export function spaceList(onlyManageable?: boolean) {
  return axios.get(Url.SPACE_LIST, { params: { onlyManageable }});
}

/**
 * 退出空间
 * @param spaceId 空间ID
 */
export function quitSpace(spaceId: string) {
  return axios.post(`${Url.QUIT_SPACE}${spaceId}`);
}

/**
 * 上传附件
 * @param formData 附件
 */
export function uploadAttach(file: any) {
  return axios.post(Url.UPLOAD_ATTACH, file, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

/**
 * 获取附件预览地址
 * @param token 云端文件名/key
 */
export function getAttachPreviewUrl(spaceId: string, token: string, attname: string) {
  return axios.post(urlcat(Url.OFFICE_PREVIEW, { spaceId }), {
    token,
    attname,
  });
}

/**
 * 空间站-通讯录管理-成员管理
 * 分页查询指定部门的成员列表
 * @param pageObjectParams 分页参数
 * @param teamId 部门ID，根部门可不填，默认为0
 * @param isActive 成员是否加入空间站
 */
export function getMemberListInSpace(pageObjectParams: string, teamId?: string, isActive?: string) {
  return axios.get(Url.MEMBER_LIST_IN_SPACE, {
    params: {
      pageObjectParams,
      teamId,
      isActive,
    },
  });
}

/**
 * 空间站-通讯录管理-成员管理
 * 修改部门信息
 * @param teamId 部门ID
 * @param superId 父级ID,如果父级是根,则为0
 * @param teamName 部门名称
 */
export function updateTeamInfo(teamId: string, superId: string, teamName?: string) {
  return axios.post(Url.UPDATE_TEAM, {
    teamId,
    teamName,
    superId,
  });
}

/**
 * 空间站-通讯录管理-成员管理
 * 新增子部门
 * @param name 部门名称
 * @param superId 父级ID,如果父级是根,则为0
 */
export function createTeam(name: string, superId: string) {
  return axios.post(Url.CREATE_TEAM, {
    name,
    superId,
  });
}

/**
 * 空间站-通讯录管理-成员管理
 * 查询部门信息
 * @param teamId 部门ID
 */
export function readTeam(teamId: string) {
  return axios.get(Url.READ_TEAM, {
    params: {
      teamId,
    },
  });
}

/**
 * 空间站-通讯录管理-成员管理
 * 删除部门
 * @param teamId 部门ID
 */
export function deleteTeam(teamId: string) {
  return axios.delete(`${Url.DELETE_TEAM}${teamId}`);
}

/**
 * 空间站-通讯录管理-成员管理
 * 编辑成员信息
 * @param data 成员信息，提交什么字段就修改什么字段
 */
export function updateMember(data: IUpdateMemberInfo) {
  return axios.post(Url.UPDATE_MEMBER, data);
}

/**
 * 空间站-通讯录管理-成员管理
 * 单个删除成员
 * @param teamId 部门ID
 * @param memberId 成员ID
 * @param action 删除动作（0：本部门删除，1：彻底从组织架构删除）
 */
export function singleDeleteMember(teamId: string, memberId: string, isDeepDel: boolean) {
  return axios.delete(Url.SINGLE_DELETE_MEMBER, {
    data: {
      memberId,
      teamId,
      action: isDeepDel ? 1 : 0,
    },
  });
}

/**
 * 空间站-通讯录管理-成员管理
 * 批量删除成员
 * @param memberId 成员ID
 * @param teamId 部门ID
 * @param action 删除动作（0：本部门删除，1：彻底从组织架构删除）
 */
export function BatchDeleteMember(teamId: string, memberId: string[], isDeepDel: boolean) {
  return axios.delete(Url.BATCH_DELETE_MEMBER, {
    data: {
      memberId,
      teamId,
      action: isDeepDel ? 1 : 0,
    },
  });
}

/**
 * 空间站-通讯录管理-成员管理
 * 查询直属子部门列表
 * @param teamId 部门ID
 */
export function getSubTeams(teamId: string) {
  return axios.get(Url.READ_SUB_TEAMS, {
    params: {
      teamId,
    },
  });
}

/**
 * 空间站-通讯录管理-成员管理
 * 部门添加成员
 * @param unitList 部门或成员列表
 * @param teamId 部门ID
 */
export function addIsActivedMembersInSpace(unitList: IAddIsActivedMemberInfo[], teamId: string) {
  return axios.post(Url.TEAM_ADD_MEMBER, {
    unitList,
    teamId,
  });
}

/**
 * 空间站-通讯录管理-成员管理
 * 根据部门查询部门下所有成员，不包括子部门的成员
 */
export function getTeamAndMemberWithoutSub(teamId?: string) {
  return axios.get(Url.TEAM_MEMBERS, {
    params: {
      teamId,
    },
  });
}

/**
 * 空间站-通讯录管理-成员管理
 * 搜索组织资源/添加部门成员modal中的搜索
 * @param keyword 搜索关键词
 * @param className 高亮样式
 */
export function addMemberSearchRes(keyword: string, className: string) {
  return axios.get(Url.GET_ADD_MEMBERS, {
    params: {
      keyword,
      className,
    },
  });
}

/**
 * 空间站-通讯录管理-成员管理
 * 搜索部门或成员
 * @param keyword 搜索词
 */
export function searchTeamAndMember(keyword: string) {
  return axios.get(Url.SEARCH_TEAM_MEMBER, {
    params: {
      keyword,
      className: 'highLight',
    },
  });
}

/**
 * 空间站-通讯录管理-成员管理
 * 调整成员所属部门
 * @param memberIds 成员ID
 * @param preTeamId 原部门ID,必填
 * @param newTeamIds 调整后的部门ID列表
 */
export function updateMemberTeam(memberIds: string[], newTeamIds: string[], preTeamId?: string) {
  return axios.post(Url.UPDATE_MEMBER_TEAM, {
    memberIds,
    newTeamIds,
    preTeamId,
  });
}

/**
 * 获取邮验证码
 * @param email 邮箱
 */
export function getEmailCode(email: string, type: number) {
  return axios.post(Url.SEND_EMAIL_CODE, {
    email,
    type,
  });
}

/**
 * 绑定邮箱
 * @param email 邮箱地址
 * @param code 验证码
 */
export function bindEmail(email: string, code: string) {
  return axios.post(Url.BIND_EMAIL, {
    email,
    code,
  });
}

/**
 * 绑定新手机
 * @param phone 手机号
 * @param code 验证码
 */
export function bindMobile(areaCode: string, phone: string, code: string) {
  return axios.post(Url.BIND_MOBILE, {
    areaCode,
    phone,
    code,
  });
}

/**
 * 手机验证码校验
 * @param phone 手机号
 * @param code 验证码
 */
export function smsVerify(areaCode: string, phone: string, code: string) {
  return axios.post(Url.VALIDATE_SMS_CODE, {
    areaCode,
    phone,
    code,
  });
}

/**
 * 邮箱验证码校验，使用场景：无手机时更换邮箱前验证身份、更换主管理员
 */
export function emailCodeVerify(email: string, code: string) {
  return axios.post(Url.VALIDATE_EMAIL_CODE, {
    email,
    code,
  });
}

/**
 * 空间站-通讯录管理
 * 判断空间内成员邮箱是否存在
 * @param email 邮箱地址
 */
export function isExistEmail(email: string) {
  return axios.get(Url.EXIST_EMAIL, {
    params: {
      email,
    },
  });
}

/**
 * 空间站-通讯录管理
 * 邮件首次（批量）邀请成员
 */
export function sendInvite(invite: IInviteMemberList[], nodeId?: string, nvcVal?: string) {
  return axios.post(Url.SEND_INVITE, {
    invite,
    nodeId,
    data: nvcVal,
  });
}

/**
 * 空间站-通讯录管理
 * 邮件再次（单次）邀请成员
 * @param email 邮箱地址,严格校验
 */
export function reSendInvite(email: string) {
  return axios.post(Url.RESEND_INVITE, {
    email,
  });
}

/**
 * 空间站-邮件邀请中转页，邮件校验
 * 邀请临时码校验
 * @param token 邀请链接一次性令牌
 * @param from 邀请者标识
 */
export function inviteEmailVerify(token: string) {
  return axios.post(Url.INVITE_EMAIL_VERIFY, {
    token,
  });
}

/**
 * 空间站-上传通讯录文件
 */
export function uploadMemberFile(formData: any, onUploadProgress: any, ctx: any) {
  return axios.post(Url.UPLOAD_MEMBER_FILE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
    cancelToken: new CancelToken(ctx),
  });
}

/**
 * 修改密码
 * @param phone 手机号
 * @param code 验证码
 * @param password 密码
 */
export function updatePwd(password: string, code?: string, type?: string) {
  return axios.post(Url.UPDATE_PWD, {
    code,
    password,
    type,
  });
}

/**
 * 找回密码
 * @param phone 手机号
 * @param password 密码
 */
export function retrievePwd(areaCode: string, username: string, code: string, password: string, type: string) {
  return axios.post(Url.RETRIEVE_PWD, {
    areaCode,
    username,
    code,
    password,
    type,
  });
}

/**
 *  检索节点
 * @param keyword 关键字
 */
export function findNode(keyword: string, ctx: any) {
  return axios.get(Url.SEARCH_NODE, {
    params: {
      keyword,
    },
    cancelToken: new CancelToken(ctx),
  });
}

export function searchNode(spaceId: string, keyword: string) {
  return axios.get<IApiWrapper & { data: INode[] }>(Url.SEARCH_NODE, {
    params: {
      spaceId,
      keyword,
    },
  });
}

/**
 * 获取是否可以管理全员可见状态
 * @param nodeId 当前节点ID
 */
export function allowVisiableSetting(nodeId: string) {
  return axios.get(Url.ALLOW_VISIBLE_SETTING, {
    params: {
      nodeId,
    },
  });
}

// 导入数表
export function importFile(formData: any, onUploadProgress: any, ctx: any) {
  return axios.post(Url.IMPORT_FILE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    cancelToken: new CancelToken(ctx),
    onUploadProgress,
  });
}

// 切换空间站
export function switchSpace(spaceId: string) {
  return axios.post(urlcat(Url.SWITCH_SPACE, { spaceId }));
}

// 删除空间
export function deleteSpace(spaceId: string, code?: string, type?: string) {
  return axios.delete(urlcat(Url.DELETE_SPACE, { spaceId }), {
    data: {
      code,
      type,
    },
  });
}

// 立即删除空间
export function deleteSpaceNow() {
  return axios.delete(Url.DELETE_SPACE_NOW);
}

/**
 *  编辑空间
 * @param name 空间名称
 * @param logo 空间头像
 */
export function updateSpace(name?: string, logo?: string) {
  return axios.post(Url.UPDATE_SPACE, {
    name,
    logo,
  });
}

// 空间信息
export function spaceInfo(spaceId: string) {
  return axios.get(Url.SPACE_INFO + spaceId);
}

// 恢复空间
export function recoverSpace(spaceId: string) {
  return axios.post(Url.RECOVER_SPACE + spaceId);
}

export function searchSpaceSize() {
  return axios.get(Url.SPACE_MEMORY);
}

/**
 *  获取指定空间的文件夹和文件的数量
 * @param spaceId 空间ID
 */
export function getSpaceNodeNumber() {
  return axios.get(Url.NODE_NUMBER);
}

/**
 *  获取指定空间的权限资源
 * @param spaceId 空间ID
 */
export function getSpaceResource() {
  return axios.get(Url.SPACE_RESOURCE);
}

/**
 * 消除空间列表的小红点
 * @param spaceId 空间ID
 */
export function removeSpaceRedPoint(spaceId: string) {
  return axios.post(`${Url.REMOVE_RED_POINT}${spaceId}`);
}

/**
 * 空间站-主管理员-获取主管理员信息
 */
export function mianAdminInfo() {
  return axios.get(Url.MAIN_ADMIN_INFO);
}

/**
 * 空间站-主管理员-更换主管理员
 */
export function changeMainAdmin(memberId: string) {
  return axios.post(Url.CHANGE_MAIN_ADMIN, { memberId });
}

/**
 * 空间站-子管理员
 * 查询管理员列表
 * @param pageObjectParams 分页参数
 */
export function getlistRole(pageObjectParams: string) {
  return axios.get(Url.LIST_ROLE, {
    params: {
      pageObjectParams,
    },
  });
}

/**
 * 空间站-子管理员
 * 获取管理员信息
 */
export function subAdminPermission(memberId: string) {
  return axios.get(Url.SUB_ADMIN_PERMISSION, {
    params: {
      memberId,
    },
  });
}

/**
 * 空间站-子管理员
 * 模糊搜索成员
 * @param keyword 搜索关键字
 */
export function searchMember(keyword: string, filter: boolean) {
  return axios.get(Url.MEMBER_SEARCH, {
    params: {
      keyword,
      filter,
    },
  });
}

/**
 * 空间站-子管理员
 * 添加管理员
 * @param memberId 成员ID
 * @param resourceCodes 操作资源集合，不分排序，自动校验
 */
export function addSubMember(memberIds: string[], resourceCodes: string[]) {
  return axios.post(Url.ADD_SUB_ADMIN, {
    memberIds,
    resourceCodes,
  });
}

/**
 * 空间站-子管理员
 * 编辑管理员
 * @param memberId 成员ID
 * @param resourceCodes 操作资源集合，不分排序，自动校验
 */
export function editSubMember(id: string, memberId: string, resourceCodes: string[]) {
  return axios.post(Url.EDIT_SUB_ADMIN, {
    id,
    memberId,
    resourceCodes,
  });
}

/**
 * 搜索组织资源
 * @param keyword 关键字（标签/部门）
 */
export function searchUnit(keyword: string, linkId?: string) {
  return axios.get(Url.SEARCH_UNIT, {
    params: {
      keyword,
      linkId,
    },
  });
}

/**
 * 切换工作目录全员可见状态
 */
export function updateAllVisible() {
  return axios.post(Url.UPDATE_ALL_VISIBLE);
}

/**
 * 查询工作目录的全员可见状态
 */
export function getAllVisibleStatus() {
  return axios.get(Url.GET_ALL_VISIBLE);
}

/**
 * 查询部门下的子部门和成员
 * @param teamId 组织ID
 */
export function getSubUnitList(teamId?: string, linkId?: string) {
  return axios.get(Url.GET_SUB_UNIT_LIST, {
    params: {
      teamId,
      linkId,
    },
  });
}

/**
 * 修改角色
 * @param data 要更新的角色的信息
 */
export function updateRole(data: IUpdateRoleData) {
  return axios.post(Url.UPDATE_ROLE, data);
}

/**
 * 空间站-子管理员-删除管理员
 */
export function deleteSubAdmin(memberId: string) {
  return axios.delete(Url.DELETE_SUB_ADMIN + memberId);
}

/**
 * 空间站-更改成员设置
 */
export function updateMemberSetting(data: { invitable?: boolean; joinable?: boolean; mobileShowable?: boolean }) {
  return axios.post(Url.UPDATE_MEMBER_SETTING, {
    ...data,
  });
}

/**
 * 空间站-获取禁止全员导出维格表状态
 */
export function getForbidStatus() {
  return axios.get(Url.FORBID_STATUS);
}

/**
 * 空间站-更改工作台设置
 */
export function updateWorkbenchSetting(data: { nodeExportable?: boolean }) {
  return axios.post(Url.UPDATE_WORKBENCH_SETTING, { ...data });
}

/**
 * 空间站-获取空间的特性
 */
export function getSpaceFeatures() {
  return axios.get(Url.GET_SPACE_FEATURES);
}

/**
 * 空间站-普通成员-切换节点角色全员可分配状态
 */
export function switchNodeAssignableStatus() {
  return axios.post(Url.SWITCH_NODEROLE_ASSIGNALE);
}

/**
 * @description 小程序扫码轮询接口
 * @param {(0 | 1 | 2)} type
 * 0：web扫码登录
 * 1：web帐号绑定
 * 2：小程序等待进入工作台
 * @param {string} mark  二维码识别ID
 * @returns
 */
export function poll(type: QrAction, mark: string) {
  return axios.get(Url.POLL, {
    params: {
      type,
      mark,
    },
  });
}

/**
 * @description 获取二维码
 * @param {number} type
 * 0：登录
 * 1：绑定
 * @returns
 */
export function getQrCode(type: number, page?: string, width?: number) {
  return axios.get(Url.WECHAT_QR_CODE, {
    params: {
      type,
      page,
      width,
    },
  });
}

/**
 * @description 解除账户绑定
 * @export
 * @param {BindAccount} type
 * @returns
 */
export function unBindAccount(type: BindAccount) {
  return axios.post(Url.UN_BIND, {
    type,
  });
}

/**
 * 生成/刷新链接
 * @param  teamId 部门ID
 */
export function createLink(teamId: string, nodeId?: string) {
  return axios.post(Url.CREATE_LINK, {
    teamId,
    nodeId,
  });
}

// 空间赠送信息
export function getCapacityRewardList(isExpire: boolean, pageNo: number) {
  const pageObjectParams = JSON.stringify({
    pageSize: ConfigConstant.CAPACITY_REWARD_LIST_PAGE_SIZE,
    order: 'createdAt',
    sort: ConfigConstant.SORT_DESC,
    pageNo,
  });
  return axios.get(Url.CAPACITY_REWARD_LIST, {
    params: {
      pageObjectParams,
      isExpire,
    },
  });
}

// 获取链接列表
export function getLinkList() {
  return axios.get(Url.LINK_LIST);
}

// 删除链接
export function deleteLink(teamId: string) {
  return axios.delete(Url.DELETE_LINK, { data: { teamId }});
}

// 公开链接校验
export function linkValid(token: string, nodeId?: string) {
  return axios.post(Url.LINK_VALID, { token, nodeId });
}

// 通过公开链接加入空间
export function joinViaSpace(token: string, nodeId: string) {
  return axios.post(Url.JOIN_VIA_LINK, { token, nodeId });
}

export function changeNodeDesc(nodeId: string, desc: string) {
  return axios.post(Url.CHANGE_NODE_DESC, {
    nodeId,
    description: desc,
  });
}

export function readShareInfo(shareId: string, headers?: Record<string, string>) {
  return axios.get(Url.READ_SHARE_INFO + `/${shareId}`, {
    headers,
  });
}

export function storeShareData(shareId: string, spaceId: string) {
  return axios.post(Url.STORE_SHARE_DATA, {
    spaceId,
    shareId,
  });
}

/**
 * 关闭节点分享
 * @export
 * @param {string} nodeId 要操作的节点ID
 * @returns
 */
export function disableShare(nodeId: string) {
  return axios.post(Url.DISABLE_SHARE + nodeId);
}

/**
 * 刷新节点分享链接
 * @export
 * @param {string} nodeId 要操作的节点ID
 * @returns
 */
export function regenerateShareLink(nodeId: string) {
  return axios.post(Url.REGENERATE_SHARE_LINK + nodeId);
}

/**
 * 获取节点分享设置
 * @export
 * @param {string} nodeId 要操作的节点ID
 * @returns
 */
export function getShareSettings(nodeId: string) {
  return axios.get(Url.SHARE_SETTINGS + nodeId);
}

export function updateShare(
  nodeId: string,
  permission: {
    onlyRead?: boolean;
    canBeEdited?: boolean;
    canBeStored?: boolean;
  },
) {
  return axios.post(Url.UPDATE_SHARE + nodeId, {
    props: JSON.stringify(permission),
  });
}

/**
 * 文件夹预览
 * @param nodeId 节点ID
 */
export function nodeShowcase(nodeId: string, shareId?: string) {
  return axios.get(Url.NODE_SHOWCASE, {
    params: {
      nodeId,
      shareId,
    },
  });
}

/**
 * 消息统计
 */
export function getNotificationStatistics() {
  return axios.get(Url.NOTIFICATION_STATISTICS);
}

/**
 * 用户分页通知列表
 * @param pageObjectParams 分页参数,详情查看,接口描述
 * @param isRead 是否已读1已读,0未读,不传代表查询全部
 */
export function getNotificationPage(isRead?: boolean, rowNo?: number) {
  return axios.get(Url.NOTIFICATION_PAGE, {
    params: {
      isRead: isRead ? 1 : 0,
      rowNo,
      pageSize: ConfigConstant.NOTICE_LIST_SIZE,
    },
  });
}

// 用户通知列表
export function getNotificationList(isRead?: boolean, notifyType?: string) {
  return axios.get(Url.NOTIFICATION_LIST, {
    params: {
      isRead: isRead ? 1 : 0,
      notifyType,
    },
  });
}

// 创建通知
export function createNotification(data: ICreateNotification[]) {
  return axios.post(Url.CREATE_NOTIFICATION, data);
}

/**
 * 提交举报信息
 * @param nodeId 被举报的维格表
 * @param reportReason  举报原因
 */
export function createReport(nodeId: string, reportReason: string) {
  return axios.post(Url.CREATE_REPORTS, {
    nodeId,
    reportReason,
  });
}

// 获取微信分享的签名
export function getWechatSignature(url: string) {
  return axios.post(Url.WECHAT_MP_SIGNATURE, {
    url,
  });
}

/**
 * 标记通知已读
 * @param id 通知ID,支持批量
 * @param isAll  是否全量:1全量,0非全量
 */
export function transferNoticeToRead(id: string[], isAll?: boolean) {
  return axios.post(Url.TRANSFER_NOTICE_TO_READ, {
    id,
    isAll: isAll ? 1 : 0,
  });
}

// 创建开发者访问令牌
export function createApiKey() {
  return axios.post(Url.CREATE_API_KEY);
}

// 刷新开发者访问令牌
export function refreshApiKey(code?: string, type?: string) {
  return axios.post(Url.REFRESH_API_KEY, { code, type });
}

// 创建模板
export function createTemplate(nodeId: string, name: string, data = true) {
  return axios.post(Url.CREATE_TEMPLATE, {
    nodeId,
    name,
    data,
  });
}

// 获取官方模版分类列表
export function getTemplateCategory(categoryCodes?: string) {
  return axios.get(Url.OFFICIAL_TEMPLATE_CATEGORY, {
    params: {
      categoryCodes,
    },
  });
}

// 获取模版列表
export function getTemplateList(categoryCode?: string, isPrivate?: boolean, headers?: Record<string, string>) {
  return axios.get(Url.TEMPLATE_LIST, {
    params: {
      categoryCode,
      isPrivate,
    },
    headers,
  });
}

// 删除模版
export const deleteTemplate = (tempalte: string) => {
  return axios.delete(`${Url.DELETE_TEMPLATE}${tempalte}`);
};

// 获取模板目录信息
export const templateDirectory = (templateId: string, isPrivate: boolean, categoryCode?: string) => {
  return axios.get(Url.TEMPLATE_DIRECTORY, {
    params: {
      templateId,
      isPrivate,
      categoryCode,
    },
  });
};

// 引用模板
export const useTemplate = (templateId: string, parentId: string, data?: boolean) => {
  return axios.post(Url.USE_TEMPLATE, {
    templateId,
    parentId,
    data,
  });
};

export const triggerWizard = (wizardId: number) => {
  return axios.post(Url.TRIGGER_WIZARD, {
    wizardId,
  });
};
// 校验模版名称是否已存在
export const templateNameValidate = (name: string) => {
  return axios.get(Url.TEMPLATE_NAME_VALIDATE, {
    params: {
      name,
    },
  });
};

// 获取热门推荐内容
export const templateRecommend = (headers?: Record<string, string>) => {
  return axios.get<IApiWrapper & { data: ITemplateRecommendResponse }>(Url.TEMPLATE_RECOMMEND, {
    headers,
  });
};

// 加载或者搜索成员，显示最近选择过的最多 10 条记录。用于成员字段下拉选择
export function loadOrSearch({ filterIds, keyword, names, unitIds, linkId, all, searchEmail }: ILoadOrSearchArg): Promise<IAxiosResponse<any>> {
  return axios.get(Url.LOAD_OR_SEARCH, {
    params: {
      filterIds,
      keyword,
      names,
      unitIds,
      linkId,
      all,
      searchEmail
    },
  });
}

export function searchUnitInfoVo(names: string, linkId?: string) {
  return axios.post(Url.SEARCH_UNIT_INFO_VO, {
    names,
    linkId,
  });
}

// 成员字段变更时，提交增量。后端聚合发提醒。
export function commitRemind(data: ICommitRemind) {
  return axios.post(Url.COMMIT_REMIND, data);
}

// 开启节点继承模式
export function enableRoleExtend(nodeId: string) {
  return axios.post(Url.ENABLE_ROLE_EXTEND + `?nodeId=${nodeId}`);
}

// 关闭节点继承模式
export function disableRoleExtend(nodeId: string, includeExtend?: boolean) {
  const params = includeExtend ? { includeExtend } : {};
  return axios.post(Url.DISABLE_ROLE_EXTEND + `?nodeId=${nodeId}`, params);
}

// 删除节点角色
export function deleteRole(nodeId: string, unitId: string) {
  return axios.delete(Url.DELETE_ROLE, {
    data: {
      nodeId,
      unitId,
    },
  });
}

// 查询节点角色列表
export function listRole(nodeId: string, includeAdmin?: boolean, includeExtend?: boolean, includeSelf?: string) {
  return axios.get(Url.NODE_LIST_ROLE, {
    params: {
      nodeId,
      includeAdmin,
      includeExtend,
      includeSelf,
    },
  });
}

// 修改节点的组织单元所属角色
export function editRole(nodeId: string, unitId: string, role: string) {
  return axios.post(Url.EDIT_ROLE, {
    nodeId,
    unitId,
    role,
  });
}

// 批量修改节点组织单元所属角色
export function batchEditRole(nodeId: string, unitIds: string[], role: string) {
  return axios.post(Url.BATCH_EDIT_ROLE, {
    nodeId,
    unitIds,
    role,
  });
}

// 批量删除节点权限
export function batchDeleteRole(nodeId: string, unitIds: string[]) {
  return axios.delete(Url.BATCH_DELETE_ROLE, {
    data: { unitIds, nodeId },
  });
}

// 添加节点指定角色的组织单元
export function addRole(nodeId: string, unitIds: string[], role: string) {
  return axios.post(Url.ADD_ROLE, {
    nodeId,
    unitIds,
    role,
  });
}

// 提交问卷调查
export function submitQuestionnaire(data: any) {
  return axios({
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    url: 'https://e6l40faiq2.execute-api.cn-northwest-1.amazonaws.com.cn/funsion-feeback-form',
    data: { data },
  });
}

// 获取空间的订阅信息
export function subscribeInfo(spaceId: string) {
  return axios.get(Url.SUBSCRIBE_INFO + spaceId);
}

// 查询回收站的节点列表
export function getTrashList(params?: IRubbishListParams) {
  return axios.get(Url.TRASH_LIST, { params });
}

// 恢复节点
export function trashRecover(nodeId: string, parentId?: string) {
  return axios.post(Url.TRASH_RECOVER, {
    nodeId,
    parentId,
  });
}

// 删除回收站的节点
export function trashDelete(nodeId: string) {
  return axios.delete(`${Url.TRASH_DELETE}${nodeId}`);
}

// 更改节点收藏状态
export function updateNodeFavoriteStatus(nodeId: string) {
  return axios.post(`${Url.UPDATE_NODE_FAVORITE_STATUS}${nodeId}`);
}

// 移动收藏节点位置
export function moveFavoriteNode(nodeId: string, preNodeId?: string) {
  return axios.post(Url.MOVE_FAVORITE_NODE, {
    nodeId,
    preNodeId,
  });
}

// 查询收藏的节点列表
export function getFavoriteNodeList() {
  return axios.get(Url.FAVORITE_NODE_LIST);
}

// 查询账户积分信息
export function getUserIntegral() {
  return axios.get(Url.USER_INTEGRAL);
}

// 分页查询积分收支明细
export function getUserIntegralRecords(pageNo: number) {
  const pageObjectParams = JSON.stringify({
    pageSize: ConfigConstant.USER_INTEGRAL_RECORDS_PAGE_SIZE,
    order: 'createdAt',
    sort: ConfigConstant.SORT_DESC,
    pageNo,
  });
  return axios.get(Url.USER_INTEGRAL_RECORDS, {
    params: { pageObjectParams },
  });
}

// 分页查询空间审计日志
export const getSpaceAudit = ({ spaceId, ...params }: IGetSpaceAuditReq) =>
  axios.get(urlcat(Url.SPACE_AUDIT, { spaceId }), {
    params: {
      ...params,
    },
  });

// 兑换v码
export function vCodeExchange(code: string) {
  return axios.post(Url.CODE_EXCHANGE + code);
}

// 模糊搜索模板
export function searchTemplate(keyword: string, className?: string) {
  return axios.get(Url.TEMPLATE_SEARCH, {
    params: {
      keyword,
      className,
    },
  });
}

// 申请加入空间
export function applyJoinSpace(spaceId: string) {
  return axios.post(Url.APPLY_JOIN_SPACE, { spaceId });
}

// 处理“某人加入空间站”的消息
export function processSpaceJoin(notifyId: string, agree: boolean) {
  return axios.post(Url.PROCESS_SPACE_JOIN, {
    notifyId,
    agree,
  });
}

//获取飞书登录用户身份
export function socialFeiShuUserAuth(token: string) {
  return axios.get(Url.SOCIAL_FEISHU_USER_AUTH, {
    params: { access_token: token },
  });
}

//校验是否当前飞书登录用户是否为应用管理员
export function socialFeiShuCheckAdmin(openId: string, tenantKey: string) {
  return axios.get(Url.SOCIAL_FEISHU_CHECK_ADMIN, {
    params: { openId, tenantKey },
  });
}

//校验飞书企业是否已绑定空间站
export function socialFeiShuCheckTenantBind(tenantKey: string) {
  return axios.get(Url.SOCIAL_FEISHU_CHECK_TENANT_BIND, {
    params: { tenantKey },
  });
}

//飞书账号绑定维格账号
export function socialFeiShuBindUser(areaCode: string, mobile: string, code: string, openId: string, tenantKey: string) {
  return axios.post(Url.SOCIAL_FEISHU_BIND_USER, {
    areaCode,
    openId,
    tenantKey,
    mobile,
    code,
  });
}

//飞书应用绑定空间站
export function socialFeiShuBindSpace(tenantKey: string, spaceList: any[]) {
  return axios.post(urlcat(Url.SOCIAL_FEISHU_BIND_SPACE, { tenantKey }), spaceList);
}

//获取飞书企业的信息
export function getFeiShuTenantInfo(tenantKey: string) {
  return axios.get(urlcat(Url.SOCIAL_FEISHU_TENANT_INFO, { tenantKey }));
}

//飞书用户授权登录
export function feishuUserLogin(openId: string, tenantKey: string) {
  return axios.post(Url.SOCIAL_FEISHU_USER_LOGIN, { openId, tenantKey });
}

//获取飞书企业绑定详情
export function feishuTenantBindDetail(tenantKey: string) {
  return axios.get(urlcat(Url.SOCIAL_FEISHU_TENANT_BIND_DETAIL, { tenantKey }));
}

//飞书-获取租户绑定的信息
export function getFeiShuTenant(tenantKey: string) {
  return axios.get(urlcat(Url.SOCIAL_FEISHU_TENANT, { tenantKey }));
}

//飞书-变更主管理员
export function feishuChangeMainAdmin(tenantKey, spaceId, memberId) {
  return axios.post(Url.SOCIAL_CHANGE_ADMIN, { memberId, spaceId, tenantKey });
}

// 钉钉（第三方）- 登陆接口
export function dingTalkUserLogin(suiteId: string, corpId: string, code: string, bizAppId?: string) {
  const data: Record<string, string> = {
    corpId,
    code,
  };

  if (bizAppId) {
    data.bizAppId = bizAppId;
  }

  return axios.post(urlcat(Url.SOCIAL_DINGTALK_USER_LOGIN, { suiteId }), data);
}

// 钉钉（第三方）- 免登接口
export function dingTalkBindSpace(suiteId: string, corpId: string) {
  return axios.get(urlcat(Url.SOCIAL_DINGTALK_BIND_SPACE, { suiteId }), {
    params: {
      corpId,
    },
  });
}

// 钉钉（第三方）- 获取租户绑定的信息
export function dingTalkAdminDetail(suiteId: string, corpId: string) {
  return axios.get(urlcat(Url.SOCIAL_DINGTALK_ADMIN_DETAIL, { suiteId }), {
    params: {
      corpId,
    },
  });
}

// 钉钉（第三方）- 后台管理员登录
export function dingTalkAdminLogin(suiteId: string, code: string, corpId: string) {
  const data: Record<string, string> = { code };

  if (corpId) {
    data.corpId = corpId;
  }

  return axios.post(urlcat(Url.SOCIAL_DINGTALK_ADMIN_LOGIN, { suiteId }), data);
}

// 钉钉（第三方）- 后台管理员变更
export function dingTalkChangeAdmin(suiteId: string, corpId: string, spaceId: string, memberId: string) {
  return axios.post(urlcat(Url.SOCIAL_DINGTALK_CHANGE_ADMIN, { suiteId }), { corpId, spaceId, memberId });
}

//钉钉扫码登陆回调
export function dingtalkH5UserLogin(agentId: string, code: string) {
  return axios.post(urlcat(Url.DINGTALK_H5_USER_LOGIN, { agentId }), { code });
}

//钉钉绑定空间
export function dingtalkH5BindSpace(agentId: string, spaceId: string) {
  return axios.post(urlcat(Url.DINGTALK_H5_BIND_SPACE, { agentId }), { spaceId });
}

export function getDingtalkH5BindSpaceId(agentId: string) {
  return axios.get(urlcat(Url.DINGTALK_H5_BIND_SPACE, { agentId }));
}

export function freshDingtalkOrg() {
  return axios.get(Url.DINGTALK_REFRESH_ORG);
}

export function freshWecomOrg() {
  return axios.get(Url.WECOM_REFRESH_ORG);
}

export function getDingtalkSKU(spaceId: string, callbackPage: string) {
  return axios.post(Url.SOCIAL_DINGTALK_SKU, { spaceId, callbackPage });
}

export function getDingtalkConfig(spaceId: string, url: string) {
  return axios.post(Url.SOCIAL_DINGTALK_CONFIG, { spaceId, url });
}

// 获取集成租户环境配置
export function socialTenantEnv() {
  return axios.get(Url.SOCIAL_TENANT_ENV);
}

// 获取三方应用列表
export function getMarketplaceApps(spaceId: string) {
  return axios.get(urlcat(Url.GET_MARKETPLACE_APPS, { spaceId }));
}

/**
 * 第三方应用集成改版
 */
// 获取应用列表
export function getAppstoreApps() {
  return axios.get(Url.GET_APPSTORES_APPS);
}

// 获取应用实例列表 - 已开启的应用
export function getAppInstances(spaceId: string) {
  return axios.get(urlcat(Url.APP_INSTANCE, { spaceId }));
}

// 创建应用实例 - 开通使用时需要先创建再跳转（企微，飞书）
export function createAppInstance(spaceId: string, appId: string) {
  return axios.post(Url.APP_INSTANCE, { spaceId, appId });
}

// 删除应用实例
export function deleteAppInstance(appInstanceId: string) {
  return axios.delete(urlcat(Url.SINGLE_APP_INSTANCE, { appInstanceId }));
}

// 获取单个应用实例配置
export function getAppInstanceById(appInstanceId: string) {
  return axios.get(urlcat(Url.SINGLE_APP_INSTANCE, { appInstanceId }));
}

// 更新飞书基础配置
export function updateLarkBaseConfig(appInstanceId: string, appKey: string, appSecret: string) {
  return axios.put(urlcat(Url.UPDATE_LARK_BASE_CONFIG, { appInstanceId }), { appKey, appSecret });
}

// 更新飞书事件配置
export function updateLarkEventConfig(appInstanceId: string, eventEncryptKey: string, eventVerificationToken: string) {
  return axios.put(urlcat(Url.UPDATE_LARK_EVENT_CONFIG, { appInstanceId }), { eventEncryptKey, eventVerificationToken });
}

/* ----- 我是分割线 ----- */

// 开启应用
export function enableApp(spaceId: string, appId: string) {
  return axios.post(urlcat(Url.APP_ENABLE, { spaceId, appId }));
}

// 关闭应用
export function disableApp(spaceId: string, appId: string) {
  return axios.post(urlcat(Url.APP_DISABLE, { spaceId, appId }));
}

// 获取音视频的元信息
// https://developer.qiniu.com/dora/1247/audio-and-video-metadata-information-avinfo
export function getAvInfo(url: string) {
  return axios.get(url);
}

// 企业微信验证授权应用配置
export function socialWecomCheckConfig({ agentId, agentSecret, appHomepageUrl, authCallbackDomain, corpId, trustedDomain }) {
  return axios.post(Url.SOCIAL_WECOM_CHECK_CONFIG, { agentId, agentSecret, appHomepageUrl, authCallbackDomain, corpId, trustedDomain });
}

// 企业微信绑定
export function socialWecomBindConfig(configSha: string, code: string, spaceId: string) {
  return axios.post(urlcat(Url.SOCIAL_WECOM_BIND_CONFIG, { configSha }), { code, spaceId });
}

// 企业微信校验-域名转换IP
export function socialWecomDomainCheck(domain: string) {
  return axios.post(Url.SOCIAL_WECOM_DOMAIN_CHECK, { domain });
}

// 企业微信获取配置
export function socialWecomGetConfig() {
  return axios.get<IApiWrapper & ISocialWecomGetConfigResponse>(Url.SOCIAL_WECOM_GET_CONFIG);
}

// 获取企业微信自建应用绑定的空间站ID
export function wecomAgentBindSpace(corpId: string, agentId: string) {
  return axios.get<IApiWrapper & IWecomAgentBindSpaceResponse>(urlcat(Url.WECOM_AGENT_BINDSPACE, { corpId, agentId }));
}

// 获取驾驶舱的广告信息
// 数据维护在 https://vika.cn/workbench/dst9vf4SSYhEAme66b/viwRvDFWeP11B
// 使用腾讯云的云函数实现获取数据的API，每个10分钟同源表同步一次数据
export function getSpaceAdList() {
  return axios.get<IAdData>('https://service-p4w3x0tq-1254196833.gz.apigw.tencentcs.com/release/ads');
}

export function unBindMobile(code: string) {
  return axios.post<IApiWrapper>(Url.USER_UNBIND_MOBILE, { code });
}

export function unBindEmail(code: string) {
  return axios.post<IApiWrapper>(Url.USER_UNBIND_EMAIL, { code });
}

// 经济系统用量提示
export function subscribeRemind(params: { nodeId?: string; spaceId: string; specification?: string; templateId: string; usage: string }) {
  return axios.post(Url.SUBSCRIBE_REMIND, params);
}

// 获取已开启的实验性功能
export function getLabsFeature(spaceId) {
  return axios.get(urlcat(Url.GET_LABS_FEATURE, { spaceId }));
}

// 获取实验性功能列表
export function getLabsFeatureList() {
  return axios.get<IApiWrapper & ILabsFeatureListResponse>(Url.GET_LABS_FEATURE_LIST);
}

// 更新实验性功能
export function updateLabsFeatureList(key: string, isEnabled: boolean, spaceId: string) {
  return axios.post<IApiWrapper>(Url.GET_LABS_FEATURE, {
    key,
    isEnabled,
    spaceId,
  });
}

export function updateSecuritySetting(config: IUpdateSecuritySetting) {
  return axios.post<IApiWrapper>(Url.UPDATE_SECURITY_SETTING, config);
}

export function syncOrgMembers(data: ISyncMemberRequest) {
  return axios.post<IApiWrapper>(Url.SYNC_ORG_MEMBERS, data);
}

export function applyResourceChangesets(changesets: ILocalChangeset[], roomId: string) {
  return axios.post<IApiWrapper & { data: IGetCommentsByIdsResponse }>(
    Url.APPLY_RESOURCE_CHANGESETS,
    {
      changesets,
      roomId,
    },
    {
      baseURL: nestBaseURL,
    },
  );
}

// 获取节点信息 - 文件信息窗
export function getNodeInfoWindow(nodeId: string) {
  return axios.get<IApiWrapper & { data: INodeInfoWindowResponse }>(urlcat(Url.GET_NODE_INFO_WINDOW, { nodeId }));
}

// eslint-disable-next-line max-len
// 查询产品所有计划价目表 https://integration.vika.ltd/api/v1/doc.html#/default/%E8%AE%A2%E5%8D%95%E6%A8%A1%E5%9D%97%E7%9B%B8%E5%85%B3%E6%8E%A5%E5%8F%A3/getPriceListByProductUsingGET
export function queryOrderPriceList(product: 'GOLD' | 'SILVER') {
  return axios.get<IApiWrapper & { data: IQueryOrderPriceResponse[] }>(Url.ORDER_PRICE, {
    params: {
      product,
    },
  });
}

export function createOrder(params: { month: number; product: string; seat: number; spaceId: string }) {
  return axios.post<IApiWrapper & { data: ICreateOrderResponse }>(Url.ORDER_CREATE, params);
}

export function payOrder(orderId: string, payChannel: 'wx_pub_qr' | 'alipay_pc_direct') {
  return axios.post<IApiWrapper & { data: IPayOrderResponse }>(urlcat(Url.ORDER_PAYMENT, { orderId }), { payChannel });
}

export function queryOrderStatus(orderId: string) {
  return axios.get<IApiWrapper & { data: IQueryOrderStatusResponse }>(urlcat(Url.ORDER_STATUS, { orderId }));
}

export function queryOrderDiscount(params) {
  return axios.post<IApiWrapper & { data: IQueryOrderDiscountResponse }>(Url.DRY_RUN, params);
}

export function paidCheck(orderId: string) {
  return axios.get<IApiWrapper & { data: IQueryOrderStatusResponse }>(urlcat(Url.PAID_CHECK, { orderId }));
}

/*---------- 企微应用商店 ----------*/

// 企业微信内点击应用跳转自动登录
export function postWecomAutoLogin(code: string, suiteId: string) {
  return axios.post(Url.POST_WECOM_AUTO_LOGIN, { code, suiteId });
}

// 扫码登录
export function postWecomScanLogin(authCode: string, suiteId: string) {
  return axios.post(Url.POST_WECOM_SCAN_LOGIN, { authCode, suiteId });
}

// 获取用户在登录空间站时信息
export function getWecomLoginInfo(authCorpId: string, suiteId: string) {
  return axios.get(urlcat(Url.GET_WECOM_SPACE_INFO, { authCorpId, suiteId }));
}

// 管理员跳转第三方管理页面自动登录
export function postWecomLoginAdmin(authCode: string, suiteId: string) {
  return axios.post(Url.POST_WECOM_LOGIN_ADMIN, { authCode, suiteId });
}

// 获取应用绑定的空间站信息
export function getWecomBindSpacesInfo(authCorpId: string, suiteId: string, cpUserId: string) {
  return axios.get(urlcat(Url.GET_WECOM_TENANT_INFO, { authCorpId, suiteId, cpUserId }));
}

// 变更管理员
export function postWecomChangeAdmin(authCorpId: string, memberId: number, spaceId: string, suiteId: string, cpUserId: string) {
  return axios.post(Url.POST_WECOM_CHANGE_ADMIN, { authCorpId, memberId, spaceId, suiteId, cpUserId });
}

// 授权模式邀请成员
export function postWecomUnauthMemberInvite(spaceId: string, selectedTickets: string[]) {
  return axios.post(Url.POST_WECOM_UNAUTHMEMBER_INVITE, { spaceId, selectedTickets });
}

// 获取企业微信 config 参数
export function getWecomCommonConfig(spaceId: string, url: string) {
  return axios.get(Url.GET_WECOM_CONFIG, {
    params: { spaceId, url },
  });
}

// 获取企业微信 agentConfig 参数
export function getWecomAgentConfig(spaceId: string, url: string) {
  return axios.get(Url.GET_WECOM_AGENT_CONFIG, {
    params: { spaceId, url },
  });
}

// 获取无权限成员列表
export function getNoPermissionMember(nodeId: string, unitIds: string[]) {
  return axios.post<IApiWrapper & INoPermissionMemberResponse>(Url.NO_PERMISSION_MEMBER, { nodeId, unitIds });
}

/*---------- 腾讯云IDASS ----------*/

// 获取玉符Idass登录url
export function getIDassLoginUrl(clientId: string) {
  return axios.get(`${Url.GET_IDASS_LOGIN_URL}/${clientId}`);
}

// 腾讯云玉符
export function idaasLoginCallback(clientId: string, code: string, state: string) {
  return axios.post(`${Url.IDAAS_LOGIN_CALLBACK}/${clientId}`, { code, state });
}

// 同步通讯录
export function idaasContactSync() {
  return axios.post(Url.IDAAS_CONTACT_SYNC);
}

// 获取空间站绑定的玉符信息
export function spaceBindIdaasInfo(spaceId: string) {
  return axios.get(urlcat(Url.IDAAS_GET_SPACE_BIND_INFO, { spaceId }));
}

/*---------- 腾讯云IDASS ----------*/

// 批量获取URL相关信息, URL列识别用
export const getURLMetaBatch = (urls: string[]) => axios.post(Url.GET_URL_META_BATCH, { urls });

export const getUploadCertificate = (params: { count: number; data: string; nodeId?: string; type: number }) => {
  return axios.post<IApiWrapper & { data: IGetUploadCertificateResponse[] }>(Url.UPLOAD_PRESIGNED_URL, params);
};

export const getS3Callback = (params: { resourceKeys: string[]; type: number }) => {
  return axios.post<IApiWrapper & { data: IGetUploadCertificateResponse[] }>(Url.UPLOAD_CALLBACK, params);
};

export const getSubscribeActiveEvents = () => {
  return axios.get<IApiWrapper & { data: ISubscribeActiveEventResponse }>(Url.SUBSCRIBE_ACTIVE_EVENT);
};
