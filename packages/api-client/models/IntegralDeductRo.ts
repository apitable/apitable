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
* Integral Deduct Ro
*/
export class IntegralDeductRo {
    /**
    * userId
    */
    'userId'?: number;
    /**
    * areaCode
    */
    'areaCode'?: string;
    /**
    * account credential（mobile phone or email）
    */
    'credential'?: string;
    /**
    * the value of the deduction
    */
    'credit': number;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "userId",
            "baseName": "userId",
            "type": "number",
            "format": "int64"
        },
        {
            "name": "areaCode",
            "baseName": "areaCode",
            "type": "string",
            "format": ""
        },
        {
            "name": "credential",
            "baseName": "credential",
            "type": "string",
            "format": ""
        },
        {
            "name": "credit",
            "baseName": "credit",
            "type": "number",
            "format": "int32"
        }    ];

    static getAttributeTypeMap() {
        return IntegralDeductRo.attributeTypeMap;
    }

    public constructor() {
    }
}
