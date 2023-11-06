// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { BatchFieldRoleDeleteRo } from '../models/BatchFieldRoleDeleteRo';
import { BatchFieldRoleEditRo } from '../models/BatchFieldRoleEditRo';
import { FieldControlProp } from '../models/FieldControlProp';
import { FieldRoleCreateRo } from '../models/FieldRoleCreateRo';
import { FieldRoleDeleteRo } from '../models/FieldRoleDeleteRo';
import { FieldRoleEditRo } from '../models/FieldRoleEditRo';
import { Page } from '../models/Page';
import { ResponseDataFieldCollaboratorVO } from '../models/ResponseDataFieldCollaboratorVO';
import { ResponseDataListFieldPermissionView } from '../models/ResponseDataListFieldPermissionView';
import { ResponseDataPageInfoFieldRoleMemberVo } from '../models/ResponseDataPageInfoFieldRoleMemberVo';
import { ResponseDataVoid } from '../models/ResponseDataVoid';
import { RoleControlOpenRo } from '../models/RoleControlOpenRo';

/**
 * no description
 */
export class WorkbenchFieldRoleAPIApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * Add field role
     * @param fieldRoleCreateRo 
     * @param dstId datasheet id
     * @param fieldId field id
     */
    public async addRole1(fieldRoleCreateRo: FieldRoleCreateRo, dstId: string, fieldId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'fieldRoleCreateRo' is not null or undefined
        if (fieldRoleCreateRo === null || fieldRoleCreateRo === undefined) {
            throw new RequiredError("WorkbenchFieldRoleAPIApi", "addRole1", "fieldRoleCreateRo");
        }


        // verify required parameter 'dstId' is not null or undefined
        if (dstId === null || dstId === undefined) {
            throw new RequiredError("WorkbenchFieldRoleAPIApi", "addRole1", "dstId");
        }


        // verify required parameter 'fieldId' is not null or undefined
        if (fieldId === null || fieldId === undefined) {
            throw new RequiredError("WorkbenchFieldRoleAPIApi", "addRole1", "fieldId");
        }


        // Path Params
        const localVarPath = '/datasheet/{dstId}/field/{fieldId}/addRole'
            .replace('{' + 'dstId' + '}', encodeURIComponent(String(dstId)))
            .replace('{' + 'fieldId' + '}', encodeURIComponent(String(fieldId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(fieldRoleCreateRo, "FieldRoleCreateRo", ""),
            contentType
        );
        requestContext.setBody(serializedBody);

        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Batch delete role
     * @param batchFieldRoleDeleteRo 
     * @param dstId datasheet id
     * @param fieldId field id
     */
    public async batchDeleteRole1(batchFieldRoleDeleteRo: BatchFieldRoleDeleteRo, dstId: string, fieldId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'batchFieldRoleDeleteRo' is not null or undefined
        if (batchFieldRoleDeleteRo === null || batchFieldRoleDeleteRo === undefined) {
            throw new RequiredError("WorkbenchFieldRoleAPIApi", "batchDeleteRole1", "batchFieldRoleDeleteRo");
        }


        // verify required parameter 'dstId' is not null or undefined
        if (dstId === null || dstId === undefined) {
            throw new RequiredError("WorkbenchFieldRoleAPIApi", "batchDeleteRole1", "dstId");
        }


        // verify required parameter 'fieldId' is not null or undefined
        if (fieldId === null || fieldId === undefined) {
            throw new RequiredError("WorkbenchFieldRoleAPIApi", "batchDeleteRole1", "fieldId");
        }


        // Path Params
        const localVarPath = '/datasheet/{dstId}/field/{fieldId}/batchDeleteRole'
            .replace('{' + 'dstId' + '}', encodeURIComponent(String(dstId)))
            .replace('{' + 'fieldId' + '}', encodeURIComponent(String(fieldId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.DELETE);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(batchFieldRoleDeleteRo, "BatchFieldRoleDeleteRo", ""),
            contentType
        );
        requestContext.setBody(serializedBody);

        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Batch edit field role
     * @param batchFieldRoleEditRo 
     * @param dstId datasheet id
     * @param fieldId field id
     */
    public async batchEditRole1(batchFieldRoleEditRo: BatchFieldRoleEditRo, dstId: string, fieldId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'batchFieldRoleEditRo' is not null or undefined
        if (batchFieldRoleEditRo === null || batchFieldRoleEditRo === undefined) {
            throw new RequiredError("WorkbenchFieldRoleAPIApi", "batchEditRole1", "batchFieldRoleEditRo");
        }


        // verify required parameter 'dstId' is not null or undefined
        if (dstId === null || dstId === undefined) {
            throw new RequiredError("WorkbenchFieldRoleAPIApi", "batchEditRole1", "dstId");
        }


        // verify required parameter 'fieldId' is not null or undefined
        if (fieldId === null || fieldId === undefined) {
            throw new RequiredError("WorkbenchFieldRoleAPIApi", "batchEditRole1", "fieldId");
        }


        // Path Params
        const localVarPath = '/datasheet/{dstId}/field/{fieldId}/batchEditRole'
            .replace('{' + 'dstId' + '}', encodeURIComponent(String(dstId)))
            .replace('{' + 'fieldId' + '}', encodeURIComponent(String(fieldId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(batchFieldRoleEditRo, "BatchFieldRoleEditRo", ""),
            contentType
        );
        requestContext.setBody(serializedBody);

        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Delete field role
     * @param fieldRoleDeleteRo 
     * @param dstId datasheet id
     * @param fieldId field id
     */
    public async deleteRole3(fieldRoleDeleteRo: FieldRoleDeleteRo, dstId: string, fieldId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'fieldRoleDeleteRo' is not null or undefined
        if (fieldRoleDeleteRo === null || fieldRoleDeleteRo === undefined) {
            throw new RequiredError("WorkbenchFieldRoleAPIApi", "deleteRole3", "fieldRoleDeleteRo");
        }


        // verify required parameter 'dstId' is not null or undefined
        if (dstId === null || dstId === undefined) {
            throw new RequiredError("WorkbenchFieldRoleAPIApi", "deleteRole3", "dstId");
        }


        // verify required parameter 'fieldId' is not null or undefined
        if (fieldId === null || fieldId === undefined) {
            throw new RequiredError("WorkbenchFieldRoleAPIApi", "deleteRole3", "fieldId");
        }


        // Path Params
        const localVarPath = '/datasheet/{dstId}/field/{fieldId}/deleteRole'
            .replace('{' + 'dstId' + '}', encodeURIComponent(String(dstId)))
            .replace('{' + 'fieldId' + '}', encodeURIComponent(String(fieldId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.DELETE);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(fieldRoleDeleteRo, "FieldRoleDeleteRo", ""),
            contentType
        );
        requestContext.setBody(serializedBody);

        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Disable field role
     * @param dstId datasheet id
     * @param fieldId field id
     */
    public async disableRole(dstId: string, fieldId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'dstId' is not null or undefined
        if (dstId === null || dstId === undefined) {
            throw new RequiredError("WorkbenchFieldRoleAPIApi", "disableRole", "dstId");
        }


        // verify required parameter 'fieldId' is not null or undefined
        if (fieldId === null || fieldId === undefined) {
            throw new RequiredError("WorkbenchFieldRoleAPIApi", "disableRole", "fieldId");
        }


        // Path Params
        const localVarPath = '/datasheet/{dstId}/field/{fieldId}/permission/disable'
            .replace('{' + 'dstId' + '}', encodeURIComponent(String(dstId)))
            .replace('{' + 'fieldId' + '}', encodeURIComponent(String(fieldId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Edit field role
     * @param fieldRoleEditRo 
     * @param dstId datasheet id
     * @param fieldId field id
     */
    public async editRole2(fieldRoleEditRo: FieldRoleEditRo, dstId: string, fieldId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'fieldRoleEditRo' is not null or undefined
        if (fieldRoleEditRo === null || fieldRoleEditRo === undefined) {
            throw new RequiredError("WorkbenchFieldRoleAPIApi", "editRole2", "fieldRoleEditRo");
        }


        // verify required parameter 'dstId' is not null or undefined
        if (dstId === null || dstId === undefined) {
            throw new RequiredError("WorkbenchFieldRoleAPIApi", "editRole2", "dstId");
        }


        // verify required parameter 'fieldId' is not null or undefined
        if (fieldId === null || fieldId === undefined) {
            throw new RequiredError("WorkbenchFieldRoleAPIApi", "editRole2", "fieldId");
        }


        // Path Params
        const localVarPath = '/datasheet/{dstId}/field/{fieldId}/editRole'
            .replace('{' + 'dstId' + '}', encodeURIComponent(String(dstId)))
            .replace('{' + 'fieldId' + '}', encodeURIComponent(String(fieldId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(fieldRoleEditRo, "FieldRoleEditRo", ""),
            contentType
        );
        requestContext.setBody(serializedBody);

        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Enable field role
     * @param dstId datasheet id
     * @param fieldId field id
     * @param roleControlOpenRo 
     */
    public async enableRole(dstId: string, fieldId: string, roleControlOpenRo?: RoleControlOpenRo, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'dstId' is not null or undefined
        if (dstId === null || dstId === undefined) {
            throw new RequiredError("WorkbenchFieldRoleAPIApi", "enableRole", "dstId");
        }


        // verify required parameter 'fieldId' is not null or undefined
        if (fieldId === null || fieldId === undefined) {
            throw new RequiredError("WorkbenchFieldRoleAPIApi", "enableRole", "fieldId");
        }



        // Path Params
        const localVarPath = '/datasheet/{dstId}/field/{fieldId}/permission/enable'
            .replace('{' + 'dstId' + '}', encodeURIComponent(String(dstId)))
            .replace('{' + 'fieldId' + '}', encodeURIComponent(String(fieldId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(roleControlOpenRo, "RoleControlOpenRo", ""),
            contentType
        );
        requestContext.setBody(serializedBody);

        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Page Query the Field\' Collaborator
     * @param dstId datasheet id
     * @param fieldId field id
     * @param page 
     * @param xSpaceId space id
     * @param pageObjectParams page\&#39;s parameter
     */
    public async getCollaboratorPage1(dstId: string, fieldId: string, page: Page, xSpaceId: string, pageObjectParams: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'dstId' is not null or undefined
        if (dstId === null || dstId === undefined) {
            throw new RequiredError("WorkbenchFieldRoleAPIApi", "getCollaboratorPage1", "dstId");
        }


        // verify required parameter 'fieldId' is not null or undefined
        if (fieldId === null || fieldId === undefined) {
            throw new RequiredError("WorkbenchFieldRoleAPIApi", "getCollaboratorPage1", "fieldId");
        }


        // verify required parameter 'page' is not null or undefined
        if (page === null || page === undefined) {
            throw new RequiredError("WorkbenchFieldRoleAPIApi", "getCollaboratorPage1", "page");
        }


        // verify required parameter 'xSpaceId' is not null or undefined
        if (xSpaceId === null || xSpaceId === undefined) {
            throw new RequiredError("WorkbenchFieldRoleAPIApi", "getCollaboratorPage1", "xSpaceId");
        }


        // verify required parameter 'pageObjectParams' is not null or undefined
        if (pageObjectParams === null || pageObjectParams === undefined) {
            throw new RequiredError("WorkbenchFieldRoleAPIApi", "getCollaboratorPage1", "pageObjectParams");
        }


        // Path Params
        const localVarPath = '/datasheet/{dstId}/field/{fieldId}/collaborator/page'
            .replace('{' + 'dstId' + '}', encodeURIComponent(String(dstId)))
            .replace('{' + 'fieldId' + '}', encodeURIComponent(String(fieldId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (page !== undefined) {
            requestContext.setQueryParam("page", ObjectSerializer.serialize(page, "Page", ""));
        }

        // Query Params
        if (pageObjectParams !== undefined) {
            requestContext.setQueryParam("pageObjectParams", ObjectSerializer.serialize(pageObjectParams, "string", ""));
        }

        // Header Params
        requestContext.setHeaderParam("X-Space-Id", ObjectSerializer.serialize(xSpaceId, "string", ""));


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Get multi datasheet field permission
     * @param dstIds datasheet id
     * @param shareId share id
     */
    public async getMultiDatasheetFieldPermission(dstIds: string, shareId?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'dstIds' is not null or undefined
        if (dstIds === null || dstIds === undefined) {
            throw new RequiredError("WorkbenchFieldRoleAPIApi", "getMultiDatasheetFieldPermission", "dstIds");
        }



        // Path Params
        const localVarPath = '/datasheet/field/permission';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (dstIds !== undefined) {
            requestContext.setQueryParam("dstIds", ObjectSerializer.serialize(dstIds, "string", ""));
        }

        // Query Params
        if (shareId !== undefined) {
            requestContext.setQueryParam("shareId", ObjectSerializer.serialize(shareId, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Gets the field role infos in datasheet.
     * @param dstId datasheet id
     * @param fieldId field id
     */
    public async listRole2(dstId: string, fieldId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'dstId' is not null or undefined
        if (dstId === null || dstId === undefined) {
            throw new RequiredError("WorkbenchFieldRoleAPIApi", "listRole2", "dstId");
        }


        // verify required parameter 'fieldId' is not null or undefined
        if (fieldId === null || fieldId === undefined) {
            throw new RequiredError("WorkbenchFieldRoleAPIApi", "listRole2", "fieldId");
        }


        // Path Params
        const localVarPath = '/datasheet/{dstId}/field/{fieldId}/listRole'
            .replace('{' + 'dstId' + '}', encodeURIComponent(String(dstId)))
            .replace('{' + 'fieldId' + '}', encodeURIComponent(String(fieldId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Update field role setting
     * @param fieldControlProp 
     * @param dstId datasheet id
     * @param fieldId field id
     */
    public async updateRoleSetting(fieldControlProp: FieldControlProp, dstId: string, fieldId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'fieldControlProp' is not null or undefined
        if (fieldControlProp === null || fieldControlProp === undefined) {
            throw new RequiredError("WorkbenchFieldRoleAPIApi", "updateRoleSetting", "fieldControlProp");
        }


        // verify required parameter 'dstId' is not null or undefined
        if (dstId === null || dstId === undefined) {
            throw new RequiredError("WorkbenchFieldRoleAPIApi", "updateRoleSetting", "dstId");
        }


        // verify required parameter 'fieldId' is not null or undefined
        if (fieldId === null || fieldId === undefined) {
            throw new RequiredError("WorkbenchFieldRoleAPIApi", "updateRoleSetting", "fieldId");
        }


        // Path Params
        const localVarPath = '/datasheet/{dstId}/field/{fieldId}/updateRoleSetting'
            .replace('{' + 'dstId' + '}', encodeURIComponent(String(dstId)))
            .replace('{' + 'fieldId' + '}', encodeURIComponent(String(fieldId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(fieldControlProp, "FieldControlProp", ""),
            contentType
        );
        requestContext.setBody(serializedBody);

        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

}

export class WorkbenchFieldRoleAPIApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to addRole1
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async addRole1WithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to batchDeleteRole1
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async batchDeleteRole1WithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to batchEditRole1
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async batchEditRole1WithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to deleteRole3
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async deleteRole3WithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to disableRole
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async disableRoleWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to editRole2
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async editRole2WithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to enableRole
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async enableRoleWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getCollaboratorPage1
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getCollaboratorPage1WithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataPageInfoFieldRoleMemberVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataPageInfoFieldRoleMemberVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataPageInfoFieldRoleMemberVo", ""
            ) as ResponseDataPageInfoFieldRoleMemberVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataPageInfoFieldRoleMemberVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataPageInfoFieldRoleMemberVo", ""
            ) as ResponseDataPageInfoFieldRoleMemberVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getMultiDatasheetFieldPermission
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getMultiDatasheetFieldPermissionWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataListFieldPermissionView >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataListFieldPermissionView = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataListFieldPermissionView", ""
            ) as ResponseDataListFieldPermissionView;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataListFieldPermissionView = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataListFieldPermissionView", ""
            ) as ResponseDataListFieldPermissionView;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to listRole2
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async listRole2WithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataFieldCollaboratorVO >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataFieldCollaboratorVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataFieldCollaboratorVO", ""
            ) as ResponseDataFieldCollaboratorVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataFieldCollaboratorVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataFieldCollaboratorVO", ""
            ) as ResponseDataFieldCollaboratorVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to updateRoleSetting
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async updateRoleSettingWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

}
