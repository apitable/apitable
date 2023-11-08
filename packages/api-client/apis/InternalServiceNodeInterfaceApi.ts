// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { CreateDatasheetRo } from '../models/CreateDatasheetRo';
import { ResponseDataCreateDatasheetVo } from '../models/ResponseDataCreateDatasheetVo';
import { ResponseDataListNodeInfo } from '../models/ResponseDataListNodeInfo';
import { ResponseDataVoid } from '../models/ResponseDataVoid';

/**
 * no description
 */
export class InternalServiceNodeInterfaceApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * create a table node
     * create a table node
     * @param createDatasheetRo 
     * @param spaceId 
     */
    public async createDatasheet(createDatasheetRo: CreateDatasheetRo, spaceId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'createDatasheetRo' is not null or undefined
        if (createDatasheetRo === null || createDatasheetRo === undefined) {
            throw new RequiredError("InternalServiceNodeInterfaceApi", "createDatasheet", "createDatasheetRo");
        }


        // verify required parameter 'spaceId' is not null or undefined
        if (spaceId === null || spaceId === undefined) {
            throw new RequiredError("InternalServiceNodeInterfaceApi", "createDatasheet", "spaceId");
        }


        // Path Params
        const localVarPath = '/internal/spaces/{spaceId}/datasheets'
            .replace('{' + 'spaceId' + '}', encodeURIComponent(String(spaceId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(createDatasheetRo, "CreateDatasheetRo", ""),
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
     * delete node
     * delete node
     * @param spaceId 
     * @param nodeId 
     */
    public async deleteNode(spaceId: string, nodeId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'spaceId' is not null or undefined
        if (spaceId === null || spaceId === undefined) {
            throw new RequiredError("InternalServiceNodeInterfaceApi", "deleteNode", "spaceId");
        }


        // verify required parameter 'nodeId' is not null or undefined
        if (nodeId === null || nodeId === undefined) {
            throw new RequiredError("InternalServiceNodeInterfaceApi", "deleteNode", "nodeId");
        }


        // Path Params
        const localVarPath = '/internal/spaces/{spaceId}/nodes/{nodeId}/delete'
            .replace('{' + 'spaceId' + '}', encodeURIComponent(String(spaceId)))
            .replace('{' + 'nodeId' + '}', encodeURIComponent(String(nodeId)));

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
     * scenario: query an existing read-only dashboard
     * Get filter nodes by type, permissions and node name.
     * @param spaceId 
     * @param type 
     * @param nodePermissions 
     * @param keyword 
     */
    public async filter(spaceId: string, type: number, nodePermissions?: Array<number>, keyword?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'spaceId' is not null or undefined
        if (spaceId === null || spaceId === undefined) {
            throw new RequiredError("InternalServiceNodeInterfaceApi", "filter", "spaceId");
        }


        // verify required parameter 'type' is not null or undefined
        if (type === null || type === undefined) {
            throw new RequiredError("InternalServiceNodeInterfaceApi", "filter", "type");
        }




        // Path Params
        const localVarPath = '/internal/spaces/{spaceId}/nodes'
            .replace('{' + 'spaceId' + '}', encodeURIComponent(String(spaceId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (type !== undefined) {
            requestContext.setQueryParam("type", ObjectSerializer.serialize(type, "number", "int32"));
        }

        // Query Params
        if (nodePermissions !== undefined) {
            requestContext.setQueryParam("nodePermissions", ObjectSerializer.serialize(nodePermissions, "Array<number>", "int32"));
        }

        // Query Params
        if (keyword !== undefined) {
            requestContext.setQueryParam("keyword", ObjectSerializer.serialize(keyword, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

}

export class InternalServiceNodeInterfaceApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to createDatasheet
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async createDatasheetWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataCreateDatasheetVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataCreateDatasheetVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataCreateDatasheetVo", ""
            ) as ResponseDataCreateDatasheetVo;
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
            const body: ResponseDataCreateDatasheetVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataCreateDatasheetVo", ""
            ) as ResponseDataCreateDatasheetVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to deleteNode
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async deleteNodeWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
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
     * @params response Response returned by the server for a request to filter
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async filterWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataListNodeInfo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataListNodeInfo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataListNodeInfo", ""
            ) as ResponseDataListNodeInfo;
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
            const body: ResponseDataListNodeInfo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataListNodeInfo", ""
            ) as ResponseDataListNodeInfo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

}
