// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { ResponseDataLoginResultVo } from '../models/ResponseDataLoginResultVO';
import { ResponseDataLoginResultVO } from '../models/ResponseDataLoginResultVO';
import { ResponseDataVoid } from '../models/ResponseDataVoid';
import { ResponseDataWechatInfoVo } from '../models/ResponseDataWechatInfoVo';

/**
 * no description
 */
export class WeChatMiniAppAPIApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * Mini Program Authorized Login (Silent Authorization)
     * Authorized Login(wx.login user)
     * @param code Wechat login credentials obtained by wx.login
     */
    public async authorize(code: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'code' is not null or undefined
        if (code === null || code === undefined) {
            throw new RequiredError("WeChatMiniAppAPIApi", "authorize", "code");
        }


        // Path Params
        const localVarPath = '/wechat/miniapp/authorize';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (code !== undefined) {
            requestContext.setQueryParam("code", ObjectSerializer.serialize(code, "string", ""));
        }



        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Get User Information
     */
    public async getInfo(_options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // Path Params
        const localVarPath = '/wechat/miniapp/getInfo';

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
     * Synchronize WeChat User Information
     * @param signature signature
     * @param rawData data
     * @param encryptedData encrypted data
     * @param iv initial vector for encryption algorithm
     */
    public async info(signature: string, rawData: string, encryptedData: string, iv: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'signature' is not null or undefined
        if (signature === null || signature === undefined) {
            throw new RequiredError("WeChatMiniAppAPIApi", "info", "signature");
        }


        // verify required parameter 'rawData' is not null or undefined
        if (rawData === null || rawData === undefined) {
            throw new RequiredError("WeChatMiniAppAPIApi", "info", "rawData");
        }


        // verify required parameter 'encryptedData' is not null or undefined
        if (encryptedData === null || encryptedData === undefined) {
            throw new RequiredError("WeChatMiniAppAPIApi", "info", "encryptedData");
        }


        // verify required parameter 'iv' is not null or undefined
        if (iv === null || iv === undefined) {
            throw new RequiredError("WeChatMiniAppAPIApi", "info", "iv");
        }


        // Path Params
        const localVarPath = '/wechat/miniapp/info';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (signature !== undefined) {
            requestContext.setQueryParam("signature", ObjectSerializer.serialize(signature, "string", ""));
        }

        // Query Params
        if (rawData !== undefined) {
            requestContext.setQueryParam("rawData", ObjectSerializer.serialize(rawData, "string", ""));
        }

        // Query Params
        if (encryptedData !== undefined) {
            requestContext.setQueryParam("encryptedData", ObjectSerializer.serialize(encryptedData, "string", ""));
        }

        // Query Params
        if (iv !== undefined) {
            requestContext.setQueryParam("iv", ObjectSerializer.serialize(iv, "string", ""));
        }



        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * The Operation of The Applet Code
     * @param type type (0: Enter verification validity; 1: Confirm the login (the WeChat account of the Weige account is bound); 2: Cancel the login/bind the account; 3: Confirm the binding account)
     * @param mark mini program code unique identifier
     */
    public async operate(type: number, mark: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'type' is not null or undefined
        if (type === null || type === undefined) {
            throw new RequiredError("WeChatMiniAppAPIApi", "operate", "type");
        }


        // verify required parameter 'mark' is not null or undefined
        if (mark === null || mark === undefined) {
            throw new RequiredError("WeChatMiniAppAPIApi", "operate", "mark");
        }


        // Path Params
        const localVarPath = '/wechat/miniapp/operate';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (type !== undefined) {
            requestContext.setQueryParam("type", ObjectSerializer.serialize(type, "number", ""));
        }

        // Query Params
        if (mark !== undefined) {
            requestContext.setQueryParam("mark", ObjectSerializer.serialize(mark, "string", ""));
        }



        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * User authorized to use WeChat mobile number
     * @param encryptedData encrypted data
     * @param iv initial vector for encryption algorithm
     * @param mark mini program code unique identifier
     */
    public async phone(encryptedData: string, iv: string, mark?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'encryptedData' is not null or undefined
        if (encryptedData === null || encryptedData === undefined) {
            throw new RequiredError("WeChatMiniAppAPIApi", "phone", "encryptedData");
        }


        // verify required parameter 'iv' is not null or undefined
        if (iv === null || iv === undefined) {
            throw new RequiredError("WeChatMiniAppAPIApi", "phone", "iv");
        }



        // Path Params
        const localVarPath = '/wechat/miniapp/phone';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (encryptedData !== undefined) {
            requestContext.setQueryParam("encryptedData", ObjectSerializer.serialize(encryptedData, "string", ""));
        }

        // Query Params
        if (iv !== undefined) {
            requestContext.setQueryParam("iv", ObjectSerializer.serialize(iv, "string", ""));
        }

        // Query Params
        if (mark !== undefined) {
            requestContext.setQueryParam("mark", ObjectSerializer.serialize(mark, "string", ""));
        }



        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

}

export class WeChatMiniAppAPIApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to authorize
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async authorizeWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataLoginResultVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataLoginResultVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataLoginResultVo", ""
            ) as ResponseDataLoginResultVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataLoginResultVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataLoginResultVo", ""
            ) as ResponseDataLoginResultVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getInfo
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getInfoWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataWechatInfoVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataWechatInfoVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataWechatInfoVo", ""
            ) as ResponseDataWechatInfoVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataWechatInfoVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataWechatInfoVo", ""
            ) as ResponseDataWechatInfoVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to info
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async infoWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
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
     * @params response Response returned by the server for a request to operate
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async operateWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
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
     * @params response Response returned by the server for a request to phone
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async phoneWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataLoginResultVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataLoginResultVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataLoginResultVo", ""
            ) as ResponseDataLoginResultVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataLoginResultVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataLoginResultVo", ""
            ) as ResponseDataLoginResultVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

}
