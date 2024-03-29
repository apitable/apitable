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
* role\'s info
*/
export class RoleVo {
    /**
    * role id
    */
    'roleId'?: number;
    /**
    * role\'s name
    */
    'roleName'?: string;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "roleId",
            "baseName": "roleId",
            "type": "number",
            "format": "int64"
        },
        {
            "name": "roleName",
            "baseName": "roleName",
            "type": "string",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return RoleVo.attributeTypeMap;
    }

    public constructor() {
    }
}

