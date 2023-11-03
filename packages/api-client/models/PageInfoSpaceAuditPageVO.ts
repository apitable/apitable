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

import { SpaceAuditPageVO } from '../models/SpaceAuditPageVO';
import { HttpFile } from '../http/http';

export class PageInfoSpaceAuditPageVO {
    'pageNum'?: number;
    'pageSize'?: number;
    'size'?: number;
    'total'?: number;
    'pages'?: number;
    'startRow'?: number;
    'endRow'?: number;
    'prePage'?: number;
    'nextPage'?: number;
    'firstPage'?: boolean;
    'lastPage'?: boolean;
    'hasPreviousPage'?: boolean;
    'hasNextPage'?: boolean;
    'records'?: Array<SpaceAuditPageVO>;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "pageNum",
            "baseName": "pageNum",
            "type": "number",
            "format": "int32"
        },
        {
            "name": "pageSize",
            "baseName": "pageSize",
            "type": "number",
            "format": "int32"
        },
        {
            "name": "size",
            "baseName": "size",
            "type": "number",
            "format": "int32"
        },
        {
            "name": "total",
            "baseName": "total",
            "type": "number",
            "format": "int32"
        },
        {
            "name": "pages",
            "baseName": "pages",
            "type": "number",
            "format": "int32"
        },
        {
            "name": "startRow",
            "baseName": "startRow",
            "type": "number",
            "format": "int32"
        },
        {
            "name": "endRow",
            "baseName": "endRow",
            "type": "number",
            "format": "int32"
        },
        {
            "name": "prePage",
            "baseName": "prePage",
            "type": "number",
            "format": "int32"
        },
        {
            "name": "nextPage",
            "baseName": "nextPage",
            "type": "number",
            "format": "int32"
        },
        {
            "name": "firstPage",
            "baseName": "firstPage",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "lastPage",
            "baseName": "lastPage",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "hasPreviousPage",
            "baseName": "hasPreviousPage",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "hasNextPage",
            "baseName": "hasNextPage",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "records",
            "baseName": "records",
            "type": "Array<SpaceAuditPageVO>",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return PageInfoSpaceAuditPageVO.attributeTypeMap;
    }

    public constructor() {
    }
}

