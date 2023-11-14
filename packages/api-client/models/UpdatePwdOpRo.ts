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

import { HttpFile } from '../http/http';

/**
* Modify password request parameters
*/
export class UpdatePwdOpRo {
    /**
    * Check Type
    */
    'type'?: UpdatePwdOpRoTypeEnum;
    /**
    * Phone number/Email Verification Code
    */
    'code'?: string;
    /**
    * Password
    */
    'password': string;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "type",
            "baseName": "type",
            "type": "UpdatePwdOpRoTypeEnum",
            "format": ""
        },
        {
            "name": "code",
            "baseName": "code",
            "type": "string",
            "format": ""
        },
        {
            "name": "password",
            "baseName": "password",
            "type": "string",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return UpdatePwdOpRo.attributeTypeMap;
    }

    public constructor() {
    }
}


export enum UpdatePwdOpRoTypeEnum {
    SmsCode = 'sms_code',
    EmailCode = 'email_code'
}

