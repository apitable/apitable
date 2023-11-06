// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { AutomationApiTriggerCreateRo } from '../models/AutomationApiTriggerCreateRo';
import { ResponseDataAutomationTriggerCreateVo } from '../models/ResponseDataAutomationTriggerCreateVo';
import { ResponseDataString } from '../models/ResponseDataString';
import { ResponseDataVoid } from '../models/ResponseDataVoid';

/**
 * no description
 */
export class AutomationOpenApiControllerApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * @param automationApiTriggerCreateRo 
     * @param xServiceToken 
     */
    public async createOrUpdateTrigger(automationApiTriggerCreateRo: AutomationApiTriggerCreateRo, xServiceToken?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'automationApiTriggerCreateRo' is not null or undefined
        if (automationApiTriggerCreateRo === null || automationApiTriggerCreateRo === undefined) {
            throw new RequiredError("AutomationOpenApiControllerApi", "createOrUpdateTrigger", "automationApiTriggerCreateRo");
        }



        // Path Params
        const localVarPath = '/automation/open/triggers/createOrUpdate';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Header Params
        requestContext.setHeaderParam("X-Service-Token", ObjectSerializer.serialize(xServiceToken, "string", ""));


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(automationApiTriggerCreateRo, "AutomationApiTriggerCreateRo", ""),
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
     * @param datasheetId 
     * @param robotIds 
     */
    public async deleteTrigger1(datasheetId: string, robotIds: Array<string>, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'datasheetId' is not null or undefined
        if (datasheetId === null || datasheetId === undefined) {
            throw new RequiredError("AutomationOpenApiControllerApi", "deleteTrigger1", "datasheetId");
        }


        // verify required parameter 'robotIds' is not null or undefined
        if (robotIds === null || robotIds === undefined) {
            throw new RequiredError("AutomationOpenApiControllerApi", "deleteTrigger1", "robotIds");
        }


        // Path Params
        const localVarPath = '/automation/open/triggers/datasheets/{datasheetId}/robots'
            .replace('{' + 'datasheetId' + '}', encodeURIComponent(String(datasheetId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.DELETE);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (robotIds !== undefined) {
            requestContext.setQueryParam("robotIds", ObjectSerializer.serialize(robotIds, "Array<string>", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

}

export class AutomationOpenApiControllerApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to createOrUpdateTrigger
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async createOrUpdateTriggerWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataAutomationTriggerCreateVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataAutomationTriggerCreateVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataAutomationTriggerCreateVo", ""
            ) as ResponseDataAutomationTriggerCreateVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataAutomationTriggerCreateVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataAutomationTriggerCreateVo", ""
            ) as ResponseDataAutomationTriggerCreateVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to deleteTrigger1
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async deleteTrigger1WithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataString >> {
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

}
