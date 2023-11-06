// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { AddNodeRoleRo } from '../models/AddNodeRoleRo';
import { BatchDeleteNodeRoleRo } from '../models/BatchDeleteNodeRoleRo';
import { BatchModifyNodeRoleRo } from '../models/BatchModifyNodeRoleRo';
import { DeleteNodeRoleRo } from '../models/DeleteNodeRoleRo';
import { ModifyNodeRoleRo } from '../models/ModifyNodeRoleRo';
import { Page } from '../models/Page';
import { ResponseDataNodeCollaboratorVO } from '../models/ResponseDataNodeCollaboratorVO';
import { ResponseDataNodeCollaboratorsVo } from '../models/ResponseDataNodeCollaboratorsVo';
import { ResponseDataPageInfoNodeRoleMemberVo } from '../models/ResponseDataPageInfoNodeRoleMemberVo';
import { ResponseDataVoid } from '../models/ResponseDataVoid';
import { RoleControlOpenRo } from '../models/RoleControlOpenRo';

/**
 * no description
 */
export class WorkbenchNodeRoleApiApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * Batch delete node role
     * @param batchDeleteNodeRoleRo 
     * @param xSpaceId space id
     * @param xSocketId user socket id
     */
    public async batchDeleteRole(batchDeleteNodeRoleRo: BatchDeleteNodeRoleRo, xSpaceId: string, xSocketId?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'batchDeleteNodeRoleRo' is not null or undefined
        if (batchDeleteNodeRoleRo === null || batchDeleteNodeRoleRo === undefined) {
            throw new RequiredError("WorkbenchNodeRoleApiApi", "batchDeleteRole", "batchDeleteNodeRoleRo");
        }


        // verify required parameter 'xSpaceId' is not null or undefined
        if (xSpaceId === null || xSpaceId === undefined) {
            throw new RequiredError("WorkbenchNodeRoleApiApi", "batchDeleteRole", "xSpaceId");
        }



        // Path Params
        const localVarPath = '/node/batchDeleteRole';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.DELETE);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Header Params
        requestContext.setHeaderParam("X-Space-Id", ObjectSerializer.serialize(xSpaceId, "string", ""));

        // Header Params
        requestContext.setHeaderParam("X-Socket-Id", ObjectSerializer.serialize(xSocketId, "string", ""));


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(batchDeleteNodeRoleRo, "BatchDeleteNodeRoleRo", ""),
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
     * Batch modify the role of the organizational unit of the node
     * Batch edit role
     * @param batchModifyNodeRoleRo 
     * @param xSpaceId space id
     * @param xSocketId user socket id
     */
    public async batchEditRole(batchModifyNodeRoleRo: BatchModifyNodeRoleRo, xSpaceId: string, xSocketId?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'batchModifyNodeRoleRo' is not null or undefined
        if (batchModifyNodeRoleRo === null || batchModifyNodeRoleRo === undefined) {
            throw new RequiredError("WorkbenchNodeRoleApiApi", "batchEditRole", "batchModifyNodeRoleRo");
        }


        // verify required parameter 'xSpaceId' is not null or undefined
        if (xSpaceId === null || xSpaceId === undefined) {
            throw new RequiredError("WorkbenchNodeRoleApiApi", "batchEditRole", "xSpaceId");
        }



        // Path Params
        const localVarPath = '/node/batchEditRole';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Header Params
        requestContext.setHeaderParam("X-Space-Id", ObjectSerializer.serialize(xSpaceId, "string", ""));

        // Header Params
        requestContext.setHeaderParam("X-Socket-Id", ObjectSerializer.serialize(xSocketId, "string", ""));


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(batchModifyNodeRoleRo, "BatchModifyNodeRoleRo", ""),
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
     * Add the organizational unit of the node specified role
     * Create node role
     * @param addNodeRoleRo 
     * @param xSpaceId space id
     * @param xSocketId user socket id
     */
    public async createRole1(addNodeRoleRo: AddNodeRoleRo, xSpaceId: string, xSocketId?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'addNodeRoleRo' is not null or undefined
        if (addNodeRoleRo === null || addNodeRoleRo === undefined) {
            throw new RequiredError("WorkbenchNodeRoleApiApi", "createRole1", "addNodeRoleRo");
        }


        // verify required parameter 'xSpaceId' is not null or undefined
        if (xSpaceId === null || xSpaceId === undefined) {
            throw new RequiredError("WorkbenchNodeRoleApiApi", "createRole1", "xSpaceId");
        }



        // Path Params
        const localVarPath = '/node/addRole';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Header Params
        requestContext.setHeaderParam("X-Space-Id", ObjectSerializer.serialize(xSpaceId, "string", ""));

        // Header Params
        requestContext.setHeaderParam("X-Socket-Id", ObjectSerializer.serialize(xSocketId, "string", ""));


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(addNodeRoleRo, "AddNodeRoleRo", ""),
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
     * Delete role
     * @param deleteNodeRoleRo 
     * @param xSpaceId space id
     * @param xSocketId user socket id
     */
    public async deleteRole2(deleteNodeRoleRo: DeleteNodeRoleRo, xSpaceId: string, xSocketId?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'deleteNodeRoleRo' is not null or undefined
        if (deleteNodeRoleRo === null || deleteNodeRoleRo === undefined) {
            throw new RequiredError("WorkbenchNodeRoleApiApi", "deleteRole2", "deleteNodeRoleRo");
        }


        // verify required parameter 'xSpaceId' is not null or undefined
        if (xSpaceId === null || xSpaceId === undefined) {
            throw new RequiredError("WorkbenchNodeRoleApiApi", "deleteRole2", "xSpaceId");
        }



        // Path Params
        const localVarPath = '/node/deleteRole';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.DELETE);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Header Params
        requestContext.setHeaderParam("X-Space-Id", ObjectSerializer.serialize(xSpaceId, "string", ""));

        // Header Params
        requestContext.setHeaderParam("X-Socket-Id", ObjectSerializer.serialize(xSocketId, "string", ""));


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(deleteNodeRoleRo, "DeleteNodeRoleRo", ""),
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
     * Disable role extend
     * @param nodeId node id
     * @param xSpaceId space id
     * @param roleControlOpenRo 
     * @param xSocketId user socket id
     */
    public async disableRoleExtend(nodeId: string, xSpaceId: string, roleControlOpenRo?: RoleControlOpenRo, xSocketId?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'nodeId' is not null or undefined
        if (nodeId === null || nodeId === undefined) {
            throw new RequiredError("WorkbenchNodeRoleApiApi", "disableRoleExtend", "nodeId");
        }


        // verify required parameter 'xSpaceId' is not null or undefined
        if (xSpaceId === null || xSpaceId === undefined) {
            throw new RequiredError("WorkbenchNodeRoleApiApi", "disableRoleExtend", "xSpaceId");
        }




        // Path Params
        const localVarPath = '/node/disableRoleExtend';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (nodeId !== undefined) {
            requestContext.setQueryParam("nodeId", ObjectSerializer.serialize(nodeId, "string", ""));
        }

        // Header Params
        requestContext.setHeaderParam("X-Space-Id", ObjectSerializer.serialize(xSpaceId, "string", ""));

        // Header Params
        requestContext.setHeaderParam("X-Socket-Id", ObjectSerializer.serialize(xSocketId, "string", ""));


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
     * Modify the role of the organizational unit of the node
     * Edit node role
     * @param modifyNodeRoleRo 
     * @param xSpaceId space id
     * @param xSocketId user socket id
     */
    public async editRole1(modifyNodeRoleRo: ModifyNodeRoleRo, xSpaceId: string, xSocketId?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'modifyNodeRoleRo' is not null or undefined
        if (modifyNodeRoleRo === null || modifyNodeRoleRo === undefined) {
            throw new RequiredError("WorkbenchNodeRoleApiApi", "editRole1", "modifyNodeRoleRo");
        }


        // verify required parameter 'xSpaceId' is not null or undefined
        if (xSpaceId === null || xSpaceId === undefined) {
            throw new RequiredError("WorkbenchNodeRoleApiApi", "editRole1", "xSpaceId");
        }



        // Path Params
        const localVarPath = '/node/editRole';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Header Params
        requestContext.setHeaderParam("X-Space-Id", ObjectSerializer.serialize(xSpaceId, "string", ""));

        // Header Params
        requestContext.setHeaderParam("X-Socket-Id", ObjectSerializer.serialize(xSocketId, "string", ""));


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(modifyNodeRoleRo, "ModifyNodeRoleRo", ""),
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
     * Enable role extend
     * @param nodeId node id
     * @param xSpaceId space id
     * @param xSocketId user socket id
     */
    public async enableRoleExtend(nodeId: string, xSpaceId: string, xSocketId?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'nodeId' is not null or undefined
        if (nodeId === null || nodeId === undefined) {
            throw new RequiredError("WorkbenchNodeRoleApiApi", "enableRoleExtend", "nodeId");
        }


        // verify required parameter 'xSpaceId' is not null or undefined
        if (xSpaceId === null || xSpaceId === undefined) {
            throw new RequiredError("WorkbenchNodeRoleApiApi", "enableRoleExtend", "xSpaceId");
        }



        // Path Params
        const localVarPath = '/node/enableRoleExtend';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (nodeId !== undefined) {
            requestContext.setQueryParam("nodeId", ObjectSerializer.serialize(nodeId, "string", ""));
        }

        // Header Params
        requestContext.setHeaderParam("X-Space-Id", ObjectSerializer.serialize(xSpaceId, "string", ""));

        // Header Params
        requestContext.setHeaderParam("X-Socket-Id", ObjectSerializer.serialize(xSocketId, "string", ""));


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Scene: Collaborator Card Information
     * Get Collaborator Info
     * @param uuid 
     * @param nodeId 
     * @param xSpaceId space id
     */
    public async getCollaboratorInfo(uuid: string, nodeId: string, xSpaceId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'uuid' is not null or undefined
        if (uuid === null || uuid === undefined) {
            throw new RequiredError("WorkbenchNodeRoleApiApi", "getCollaboratorInfo", "uuid");
        }


        // verify required parameter 'nodeId' is not null or undefined
        if (nodeId === null || nodeId === undefined) {
            throw new RequiredError("WorkbenchNodeRoleApiApi", "getCollaboratorInfo", "nodeId");
        }


        // verify required parameter 'xSpaceId' is not null or undefined
        if (xSpaceId === null || xSpaceId === undefined) {
            throw new RequiredError("WorkbenchNodeRoleApiApi", "getCollaboratorInfo", "xSpaceId");
        }


        // Path Params
        const localVarPath = '/node/collaborator/info';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (uuid !== undefined) {
            requestContext.setQueryParam("uuid", ObjectSerializer.serialize(uuid, "string", ""));
        }

        // Query Params
        if (nodeId !== undefined) {
            requestContext.setQueryParam("nodeId", ObjectSerializer.serialize(nodeId, "string", ""));
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
     * Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Page Query the Node\' Collaborator
     * @param nodeId node id
     * @param page 
     * @param xSpaceId space id
     * @param pageObjectParams page\&#39;s parameter
     */
    public async getCollaboratorPage(nodeId: string, page: Page, xSpaceId: string, pageObjectParams: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'nodeId' is not null or undefined
        if (nodeId === null || nodeId === undefined) {
            throw new RequiredError("WorkbenchNodeRoleApiApi", "getCollaboratorPage", "nodeId");
        }


        // verify required parameter 'page' is not null or undefined
        if (page === null || page === undefined) {
            throw new RequiredError("WorkbenchNodeRoleApiApi", "getCollaboratorPage", "page");
        }


        // verify required parameter 'xSpaceId' is not null or undefined
        if (xSpaceId === null || xSpaceId === undefined) {
            throw new RequiredError("WorkbenchNodeRoleApiApi", "getCollaboratorPage", "xSpaceId");
        }


        // verify required parameter 'pageObjectParams' is not null or undefined
        if (pageObjectParams === null || pageObjectParams === undefined) {
            throw new RequiredError("WorkbenchNodeRoleApiApi", "getCollaboratorPage", "pageObjectParams");
        }


        // Path Params
        const localVarPath = '/node/collaborator/page';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (nodeId !== undefined) {
            requestContext.setQueryParam("nodeId", ObjectSerializer.serialize(nodeId, "string", ""));
        }

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
     * Get node roles
     * @param nodeId node id
     * @param xSpaceId space id
     * @param includeAdmin Whether to include the master administrator, can not be passed, the default includes
     * @param includeSelf Whether to get userself, do not pass, the default contains
     * @param includeExtend Contains superior inherited permissions. By default, it does not include
     */
    public async listRole1(nodeId: string, xSpaceId: string, includeAdmin?: boolean, includeSelf?: boolean, includeExtend?: boolean, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'nodeId' is not null or undefined
        if (nodeId === null || nodeId === undefined) {
            throw new RequiredError("WorkbenchNodeRoleApiApi", "listRole1", "nodeId");
        }


        // verify required parameter 'xSpaceId' is not null or undefined
        if (xSpaceId === null || xSpaceId === undefined) {
            throw new RequiredError("WorkbenchNodeRoleApiApi", "listRole1", "xSpaceId");
        }





        // Path Params
        const localVarPath = '/node/listRole';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (nodeId !== undefined) {
            requestContext.setQueryParam("nodeId", ObjectSerializer.serialize(nodeId, "string", ""));
        }

        // Query Params
        if (includeAdmin !== undefined) {
            requestContext.setQueryParam("includeAdmin", ObjectSerializer.serialize(includeAdmin, "boolean", ""));
        }

        // Query Params
        if (includeSelf !== undefined) {
            requestContext.setQueryParam("includeSelf", ObjectSerializer.serialize(includeSelf, "boolean", ""));
        }

        // Query Params
        if (includeExtend !== undefined) {
            requestContext.setQueryParam("includeExtend", ObjectSerializer.serialize(includeExtend, "boolean", ""));
        }

        // Header Params
        requestContext.setHeaderParam("X-Space-Id", ObjectSerializer.serialize(xSpaceId, "string", ""));


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

}

export class WorkbenchNodeRoleApiApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to batchDeleteRole
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async batchDeleteRoleWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
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
     * @params response Response returned by the server for a request to batchEditRole
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async batchEditRoleWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
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
     * @params response Response returned by the server for a request to createRole1
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async createRole1WithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
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
     * @params response Response returned by the server for a request to deleteRole2
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async deleteRole2WithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
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
     * @params response Response returned by the server for a request to disableRoleExtend
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async disableRoleExtendWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
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
     * @params response Response returned by the server for a request to editRole1
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async editRole1WithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
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
     * @params response Response returned by the server for a request to enableRoleExtend
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async enableRoleExtendWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
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
     * @params response Response returned by the server for a request to getCollaboratorInfo
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getCollaboratorInfoWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataNodeCollaboratorVO >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataNodeCollaboratorVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataNodeCollaboratorVO", ""
            ) as ResponseDataNodeCollaboratorVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataNodeCollaboratorVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataNodeCollaboratorVO", ""
            ) as ResponseDataNodeCollaboratorVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getCollaboratorPage
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getCollaboratorPageWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataPageInfoNodeRoleMemberVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataPageInfoNodeRoleMemberVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataPageInfoNodeRoleMemberVo", ""
            ) as ResponseDataPageInfoNodeRoleMemberVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataPageInfoNodeRoleMemberVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataPageInfoNodeRoleMemberVo", ""
            ) as ResponseDataPageInfoNodeRoleMemberVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to listRole1
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async listRole1WithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataNodeCollaboratorsVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataNodeCollaboratorsVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataNodeCollaboratorsVo", ""
            ) as ResponseDataNodeCollaboratorsVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataNodeCollaboratorsVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataNodeCollaboratorsVo", ""
            ) as ResponseDataNodeCollaboratorsVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

}
