import { IGetCommentsByIdsResponse } from 'api/datasheet_api.interface';
import axios from 'axios';
import { ConfigConstant, Url } from 'config';
import { ILocalChangeset } from 'engine';
import {
  BindAccount, IAddIsActivedMemberInfo, IApiWrapper, IInviteMemberList, ILocateIdMap, ILogoutResult, IMemberInfoInAddressList, INode, INodesMapItem,
  IParent, IRubbishListParams, IUpdateMemberInfo, IUpdateRoleData, IUserInfo, QrAction,
} from 'store';
import { IAxiosResponse, MemberType } from 'types';
import urlcat from 'urlcat';
import { NodeType, ShowRecordHistory } from '../config/constant';
import {
  IAdData, ICommitRemind, ICreateNotification, ICreateOrderResponse, IGetRoleListResponse, IGetRoleMemberListResponse, IGetSpaceAuditReq,
  IGetUploadCertificateResponse, ILabsFeatureListResponse, ILoadOrSearchArg, INodeInfoWindowResponse, INoPermissionMemberResponse, IPayOrderResponse,
  IQueryOrderDiscountResponse, IQueryOrderPriceResponse, IQueryOrderStatusResponse, IRecentlyBrowsedFolder, ISignIn, 
  ISubscribeActiveEventResponse, ISyncMemberRequest, ITemplateRecommendResponse, IUpdateSecuritySetting, 
} from './api.interface';

export * from './api.enterprise';

axios.defaults.baseURL = Url.BASE_URL;
const CancelToken = axios.CancelToken;
const nestBaseURL = process.env.NEXT_PUBLIC_NEXT_API;

/**
 * Login / Register (get identity token directly)
 * @param data 
 * @returns 
 */
export function signInOrSignUp(data: ISignIn) {
  return axios.post(Url.SIGN_IN_OR_SIGN_UP, { ...data });
}

/**
 * Sign In
 * @param data 
 * @returns 
 */
export function signIn(data: ISignIn) {
  return axios.post(Url.SIGN_IN, { ...data });
}

/**
 * Sign Out
 * 
 * @returns 
 */
export function signOut() {
  return axios.post<IApiWrapper & { data: ILogoutResult }>(Url.SIGN_OUT);
}

/**
 * Close the user, delete the account
 * 
 * @returns 
 */
export function logout() {
  return axios.post(Url.CLOSE_USER);
}

/**
 * Cancel close the user, cancel delete the account
 * @returns 
 */
export function revokeLogout() {
  return axios.post(Url.CANCEL_CLOSE_USER);
}

/**
 * 
 * Register 
 * 
 * @param phone phone number
 * @param password password
 * @param code verify code
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

/**
 * Generate or Refresh wechat public account QR code
 * 
 * @param type 
 * @returns 
 */
export function getOfficialAccountsQrCode(type: number) {
  return axios.get(Url.OFFICIAL_ACCOUNTS_QRCODE, {
    params: {
      type,
    },
  });
}

/**
 * Poll wechat public account (media platform)
 * 
 * @param mark 
 * @param type 
 * @returns 
 */
export function officialAccountsPoll(mark: string, type: number) {
  return axios.get(Url.OFFICIAL_ACCOUNTS_POLL, {
    params: {
      mark,
      type,
    },
  });
}

/**
 * 
 * Get phone verification code
 * 
 * @param phone Phone Number
 * @param type 1:Register, 3:Edit password
 * @param data CAPTCHA arguments
 */
export function getSmsCode(areaCode: string, phone: string, type: number, data?: string) {
  return axios.post(Url.SEND_SMS_CODE, {
    areaCode,
    phone,
    type,
    data,
  });
}

/**
 * 
 * Get My Info
 * 
 * @param locateIdMap 
 * @param filter 
 * @param headers 
 * @returns 
 */
export function getUserMe(locateIdMap: ILocateIdMap = { spaceId: '', nodeId: '' }, filter = false, headers?: Record<string, string>) {
  return axios.get<IApiWrapper & { data: IUserInfo }>(Url.USER_ME, {
    params: {
      ...locateIdMap,
      filter,
    },
    headers,
  });
}

/**
 * Check user can delete or close
 * @returns 
 */
export function getUserCanLogout() {
  return axios.get<IApiWrapper & { data: boolean }>(Url.USER_CAN_LOGOUT);
}

/**
 * 
 * Space - check if the user's email is the same as the specified email
 * @param email 
 * @returns 
 */
export function validateEmail(email: string) {
  return axios.post(Url.EMAIL_VALIDATE, { email });
}

/**
 * 
 * Space - binding the invited email
 * 
 * @param spaceId 
 * @param email 
 * @returns 
 */
export function linkInviteEmail(spaceId: string, email: string) {
  return axios.post(Url.LINK_INVITE_EMAIL, { spaceId, email });
}

/**
 * invite code reward
 */
export function submitInviteCode(inviteCode: string) {
  return axios.post(Url.INVITE_CODE_REWARD, { inviteCode });
}

/**
 * Space - check if the user has bound the email
 */
export function emailBind() {
  return axios.get(Url.EMAIL_BIND);
}

/**
 * Update (Edit) the user info
 * @param info 
 */
export function updateUser(info: { avatar?: string; nickName?: string | null; locale?: string; init?: boolean }) {
  return axios.post(Url.UPDATE_USER, info);
}

/**
 * Edit Member Info and nickname
 * @param memberName nickname
 */
export function updateOwnerMemberInfo(memberName: string) {
  return axios.post(Url.MEMBER_UPDATE, { memberName });
}

