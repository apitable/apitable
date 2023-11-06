// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { IdaasAuthCallbackRo } from '../models/IdaasAuthCallbackRo';
import { ResponseDataIdaasAuthLoginVo } from '../models/ResponseDataIdaasAuthLoginVo';
import { ResponseDataIdaasBindInfoVo } from '../models/ResponseDataIdaasBindInfoVo';
import { ResponseDataVoid } from '../models/ResponseDataVoid';

/**
 * no description
 */
export class IDaaSLoginAuthorizationApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * Get the IDaaS information bound to the space
     * @param spaceId 
     */
    public async getBindInfo(spaceId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'spaceId' is not null or undefined
        if (spaceId === null || spaceId === undefined) {
            throw new RequiredError("IDaaSLoginAuthorizationApi", "getBindInfo", "spaceId");
        }


        // Path Params
        const localVarPath = '/idaas/auth/{spaceId}/bindInfo'
            .replace('{' + 'spaceId' + '}', encodeURIComponent(String(spaceId)));

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
     * Get the link to log in to the IDaaS system
     * @param clientId 
     */
    public async getLogin(clientId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'clientId' is not null or undefined
        if (clientId === null || clientId === undefined) {
            throw new RequiredError("IDaaSLoginAuthorizationApi", "getLogin", "clientId");
        }


        // Path Params
        const localVarPath = '/idaas/auth/login/{clientId}'
            .replace('{' + 'clientId' + '}', encodeURIComponent(String(clientId)));

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
     * Jump to the IDaaS system for automatic login
     * @param clientId 
     */
    public async getLoginRedirect(clientId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'clientId' is not null or undefined
        if (clientId === null || clientId === undefined) {
            throw new RequiredError("IDaaSLoginAuthorizationApi", "getLoginRedirect", "clientId");
        }


        // Path Params
        const localVarPath = '/idaas/auth/login/redirect/{clientId}'
            .replace('{' + 'clientId' + '}', encodeURIComponent(String(clientId)));

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
     * For private deployment only
     * The user completes subsequent operations after logging in to the IDaaS system
     * @param idaasAuthCallbackRo 
     * @param clientId 
     */
    public async postCallback1(idaasAuthCallbackRo: IdaasAuthCallbackRo, clientId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'idaasAuthCallbackRo' is not null or undefined
        if (idaasAuthCallbackRo === null || idaasAuthCallbackRo === undefined) {
            throw new RequiredError("IDaaSLoginAuthorizationApi", "postCallback1", "idaasAuthCallbackRo");
        }


        // verify required parameter 'clientId' is not null or undefined
        if (clientId === null || clientId === undefined) {
            throw new RequiredError("IDaaSLoginAuthorizationApi", "postCallback1", "clientId");
        }


        // Path Params
        const localVarPath = '/idaas/auth/callback/{clientId}'
            .replace('{' + 'clientId' + '}', encodeURIComponent(String(clientId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(idaasAuthCallbackRo, "IdaasAuthCallbackRo", ""),
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
     * For Sass version only
     * The user completes subsequent operations after logging in to the IDaaS system
     * @param idaasAuthCallbackRo 
     * @param clientId 
     * @param spaceId 
     */
    public async postSpaceCallback(idaasAuthCallbackRo: IdaasAuthCallbackRo, clientId: string, spaceId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'idaasAuthCallbackRo' is not null or undefined
        if (idaasAuthCallbackRo === null || idaasAuthCallbackRo === undefined) {
            throw new RequiredError("IDaaSLoginAuthorizationApi", "postSpaceCallback", "idaasAuthCallbackRo");
        }


        // verify required parameter 'clientId' is not null or undefined
        if (clientId === null || clientId === undefined) {
            throw new RequiredError("IDaaSLoginAuthorizationApi", "postSpaceCallback", "clientId");
        }


        // verify required parameter 'spaceId' is not null or undefined
        if (spaceId === null || spaceId === undefined) {
            throw new RequiredError("IDaaSLoginAuthorizationApi", "postSpaceCallback", "spaceId");
        }


        // Path Params
        const localVarPath = '/idaas/auth/callback/{clientId}/{spaceId}'
            .replace('{' + 'clientId' + '}', encodeURIComponent(String(clientId)))
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
            ObjectSerializer.serialize(idaasAuthCallbackRo, "IdaasAuthCallbackRo", ""),
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

export class IDaaSLoginAuthorizationApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getBindInfo
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getBindInfoWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataIdaasBindInfoVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataIdaasBindInfoVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataIdaasBindInfoVo", ""
            ) as ResponseDataIdaasBindInfoVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataIdaasBindInfoVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataIdaasBindInfoVo", ""
            ) as ResponseDataIdaasBindInfoVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getLogin
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getLoginWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataIdaasAuthLoginVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataIdaasAuthLoginVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataIdaasAuthLoginVo", ""
            ) as ResponseDataIdaasAuthLoginVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataIdaasAuthLoginVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataIdaasAuthLoginVo", ""
            ) as ResponseDataIdaasAuthLoginVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getLoginRedirect
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getLoginRedirectWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, undefined);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: void = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "void", ""
            ) as void;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to postCallback1
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async postCallback1WithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
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
     * @params response Response returned by the server for a request to postSpaceCallback
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async postSpaceCallbackWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
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
