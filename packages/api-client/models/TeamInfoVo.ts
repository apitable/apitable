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
* Department information
*/
export class TeamInfoVo {
    /**
    * Department ID
    */
    'teamId'?: number;
    /**
    * Department name
    */
    'teamName'?: string;
    /**
    * Number of department members
    */
    'memberCount'?: number;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "teamId",
            "baseName": "teamId",
            "type": "number",
            "format": "int64"
        },
        {
            "name": "teamName",
            "baseName": "teamName",
            "type": "string",
            "format": ""
        },
        {
            "name": "memberCount",
            "baseName": "memberCount",
            "type": "number",
            "format": "int64"
        }    ];

    static getAttributeTypeMap() {
        return TeamInfoVo.attributeTypeMap;
    }

    public constructor() {
    }
}

