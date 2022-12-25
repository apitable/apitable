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

export const STATUS_OK = 200;
export const UN_AUTHORIZED = 201;
export const RESOURCE_NOT_EXIST = 210;
export const NVC_FAIL = 250;
export const SECONDARY_VALIDATION = 251;
export const PHONE_VALIDATION = 252;
export const OPERATION_FREQUENT = 233;
export const ACCOUNT_ERROR = 303;
export const TIME_OUT = 303;
export const EMAIL_ERR = 304;
export const PASSWORD_ERR = 305;
export const LOGIN_OUT_NUMBER = 306;
export const SMS_GET_ERR = 230;
export const SMS_CHECK_ERR = 231;
export const SMS_CODE_NOT_CHECK = 232;
export const PHONE_COMMON_ERR = 303;
export const NAME_AND_PWD_ERR = 302;
export const BINDING_WECHAT = 332; // The phone number has been bound to WeChat
export const MOVE_FORM_SPACE = 403; // Moved out of space
export const SPACE_NOT_EXIST = 404; // The invited space does not exist
export const NODE_NUMBER_ERR = 412;
export const TEMPLATE_NOT_EXIST = 431;
export const FREQUENTLY_QR = 324; // The verification code is refreshed too frequently
export const COMMON_ERR = 500; // general error
export const MEMBER_NOT_EXIST = 508; // member does not exist
export const BINDING_ACCOUNT_ERR = [320, 332];
// switch space, space is not activated
export const INVALID_SPACE = 406;
// Email invitation, the inviter clicks the link, the space has been deleted, and the message is that the space does not exist
export const SPACE_DELETED = 404;

// Public link invitation - the number of inviters in the space has reached the upper limit, temporarily unable to join
export const INVITER_SPACE_MEMBER_LIMIT = 407;
// public link invite - invite link has expired
export const LINK_INVALID = 517;
// public link invitation - the number of spaces has reached the limit
export const SPACE_LIMIT = 405;

export const NODE_DELETED = 600; // no permission or node is deleted
export const NODE_NOT_EXIST = 601; // no permission or node doesn't exist
export const NOT_PERMISSION = 602; // operation without permission - no editing permission
export const PAYMENT_PLAN = 951;
export const LOG_OUT_UNSATISFIED = 962; // The logout condition is not met, the user is not allowed to logout

// The datasheet for the magic form mapping does not exist
export const FORM_DATASHEET_NOT_EXIST = 301;
export const FORM_FOREIGN_DATASHEET_NOT_EXIST = 302;

// Front-end custom error code
export const USER_DEFINED_PASSWORD_ERR = 1001;
export const FEISHU_ACCOUNT_NOT_BOUND = 1110;

export const WECOM_NOT_BIND_SPACE = 1106;

export const DINGTALK_NOT_BIND_SPACE = 1106; // Enterprise unbound space
export const DINGTALK_TENANT_NOT_EXIST = 1107; // tenant does not exist
export const DINGTALK_USER_NOT_EXIST = 1109; // Tenant user is not authorized
export const DINGTALK_USER_CONTACT_SYNCING = 1131; // Contacts are being synchronized

// Enterprise WeChat app store error code
export const WECOM_SHOP_USER_NOT_EXIST = 1115; // The tenant is not visible to the application

// The exclusive domain name is not bound
export const WECOM_NOT_BIND_DOMAIN = 1122;
export const WECOM_HAS_BIND = 338; // The account has been bound to the corporate WeChat account
export const WECOM_NO_EXIST = 1107; // The enterprise has not installed third-party applications
export const WECOM_NO_INSTALL = 1114; // Enterprise application is deleted
export const WECOM_OUT_OF_RANGE = 1109; // The tenant is not authorized, that is, the user is not within the visible range of the enterprise
export const WECOM_NOT_ADMIN = 1113; // not an administrator

export const SPACE_CAPACITY_OVER_LIMIT = 4008; // The space capacity exceeds the limit

export const FRONT_VERSION_ERROR = 3005; //The front-end version does not match

export const DELETE_ROLE_EXIST_MEMBER = 528; // Delete the role, but there are members in the role

export enum SmsErrCode {
  GetErr = 230,
  CheckErr = 231,
  CodeNotCheck = 232,
  NormalErr = 500,
}

export enum PhoneErr {
  CommonErr = 303,
  PhoneLengthErr = 500,
}

export enum AccountErr {
  UserNameErr = 302,
  CommonErr = 303,
  EmailErr = 304,
  PhoneLengthErr = 500,
}

export enum PasswordErr {
  NameAndPwdErr = 302,
  PasswordEmptyErr = 305,
}
