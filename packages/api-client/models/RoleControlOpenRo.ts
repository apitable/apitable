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
* Space Management - Node and Field Role Control Open Request Parameters
*/
export class RoleControlOpenRo {
    /**
    * Inherit role when opening
    */
    'includeExtend'?: boolean;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "includeExtend",
            "baseName": "includeExtend",
            "type": "boolean",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return RoleControlOpenRo.attributeTypeMap;
    }

    public constructor() {
    }
}