/**
 * 
 * Query the node tree of the workbench, limit the query to two layers
 * 
 * @param depth 
 * @returns 
 */
export function getNodeTree(depth?: number) {
  return axios.get(Url.GET_NODE_TREE, {
    params: {
      depth,
    },
  });
}

/**
 * 
 * Get and query the root node
 * 
 * @returns 
 */
export function getRootNode() {
  return axios.get(Url.GET_ROOT_NODE);
}

/**
 * 
 * Query the child node list
 * 
 * @param nodeId 
 * @param nodeType 
 * @returns 
 */
export function getChildNodeList(nodeId: string, nodeType?: NodeType) {
  return axios.get<IApiWrapper & { data: Omit<INodesMapItem, 'children'>[] }>(Url.GET_NODE_LIST, {
    params: {
      nodeId,
      nodeType
    },
  });
}

/**
 * Get Node's Parent Node List
 * 
 * @param nodeId 
 * @returns 
 */
export function getParents(nodeId: string) {
  return axios.get<IApiWrapper & { data: IParent[] }>(Url.GET_PARENTS, {
    params: {
      nodeId,
    },
  });
}

/**
 * 
 * Get Node Info
 * 
 * @param nodeIds 
 * @returns 
 */
export function getNodeInfo(nodeIds: string) {
  return axios.get(Url.GET_NODE_INFO, {
    params: {
      nodeIds,
    },
  });
}

/**
 * query the child nodes with the parent node id, 
 * 
 * @param parentId parent node id
 */
export function getNodeListByParentId(parentId: string) {
  return axios.get(Url.SELECTBYPARENTID + parentId);
}

/**
 * 
 * Get relevant nodes(form/mirror) of the node
 * 
 * @param dstId datasheet id
 * @param viewId view id. if empty, query all views' relevant nodes.
 * @param type   relevant nodes type. if empty, query all types.
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
 * Create Space
 * 
 * @param name Space Name
 */
export function createSpace(name: string) {
  return axios.post(Url.CREATE_SPACE, {
    name,
  });
}

/**
 * Move Nodes
 * 
 * @param nodeId the node id that will be moved.
 * @param parentId the parent node id that will be placed here.
 * @param preNodeId 
 */
export function nodeMove(nodeId: string, parentId: string, preNodeId?: string) {
  return axios.post(Url.MOVE_NODE, {
    nodeId,
    parentId,
    preNodeId,
  });
}

/**
 * Add Node
 */
export function addNode(nodeInfo: { parentId: string; type: number; nodeName?: string; preNodeId?: string; extra?: { [key: string]: any } }) {
  return axios.post(Url.ADD_NODE, nodeInfo);
}

/**
 * Delete Node
 * @param nodeId Node Id
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
 * Edit Node
 * 
 * @param nodeId Node ID
 * @param data 
 */
export function editNode(nodeId: string, data: { nodeName?: string; icon?: string; cover?: string; showRecordHistory?: ShowRecordHistory }) {
  return axios.post(Url.EDIT_NODE + nodeId, data);
}

/**
 * duplicate the node
 * 
 */
export function copyNode(nodeId: string, copyAll: boolean) {
  return axios.post(Url.COPY_NODE, {
    nodeId,
    data: copyAll,
  });
}

/**
 * Get Datasheet ID by Node ID
 * 
 * @param nodeId Node ID
 */
export function getDstId(nodeId: string) {
  return axios.get(Url.GET_DST_ID + nodeId);
}

/**
 * Save the active datasheet tab
 */
export function keepTabbar(data: { nodeId?: string; viewId?: string }) {
  return axios.post(Url.KEEP_TAB_BAR, data);
}

/**
 * Positioning the node, where it is.
 */
export function positionNode(nodeId: string) {
  return axios.get(Url.POSITION_NODE + nodeId);
}

/**
 * Query the list of units(member/group) in the space's organization
 * @returns 
 */
export function getUnitsByMember() {
  return axios.get(Url.MEMBER_UNITS);
}

/**
 * Contact List, get teams
 * 
 * @returns 
 */
export function getTeamList() {
  return axios.get(Url.TEAM_LIST);
}

/**
 * Contact list, get members
 * 
 * @param teamId team ID, if empty, return root team, default 0
 */
export function getMemberList(teamId?: string): Promise<IAxiosResponse<IMemberInfoInAddressList[]>> {
  return axios.get(Url.MEMBER_LIST, {
    params: {
      teamId,
    },
  });
}

/**
 * Get member info
 * 
 * @param memberId  Contact member id
 * @param userId   user id
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
 * Get space list
 */
export function spaceList(onlyManageable?: boolean) {
  return axios.get(Url.SPACE_LIST, { params: { onlyManageable }});
}

/**
 * Quit the Space
 * @param spaceId 
 */
export function quitSpace(spaceId: string) {
  return axios.post(`${Url.QUIT_SPACE}${spaceId}`);
}

/**
 * Upload Attachment
 * 
 * @param formData attachment data
 */
