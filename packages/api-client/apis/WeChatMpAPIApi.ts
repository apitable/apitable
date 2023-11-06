// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { MpSignatureRo } from '../models/MpSignatureRo';
import { ResponseDataQrCodeVo } from '../models/ResponseDataQrCodeVo';
import { ResponseDataString } from '../models/ResponseDataString';
import { ResponseDataVoid } from '../models/ResponseDataVoid';
import { ResponseDataWxJsapiSignature } from '../models/ResponseDataWxJsapiSignature';

/**
 * no description
 */
export class WeChatMpAPIApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * Web Page Authorization Callback
     * @param code coding. JS gets the loginTmpCode, redirects and returns after jumping to the specified connection
     * @param state declare value. Used to prevent replay attacks
     */
    public async callback1(code: string, state: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'code' is not null or undefined
        if (code === null || code === undefined) {
            throw new RequiredError("WeChatMpAPIApi", "callback1", "code");
        }


        // verify required parameter 'state' is not null or undefined
        if (state === null || state === undefined) {
            throw new RequiredError("WeChatMpAPIApi", "callback1", "state");
        }


        // Path Params
        const localVarPath = '/wechat/mp/web/callback';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (code !== undefined) {
            requestContext.setQueryParam("code", ObjectSerializer.serialize(code, "string", ""));
        }

        // Query Params
        if (state !== undefined) {
            requestContext.setQueryParam("state", ObjectSerializer.serialize(state, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Scene: Scan code login, account binding polling results
     * Scan poll
     * @param type type (0: scan code to log in; 1: account binding)
     * @param mark the unique identifier of the qrcode
     */
    public async poll(type: number, mark: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'type' is not null or undefined
        if (type === null || type === undefined) {
            throw new RequiredError("WeChatMpAPIApi", "poll", "type");
        }


        // verify required parameter 'mark' is not null or undefined
        if (mark === null || mark === undefined) {
            throw new RequiredError("WeChatMpAPIApi", "poll", "mark");
        }


        // Path Params
        const localVarPath = '/wechat/mp/poll';

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
     * Get qrcode
     */
    public async qrcode(_options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // Path Params
        const localVarPath = '/wechat/mp/qrcode';

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
     * Get wechat signature
     * @param mpSignatureRo 
     */
    public async signature(mpSignatureRo: MpSignatureRo, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'mpSignatureRo' is not null or undefined
        if (mpSignatureRo === null || mpSignatureRo === undefined) {
            throw new RequiredError("WeChatMpAPIApi", "signature", "mpSignatureRo");
        }


        // Path Params
        const localVarPath = '/wechat/mp/signature';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(mpSignatureRo, "MpSignatureRo", ""),
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

export class WeChatMpAPIApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to callback1
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async callback1WithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataString >> {
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
     * @params response Response returned by the server for a request to poll
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async pollWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataString >> {
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
     * @params response Response returned by the server for a request to qrcode
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async qrcodeWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataQrCodeVo >> {
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
     * @params response Response returned by the server for a request to signature
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async signatureWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataWxJsapiSignature >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataWxJsapiSignature = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataWxJsapiSignature", ""
            ) as ResponseDataWxJsapiSignature;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataWxJsapiSignature = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataWxJsapiSignature", ""
            ) as ResponseDataWxJsapiSignature;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

}
