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

import { OpAssetRo } from '../models/OpAssetRo';
import { HttpFile } from '../http/http';

/**
* Space attachment resource request parameters
*/
export class SpaceAssetOpRo {
    /**
    * Write the token set
    */
    'addToken'?: Array<OpAssetRo>;
    /**
    * Delete token collection
    */
    'removeToken'?: Array<OpAssetRo>;
    /**
    * DataSheet Node Id
    */
    'nodeId': string;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "addToken",
            "baseName": "addToken",
            "type": "Array<OpAssetRo>",
            "format": ""
        },
        {
            "name": "removeToken",
            "baseName": "removeToken",
            "type": "Array<OpAssetRo>",
            "format": ""
        },
        {
            "name": "nodeId",
            "baseName": "nodeId",
            "type": "string",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return SpaceAssetOpRo.attributeTypeMap;
    }

    public constructor() {
    }
}

