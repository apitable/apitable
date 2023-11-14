// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { AddRoleMemberRo } from '../models/AddRoleMemberRo';
import { CreateRoleRo } from '../models/CreateRoleRo';
import { DeleteRoleMemberRo } from '../models/DeleteRoleMemberRo';
import { PageVoid } from '../models/PageVoid';
import { ResponseDataListRoleInfoVo } from '../models/ResponseDataListRoleInfoVo';
import { ResponseDataPageInfoRoleMemberVo } from '../models/ResponseDataPageInfoRoleMemberVo';
import { ResponseDataVoid } from '../models/ResponseDataVoid';
import { UpdateRoleRo } from '../models/UpdateRoleRo';

/**
 * no description
 */
export class ContactsRoleApiApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * add role members
     * add role members
     * @param addRoleMemberRo 
     * @param roleId 
     * @param xSpaceId space id
     * @param roleId2 
     */
    public async addRoleMembers(addRoleMemberRo: AddRoleMemberRo, roleId: number, xSpaceId: string, roleId2: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'addRoleMemberRo' is not null or undefined
        if (addRoleMemberRo === null || addRoleMemberRo === undefined) {
            throw new RequiredError("ContactsRoleApiApi", "addRoleMembers", "addRoleMemberRo");
        }


        // verify required parameter 'roleId' is not null or undefined
        if (roleId === null || roleId === undefined) {
            throw new RequiredError("ContactsRoleApiApi", "addRoleMembers", "roleId");
        }


        // verify required parameter 'xSpaceId' is not null or undefined
        if (xSpaceId === null || xSpaceId === undefined) {
            throw new RequiredError("ContactsRoleApiApi", "addRoleMembers", "xSpaceId");
        }


        // verify required parameter 'roleId2' is not null or undefined
        if (roleId2 === null || roleId2 === undefined) {
            throw new RequiredError("ContactsRoleApiApi", "addRoleMembers", "roleId2");
        }


        // Path Params
        const localVarPath = '/org/roles/{roleId}/members'
            .replace('{' + 'roleId' + '}', encodeURIComponent(String(roleId)))
            .replace('{' + 'role id' + '}', encodeURIComponent(String(roleId2)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Header Params
        requestContext.setHeaderParam("X-Space-Id", ObjectSerializer.serialize(xSpaceId, "string", ""));


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(addRoleMemberRo, "AddRoleMemberRo", ""),
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
     * create new role
     * create new role
     * @param createRoleRo 
     * @param xSpaceId space id
     */
    public async createRole(createRoleRo: CreateRoleRo, xSpaceId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'createRoleRo' is not null or undefined
        if (createRoleRo === null || createRoleRo === undefined) {
            throw new RequiredError("ContactsRoleApiApi", "createRole", "createRoleRo");
        }


        // verify required parameter 'xSpaceId' is not null or undefined
        if (xSpaceId === null || xSpaceId === undefined) {
            throw new RequiredError("ContactsRoleApiApi", "createRole", "xSpaceId");
        }


        // Path Params
        const localVarPath = '/org/roles';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Header Params
        requestContext.setHeaderParam("X-Space-Id", ObjectSerializer.serialize(xSpaceId, "string", ""));


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(createRoleRo, "CreateRoleRo", ""),
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
     * delete role
     * delete role
     * @param roleId 
     * @param xSpaceId space id
     * @param roleId2 
     */
    public async deleteRole1(roleId: number, xSpaceId: string, roleId2: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'roleId' is not null or undefined
        if (roleId === null || roleId === undefined) {
            throw new RequiredError("ContactsRoleApiApi", "deleteRole1", "roleId");
        }


        // verify required parameter 'xSpaceId' is not null or undefined
        if (xSpaceId === null || xSpaceId === undefined) {
            throw new RequiredError("ContactsRoleApiApi", "deleteRole1", "xSpaceId");
        }


        // verify required parameter 'roleId2' is not null or undefined
        if (roleId2 === null || roleId2 === undefined) {
            throw new RequiredError("ContactsRoleApiApi", "deleteRole1", "roleId2");
        }


        // Path Params
        const localVarPath = '/org/roles/{roleId}'
            .replace('{' + 'roleId' + '}', encodeURIComponent(String(roleId)))
            .replace('{' + 'role id' + '}', encodeURIComponent(String(roleId2)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.DELETE);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Header Params
        requestContext.setHeaderParam("X-Space-Id", ObjectSerializer.serialize(xSpaceId, "string", ""));


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * query the role\'s members
     * query role members
     * @param roleId 
     * @param page 
     * @param xSpaceId space id
     * @param roleId2 
     * @param pageObjectParams page parameters
     */
    public async getRoleMembers(roleId: number, page: PageVoid, xSpaceId: string, roleId2: string, pageObjectParams: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'roleId' is not null or undefined
        if (roleId === null || roleId === undefined) {
            throw new RequiredError("ContactsRoleApiApi", "getRoleMembers", "roleId");
        }


        // verify required parameter 'page' is not null or undefined
        if (page === null || page === undefined) {
            throw new RequiredError("ContactsRoleApiApi", "getRoleMembers", "page");
        }


        // verify required parameter 'xSpaceId' is not null or undefined
        if (xSpaceId === null || xSpaceId === undefined) {
            throw new RequiredError("ContactsRoleApiApi", "getRoleMembers", "xSpaceId");
        }


        // verify required parameter 'roleId2' is not null or undefined
        if (roleId2 === null || roleId2 === undefined) {
            throw new RequiredError("ContactsRoleApiApi", "getRoleMembers", "roleId2");
        }


        // verify required parameter 'pageObjectParams' is not null or undefined
        if (pageObjectParams === null || pageObjectParams === undefined) {
            throw new RequiredError("ContactsRoleApiApi", "getRoleMembers", "pageObjectParams");
        }


        // Path Params
        const localVarPath = '/org/roles/{roleId}/members'
            .replace('{' + 'roleId' + '}', encodeURIComponent(String(roleId)))
            .replace('{' + 'role id' + '}', encodeURIComponent(String(roleId2)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (page !== undefined) {
            requestContext.setQueryParam("page", ObjectSerializer.serialize(page, "PageVoid", ""));
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
     * query the space\'s roles
     * query roles
     * @param xSpaceId space id
     */
    public async getRoles(xSpaceId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'xSpaceId' is not null or undefined
        if (xSpaceId === null || xSpaceId === undefined) {
            throw new RequiredError("ContactsRoleApiApi", "getRoles", "xSpaceId");
        }


        // Path Params
        const localVarPath = '/org/roles';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Header Params
        requestContext.setHeaderParam("X-Space-Id", ObjectSerializer.serialize(xSpaceId, "string", ""));


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * create init role
     * create init role
     * @param xSpaceId space id
     */
    public async initRoles(xSpaceId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'xSpaceId' is not null or undefined
        if (xSpaceId === null || xSpaceId === undefined) {
            throw new RequiredError("ContactsRoleApiApi", "initRoles", "xSpaceId");
        }


        // Path Params
        const localVarPath = '/org/roles/init';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Header Params
        requestContext.setHeaderParam("X-Space-Id", ObjectSerializer.serialize(xSpaceId, "string", ""));


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * remove role members
     * remove role members
     * @param deleteRoleMemberRo 
     * @param roleId 
     * @param xSpaceId space id
     * @param roleId2 
     */
    public async removeRoleMembers(deleteRoleMemberRo: DeleteRoleMemberRo, roleId: number, xSpaceId: string, roleId2: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'deleteRoleMemberRo' is not null or undefined
        if (deleteRoleMemberRo === null || deleteRoleMemberRo === undefined) {
            throw new RequiredError("ContactsRoleApiApi", "removeRoleMembers", "deleteRoleMemberRo");
        }


        // verify required parameter 'roleId' is not null or undefined
        if (roleId === null || roleId === undefined) {
            throw new RequiredError("ContactsRoleApiApi", "removeRoleMembers", "roleId");
        }


        // verify required parameter 'xSpaceId' is not null or undefined
        if (xSpaceId === null || xSpaceId === undefined) {
            throw new RequiredError("ContactsRoleApiApi", "removeRoleMembers", "xSpaceId");
        }


        // verify required parameter 'roleId2' is not null or undefined
        if (roleId2 === null || roleId2 === undefined) {
            throw new RequiredError("ContactsRoleApiApi", "removeRoleMembers", "roleId2");
        }


        // Path Params
        const localVarPath = '/org/roles/{roleId}/members'
            .replace('{' + 'roleId' + '}', encodeURIComponent(String(roleId)))
            .replace('{' + 'role id' + '}', encodeURIComponent(String(roleId2)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.DELETE);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Header Params
        requestContext.setHeaderParam("X-Space-Id", ObjectSerializer.serialize(xSpaceId, "string", ""));


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(deleteRoleMemberRo, "DeleteRoleMemberRo", ""),
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
     * update role information
     * update role information
     * @param updateRoleRo 
     * @param roleId 
     * @param xSpaceId space id
     * @param roleId2 
     */
    public async updateRole(updateRoleRo: UpdateRoleRo, roleId: number, xSpaceId: string, roleId2: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'updateRoleRo' is not null or undefined
        if (updateRoleRo === null || updateRoleRo === undefined) {
            throw new RequiredError("ContactsRoleApiApi", "updateRole", "updateRoleRo");
        }


        // verify required parameter 'roleId' is not null or undefined
        if (roleId === null || roleId === undefined) {
            throw new RequiredError("ContactsRoleApiApi", "updateRole", "roleId");
        }


        // verify required parameter 'xSpaceId' is not null or undefined
        if (xSpaceId === null || xSpaceId === undefined) {
            throw new RequiredError("ContactsRoleApiApi", "updateRole", "xSpaceId");
        }


        // verify required parameter 'roleId2' is not null or undefined
        if (roleId2 === null || roleId2 === undefined) {
            throw new RequiredError("ContactsRoleApiApi", "updateRole", "roleId2");
        }


        // Path Params
        const localVarPath = '/org/roles/{roleId}'
            .replace('{' + 'roleId' + '}', encodeURIComponent(String(roleId)))
            .replace('{' + 'role id' + '}', encodeURIComponent(String(roleId2)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.PATCH);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Header Params
        requestContext.setHeaderParam("X-Space-Id", ObjectSerializer.serialize(xSpaceId, "string", ""));


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(updateRoleRo, "UpdateRoleRo", ""),
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

export class ContactsRoleApiApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to addRoleMembers
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async addRoleMembersWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
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
     * @params response Response returned by the server for a request to createRole
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async createRoleWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
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
     * @params response Response returned by the server for a request to deleteRole1
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async deleteRole1WithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
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
     * @params response Response returned by the server for a request to getRoleMembers
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getRoleMembersWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataPageInfoRoleMemberVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataPageInfoRoleMemberVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataPageInfoRoleMemberVo", ""
            ) as ResponseDataPageInfoRoleMemberVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataPageInfoRoleMemberVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataPageInfoRoleMemberVo", ""
            ) as ResponseDataPageInfoRoleMemberVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getRoles
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getRolesWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataListRoleInfoVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataListRoleInfoVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataListRoleInfoVo", ""
            ) as ResponseDataListRoleInfoVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataListRoleInfoVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataListRoleInfoVo", ""
            ) as ResponseDataListRoleInfoVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to initRoles
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async initRolesWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
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
     * @params response Response returned by the server for a request to removeRoleMembers
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async removeRoleMembersWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
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
     * @params response Response returned by the server for a request to updateRole
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async updateRoleWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
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
