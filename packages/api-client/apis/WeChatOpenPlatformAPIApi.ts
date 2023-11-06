// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { Page } from '../models/Page';
import { ResponseDataListString } from '../models/ResponseDataListString';
import { ResponseDataPageInfoQrCodePageVo } from '../models/ResponseDataPageInfoQrCodePageVo';
import { ResponseDataQrCodeVo } from '../models/ResponseDataQrCodeVo';
import { ResponseDataString } from '../models/ResponseDataString';
import { ResponseDataVoid } from '../models/ResponseDataVoid';
import { ResponseDataWechatAuthorizationEntity } from '../models/ResponseDataWechatAuthorizationEntity';
import { ResponseDataWxOpenAuthorizerListResult } from '../models/ResponseDataWxOpenAuthorizerListResult';

/**
 * no description
 */
export class WeChatOpenPlatformAPIApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * WeChat Message Push Callback
     * @param appId 
     * @param signature 
     * @param timestamp 
     * @param nonce 
     * @param openid 
     * @param encryptType 
     * @param msgSignature 
     * @param body 
     */
    public async callback(appId: string, signature: string, timestamp: string, nonce: string, openid: string, encryptType: string, msgSignature: string, body?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'appId' is not null or undefined
        if (appId === null || appId === undefined) {
            throw new RequiredError("WeChatOpenPlatformAPIApi", "callback", "appId");
        }


        // verify required parameter 'signature' is not null or undefined
        if (signature === null || signature === undefined) {
            throw new RequiredError("WeChatOpenPlatformAPIApi", "callback", "signature");
        }


        // verify required parameter 'timestamp' is not null or undefined
        if (timestamp === null || timestamp === undefined) {
            throw new RequiredError("WeChatOpenPlatformAPIApi", "callback", "timestamp");
        }


        // verify required parameter 'nonce' is not null or undefined
        if (nonce === null || nonce === undefined) {
            throw new RequiredError("WeChatOpenPlatformAPIApi", "callback", "nonce");
        }


        // verify required parameter 'openid' is not null or undefined
        if (openid === null || openid === undefined) {
            throw new RequiredError("WeChatOpenPlatformAPIApi", "callback", "openid");
        }


        // verify required parameter 'encryptType' is not null or undefined
        if (encryptType === null || encryptType === undefined) {
            throw new RequiredError("WeChatOpenPlatformAPIApi", "callback", "encryptType");
        }


        // verify required parameter 'msgSignature' is not null or undefined
        if (msgSignature === null || msgSignature === undefined) {
            throw new RequiredError("WeChatOpenPlatformAPIApi", "callback", "msgSignature");
        }



        // Path Params
        const localVarPath = '/wechat/open/callback/{appId}'
            .replace('{' + 'appId' + '}', encodeURIComponent(String(appId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (signature !== undefined) {
            requestContext.setQueryParam("signature", ObjectSerializer.serialize(signature, "string", ""));
        }

        // Query Params
        if (timestamp !== undefined) {
            requestContext.setQueryParam("timestamp", ObjectSerializer.serialize(timestamp, "string", ""));
        }

        // Query Params
        if (nonce !== undefined) {
            requestContext.setQueryParam("nonce", ObjectSerializer.serialize(nonce, "string", ""));
        }

        // Query Params
        if (openid !== undefined) {
            requestContext.setQueryParam("openid", ObjectSerializer.serialize(openid, "string", ""));
        }

        // Query Params
        if (encryptType !== undefined) {
            requestContext.setQueryParam("encrypt_type", ObjectSerializer.serialize(encryptType, "string", ""));
        }

        // Query Params
        if (msgSignature !== undefined) {
            requestContext.setQueryParam("msg_signature", ObjectSerializer.serialize(msgSignature, "string", ""));
        }


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(body, "string", ""),
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
     * Create Pre-authorization URL
     * @param authType Authorized account type, 1. Only the official account authorization list is displayed, 2. Only the applet authorization list is displayed, 3. Both are displayed
     * @param componentAppid Authorized Official Account or Mini Program AppId
     */
    public async createPreAuthUrl(authType: string, componentAppid: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'authType' is not null or undefined
        if (authType === null || authType === undefined) {
            throw new RequiredError("WeChatOpenPlatformAPIApi", "createPreAuthUrl", "authType");
        }


        // verify required parameter 'componentAppid' is not null or undefined
        if (componentAppid === null || componentAppid === undefined) {
            throw new RequiredError("WeChatOpenPlatformAPIApi", "createPreAuthUrl", "componentAppid");
        }


        // Path Params
        const localVarPath = '/wechat/open/createPreAuthUrl';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (authType !== undefined) {
            requestContext.setQueryParam("auth_type", ObjectSerializer.serialize(authType, "string", ""));
        }

        // Query Params
        if (componentAppid !== undefined) {
            requestContext.setQueryParam("component_appid", ObjectSerializer.serialize(componentAppid, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * The scene value cannot be passed at all, and the string type is preferred.
     * Generates Qrcode
     * @param type qrcode type, type value (temporary integer value: QR_SCENE, temporary string value: QR_STR_SCENE; permanent integer value: QR_LIMIT_SCENE, permanent string value: QR_LIMIT_STR_SCENE)
     * @param expireSeconds the valid time of the QR code, in seconds. The maximum is not more than 2592000 (that is, 30 days), and the default is 30 seconds.
     * @param sceneId scene value ID, a 32-bit non-zero integer for a temporary QR code, and a maximum value of 100000 for a permanent QR code (current parameters only support 1--100000)
     * @param sceneStr Scene value ID (ID in string form), string type, length limited from 1 to 64.
     * @param appId wechat public account appId
     */
    public async createWxQrCode(type?: string, expireSeconds?: number, sceneId?: number, sceneStr?: string, appId?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;






        // Path Params
        const localVarPath = '/wechat/open/createWxQrCode';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (type !== undefined) {
            requestContext.setQueryParam("type", ObjectSerializer.serialize(type, "string", ""));
        }

        // Query Params
        if (expireSeconds !== undefined) {
            requestContext.setQueryParam("expireSeconds", ObjectSerializer.serialize(expireSeconds, "number", ""));
        }

        // Query Params
        if (sceneId !== undefined) {
            requestContext.setQueryParam("sceneId", ObjectSerializer.serialize(sceneId, "number", ""));
        }

        // Query Params
        if (sceneStr !== undefined) {
            requestContext.setQueryParam("sceneStr", ObjectSerializer.serialize(sceneStr, "string", ""));
        }

        // Query Params
        if (appId !== undefined) {
            requestContext.setQueryParam("appId", ObjectSerializer.serialize(appId, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Delete Qrcode
     * @param qrCodeId qrcode ID
     * @param appId wechat public account appId
     */
    public async delQrCode(qrCodeId: string, appId?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'qrCodeId' is not null or undefined
        if (qrCodeId === null || qrCodeId === undefined) {
            throw new RequiredError("WeChatOpenPlatformAPIApi", "delQrCode", "qrCodeId");
        }



        // Path Params
        const localVarPath = '/wechat/open/delQrCode';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (qrCodeId !== undefined) {
            requestContext.setQueryParam("qrCodeId", ObjectSerializer.serialize(qrCodeId, "string", ""));
        }

        // Query Params
        if (appId !== undefined) {
            requestContext.setQueryParam("appId", ObjectSerializer.serialize(appId, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Delete Qrcode
     * @param qrCodeId qrcode ID
     * @param appId wechat public account appId
     */
    public async delQrCode1(qrCodeId: string, appId?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'qrCodeId' is not null or undefined
        if (qrCodeId === null || qrCodeId === undefined) {
            throw new RequiredError("WeChatOpenPlatformAPIApi", "delQrCode1", "qrCodeId");
        }



        // Path Params
        const localVarPath = '/wechat/open/delQrCode';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.DELETE);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (qrCodeId !== undefined) {
            requestContext.setQueryParam("qrCodeId", ObjectSerializer.serialize(qrCodeId, "string", ""));
        }

        // Query Params
        if (appId !== undefined) {
            requestContext.setQueryParam("appId", ObjectSerializer.serialize(appId, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Obtain the basic information of the authorized account
     * @param authorizerAppid 
     */
    public async getAuthorizerInfo(authorizerAppid?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;


        // Path Params
        const localVarPath = '/wechat/open/createAuthorizerInfo';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (authorizerAppid !== undefined) {
            requestContext.setQueryParam("authorizerAppid", ObjectSerializer.serialize(authorizerAppid, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Get All Authorized Account Information
     */
    public async getAuthorizerList(_options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // Path Params
        const localVarPath = '/wechat/open/getAuthorizerList';

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
     * Receive Verification Ticket
     * @param timestamp 
     * @param nonce 
     * @param signature 
     * @param body 
     * @param encryptType 
     * @param msgSignature 
     */
    public async getComponentVerifyTicket(timestamp: string, nonce: string, signature: string, body?: string, encryptType?: string, msgSignature?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'timestamp' is not null or undefined
        if (timestamp === null || timestamp === undefined) {
            throw new RequiredError("WeChatOpenPlatformAPIApi", "getComponentVerifyTicket", "timestamp");
        }


        // verify required parameter 'nonce' is not null or undefined
        if (nonce === null || nonce === undefined) {
            throw new RequiredError("WeChatOpenPlatformAPIApi", "getComponentVerifyTicket", "nonce");
        }


        // verify required parameter 'signature' is not null or undefined
        if (signature === null || signature === undefined) {
            throw new RequiredError("WeChatOpenPlatformAPIApi", "getComponentVerifyTicket", "signature");
        }





        // Path Params
        const localVarPath = '/wechat/open/receiveTicket';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (timestamp !== undefined) {
            requestContext.setQueryParam("timestamp", ObjectSerializer.serialize(timestamp, "string", ""));
        }

        // Query Params
        if (nonce !== undefined) {
            requestContext.setQueryParam("nonce", ObjectSerializer.serialize(nonce, "string", ""));
        }

        // Query Params
        if (signature !== undefined) {
            requestContext.setQueryParam("signature", ObjectSerializer.serialize(signature, "string", ""));
        }

        // Query Params
        if (encryptType !== undefined) {
            requestContext.setQueryParam("encrypt_type", ObjectSerializer.serialize(encryptType, "string", ""));
        }

        // Query Params
        if (msgSignature !== undefined) {
            requestContext.setQueryParam("msg_signature", ObjectSerializer.serialize(msgSignature, "string", ""));
        }


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(body, "string", ""),
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
     * Query Qrcode pagination list
     * @param page 
     * @param pageObjectParams page params
     * @param appId wechat public account appId
     */
    public async getQrCodePage(page: Page, pageObjectParams: string, appId?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'page' is not null or undefined
        if (page === null || page === undefined) {
            throw new RequiredError("WeChatOpenPlatformAPIApi", "getQrCodePage", "page");
        }


        // verify required parameter 'pageObjectParams' is not null or undefined
        if (pageObjectParams === null || pageObjectParams === undefined) {
            throw new RequiredError("WeChatOpenPlatformAPIApi", "getQrCodePage", "pageObjectParams");
        }



        // Path Params
        const localVarPath = '/wechat/open/getQrCodePage';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (appId !== undefined) {
            requestContext.setQueryParam("appId", ObjectSerializer.serialize(appId, "string", ""));
        }

        // Query Params
        if (page !== undefined) {
            requestContext.setQueryParam("page", ObjectSerializer.serialize(page, "Page", ""));
        }

        // Query Params
        if (pageObjectParams !== undefined) {
            requestContext.setQueryParam("pageObjectParams", ObjectSerializer.serialize(pageObjectParams, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Get Authorization Code Get Authorization Information
     * @param authCode 
     */
    public async getQueryAuth(authCode?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;


        // Path Params
        const localVarPath = '/wechat/open/getQueryAuth';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (authCode !== undefined) {
            requestContext.setQueryParam("auth_code", ObjectSerializer.serialize(authCode, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Get WeChat server IP list
     * @param appId 
     */
    public async getWechatIpList(appId?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;


        // Path Params
        const localVarPath = '/wechat/open/getWechatIpList';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (appId !== undefined) {
            requestContext.setQueryParam("appId", ObjectSerializer.serialize(appId, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Be sure to add keyword replies first in the background of the official account
     * Synchronously update WeChat keyword automatic reply rules
     * @param appId 
     */
    public async updateWxReply(appId?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;


        // Path Params
        const localVarPath = '/wechat/open/updateWxReply';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (appId !== undefined) {
            requestContext.setQueryParam("appId", ObjectSerializer.serialize(appId, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

}

export class WeChatOpenPlatformAPIApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to callback
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async callbackWithHttpInfo(response: ResponseContext): Promise<HttpInfo<any >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: any = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "any", ""
            ) as any;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: any = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "any", ""
            ) as any;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to createPreAuthUrl
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async createPreAuthUrlWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataString >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataString = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataString", ""
            ) as ResponseDataString;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataString = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataString", ""
            ) as ResponseDataString;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to createWxQrCode
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async createWxQrCodeWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataQrCodeVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataQrCodeVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataQrCodeVo", ""
            ) as ResponseDataQrCodeVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataQrCodeVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataQrCodeVo", ""
            ) as ResponseDataQrCodeVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to delQrCode
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async delQrCodeWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
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
     * @params response Response returned by the server for a request to delQrCode1
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async delQrCode1WithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
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
     * @params response Response returned by the server for a request to getAuthorizerInfo
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getAuthorizerInfoWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataWechatAuthorizationEntity >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataWechatAuthorizationEntity = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataWechatAuthorizationEntity", ""
            ) as ResponseDataWechatAuthorizationEntity;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataWechatAuthorizationEntity = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataWechatAuthorizationEntity", ""
            ) as ResponseDataWechatAuthorizationEntity;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getAuthorizerList
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getAuthorizerListWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataWxOpenAuthorizerListResult >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataWxOpenAuthorizerListResult = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataWxOpenAuthorizerListResult", ""
            ) as ResponseDataWxOpenAuthorizerListResult;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataWxOpenAuthorizerListResult = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataWxOpenAuthorizerListResult", ""
            ) as ResponseDataWxOpenAuthorizerListResult;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getComponentVerifyTicket
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getComponentVerifyTicketWithHttpInfo(response: ResponseContext): Promise<HttpInfo<string >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: string = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "string", ""
            ) as string;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: string = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "string", ""
            ) as string;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getQrCodePage
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getQrCodePageWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataPageInfoQrCodePageVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataPageInfoQrCodePageVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataPageInfoQrCodePageVo", ""
            ) as ResponseDataPageInfoQrCodePageVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataPageInfoQrCodePageVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataPageInfoQrCodePageVo", ""
            ) as ResponseDataPageInfoQrCodePageVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getQueryAuth
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getQueryAuthWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataWechatAuthorizationEntity >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataWechatAuthorizationEntity = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataWechatAuthorizationEntity", ""
            ) as ResponseDataWechatAuthorizationEntity;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataWechatAuthorizationEntity = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataWechatAuthorizationEntity", ""
            ) as ResponseDataWechatAuthorizationEntity;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getWechatIpList
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getWechatIpListWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataListString >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataListString = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataListString", ""
            ) as ResponseDataListString;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataListString = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataListString", ""
            ) as ResponseDataListString;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to updateWxReply
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async updateWxReplyWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
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