export function uploadAttach(file: any) {
  return axios.post(Url.UPLOAD_ATTACH, file, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

/**
 * Get attachment's preview url
 * 
 * @param token cloud file token
 */
export function getAttachPreviewUrl(spaceId: string, token: string, attname: string) {
  return axios.post(urlcat(Url.OFFICE_PREVIEW, { spaceId }), {
    token,
    attname,
  });
}

/**
 * Get member list by pagination
 * 
 * @param pageObjectParams pagination params
 * @param teamId if empty return root team, default 0
 * @param isActive whether the member has joined space 
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
 * Update Team Info
 * edit the team 
 * 
 * @param teamId 
 * @param superId parent team ID,if empty return root team, default 0
 * @param teamName team name
 */
export function updateTeamInfo(teamId: string, superId: string, teamName?: string) {
  return axios.post(Url.UPDATE_TEAM, {
    teamId,
    teamName,
    superId,
  });
}

/**
 * Create Team
 * 
 * @param name 
 * @param superId parent team id, if empty return root team, default 0
 */
export function createTeam(name: string, superId: string) {
  return axios.post(Url.CREATE_TEAM, {
    name,
    superId,
  });
}

/**
 * Get Team Info
 * 
 * @param teamId 
 */
export function readTeam(teamId: string) {
  return axios.get(Url.READ_TEAM, {
    params: {
      teamId,
    },
  });
}

/**
 * Delete the team
 * @param teamId team ID
 */
export function deleteTeam(teamId: string) {
  return axios.delete(`${Url.DELETE_TEAM}${teamId}`);
}

/**
 * Update Member Info
 * 
 * @param data member info
 */
export function updateMember(data: IUpdateMemberInfo) {
  return axios.post(Url.UPDATE_MEMBER, data);
}

/**
 * Delete single member
 * 
 * @param teamId Team ID
 * @param memberId Member ID
 * @param action Delete Action(0:delete from inner team, 1:delete from organization)
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
 * Batch Delete Members
 * 
 * @param memberId Member ID
 * @param teamId Team ID
 * @param action Delete Action(0:delete from inner team, 1:delete from organization)
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
 * Get Sub Teams
 * 
 * @param teamId Team ID
 */
export function getSubTeams(teamId: string) {
  return axios.get(Url.READ_SUB_TEAMS, {
    params: {
      teamId,
    },
  });
}

/**
 * Add active units(members,teams) to team
 * 
 * @param unitList 
 * @param teamId 
 */
export function addIsActivedMembersInSpace(unitList: IAddIsActivedMemberInfo[], teamId: string) {
  return axios.post(Url.TEAM_ADD_MEMBER, {
    unitList,
    teamId,
  });
}

/**
 * Get members by team(include members in the sub team)
 */
export function getTeamAndMemberWithoutSub(teamId?: string) {
  return axios.get(Url.TEAM_MEMBERS, {
    params: {
      teamId,
    },
  });
}

/**
 * 
 * Search organization resources
 * search in the add department member UI modal
 * 
 * @param keyword the keyword to search
 * @param className class style
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
 * Search Teams or Members
 * 
 * @param keyword the keyword to search
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
 * Update Member's Team
 * @param memberIds 
 * @param preTeamId Original Team ID, required
 * @param newTeamIds New Team IDs list
 */
export function updateMemberTeam(memberIds: string[], newTeamIds: string[], preTeamId?: string) {
  return axios.post(Url.UPDATE_MEMBER_TEAM, {
    memberIds,
    newTeamIds,
    preTeamId,
  });
}

/**
 * Get Email Verify Code
 * 
 * @param email mail
 */
export function getEmailCode(email: string, type: number) {
  return axios.post(Url.SEND_EMAIL_CODE, {
    email,
    type,
  });
}

/**
 * Bind the email
 * @param email 
 * @param code 
 */
export function bindEmail(email: string, code: string) {
  return axios.post(Url.BIND_EMAIL, {
    email,
    code,
  });
}

/**
 * Bind the mobile phone 
 * 
 * @param phone 
 * @param code 
 */
export function bindMobile(areaCode: string, phone: string, code: string) {
  return axios.post(Url.BIND_MOBILE, {
    areaCode,
    phone,
    code,
  });
}

/**
 * Verify the mobile phone code
 * @param phone 
 * @param code 
 */
export function smsVerify(areaCode: string, phone: string, code: string) {
  return axios.post(Url.VALIDATE_SMS_CODE, {
    areaCode,
    phone,
    code,
  });
}

/**
 * Verify the email code
 * When you don't have a mobile phone
 * you can verify your identity before changing your mailbox or changing the main administrator
 */
export function emailCodeVerify(email: string, code: string) {
  return axios.post(Url.VALIDATE_EMAIL_CODE, {
    email,
    code,
  });
}

/**
 * Check whether the email exists in the space
 * @param email
 */
export function isExistEmail(email: string) {
  return axios.get(Url.EXIST_EMAIL, {
    params: {
      email,
    },
  });
}

/**
 * Invite members(batch available)
 */
export function sendInvite(invite: IInviteMemberList[], nodeId?: string, nvcVal?: string) {
  return axios.post(Url.SEND_INVITE, {
    invite,
    nodeId,
    data: nvcVal,
  });
}

/**
 * ReSend email to invite members
 * 
 * @param email strict email format
 */
export function reSendInvite(email: string) {
  return axios.post(Url.RESEND_INVITE, {
    email,
  });
}

/**
 * Invite Email Verify
 * @param token one-time invite token 
 * @param from inviter
 */
export function inviteEmailVerify(token: string) {
  return axios.post(Url.INVITE_EMAIL_VERIFY, {
    token,
  });
}

/**
 * Upload the contact file
 */
export function uploadMemberFile(formData: any, onUploadProgress: any, ctx: any) {
  return axios.post(Url.UPLOAD_MEMBER_FILE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
    cancelToken: new CancelToken(ctx),
  });
}

/**
 * Edit password 
 * @param phone 
 * @param code verify code
 * @param password password
 */
export function updatePwd(password: string, code?: string, type?: string) {
  return axios.post(Url.UPDATE_PWD, {
    code,
    password,
    type,
  });
}

/**
 * Forgot password
 * 
 * @param phone 
 * @param password 
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
 * Find nodes
 * 
 * @param keyword the keyword to search
 */
export function findNode(keyword: string, ctx: any) {
  return axios.get(Url.SEARCH_NODE, {
    params: {
      keyword,
    },
    cancelToken: new CancelToken(ctx),
  });
}

/**
 * Search nodes
 * 
 * @param spaceId 
 * @param keyword 
 * @returns 
 */
export function searchNode(spaceId: string, keyword: string) {
  return axios.get<IApiWrapper & { data: INode[] }>(Url.SEARCH_NODE, {
    params: {
      spaceId,
      keyword,
    },
  });
}

/**
 * Get the setting of "whether the space is visible to all members"
 * @param nodeId current node id
 */
export function allowVisiableSetting(nodeId: string) {
  return axios.get(Url.ALLOW_VISIBLE_SETTING, {
    params: {
      nodeId,
    },
  });
}

/**
 * 
 * import datasheet by file
 * 
 * @param formData 
 * @param onUploadProgress 
 * @param ctx 
 * @returns 
 */
export function importFile(formData: any, onUploadProgress: any, ctx: any) {
  return axios.post(Url.IMPORT_FILE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    cancelToken: new CancelToken(ctx),
    onUploadProgress,
  });
}

