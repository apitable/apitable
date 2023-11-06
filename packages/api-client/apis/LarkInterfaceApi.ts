// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { FeishuTenantMainAdminChangeRo } from '../models/FeishuTenantMainAdminChangeRo';
import { ResponseDataFeishuTenantDetailVO } from '../models/ResponseDataFeishuTenantDetailVO';
import { ResponseDataVoid } from '../models/ResponseDataVoid';

/**
 * no description
 */
export class LarkInterfaceApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * Replace the master administrator
     * Tenant space replacement master administrator
     * @param feishuTenantMainAdminChangeRo 
     */
    public async changeAdmin(feishuTenantMainAdminChangeRo: FeishuTenantMainAdminChangeRo, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'feishuTenantMainAdminChangeRo' is not null or undefined
        if (feishuTenantMainAdminChangeRo === null || feishuTenantMainAdminChangeRo === undefined) {
            throw new RequiredError("LarkInterfaceApi", "changeAdmin", "feishuTenantMainAdminChangeRo");
        }


        // Path Params
        const localVarPath = '/social/feishu/changeAdmin';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(feishuTenantMainAdminChangeRo, "FeishuTenantMainAdminChangeRo", ""),
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
     * Get the space information bound by the tenant
     * Get tenant binding information
     * @param tenantKey Lark Tenant ID
     */
    public async getTenantInfo1(tenantKey: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'tenantKey' is not null or undefined
        if (tenantKey === null || tenantKey === undefined) {
            throw new RequiredError("LarkInterfaceApi", "getTenantInfo1", "tenantKey");
        }


        // Path Params
        const localVarPath = '/social/feishu/tenant/{tenantKey}'
            .replace('{' + 'tenantKey' + '}', encodeURIComponent(String(tenantKey)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

}

export class LarkInterfaceApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to changeAdmin
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async changeAdminWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
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
     * @params response Response returned by the server for a request to getTenantInfo1
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getTenantInfo1WithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataFeishuTenantDetailVO >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataFeishuTenantDetailVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataFeishuTenantDetailVO", ""
            ) as ResponseDataFeishuTenantDetailVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataFeishuTenantDetailVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataFeishuTenantDetailVO", ""
            ) as ResponseDataFeishuTenantDetailVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

}
