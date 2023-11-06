// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { ResponseDataTenantDetailVO } from '../models/ResponseDataTenantDetailVO';
import { ResponseDataVoid } from '../models/ResponseDataVoid';
import { ResponseDataWeComIsvJsSdkAgentConfigVo } from '../models/ResponseDataWeComIsvJsSdkAgentConfigVo';
import { ResponseDataWeComIsvJsSdkConfigVo } from '../models/ResponseDataWeComIsvJsSdkConfigVo';
import { ResponseDataWeComIsvRegisterInstallSelfUrlVo } from '../models/ResponseDataWeComIsvRegisterInstallSelfUrlVo';
import { ResponseDataWeComIsvRegisterInstallWeComVo } from '../models/ResponseDataWeComIsvRegisterInstallWeComVo';
import { ResponseDataWeComIsvUserLoginVo } from '../models/ResponseDataWeComIsvUserLoginVo';
import { WeComIsvAdminChangeRo } from '../models/WeComIsvAdminChangeRo';
import { WeComIsvInviteUnauthMemberRo } from '../models/WeComIsvInviteUnauthMemberRo';
import { WeComIsvLoginAdminCodeRo } from '../models/WeComIsvLoginAdminCodeRo';
import { WeComIsvLoginAuthCodeRo } from '../models/WeComIsvLoginAuthCodeRo';
import { WeComIsvLoginCodeRo } from '../models/WeComIsvLoginCodeRo';

/**
 * no description
 */