/**
 * Switch Space
 * @param spaceId 
 * @returns 
 */
export function switchSpace(spaceId: string) {
  return axios.post(urlcat(Url.SWITCH_SPACE, { spaceId }));
}

/**
 * Delete Space
 * 
 * @param spaceId 
 * @param code 
 * @param type 
 * @returns 
 */
export function deleteSpace(spaceId: string, code?: string, type?: string) {
  return axios.delete(urlcat(Url.DELETE_SPACE, { spaceId }), {
    data: {
      code,
      type,
    },
  });
}

/**
 * 
 * Delete the space immediately
 * 
 * @returns 
 */
export function deleteSpaceNow() {
  return axios.delete(Url.DELETE_SPACE_NOW);
}

/**
 * Update/Edit the space
 * 
 * @param name 
 * @param logo 
 */
export function updateSpace(name?: string, logo?: string) {
  return axios.post(Url.UPDATE_SPACE, {
    name,
    logo,
  });
}

/**
 * Get space info
 * 
 * @param spaceId 
 * @returns 
 */
export function spaceInfo(spaceId: string) {
  return axios.get(Url.
    SPACE_INFO + spaceId);
}

/**
 * Recover space
 * 
 * @param spaceId 
 * @returns 
 */
export function recoverSpace(spaceId: string) {
  return axios.post(Url.RECOVER_SPACE + spaceId);
}

/**
 * Search space size 
 * @returns 
 */
export function searchSpaceSize() {
  return axios.get(Url.SPACE_MEMORY);
}

/**
 * Get the number of nodes(folders and files) in the specified space
 * @param spaceId 
 */
export function getSpaceNodeNumber() {
  return axios.get(Url.NODE_NUMBER);
}

/**
 * Get the permissions resources of the specified space
 * @param spaceId 
 */
export function getSpaceResource() {
  return axios.get(Url.SPACE_RESOURCE);
}

/**
 * clean the red dot of space 
 * @param spaceId 
 */
export function removeSpaceRedPoint(spaceId: string) {
  return axios.post(`${Url.REMOVE_RED_POINT}${spaceId}`);
}

/**
 * get main admin info
 */
export function getMainAdminInfo() {
  return axios.get(Url.MAIN_ADMIN_INFO);
}

/**
 * change main admin
 */
export function changeMainAdmin(memberId: string) {
  return axios.post(Url.CHANGE_MAIN_ADMIN, { memberId });
}

/**
 * query the list of admins
 * 
 * @param pageObjectParams pagination params
 */
export function getlistRole(pageObjectParams: string) {
  return axios.get(Url.LIST_ROLE, {
    params: {
      pageObjectParams,
    },
  });
}

/**
 * get sub-admin's permission
 */
export function subAdminPermission(memberId: string) {
  return axios.get(Url.SUB_ADMIN_PERMISSION, {
    params: {
      memberId,
    },
  });
}

/**
 * fuzzy search members
 * 
 * @param keyword the keyword to search
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
 * add sub-admin
 * 
 * @param memberId member id
 * @param resourceCodes operation resources set, no orders, auto verify
 */
export function addSubMember(memberIds: string[], resourceCodes: string[]) {
  return axios.post(Url.ADD_SUB_ADMIN, {
    memberIds,
    resourceCodes,
  });
}

/**
 * edit sub-admin
 * 
 * @param memberId member id
 * @param resourceCodes operation resources set, no orders, auto verify
 */
export function editSubMember(id: string, memberId: string, resourceCodes: string[]) {
  return axios.post(Url.EDIT_SUB_ADMIN, {
    id,
    memberId,
    resourceCodes,
  });
}

/**
 * search organization resource
 * 
 * @param keyword keywords(tag/team)
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
 * update the all visibility of the current space
 */
export function updateAllVisible() {
  return axios.post(Url.UPDATE_ALL_VISIBLE);
}

/**
 * get all visible status of the current space
 */
export function getAllVisibleStatus() {
  return axios.get(Url.GET_ALL_VISIBLE);
}

/**
 * get child teams and members
 * @param teamId Team ID
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
 * Update(edit) role
 * 
 * @param data data info
 */
export function updateRole(data: IUpdateRoleData) {
  return axios.post(Url.UPDATE_ROLE, data);
}

/**
 * delete sub-admin
 */
export function deleteSubAdmin(memberId: string) {
  return axios.delete(Url.DELETE_SUB_ADMIN + memberId);
}

