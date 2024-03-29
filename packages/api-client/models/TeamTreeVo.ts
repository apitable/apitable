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
* Department Tree View
*/
export class TeamTreeVo {
    /**
    * Department ID
    */
    'teamId'?: number;
    /**
    * Department name
    */
    'teamName'?: string;
    /**
    * Parent ID, 0 if the parent is root
    */
    'parentId'?: number;
    /**
    * Number of department members
    */
    'memberCount'?: number;
    /**
    * Sort No
    */
    'sequence'?: number;
    /**
    * Whether there are sub teams.
    */
    'hasChildren'?: boolean;
    /**
    * Subsidiary department
    */
    'children'?: Array<TeamTreeVo>;

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
            "name": "parentId",
            "baseName": "parentId",
            "type": "number",
            "format": "int64"
        },
        {
            "name": "memberCount",
            "baseName": "memberCount",
            "type": "number",
            "format": "int32"
        },
        {
            "name": "sequence",
            "baseName": "sequence",
            "type": "number",
            "format": "int32"
        },
        {
            "name": "hasChildren",
            "baseName": "hasChildren",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "children",
            "baseName": "children",
            "type": "Array<TeamTreeVo>",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return TeamTreeVo.attributeTypeMap;
    }

    public constructor() {
    }
}

