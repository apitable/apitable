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

import { AlbumGroupVo } from '../models/AlbumGroupVo';
import { Banner } from '../models/Banner';
import { TemplateGroupVo } from '../models/TemplateGroupVo';
import { HttpFile } from '../http/http';

/**
* Recommend View
*/
export class RecommendVo {
    /**
    * Top Banner
    */
    'top'?: Array<Banner>;
    /**
    * Custom Albums Groups
    */
    'albumGroups'?: Array<AlbumGroupVo>;
    /**
    * Custom Template Groups
    */
    'templateGroups'?: Array<TemplateGroupVo>;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "top",
            "baseName": "top",
            "type": "Array<Banner>",
            "format": ""
        },
        {
            "name": "albumGroups",
            "baseName": "albumGroups",
            "type": "Array<AlbumGroupVo>",
            "format": ""
        },
        {
            "name": "templateGroups",
            "baseName": "templateGroups",
            "type": "Array<TemplateGroupVo>",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return RecommendVo.attributeTypeMap;
    }

    public constructor() {
    }
}

