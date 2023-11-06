// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { RedirectView } from '../models/RedirectView';
import { ResponseDataVoid } from '../models/ResponseDataVoid';

/**
 * no description
 */
export class Auth0ControllerApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * @param code 
     * @param error 
     * @param errorDescription 
     */
    public async callback4(code?: string, error?: string, errorDescription?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;




        // Path Params
        const localVarPath = '/auth0/callback';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (code !== undefined) {
            requestContext.setQueryParam("code", ObjectSerializer.serialize(code, "string", ""));
        }

        // Query Params
        if (error !== undefined) {
            requestContext.setQueryParam("error", ObjectSerializer.serialize(error, "string", ""));
        }

        // Query Params
        if (errorDescription !== undefined) {
            requestContext.setQueryParam("error_description", ObjectSerializer.serialize(errorDescription, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * @param email 
     * @param success 
     */
    public async invitationCallback(email: string, success: boolean, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'email' is not null or undefined
        if (email === null || email === undefined) {
            throw new RequiredError("Auth0ControllerApi", "invitationCallback", "email");
        }


        // verify required parameter 'success' is not null or undefined
        if (success === null || success === undefined) {
            throw new RequiredError("Auth0ControllerApi", "invitationCallback", "success");
        }


        // Path Params
        const localVarPath = '/invitation/callback';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (email !== undefined) {
            requestContext.setQueryParam("email", ObjectSerializer.serialize(email, "string", ""));
        }

        // Query Params
        if (success !== undefined) {
            requestContext.setQueryParam("success", ObjectSerializer.serialize(success, "boolean", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * @param message 
     */
    public async login3(message?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;


        // Path Params
        const localVarPath = '/auth0/login';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (message !== undefined) {
            requestContext.setQueryParam("message", ObjectSerializer.serialize(message, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

}

export class Auth0ControllerApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to callback4
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async callback4WithHttpInfo(response: ResponseContext): Promise<HttpInfo<RedirectView >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: RedirectView = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "RedirectView", ""
            ) as RedirectView;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: RedirectView = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "RedirectView", ""
            ) as RedirectView;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to invitationCallback
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async invitationCallbackWithHttpInfo(response: ResponseContext): Promise<HttpInfo<RedirectView >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: RedirectView = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "RedirectView", ""
            ) as RedirectView;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: RedirectView = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "RedirectView", ""
            ) as RedirectView;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to login3
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async login3WithHttpInfo(response: ResponseContext): Promise<HttpInfo<RedirectView >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: RedirectView = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "RedirectView", ""
            ) as RedirectView;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: RedirectView = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "RedirectView", ""
            ) as RedirectView;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

}
