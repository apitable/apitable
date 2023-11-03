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

import { InviteUserInfo } from '../models/InviteUserInfo';
import { HttpFile } from '../http/http';

/**
* Space Asset Capacity Detail
*/
export class SpaceCapacityPageVO {
    'inviteUserInfo'?: InviteUserInfo;
    /**
    * quota source
    */
    'quotaSource'?: string;
    /**
    * quota
    */
    'quota'?: string;
    /**
    * expire date
    */
    'expireDate'?: string;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "inviteUserInfo",
            "baseName": "inviteUserInfo",
            "type": "InviteUserInfo",
            "format": ""
        },
        {
            "name": "quotaSource",
            "baseName": "quotaSource",
            "type": "string",
            "format": ""
        },
        {
            "name": "quota",
            "baseName": "quota",
            "type": "string",
            "format": ""
        },
        {
            "name": "expireDate",
            "baseName": "expireDate",
            "type": "string",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return SpaceCapacityPageVO.attributeTypeMap;
    }

    public constructor() {
    }
}