/**
 * update member setting
 */
export function updateMemberSetting(data: { invitable?: boolean; joinable?: boolean; mobileShowable?: boolean }) {
  return axios.post(Url.UPDATE_MEMBER_SETTING, {
    ...data,
  });
}

/**
 * get the status of the forbidden on exporting the entire space to excel
 */
export function getForbidStatus() {
  return axios.get(Url.FORBID_STATUS);
}

/**
 * update workbench setting
 */
export function updateWorkbenchSetting(data: { nodeExportable?: boolean }) {
  return axios.post(Url.UPDATE_WORKBENCH_SETTING, { ...data });
}

/**
 * get space features
 */
export function getSpaceFeatures() {
  return axios.get(Url.GET_SPACE_FEATURES);
}

/**
 * switch the status of the node role assignment
 */
export function switchNodeAssignableStatus() {
  return axios.post(Url.SWITCH_NODEROLE_ASSIGNALE);
}

/**
 * wechat miniapp poll check 
 * @param {(0 | 1 | 2)} type
 * 0：web qr code login
 * 1：web account binding
 * 2：miniapp is waiting get into workbench
 * @param {string} mark  QR Code ID
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
 * @description Get QR Code
 * @param {number} type
 * 0：login
 * 1：binding
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
 * @description unbind account
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
 * generate/refresh the link
 * @param  teamId team ID
 */
export function createLink(teamId: string, nodeId?: string) {
  return axios.post(Url.CREATE_LINK, {
    teamId,
    nodeId,
  });
}

/**
 * Get Space Reward infos
 * 
 * @param isExpire 
 * @param pageNo 
 * @returns 
 */
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

/**
 * Get links list
 * @returns 
 */
export function getLinkList() {
  return axios.get(Url.LINK_LIST);
}

/**
 * Delete team invite link
 * 
 * @param teamId 
 * @returns 
 */
export function deleteLink(teamId: string) {
  return axios.delete(Url.DELETE_LINK, { data: { teamId }});
}

/**
 * public link validation
 * @param token 
 * @param nodeId 
 * @returns 
 */
export function linkValid(token: string, nodeId?: string) {
  return axios.post(Url.LINK_VALID, { token, nodeId });
}

/**
 * join space by public link
 * 
 * @param token 
 * @param nodeId 
 * @returns 
 */
export function joinViaSpace(token: string, nodeId?: string) {
  return axios.post(Url.JOIN_VIA_LINK, { token, nodeId });
}

/**
 * change node's description
 * 
 * @param nodeId 
 * @param desc 
 * @returns 
 */
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
 * disable the node's share link
 * 
 * @export
 * @param {string} nodeId 
 * @returns
 */
export function disableShare(nodeId: string) {
  return axios.post(Url.DISABLE_SHARE + nodeId);
}

/**
 * refresh node's share link
 * 
 * @export
 * @param {string} nodeId 
 * @returns
 */
export function regenerateShareLink(nodeId: string) {
  return axios.post(Url.REGENERATE_SHARE_LINK + nodeId);
}

/**
 * get node's share setting
 * 
 * @export
 * @param {string} nodeId 
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
 * folder node preview
 * 
 * @param nodeId 
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
 * get notifications statistics
 */
export function getNotificationStatistics() {
  return axios.get(Url.NOTIFICATION_STATISTICS);
}

/**
 * notification list with pagination
 * @param pageObjectParams pagination params
 * @param isRead 1:read 2:unread, if empty, get all
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

/**
 * get notification list
 * 
 * @param isRead 
 * @param notifyType 
 * @returns 
 */
export function getNotificationList(isRead?: boolean, notifyType?: string) {
  return axios.get(Url.NOTIFICATION_LIST, {
    params: {
      isRead: isRead ? 1 : 0,
      notifyType,
    },
  });
}

/**
 * create notification
 * @param data 
 * @returns 
 */
export function createNotification(data: ICreateNotification[]) {
  return axios.post(Url.CREATE_NOTIFICATION, data);
}

/**
 * create tip-off report
 * 
 * @param nodeId 
 * @param reportReason  
 */
export function createReport(nodeId: string, reportReason: string) {
  return axios.post(Url.CREATE_REPORTS, {
    nodeId,
    reportReason,
  });
}

/**
 * get wechat share signature
 * @param url 
 * @returns 
 */
export function getWechatSignature(url: string) {
  return axios.post(Url.WECHAT_MP_SIGNATURE, {
    url,
  });
}

/**
 * mark notification as read
 * @param id notification id, batch edit support
 * @param isAll  total or not 
 */
export function transferNoticeToRead(id: string[], isAll?: boolean) {
  return axios.post(Url.TRANSFER_NOTICE_TO_READ, {
    id,
    isAll: isAll ? 1 : 0,
  });
}

/**
 * create developer access token
 * @returns 
 */
export function createApiKey() {
  return axios.post(Url.CREATE_API_KEY);
}

/**
 * refresh developer access token
 * @param code 
 * @param type 
 * @returns 
 */
export function refreshApiKey(code?: string, type?: string) {
  return axios.post(Url.REFRESH_API_KEY, { code, type });
}

/**
 * create template
 * @param nodeId 
 * @param name 
 * @param data 
 * @returns 
 */
export function createTemplate(nodeId: string, name: string, data = true) {
  return axios.post(Url.CREATE_TEMPLATE, {
    nodeId,
    name,
    data,
  });
}

/**
 * get official template category list
 * @param categoryCodes 
 * @returns 
 */
