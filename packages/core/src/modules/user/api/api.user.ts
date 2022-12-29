import axios from 'axios';
import * as Url from '../../shared/api/url';
import {
  IApiWrapper, ILocateIdMap,
  IUserInfo, 
} from '../../../exports/store';
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
