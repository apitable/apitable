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
* Create Oder Request Object
*/
export class CreateOrderRo {
    /**
    * space id
    */
    'spaceId': string;
    /**
    * product type
    */
    'product': string;
    /**
    * seat
    */
    'seat': number;
    /**
    * month
    */
    'month': number;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "spaceId",
            "baseName": "spaceId",
            "type": "string",
            "format": ""
        },
        {
            "name": "product",
            "baseName": "product",
            "type": "string",
            "format": ""
        },
        {
            "name": "seat",
            "baseName": "seat",
            "type": "number",
            "format": "int32"
        },
        {
            "name": "month",
            "baseName": "month",
            "type": "number",
            "format": "int32"
        }    ];

    static getAttributeTypeMap() {
        return CreateOrderRo.attributeTypeMap;
    }

    public constructor() {
    }
}
