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
* Template Unpublish Ro
*/
export class TemplateUnpublishRo {
    /**
    * template category code; invalid when allCategory is true
    */
    'categoryCode'?: string;
    /**
    * unpublish from all template categories
    */
    'allCategory'?: boolean;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "categoryCode",
            "baseName": "categoryCode",
            "type": "string",
            "format": ""
        },
        {
            "name": "allCategory",
            "baseName": "allCategory",
            "type": "boolean",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return TemplateUnpublishRo.attributeTypeMap;
    }

    public constructor() {
    }
}

