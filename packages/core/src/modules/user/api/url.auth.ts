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

// login signin, register
export const SIGN_IN_OR_SIGN_UP = '/signIn';

// logout, sign out
export const SIGN_OUT = '/signOut';

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

export const REGISTER = '/register';