export function getTemplateCategory(categoryCodes?: string) {
  return axios.get(Url.OFFICIAL_TEMPLATE_CATEGORY, {
    params: {
      categoryCodes,
    },
  });
}

/**
 * get official template list
 * @param spaceId 
 * @param categoryCode 
 * @param isPrivate 
 * @param headers 
 * @returns 
 */
export function getTemplateList(spaceId: string, categoryCode?: string, isPrivate?: boolean, headers?: Record<string, string>) {
  return axios.get(urlcat(Url.SPACE_TEMPLATES, { spaceId }), {
    params: {
      categoryCode,
      isPrivate,
    },
    headers,
  });
}

/**
 * get official template category content
 * @param categoryCode 
 * @param headers 
 * @returns 
 */
export function getTemplateCategories(categoryCode: string, headers?: Record<string, string>) {
  return axios.get(urlcat(Url.TEMPLATE_CATEGORIES, { categoryCode }), {
    headers,
  });
}

/**
 * Delete templates
 * 
 * @param tempalte 
 * @returns 
 */
export const deleteTemplate = (tempalte: string) => {
  return axios.delete(`${Url.DELETE_TEMPLATE}${tempalte}`);
};

/**
 * Get template album content
 * @param albumId 
 * @param headers 
 * @returns 
 */
export function getTemplateAlbum(albumId: string, headers?: Record<string, string>) {
  return axios.get(urlcat(Url.TEMPLATE_ALBUMS, { albumId }), {
    headers,
  });
}

/**
 * Get template album content
 * 
 * @param headers 
 * @returns 
 */
export function getTemplateAlbumsRecommend(headers?: Record<string, string>) {
  return axios.get(Url.TEMPLATE_ALBUMS_RECOMMEND, {
    headers,
  });
}

/**
 * get template directory information
 * @param templateId 
 * @param isPrivate 
 * @param categoryCode 
 * @returns 
 */
export const templateDirectory = (templateId: string, isPrivate: boolean, categoryCode?: string) => {
  return axios.get(Url.TEMPLATE_DIRECTORY, {
    params: {
      templateId,
      isPrivate,
      categoryCode,
    },
  });
};

/**
 * use template
 * 
 * @param templateId 
 * @param parentId 
 * @param data 
 * @returns 
 */
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

/**
 * validate the template's existence
 * @param name 
 * @returns 
 */
export const templateNameValidate = (name: string) => {
  return axios.get(Url.TEMPLATE_NAME_VALIDATE, {
    params: {
      name,
    },
  });
};

/**
 * get hot recommend content
 * @param headers 
 * @returns 
 */
export const templateRecommend = (headers?: Record<string, string>) => {
  return axios.get<IApiWrapper & { data: ITemplateRecommendResponse }>(Url.TEMPLATE_RECOMMEND, {
    headers,
  });
};

/**
 * load or search members.
 * display the most selected recent 10 records for Member Field choices
 * @param param0 
 * @returns 
 */
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

/**
 * Search unit(folder/file) info
 * 
 * @param names 
 * @param linkId 
 * @returns 
 */
export function searchUnitInfoVo(names: string, linkId?: string) {
  return axios.post(Url.SEARCH_UNIT_INFO_VO, {
    names,
    linkId,
  });
}

/**
 * when member field change, submit increment. 
 * backend will aggregate them to send notice.
 * @param data 
 * @returns 
 */
export function commitRemind(data: ICommitRemind) {
  return axios.post(Url.COMMIT_REMIND, data);
}

/**
 * Enable node permission (inheritance parent)
 * 
 * @param nodeId 
 * @returns 
 */
export function enableRoleExtend(nodeId: string) {
  return axios.post(Url.ENABLE_ROLE_EXTEND + `?nodeId=${nodeId}`);
}

/**
 * Disable node permission (inheritance parent)
 * @param nodeId 
 * @param includeExtend 
 * @returns 
 */
export function disableRoleExtend(nodeId: string, includeExtend?: boolean) {
  const params = includeExtend ? { includeExtend } : {};
  return axios.post(Url.DISABLE_ROLE_EXTEND + `?nodeId=${nodeId}`, params);
}

/**
 * Delete node role
 * @param nodeId 
 * @param unitId 
 * @returns 
 */
export function deleteRole(nodeId: string, unitId: string) {
  return axios.delete(Url.DELETE_ROLE, {
    data: {
      nodeId,
      unitId,
    },
  });
}

/**
 * Query the node role list
 * 
 * @param nodeId 
 * @param includeAdmin 
 * @param includeExtend 
 * @param includeSelf 
 * @returns 
 */
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

/**
 * Edit the role of the node's organization unit
 * 
 * @param nodeId 
 * @param unitId 
 * @param role 
 * @returns 
 */
export function editRole(nodeId: string, unitId: string, role: string) {
  return axios.post(Url.EDIT_ROLE, {
    nodeId,
    unitId,
    role,
  });
}

/**
 * Batch edit the role of the node's organization unit
 * @param nodeId 
 * @param unitIds 
 * @param role 
 * @returns 
 */
export function batchEditRole(nodeId: string, unitIds: string[], role: string) {
  return axios.post(Url.BATCH_EDIT_ROLE, {
    nodeId,
    unitIds,
    role,
  });
}

/**
 * Batch delete node roles
 * @param nodeId 
 * @param unitIds 
 * @returns 
 */
export function batchDeleteRole(nodeId: string, unitIds: string[]) {
  return axios.delete(Url.BATCH_DELETE_ROLE, {
    data: { unitIds, nodeId },
  });
}

/**
 * Add role to specified organization unit
 * @param nodeId 
 * @param unitIds 
 * @param role 
 * @returns 
 */
