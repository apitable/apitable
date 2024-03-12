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

import axios from 'axios';
import * as Url from '../../shared/api/url';
import {
  IApiWrapper, ILogoutResult,
} from '../../../exports/store/interfaces';
import {
  ISignIn,
} from '../../shared/api/api.interface';

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

/**
 * APITable CE Register
 *
 */

export function register(username: string, credential: string, lang = 'en-US') {
  return axios.post(Url.REGISTER, {
    username,
    credential,
    lang
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
