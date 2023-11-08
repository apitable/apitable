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

import { DeptLeader } from '../models/DeptLeader';
import { DeptOrder } from '../models/DeptOrder';
import { UnionEmpExt } from '../models/UnionEmpExt';
import { UserRole } from '../models/UserRole';
import { HttpFile } from '../http/http';

export class DingTalkUserDetail {
    'userid'?: string;
    'unionid'?: string;
    'name'?: string;
    'avatar'?: string;
    'stateCode'?: string;
    'managerUserid'?: string;
    'mobile'?: string;
    'hideMobile'?: boolean;
    'telephone'?: string;
    'jobNumber'?: string;
    'title'?: string;
    'email'?: string;
    'workPlace'?: string;
    'remark'?: string;
    'loginId'?: string;
    'exclusiveAccountType'?: string;
    'exclusiveAccount'?: boolean;
    'deptIdList'?: Array<number>;
    'deptOrderList'?: Array<DeptOrder>;
    'extension'?: string;
    'hiredDate'?: Date;
    'active'?: boolean;
    'realAuthed'?: boolean;
    'senior'?: boolean;
    'admin'?: boolean;
    'boss'?: boolean;
    'leaderInDept'?: Array<DeptLeader>;
    'roleList'?: Array<UserRole>;
    'unionEmpExt'?: UnionEmpExt;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "userid",
            "baseName": "userid",
            "type": "string",
            "format": ""
        },
        {
            "name": "unionid",
            "baseName": "unionid",
            "type": "string",
            "format": ""
        },
        {
            "name": "name",
            "baseName": "name",
            "type": "string",
            "format": ""
        },
        {
            "name": "avatar",
            "baseName": "avatar",
            "type": "string",
            "format": ""
        },
        {
            "name": "stateCode",
            "baseName": "stateCode",
            "type": "string",
            "format": ""
        },
        {
            "name": "managerUserid",
            "baseName": "managerUserid",
            "type": "string",
            "format": ""
        },
        {
            "name": "mobile",
            "baseName": "mobile",
            "type": "string",
            "format": ""
        },
        {
            "name": "hideMobile",
            "baseName": "hideMobile",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "telephone",
            "baseName": "telephone",
            "type": "string",
            "format": ""
        },
        {
            "name": "jobNumber",
            "baseName": "jobNumber",
            "type": "string",
            "format": ""
        },
        {
            "name": "title",
            "baseName": "title",
            "type": "string",
            "format": ""
        },
        {
            "name": "email",
            "baseName": "email",
            "type": "string",
            "format": ""
        },
        {
            "name": "workPlace",
            "baseName": "workPlace",
            "type": "string",
            "format": ""
        },
        {
            "name": "remark",
            "baseName": "remark",
            "type": "string",
            "format": ""
        },
        {
            "name": "loginId",
            "baseName": "loginId",
            "type": "string",
            "format": ""
        },
        {
            "name": "exclusiveAccountType",
            "baseName": "exclusiveAccountType",
            "type": "string",
            "format": ""
        },
        {
            "name": "exclusiveAccount",
            "baseName": "exclusiveAccount",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "deptIdList",
            "baseName": "deptIdList",
            "type": "Array<number>",
            "format": "int64"
        },
        {
            "name": "deptOrderList",
            "baseName": "deptOrderList",
            "type": "Array<DeptOrder>",
            "format": ""
        },
        {
            "name": "extension",
            "baseName": "extension",
            "type": "string",
            "format": ""
        },
        {
            "name": "hiredDate",
            "baseName": "hiredDate",
            "type": "Date",
            "format": "date-time"
        },
        {
            "name": "active",
            "baseName": "active",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "realAuthed",
            "baseName": "realAuthed",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "senior",
            "baseName": "senior",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "admin",
            "baseName": "admin",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "boss",
            "baseName": "boss",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "leaderInDept",
            "baseName": "leaderInDept",
            "type": "Array<DeptLeader>",
            "format": ""
        },
        {
            "name": "roleList",
            "baseName": "roleList",
            "type": "Array<UserRole>",
            "format": ""
        },
        {
            "name": "unionEmpExt",
            "baseName": "unionEmpExt",
            "type": "UnionEmpExt",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return DingTalkUserDetail.attributeTypeMap;
    }

    public constructor() {
    }
}