export function addRole(nodeId: string, unitIds: string[], role: string) {
  return axios.post(Url.ADD_ROLE, {
    nodeId,
    unitIds,
    role,
  });
}

/**
 * Submit questionnaire
 * 
 * TODO: remove this hard code api
 * 
 * @param data 
 * @returns 
 */
export function submitQuestionnaire(data: any) {
  return axios({
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    url: 'https://e6l40faiq2.execute-api.cn-northwest-1.amazonaws.com.cn/funsion-feeback-form',
    data: { data },
  });
}

/**
 * get space subscription info
 * 
 * @param spaceId 
 * @returns 
 */
export function subscribeInfo(spaceId: string) {
  return axios.get(Url.SUBSCRIBE_INFO + spaceId);
}

/**
 * Query trash's node list
 * @param params 
 * @returns 
 */
export function getTrashList(params?: IRubbishListParams) {
  return axios.get(Url.TRASH_LIST, { params });
}

/**
 * Recover trash node
 * @param nodeId 
 * @param parentId 
 * @returns 
 */
export function trashRecover(nodeId: string, parentId?: string) {
  return axios.post(Url.TRASH_RECOVER, {
    nodeId,
    parentId,
  });
}

/**
 * Delete trash's node
 * @param nodeId 
 * @returns 
 */
export function trashDelete(nodeId: string) {
  return axios.delete(`${Url.TRASH_DELETE}${nodeId}`);
}

/**
 * update node's favorite status
 * 
 * @param nodeId 
 * @returns 
 */
export function updateNodeFavoriteStatus(nodeId: string) {
  return axios.post(`${Url.UPDATE_NODE_FAVORITE_STATUS}${nodeId}`);
}

/**
 * Move favorite node position
 * 
 * @param nodeId 
 * @param preNodeId 
 * @returns 
 */
export function moveFavoriteNode(nodeId: string, preNodeId?: string) {
  return axios.post(Url.MOVE_FAVORITE_NODE, {
    nodeId,
    preNodeId,
  });
}

/**
 * Query favorite node list
 * @returns 
 */
export function getFavoriteNodeList() {
  return axios.get(Url.FAVORITE_NODE_LIST);
}

/**
 * get user's point(credit) info
 * @returns 
 */
export function getUserIntegral() {
  return axios.get(Url.USER_CREDIT);
}

/**
 * get user's point(credit) transaction list
 * 
 * @param pageNo 
 * @returns 
 */
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

/**
 * query audit log list with pagination
 * 
 * @param param0 
 * @returns 
 */
export const getSpaceAudit = ({ spaceId, ...params }: IGetSpaceAuditReq) =>
  axios.get(urlcat(Url.SPACE_AUDIT, { spaceId }), {
    params: {
      ...params,
    },
  });

/**
 * Reedem the code award
 * @param code 
 * @returns 
 */
export function vCodeExchange(code: string) {
  return axios.post(Url.CODE_EXCHANGE + code);
}

/**
 * fuzzy search template
 * 
 * @param keyword 
 * @param className 
 * @returns 
 */
export function searchTemplate(keyword: string, className?: string) {
  return axios.get(Url.TEMPLATE_SEARCH, {
    params: {
      keyword,
      className,
    },
  });
}

/**
 * apply to join space
 * 
 * @param spaceId 
 * @returns 
 */
export function applyJoinSpace(spaceId: string) {
  return axios.post(Url.APPLY_JOIN_SPACE, { spaceId });
}

/**
 * process the message of "someone join space"
 * 
 * @param notifyId 
 * @param agree 
 * @returns 
 */
export function processSpaceJoin(notifyId: string, agree: boolean) {
  return axios.post(Url.PROCESS_SPACE_JOIN, {
    notifyId,
    agree,
  });
}

/**
 * get the social tenant env config
 * @returns 
 */
export function socialTenantEnv() {
  return axios.get(Url.SOCIAL_TENANT_ENV);
}

/**
 * get 3rd apps list (marketplace)
 * 
 * @param spaceId 
 * @returns 
 */
export function getMarketplaceApps(spaceId: string) {
  return axios.get(urlcat(Url.GET_MARKETPLACE_APPS, { spaceId }));
}

/**
 * get 3rd apps list (marketplace)
 * @returns 
 */
export function getAppstoreApps() {
  return axios.get(Url.GET_APPSTORES_APPS);
}

/**
 * get app instances (enabled)
 * @param spaceId 
 * @returns 
 */
export function getAppInstances(spaceId: string) {
  return axios.get(urlcat(Url.APP_INSTANCE, { spaceId }));
}

/**
 * 
 * create app instances (before use it, you need to create it(wecom/lark) first)
 * 
 * @param spaceId 
 * @param appId 
 * @returns 
 */
export function createAppInstance(spaceId: string, appId: string) {
  return axios.post(Url.APP_INSTANCE, { spaceId, appId });
}

/**
 * 
 * delete app instance
 * 
 * @param appInstanceId 
 * @returns 
 */
export function deleteAppInstance(appInstanceId: string) {
  return axios.delete(urlcat(Url.SINGLE_APP_INSTANCE, { appInstanceId }));
}

/**
 * 
 * get app instance by id
 * 
 * @param appInstanceId 
 * @returns 
 */
export function getAppInstanceById(appInstanceId: string) {
  return axios.get(urlcat(Url.SINGLE_APP_INSTANCE, { appInstanceId }));
}

/**
 * enable app
 * @param spaceId 
 * @param appId 
 * @returns 
 */
export function enableApp(spaceId: string, appId: string) {
  return axios.post(urlcat(Url.APP_ENABLE, { spaceId, appId }));
}

