/**
 * Api Document
 * Backend_Server Api Document
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { JSONObject } from '../models/JSONObject';
import { UserLinkVo } from '../models/UserLinkVo';
import { HttpFile } from '../http/http';

/**
* Account Information View
*/
export class UserInfoVo {
    /**
    * User ID (the actual return is uuid)
    */
    'userId'?: string;
    /**
    * User UUID
    */
    'uuid'?: string;
    /**
    * Nickname
    */
    'nickName'?: string;
    /**
    * Mobile phone area code
    */
    'areaCode'?: string;
    /**
    * Phone number
    */
    'mobile'?: string;
    /**
    * Email
    */
    'email'?: string;
    /**
    * Avatar
    */
    'avatar'?: string;
    /**
    * Registration time
    */
    'signUpTime'?: Date;
    /**
    * Last logon time
    */
    'lastLoginTime'?: Date;
    /**
    * Bind third-party information
    */
    'thirdPartyInformation'?: Array<UserLinkVo>;
    /**
    * Whether to set a password is required. It indicates that the user does not have a password. It is a standard field for initialization and password setting
    */
    'needPwd'?: boolean;
    /**
    * Whether it is necessary to create a space indicates that the user does not have any space association, which is a standard field for space creation guidance
    */
    'needCreate'?: boolean;
    /**
    * Space id
    */
    'spaceId'?: string;
    /**
    * Space name
    */
    'spaceName'?: string;
    /**
    * Space logo
    */
    'spaceLogo'?: string;
    /**
    * Member ID corresponding to the space
    */
    'memberId'?: number;
    /**
    * Member name corresponding to the space
    */
    'memberName'?: string;
    /**
    * Organization unit ID of the corresponding member of the space
    */
    'unitId'?: number;
    /**
    * ID of the open data table node in the space
    */
    'activeNodeId'?: string;
    /**
    * ID of the view opened in the meter
    */
    'activeViewId'?: string;
    /**
    * Active node location (0: working directory; 1: star)
    */
    'activeNodePos'?: number;
    /**
    * Whether it is a space administrator, and whether the space management menu is displayed
    */
    'isAdmin'?: boolean;
    /**
    * Primary administrator or not
    */
    'isMainAdmin'?: boolean;
    /**
    * Whether the account is cancelled during the cooling off period (account recovery is allowed during the cooling off period)
    */
    'isPaused'?: boolean;
    /**
    * Account destruction time
    */
    'closeAt'?: Date;
    /**
    * Whether the space is deleted
    */
    'isDelSpace'?: boolean;
    /**
    * Developer Access Token
    */
    'apiKey'?: string;
    'wizards'?: JSONObject;
    /**
    * Personal invitation code
    */
    'inviteCode'?: string;
    /**
    * Space station domain name
    */
    'spaceDomain'?: string;
    /**
    * Whether the user\'s space has changed the internal nickname (abandoned)
    */
    'isNameModified'?: boolean;
    /**
    * Whether the user is new
    */
    'isNewComer'?: boolean;
    /**
    * (Used in WeCom)Whether the user has modified the nickname
    */
    'isNickNameModified'?: boolean;
    /**
    * (Used in WeCom)Whether the member has modified the nickname
    */
    'isMemberNameModified'?: boolean;
    /**
    * Whether to send subscription related notifications
    */
    'sendSubscriptionNotify'?: boolean;
    /**
    * Have you ever used invitation rewards
    */
    'usedInviteReward'?: boolean;
    /**
    * default avatar color number
    */
    'avatarColor'?: number;
    /**
    * user time zone
    */
    'timeZone'?: string;
    /**
    * User locale
    */
    'locale'?: string;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "userId",
            "baseName": "userId",
            "type": "string",
            "format": ""
        },
        {
            "name": "uuid",
            "baseName": "uuid",
            "type": "string",
            "format": ""
        },
        {
            "name": "nickName",
            "baseName": "nickName",
            "type": "string",
            "format": ""
        },
        {
            "name": "areaCode",
            "baseName": "areaCode",
            "type": "string",
            "format": ""
        },
        {
            "name": "mobile",
            "baseName": "mobile",
            "type": "string",
            "format": ""
        },
        {
            "name": "email",
            "baseName": "email",
            "type": "string",
            "format": ""
        },
        {
            "name": "avatar",
            "baseName": "avatar",
            "type": "string",
            "format": ""
        },
        {
            "name": "signUpTime",
            "baseName": "signUpTime",
            "type": "Date",
            "format": "date-time"
        },
        {
            "name": "lastLoginTime",
            "baseName": "lastLoginTime",
            "type": "Date",
            "format": "date-time"
        },
        {
            "name": "thirdPartyInformation",
            "baseName": "thirdPartyInformation",
            "type": "Array<UserLinkVo>",
            "format": ""
        },
        {
            "name": "needPwd",
            "baseName": "needPwd",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "needCreate",
            "baseName": "needCreate",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "spaceId",
            "baseName": "spaceId",
            "type": "string",
            "format": ""
        },
        {
            "name": "spaceName",
            "baseName": "spaceName",
            "type": "string",
            "format": ""
        },
        {
            "name": "spaceLogo",
            "baseName": "spaceLogo",
            "type": "string",
            "format": ""
        },
        {
            "name": "memberId",
            "baseName": "memberId",
            "type": "number",
            "format": "int64"
        },
        {
            "name": "memberName",
            "baseName": "memberName",
            "type": "string",
            "format": ""
        },
        {
            "name": "unitId",
            "baseName": "unitId",
            "type": "number",
            "format": "int64"
        },
        {
            "name": "activeNodeId",
            "baseName": "activeNodeId",
            "type": "string",
            "format": ""
        },
        {
            "name": "activeViewId",
            "baseName": "activeViewId",
            "type": "string",
            "format": ""
        },
        {
            "name": "activeNodePos",
            "baseName": "activeNodePos",
            "type": "number",
            "format": "int32"
        },
        {
            "name": "isAdmin",
            "baseName": "isAdmin",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "isMainAdmin",
            "baseName": "isMainAdmin",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "isPaused",
            "baseName": "isPaused",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "closeAt",
            "baseName": "closeAt",
            "type": "Date",
            "format": "date-time"
        },
        {
            "name": "isDelSpace",
            "baseName": "isDelSpace",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "apiKey",
            "baseName": "apiKey",
            "type": "string",
            "format": ""
        },
        {
            "name": "wizards",
            "baseName": "wizards",
            "type": "JSONObject",
            "format": ""
        },
        {
            "name": "inviteCode",
            "baseName": "inviteCode",
            "type": "string",
            "format": ""
        },
        {
            "name": "spaceDomain",
            "baseName": "spaceDomain",
            "type": "string",
            "format": ""
        },
        {
            "name": "isNameModified",
            "baseName": "isNameModified",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "isNewComer",
            "baseName": "isNewComer",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "isNickNameModified",
            "baseName": "isNickNameModified",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "isMemberNameModified",
            "baseName": "isMemberNameModified",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "sendSubscriptionNotify",
            "baseName": "sendSubscriptionNotify",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "usedInviteReward",
            "baseName": "usedInviteReward",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "avatarColor",
            "baseName": "avatarColor",
            "type": "number",
            "format": "int32"
        },
        {
            "name": "timeZone",
            "baseName": "timeZone",
            "type": "string",
            "format": ""
        },
        {
            "name": "locale",
            "baseName": "locale",
            "type": "string",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return UserInfoVo.attributeTypeMap;
    }

    public constructor() {
    }
}

