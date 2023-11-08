// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { ResponseDataNodeShareInfoVO } from '../models/ResponseDataNodeShareInfoVO';
import { ResponseDataNodeShareSettingInfoVO } from '../models/ResponseDataNodeShareSettingInfoVO';
import { ResponseDataShareBaseInfoVo } from '../models/ResponseDataShareBaseInfoVo';
import { ResponseDataStoreNodeInfoVO } from '../models/ResponseDataStoreNodeInfoVO';
import { ResponseDataVoid } from '../models/ResponseDataVoid';
import { StoreShareNodeRo } from '../models/StoreShareNodeRo';
import { UpdateNodeShareSettingRo } from '../models/UpdateNodeShareSettingRo';

/**
 * no description
 */
export class WorkbenchNodeShareApiApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * Disable node sharing
     * @param nodeId node id
     */
    public async disableShare(nodeId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'nodeId' is not null or undefined
        if (nodeId === null || nodeId === undefined) {
            throw new RequiredError("WorkbenchNodeShareApiApi", "disableShare", "nodeId");
        }


        // Path Params
        const localVarPath = '/node/disableShare/{nodeId}'
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
     * Get node share info
     * @param nodeId node id
     */
    public async nodeShareInfo(nodeId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'nodeId' is not null or undefined
        if (nodeId === null || nodeId === undefined) {
            throw new RequiredError("WorkbenchNodeShareApiApi", "nodeShareInfo", "nodeId");
        }


        // Path Params
        const localVarPath = '/node/shareSettings/{nodeId}'
            .replace('{' + 'nodeId' + '}', encodeURIComponent(String(nodeId)));

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
     * get shared content according to share id
     * Get share node info
     * @param shareId share id
     */
    public async readShareInfo(shareId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'shareId' is not null or undefined
        if (shareId === null || shareId === undefined) {
            throw new RequiredError("WorkbenchNodeShareApiApi", "readShareInfo", "shareId");
        }


        // Path Params
        const localVarPath = '/node/readShareInfo/{shareId}'
            .replace('{' + 'shareId' + '}', encodeURIComponent(String(shareId)));

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
     * Sotre share data
     * @param storeShareNodeRo 
     * @param xSocketId user socket id
     */
    public async storeShareData(storeShareNodeRo: StoreShareNodeRo, xSocketId?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'storeShareNodeRo' is not null or undefined
        if (storeShareNodeRo === null || storeShareNodeRo === undefined) {
            throw new RequiredError("WorkbenchNodeShareApiApi", "storeShareData", "storeShareNodeRo");
        }



        // Path Params
        const localVarPath = '/node/storeShareData';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Header Params
        requestContext.setHeaderParam("X-Socket-Id", ObjectSerializer.serialize(xSocketId, "string", ""));


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(storeShareNodeRo, "StoreShareNodeRo", ""),
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
     * Update node share setting  stringObjectParams share setting parameter description: <br/> There are three option parameters for sharing settings. Only one can be set true, and more than two cannot be set to true at the same time.<br/>onlyRead: Bool, whether to set sharing only for others to view.<br/>canBeEdited: Bool, whether to set up sharing to others for collaborative editing.<br/>canBeStored: Bool, whether to set up sharing to others and save as a copy.<br/>Example: Set <Share Only for Others to View>, parameters:{\"onlyRead\": true}
     * Update node share setting
     * @param updateNodeShareSettingRo 
     * @param nodeId node id
     */
    public async updateNodeShare(updateNodeShareSettingRo: UpdateNodeShareSettingRo, nodeId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'updateNodeShareSettingRo' is not null or undefined
        if (updateNodeShareSettingRo === null || updateNodeShareSettingRo === undefined) {
            throw new RequiredError("WorkbenchNodeShareApiApi", "updateNodeShare", "updateNodeShareSettingRo");
        }


        // verify required parameter 'nodeId' is not null or undefined
        if (nodeId === null || nodeId === undefined) {
            throw new RequiredError("WorkbenchNodeShareApiApi", "updateNodeShare", "nodeId");
        }


        // Path Params
        const localVarPath = '/node/updateShare/{nodeId}'
            .replace('{' + 'nodeId' + '}', encodeURIComponent(String(nodeId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(updateNodeShareSettingRo, "UpdateNodeShareSettingRo", ""),
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

export class WorkbenchNodeShareApiApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to disableShare
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async disableShareWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
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
     * @params response Response returned by the server for a request to nodeShareInfo
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async nodeShareInfoWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataNodeShareSettingInfoVO >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataNodeShareSettingInfoVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataNodeShareSettingInfoVO", ""
            ) as ResponseDataNodeShareSettingInfoVO;
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
            const body: ResponseDataNodeShareSettingInfoVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataNodeShareSettingInfoVO", ""
            ) as ResponseDataNodeShareSettingInfoVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to readShareInfo
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async readShareInfoWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataNodeShareInfoVO >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataNodeShareInfoVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataNodeShareInfoVO", ""
            ) as ResponseDataNodeShareInfoVO;
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
            const body: ResponseDataNodeShareInfoVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataNodeShareInfoVO", ""
            ) as ResponseDataNodeShareInfoVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to storeShareData
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async storeShareDataWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataStoreNodeInfoVO >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataStoreNodeInfoVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataStoreNodeInfoVO", ""
            ) as ResponseDataStoreNodeInfoVO;
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
            const body: ResponseDataStoreNodeInfoVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataStoreNodeInfoVO", ""
            ) as ResponseDataStoreNodeInfoVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to updateNodeShare
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async updateNodeShareWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataShareBaseInfoVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataShareBaseInfoVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataShareBaseInfoVo", ""
            ) as ResponseDataShareBaseInfoVo;
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
            const body: ResponseDataShareBaseInfoVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataShareBaseInfoVo", ""
            ) as ResponseDataShareBaseInfoVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

}