/**
 * disable app
 * @param spaceId 
 * @param appId 
 * @returns 
 */
export function disableApp(spaceId: string, appId: string) {
  return axios.post(urlcat(Url.APP_DISABLE, { spaceId, appId }));
}

/**
 * get audio and video metadata
 * 
 * @param url 
 * @returns 
 */
// https://developer.qiniu.com/dora/1247/audio-and-video-metadata-information-avinfo
export function getAvInfo(url: string) {
  return axios.get(url);
}

/**
 * get space admin ad list
 * the config data stored in the space's config: https://vika.cn/workbench/dst9vf4SSYhEAme66b/viwRvDFWeP11B
 * if use cloud function to get API, every 10 minutes will sync once
 * @returns 
 */
export function getSpaceAdList() {
  return axios.get<IAdData>('https://service-p4w3x0tq-1254196833.gz.apigw.tencentcs.com/release/ads');
}

export function unBindMobile(code: string) {
  return axios.post<IApiWrapper>(Url.USER_UNBIND_MOBILE, { code });
}

export function unBindEmail(code: string) {
  return axios.post<IApiWrapper>(Url.USER_UNBIND_EMAIL, { code });
}

/**
 * billing system usage tips
 * @param params 
 * @returns 
 */
export function subscribeRemind(params: { nodeId?: string; spaceId: string; specification?: string; templateId: string; usage: string }) {
  return axios.post(Url.SUBSCRIBE_REMIND, params);
}

/**
 * get labs features
 * @param spaceId 
 * @returns 
 */
export function getLabsFeature(spaceId) {
  return axios.get(urlcat(Url.GET_LABS_FEATURE, { spaceId }));
}

/**
 * get labs features list
 * @returns 
 */
export function getLabsFeatureList() {
  return axios.get<IApiWrapper & ILabsFeatureListResponse>(Url.GET_LABS_FEATURE_LIST);
}

/**
 * update labs features list
 * @param key 
 * @param isEnabled 
 * @param spaceId 
 * @returns 
 */
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

/**
 * get node info - (file info UI modal)
 * @param nodeId 
 * @returns 
 */
export function getNodeInfoWindow(nodeId: string) {
  return axios.get<IApiWrapper & { data: INodeInfoWindowResponse }>(urlcat(Url.GET_NODE_INFO_WINDOW, { nodeId }));
}

// eslint-disable-next-line max-len
// query all pricing plans https://integration.vika.ltd/api/v1/doc.html#/default/%E8%AE%A2%E5%8D%95%E6%A8%A1%E5%9D%97%E7%9B%B8%E5%85%B3%E6%8E%A5%E5%8F%A3/getPriceListByProductUsingGET
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

/**
 * get members that have no permissions
 * 
 * @param nodeId 
 * @param unitIds 
 * @returns 
 */
export function getNoPermissionMember(nodeId: string, unitIds: string[]) {
  return axios.post<IApiWrapper & INoPermissionMemberResponse>(Url.NO_PERMISSION_MEMBER, { nodeId, unitIds });
}

/**
 * batch get url info,  for URL field recognition
 * 
 * @param urls 
 * @returns 
 */
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

/**
 * get role list
 * @returns 
 */
export const getRoleList = () => {
  return axios.get<IApiWrapper & { data: IGetRoleListResponse }>(Url.GET_ROLE_LIST);
};

/**
 * create organization role
 * @param roleName 
 * @returns 
 */
export const createRole = (roleName: string) => {
  return axios.post<IApiWrapper>(Url.CREATE_NEW_ROLE, { roleName });
};

/**
 * delete organization role
 * @param roleId 
 * @returns 
 */
export const deleteOrgRole = (roleId: string) => {
  return axios.delete<IApiWrapper>(urlcat(Url.DELETE_ORG_ROLE, { roleId }));
};

/**
 * update organization role
 * @param roleId 
 * @param roleName 
 * @returns 
 */
export const updateOrgRole = (roleId: string, roleName: string) => {
  return axios.patch<IApiWrapper>(urlcat(Url.UPDATE_ORG_ROLE, { roleId }), { roleName });
};

/**
 * get role's members list
 * @param roleId 
 * @param page 
 * @returns 
 */
export const getRoleMemberList = (roleId: string, page: { pageSize: number; pageNo: number }) => {
  const pageObjectParams = JSON.stringify(page);
  return axios.get<IApiWrapper & { data: IGetRoleMemberListResponse }>(urlcat(Url.GET_MEMBER_LIST_BY_ROLE, { roleId }), {
    params: { pageObjectParams },
  });
};

/**
 * add member to role
 * @param roleId 
 * @param unitList 
 * @returns 
 */
export const addRoleMember = (roleId: string, unitList: { id: string; type: MemberType }[]) => {
  return axios.post<IApiWrapper>(urlcat(Url.ADD_ROLE_MEMBER, { roleId }), { unitList });
};

/**
 * delete member from role
 * @param roleId 
 * @param unitIds 
 * @returns 
 */
export const deleteRoleMember = (roleId: string, unitIds: string[]) => {
  return axios.delete<IApiWrapper>(urlcat(Url.DELETE_ROLE_MEMBER, { roleId }), { data: { unitIds }});
};

/**
 * init roles
 * @returns 
 */
export const initRoles = () => {
  return axios.post<IApiWrapper>(Url.INIT_ROLE);
};

// recently browsed folder
export const getRecentlyBrowsedFolder = () => {
  return axios.get<IApiWrapper & { data: IRecentlyBrowsedFolder[] }>(Url.NODE_RECENTLY_BROWSED);
};
