// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { InternalPermissionRo } from '../models/InternalPermissionRo';
import { ResponseDataFieldPermissionView } from '../models/ResponseDataFieldPermissionView';
import { ResponseDataListFieldPermissionView } from '../models/ResponseDataListFieldPermissionView';
import { ResponseDataVoid } from '../models/ResponseDataVoid';

/**
 * no description
 */
export class InternalServiceDataTableFieldPermissionInterfaceApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * room layer ot delete field operation call
     * turn off multiple field permissions
     * @param dstId table id
     * @param fieldIds list of field ids
     */
    public async disableRoles(dstId: string, fieldIds: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'dstId' is not null or undefined
        if (dstId === null || dstId === undefined) {
            throw new RequiredError("InternalServiceDataTableFieldPermissionInterfaceApi", "disableRoles", "dstId");
        }


        // verify required parameter 'fieldIds' is not null or undefined
        if (fieldIds === null || fieldIds === undefined) {
            throw new RequiredError("InternalServiceDataTableFieldPermissionInterfaceApi", "disableRoles", "fieldIds");
        }


        // Path Params
        const localVarPath = '/internal/datasheet/{dstId}/field/permission/disable'
            .replace('{' + 'dstId' + '}', encodeURIComponent(String(dstId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (fieldIds !== undefined) {
            requestContext.setQueryParam("fieldIds", ObjectSerializer.serialize(fieldIds, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * get field permissions
     * @param nodeId node id
     * @param userId user id
     * @param shareId share id
     */
    public async getFieldPermission(nodeId: string, userId: string, shareId?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'nodeId' is not null or undefined
        if (nodeId === null || nodeId === undefined) {
            throw new RequiredError("InternalServiceDataTableFieldPermissionInterfaceApi", "getFieldPermission", "nodeId");
        }


        // verify required parameter 'userId' is not null or undefined
        if (userId === null || userId === undefined) {
            throw new RequiredError("InternalServiceDataTableFieldPermissionInterfaceApi", "getFieldPermission", "userId");
        }



        // Path Params
        const localVarPath = '/internal/node/{nodeId}/field/permission'
            .replace('{' + 'nodeId' + '}', encodeURIComponent(String(nodeId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (shareId !== undefined) {
            requestContext.setQueryParam("shareId", ObjectSerializer.serialize(shareId, "string", ""));
        }

        // Query Params
        if (userId !== undefined) {
            requestContext.setQueryParam("userId", ObjectSerializer.serialize(userId, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * get field permission set for multiple nodes
     * @param internalPermissionRo 
     */
    public async getMultiFieldPermissionViews(internalPermissionRo: InternalPermissionRo, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'internalPermissionRo' is not null or undefined
        if (internalPermissionRo === null || internalPermissionRo === undefined) {
            throw new RequiredError("InternalServiceDataTableFieldPermissionInterfaceApi", "getMultiFieldPermissionViews", "internalPermissionRo");
        }


        // Path Params
        const localVarPath = '/internal/node/field/permission';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(internalPermissionRo, "InternalPermissionRo", ""),
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

export class InternalServiceDataTableFieldPermissionInterfaceApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to disableRoles
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async disableRolesWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
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
     * @params response Response returned by the server for a request to getFieldPermission
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getFieldPermissionWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataFieldPermissionView >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataFieldPermissionView = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataFieldPermissionView", ""
            ) as ResponseDataFieldPermissionView;
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
            const body: ResponseDataFieldPermissionView = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataFieldPermissionView", ""
            ) as ResponseDataFieldPermissionView;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getMultiFieldPermissionViews
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getMultiFieldPermissionViewsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataListFieldPermissionView >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataListFieldPermissionView = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataListFieldPermissionView", ""
            ) as ResponseDataListFieldPermissionView;
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
            const body: ResponseDataListFieldPermissionView = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataListFieldPermissionView", ""
            ) as ResponseDataListFieldPermissionView;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

}