export class ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * @param msgSignature 
     * @param timestamp 
     * @param nonce 
     * @param echostr 
     */
    public async getCallback(msgSignature: string, timestamp: string, nonce: string, echostr: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'msgSignature' is not null or undefined
        if (msgSignature === null || msgSignature === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi", "getCallback", "msgSignature");
        }


        // verify required parameter 'timestamp' is not null or undefined
        if (timestamp === null || timestamp === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi", "getCallback", "timestamp");
        }


        // verify required parameter 'nonce' is not null or undefined
        if (nonce === null || nonce === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi", "getCallback", "nonce");
        }


        // verify required parameter 'echostr' is not null or undefined
        if (echostr === null || echostr === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi", "getCallback", "echostr");
        }


        // Path Params
        const localVarPath = '/social/wecom/isv/datasheet/callback';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (msgSignature !== undefined) {
            requestContext.setQueryParam("msg_signature", ObjectSerializer.serialize(msgSignature, "string", ""));
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
        if (echostr !== undefined) {
            requestContext.setQueryParam("echostr", ObjectSerializer.serialize(echostr, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * JS-SDK Verify the configuration parameters of application identity and permission
     * JS-SDK Verify the configuration parameters of application identity and permission
     * @param spaceId 
     * @param url 
     */
    public async getJsSdkAgentConfig(spaceId: string, url: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'spaceId' is not null or undefined
        if (spaceId === null || spaceId === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi", "getJsSdkAgentConfig", "spaceId");
        }


        // verify required parameter 'url' is not null or undefined
        if (url === null || url === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi", "getJsSdkAgentConfig", "url");
        }


        // Path Params
        const localVarPath = '/social/wecom/isv/datasheet/jsSdk/agentConfig';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (spaceId !== undefined) {
            requestContext.setQueryParam("spaceId", ObjectSerializer.serialize(spaceId, "string", ""));
        }

        // Query Params
        if (url !== undefined) {
            requestContext.setQueryParam("url", ObjectSerializer.serialize(url, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * JS-SDK Verify the configuration parameters of enterprise identity and authority
     * JS-SDK Verify the configuration parameters of enterprise identity and authority
     * @param spaceId 
     * @param url 
     */
    public async getJsSdkConfig(spaceId: string, url: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'spaceId' is not null or undefined
        if (spaceId === null || spaceId === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi", "getJsSdkConfig", "spaceId");
        }


        // verify required parameter 'url' is not null or undefined
        if (url === null || url === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi", "getJsSdkConfig", "url");
        }


        // Path Params
        const localVarPath = '/social/wecom/isv/datasheet/jsSdk/config';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (spaceId !== undefined) {
            requestContext.setQueryParam("spaceId", ObjectSerializer.serialize(spaceId, "string", ""));
        }

        // Query Params
        if (url !== undefined) {
            requestContext.setQueryParam("url", ObjectSerializer.serialize(url, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Get the authorization link for installing vika
     * Get the authorization link for installing vika
     * @param finalPath 
     */
    public async getRegisterInstallSelfUrl(finalPath: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'finalPath' is not null or undefined
        if (finalPath === null || finalPath === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi", "getRegisterInstallSelfUrl", "finalPath");
        }


        // Path Params
        const localVarPath = '/social/wecom/isv/datasheet/register/installSelf/url';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (finalPath !== undefined) {
            requestContext.setQueryParam("finalPath", ObjectSerializer.serialize(finalPath, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Get the registration code for registering WeCom and installing vika
     * Get the registration code for registering WeCom and installing vika
     */
    public async getRegisterInstallWeCom(_options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // Path Params
        const localVarPath = '/social/wecom/isv/datasheet/register/installWeCom';

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
     * Get tenant binding information
     * Get tenant binding information
     * @param suiteId 
     * @param authCorpId 
     */
    public async getTenantInfo(suiteId: string, authCorpId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'suiteId' is not null or undefined
        if (suiteId === null || suiteId === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi", "getTenantInfo", "suiteId");
        }


        // verify required parameter 'authCorpId' is not null or undefined
        if (authCorpId === null || authCorpId === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi", "getTenantInfo", "authCorpId");
        }


        // Path Params
        const localVarPath = '/social/wecom/isv/datasheet/tenant/info';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (suiteId !== undefined) {
            requestContext.setQueryParam("suiteId", ObjectSerializer.serialize(suiteId, "string", ""));
        }

        // Query Params
        if (authCorpId !== undefined) {
            requestContext.setQueryParam("authCorpId", ObjectSerializer.serialize(authCorpId, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Tenant space replacement master administrator
     * Tenant space replacement master administrator
     * @param weComIsvAdminChangeRo 
     */
    public async postAdminChange(weComIsvAdminChangeRo: WeComIsvAdminChangeRo, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'weComIsvAdminChangeRo' is not null or undefined
        if (weComIsvAdminChangeRo === null || weComIsvAdminChangeRo === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi", "postAdminChange", "weComIsvAdminChangeRo");
        }


        // Path Params
        const localVarPath = '/social/wecom/isv/datasheet/admin/change';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(weComIsvAdminChangeRo, "WeComIsvAdminChangeRo", ""),
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
     * @param body 
     * @param type 
     * @param msgSignature 
     * @param timestamp 
     * @param nonce 
     * @param suiteId 
     */
    public async postCallback(body: string, type: string, msgSignature: string, timestamp: string, nonce: string, suiteId?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'body' is not null or undefined
        if (body === null || body === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi", "postCallback", "body");
        }


        // verify required parameter 'type' is not null or undefined
        if (type === null || type === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi", "postCallback", "type");
        }


        // verify required parameter 'msgSignature' is not null or undefined
        if (msgSignature === null || msgSignature === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi", "postCallback", "msgSignature");
        }


        // verify required parameter 'timestamp' is not null or undefined
        if (timestamp === null || timestamp === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi", "postCallback", "timestamp");
        }


        // verify required parameter 'nonce' is not null or undefined
        if (nonce === null || nonce === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi", "postCallback", "nonce");
        }



        // Path Params
        const localVarPath = '/social/wecom/isv/datasheet/callback';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (type !== undefined) {
            requestContext.setQueryParam("type", ObjectSerializer.serialize(type, "string", ""));
        }

        // Query Params
        if (suiteId !== undefined) {
            requestContext.setQueryParam("suite_id", ObjectSerializer.serialize(suiteId, "string", ""));
        }

        // Query Params
        if (msgSignature !== undefined) {
            requestContext.setQueryParam("msg_signature", ObjectSerializer.serialize(msgSignature, "string", ""));
        }

        // Query Params
        if (timestamp !== undefined) {
            requestContext.setQueryParam("timestamp", ObjectSerializer.serialize(timestamp, "string", ""));
        }

        // Query Params
        if (nonce !== undefined) {
            requestContext.setQueryParam("nonce", ObjectSerializer.serialize(nonce, "string", ""));
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
     * Invite unauthorized users
     * Invite unauthorized users
     * @param weComIsvInviteUnauthMemberRo 
     */
    public async postInviteUnauthMember(weComIsvInviteUnauthMemberRo: WeComIsvInviteUnauthMemberRo, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'weComIsvInviteUnauthMemberRo' is not null or undefined
        if (weComIsvInviteUnauthMemberRo === null || weComIsvInviteUnauthMemberRo === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi", "postInviteUnauthMember", "weComIsvInviteUnauthMemberRo");
        }


        // Path Params
        const localVarPath = '/social/wecom/isv/datasheet/invite/unauthMember';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(weComIsvInviteUnauthMemberRo, "WeComIsvInviteUnauthMemberRo", ""),
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
     * WeCom administrator jumps to the third-party application management page and automatically logs in
     * WeCom administrator jumps to the third-party application management page and automatically logs in
     * @param weComIsvLoginAdminCodeRo 
     */
    public async postLoginAdminCode(weComIsvLoginAdminCodeRo: WeComIsvLoginAdminCodeRo, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'weComIsvLoginAdminCodeRo' is not null or undefined
        if (weComIsvLoginAdminCodeRo === null || weComIsvLoginAdminCodeRo === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi", "postLoginAdminCode", "weComIsvLoginAdminCodeRo");
        }


        // Path Params
        const localVarPath = '/social/wecom/isv/datasheet/login/adminCode';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(weComIsvLoginAdminCodeRo, "WeComIsvLoginAdminCodeRo", ""),
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
     * WeCom third-party application scanning code login
     * WeCom third-party application scanning code login
     * @param weComIsvLoginAuthCodeRo 
     */
    public async postLoginAuthCode(weComIsvLoginAuthCodeRo: WeComIsvLoginAuthCodeRo, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'weComIsvLoginAuthCodeRo' is not null or undefined
        if (weComIsvLoginAuthCodeRo === null || weComIsvLoginAuthCodeRo === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi", "postLoginAuthCode", "weComIsvLoginAuthCodeRo");
        }


        // Path Params
        const localVarPath = '/social/wecom/isv/datasheet/login/authCode';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(weComIsvLoginAuthCodeRo, "WeComIsvLoginAuthCodeRo", ""),
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
     * Auto login to third-party applications within WeCom
     * Auto login to third-party applications within WeCom
     * @param weComIsvLoginCodeRo 
     */
    public async postLoginCode(weComIsvLoginCodeRo: WeComIsvLoginCodeRo, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'weComIsvLoginCodeRo' is not null or undefined
        if (weComIsvLoginCodeRo === null || weComIsvLoginCodeRo === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi", "postLoginCode", "weComIsvLoginCodeRo");
        }


        // Path Params
        const localVarPath = '/social/wecom/isv/datasheet/login/code';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(weComIsvLoginCodeRo, "WeComIsvLoginCodeRo", ""),
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

export class ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getCallback
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getCallbackWithHttpInfo(response: ResponseContext): Promise<HttpInfo<string >> {
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
     * @params response Response returned by the server for a request to getJsSdkAgentConfig
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getJsSdkAgentConfigWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataWeComIsvJsSdkAgentConfigVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataWeComIsvJsSdkAgentConfigVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataWeComIsvJsSdkAgentConfigVo", ""
            ) as ResponseDataWeComIsvJsSdkAgentConfigVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataWeComIsvJsSdkAgentConfigVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataWeComIsvJsSdkAgentConfigVo", ""
            ) as ResponseDataWeComIsvJsSdkAgentConfigVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getJsSdkConfig
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getJsSdkConfigWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataWeComIsvJsSdkConfigVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataWeComIsvJsSdkConfigVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataWeComIsvJsSdkConfigVo", ""
            ) as ResponseDataWeComIsvJsSdkConfigVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataWeComIsvJsSdkConfigVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataWeComIsvJsSdkConfigVo", ""
            ) as ResponseDataWeComIsvJsSdkConfigVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getRegisterInstallSelfUrl
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getRegisterInstallSelfUrlWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataWeComIsvRegisterInstallSelfUrlVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataWeComIsvRegisterInstallSelfUrlVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataWeComIsvRegisterInstallSelfUrlVo", ""
            ) as ResponseDataWeComIsvRegisterInstallSelfUrlVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataWeComIsvRegisterInstallSelfUrlVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataWeComIsvRegisterInstallSelfUrlVo", ""
            ) as ResponseDataWeComIsvRegisterInstallSelfUrlVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getRegisterInstallWeCom
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getRegisterInstallWeComWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataWeComIsvRegisterInstallWeComVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataWeComIsvRegisterInstallWeComVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataWeComIsvRegisterInstallWeComVo", ""
            ) as ResponseDataWeComIsvRegisterInstallWeComVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataWeComIsvRegisterInstallWeComVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataWeComIsvRegisterInstallWeComVo", ""
            ) as ResponseDataWeComIsvRegisterInstallWeComVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getTenantInfo
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getTenantInfoWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataTenantDetailVO >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataTenantDetailVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataTenantDetailVO", ""
            ) as ResponseDataTenantDetailVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataTenantDetailVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataTenantDetailVO", ""
            ) as ResponseDataTenantDetailVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to postAdminChange
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async postAdminChangeWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
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
     * @params response Response returned by the server for a request to postCallback
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async postCallbackWithHttpInfo(response: ResponseContext): Promise<HttpInfo<string >> {
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
     * @params response Response returned by the server for a request to postInviteUnauthMember
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async postInviteUnauthMemberWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
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
     * @params response Response returned by the server for a request to postLoginAdminCode
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async postLoginAdminCodeWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataWeComIsvUserLoginVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataWeComIsvUserLoginVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataWeComIsvUserLoginVo", ""
            ) as ResponseDataWeComIsvUserLoginVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataWeComIsvUserLoginVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataWeComIsvUserLoginVo", ""
            ) as ResponseDataWeComIsvUserLoginVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to postLoginAuthCode
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async postLoginAuthCodeWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataWeComIsvUserLoginVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataWeComIsvUserLoginVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataWeComIsvUserLoginVo", ""
            ) as ResponseDataWeComIsvUserLoginVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataWeComIsvUserLoginVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataWeComIsvUserLoginVo", ""
            ) as ResponseDataWeComIsvUserLoginVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to postLoginCode
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async postLoginCodeWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataWeComIsvUserLoginVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataWeComIsvUserLoginVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataWeComIsvUserLoginVo", ""
            ) as ResponseDataWeComIsvUserLoginVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataWeComIsvUserLoginVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataWeComIsvUserLoginVo", ""
            ) as ResponseDataWeComIsvUserLoginVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

}
