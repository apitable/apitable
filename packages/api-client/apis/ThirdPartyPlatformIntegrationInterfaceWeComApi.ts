// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { HotsTransformIpRo } from '../models/HotsTransformIpRo';
import { ResponseDataBoolean } from '../models/ResponseDataBoolean';
import { ResponseDataSocialTenantEnvVo } from '../models/ResponseDataSocialTenantEnvVo';
import { ResponseDataVoid } from '../models/ResponseDataVoid';
import { ResponseDataWeComBindConfigVo } from '../models/ResponseDataWeComBindConfigVo';
import { ResponseDataWeComBindSpaceVo } from '../models/ResponseDataWeComBindSpaceVo';
import { ResponseDataWeComCheckConfigVo } from '../models/ResponseDataWeComCheckConfigVo';
import { ResponseDataWeComUserLoginVo } from '../models/ResponseDataWeComUserLoginVo';
import { WeComAgentBindSpaceRo } from '../models/WeComAgentBindSpaceRo';
import { WeComCheckConfigRo } from '../models/WeComCheckConfigRo';
import { WeComUserLoginRo } from '../models/WeComUserLoginRo';

/**
 * no description
 */
export class ThirdPartyPlatformIntegrationInterfaceWeComApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * Get the space ID bound to the self built application of WeCom, and jump to the login page when success=false
     * Obtain the space ID bound by the self built application of WeCom
     * @param corpId 
     * @param agentId 
     */
    public async bindSpaceInfo(corpId: string, agentId: number, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'corpId' is not null or undefined
        if (corpId === null || corpId === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceWeComApi", "bindSpaceInfo", "corpId");
        }


        // verify required parameter 'agentId' is not null or undefined
        if (agentId === null || agentId === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceWeComApi", "bindSpaceInfo", "agentId");
        }


        // Path Params
        const localVarPath = '/social/wecom/agent/get/bindSpace';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (corpId !== undefined) {
            requestContext.setQueryParam("corpId", ObjectSerializer.serialize(corpId, "string", ""));
        }

        // Query Params
        if (agentId !== undefined) {
            requestContext.setQueryParam("agentId", ObjectSerializer.serialize(agentId, "number", "int32"));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Get the bound WeCom application configuration of the space station
     * Get the bound WeCom application configuration of the space station
     * @param xSpaceId space ID
     */
    public async getTenantBindWeComConfig(xSpaceId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'xSpaceId' is not null or undefined
        if (xSpaceId === null || xSpaceId === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceWeComApi", "getTenantBindWeComConfig", "xSpaceId");
        }


        // Path Params
        const localVarPath = '/social/wecom/get/config';

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
     * Used to generate We Com scanning code to log in and verify whether the domain name can be accessed
     * WeCom Verification domain name conversion IP
     * @param hotsTransformIpRo 
     */
    public async hotsTransformIp(hotsTransformIpRo: HotsTransformIpRo, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'hotsTransformIpRo' is not null or undefined
        if (hotsTransformIpRo === null || hotsTransformIpRo === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceWeComApi", "hotsTransformIp", "hotsTransformIpRo");
        }


        // Path Params
        const localVarPath = '/social/wecom/hotsTransformIp';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(hotsTransformIpRo, "HotsTransformIpRo", ""),
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
     * Get integrated tenant environment configuration
     * Get integrated tenant environment configuration
     * @param xRealHost Real request address
     */
    public async socialTenantEnv(xRealHost: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'xRealHost' is not null or undefined
        if (xRealHost === null || xRealHost === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceWeComApi", "socialTenantEnv", "xRealHost");
        }


        // Path Params
        const localVarPath = '/social/tenant/env';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Header Params
        requestContext.setHeaderParam("X-Real-Host", ObjectSerializer.serialize(xRealHost, "string", ""));


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * WeCom Application binding space
     * WeCom Application binding space
     * @param weComAgentBindSpaceRo 
     * @param configSha 
     */
    public async weComBindConfig(weComAgentBindSpaceRo: WeComAgentBindSpaceRo, configSha: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'weComAgentBindSpaceRo' is not null or undefined
        if (weComAgentBindSpaceRo === null || weComAgentBindSpaceRo === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceWeComApi", "weComBindConfig", "weComAgentBindSpaceRo");
        }


        // verify required parameter 'configSha' is not null or undefined
        if (configSha === null || configSha === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceWeComApi", "weComBindConfig", "configSha");
        }


        // Path Params
        const localVarPath = '/social/wecom/bind/{configSha}/config'
            .replace('{' + 'configSha' + '}', encodeURIComponent(String(configSha)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(weComAgentBindSpaceRo, "WeComAgentBindSpaceRo", ""),
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
     * Before binding We Com, verify the third-party application configuration in advance. If the code scanning verification is not successful, the configuration file is not effective
     * WeCom Verification - Authorization Application Configuration
     * @param weComCheckConfigRo 
     * @param xSpaceId space id
     */
    public async weComCheckConfig(weComCheckConfigRo: WeComCheckConfigRo, xSpaceId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'weComCheckConfigRo' is not null or undefined
        if (weComCheckConfigRo === null || weComCheckConfigRo === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceWeComApi", "weComCheckConfig", "weComCheckConfigRo");
        }


        // verify required parameter 'xSpaceId' is not null or undefined
        if (xSpaceId === null || xSpaceId === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceWeComApi", "weComCheckConfig", "xSpaceId");
        }


        // Path Params
        const localVarPath = '/social/wecom/check/config';

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
            ObjectSerializer.serialize(weComCheckConfigRo, "WeComCheckConfigRo", ""),
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
     * WeCom Apply to refresh the address book manually
     * WeCom App Refresh Address Book
     * @param xSpaceId space ID
     */
    public async weComRefreshContact(xSpaceId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'xSpaceId' is not null or undefined
        if (xSpaceId === null || xSpaceId === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceWeComApi", "weComRefreshContact", "xSpaceId");
        }


        // Path Params
        const localVarPath = '/social/wecom/refresh/contact';

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
     * Use WeCom login user identity to authorize login, and return parameters to guide registration when no user is bound
     * WeCom Application user login
     * @param weComUserLoginRo 
     */
    public async weComUserLogin(weComUserLoginRo: WeComUserLoginRo, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'weComUserLoginRo' is not null or undefined
        if (weComUserLoginRo === null || weComUserLoginRo === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceWeComApi", "weComUserLogin", "weComUserLoginRo");
        }


        // Path Params
        const localVarPath = '/social/wecom/user/login';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(weComUserLoginRo, "WeComUserLoginRo", ""),
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

export class ThirdPartyPlatformIntegrationInterfaceWeComApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to bindSpaceInfo
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async bindSpaceInfoWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataWeComBindSpaceVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataWeComBindSpaceVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataWeComBindSpaceVo", ""
            ) as ResponseDataWeComBindSpaceVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataWeComBindSpaceVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataWeComBindSpaceVo", ""
            ) as ResponseDataWeComBindSpaceVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getTenantBindWeComConfig
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getTenantBindWeComConfigWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataWeComBindConfigVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataWeComBindConfigVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataWeComBindConfigVo", ""
            ) as ResponseDataWeComBindConfigVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataWeComBindConfigVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataWeComBindConfigVo", ""
            ) as ResponseDataWeComBindConfigVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to hotsTransformIp
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async hotsTransformIpWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataBoolean >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataBoolean = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataBoolean", ""
            ) as ResponseDataBoolean;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataBoolean = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataBoolean", ""
            ) as ResponseDataBoolean;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to socialTenantEnv
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async socialTenantEnvWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataSocialTenantEnvVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataSocialTenantEnvVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataSocialTenantEnvVo", ""
            ) as ResponseDataSocialTenantEnvVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataSocialTenantEnvVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataSocialTenantEnvVo", ""
            ) as ResponseDataSocialTenantEnvVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to weComBindConfig
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async weComBindConfigWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
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
     * @params response Response returned by the server for a request to weComCheckConfig
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async weComCheckConfigWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataWeComCheckConfigVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataWeComCheckConfigVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataWeComCheckConfigVo", ""
            ) as ResponseDataWeComCheckConfigVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataWeComCheckConfigVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataWeComCheckConfigVo", ""
            ) as ResponseDataWeComCheckConfigVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to weComRefreshContact
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async weComRefreshContactWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
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
     * @params response Response returned by the server for a request to weComUserLogin
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async weComUserLoginWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataWeComUserLoginVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataWeComUserLoginVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataWeComUserLoginVo", ""
            ) as ResponseDataWeComUserLoginVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataWeComUserLoginVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataWeComUserLoginVo", ""
            ) as ResponseDataWeComUserLoginVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

}
