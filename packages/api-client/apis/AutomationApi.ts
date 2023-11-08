// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { CreateActionRO } from '../models/CreateActionRO';
import { CreateTriggerRO } from '../models/CreateTriggerRO';
import { ResponseDataAutomationVO } from '../models/ResponseDataAutomationVO';
import { ResponseDataListActionVO } from '../models/ResponseDataListActionVO';
import { ResponseDataListAutomationSimpleVO } from '../models/ResponseDataListAutomationSimpleVO';
import { ResponseDataListAutomationTaskSimpleVO } from '../models/ResponseDataListAutomationTaskSimpleVO';
import { ResponseDataListTriggerVO } from '../models/ResponseDataListTriggerVO';
import { ResponseDataVoid } from '../models/ResponseDataVoid';
import { UpdateActionRO } from '../models/UpdateActionRO';
import { UpdateRobotRO } from '../models/UpdateRobotRO';
import { UpdateTriggerRO } from '../models/UpdateTriggerRO';

/**
 * no description
 */
export class AutomationApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * Create automation action
     * @param createActionRO 
     * @param resourceId node id
     * @param shareId share id
     */
    public async createAction(createActionRO: CreateActionRO, resourceId: string, shareId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'createActionRO' is not null or undefined
        if (createActionRO === null || createActionRO === undefined) {
            throw new RequiredError("AutomationApi", "createAction", "createActionRO");
        }


        // verify required parameter 'resourceId' is not null or undefined
        if (resourceId === null || resourceId === undefined) {
            throw new RequiredError("AutomationApi", "createAction", "resourceId");
        }


        // verify required parameter 'shareId' is not null or undefined
        if (shareId === null || shareId === undefined) {
            throw new RequiredError("AutomationApi", "createAction", "shareId");
        }


        // Path Params
        const localVarPath = '/automation/{resourceId}/actions'
            .replace('{' + 'resourceId' + '}', encodeURIComponent(String(resourceId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (shareId !== undefined) {
            requestContext.setQueryParam("shareId", ObjectSerializer.serialize(shareId, "string", ""));
        }


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(createActionRO, "CreateActionRO", ""),
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
     * Create automation robot trigger
     * @param createTriggerRO 
     * @param resourceId node id
     * @param shareId share id
     */
    public async createTrigger(createTriggerRO: CreateTriggerRO, resourceId: string, shareId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'createTriggerRO' is not null or undefined
        if (createTriggerRO === null || createTriggerRO === undefined) {
            throw new RequiredError("AutomationApi", "createTrigger", "createTriggerRO");
        }


        // verify required parameter 'resourceId' is not null or undefined
        if (resourceId === null || resourceId === undefined) {
            throw new RequiredError("AutomationApi", "createTrigger", "resourceId");
        }


        // verify required parameter 'shareId' is not null or undefined
        if (shareId === null || shareId === undefined) {
            throw new RequiredError("AutomationApi", "createTrigger", "shareId");
        }


        // Path Params
        const localVarPath = '/automation/{resourceId}/triggers'
            .replace('{' + 'resourceId' + '}', encodeURIComponent(String(resourceId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (shareId !== undefined) {
            requestContext.setQueryParam("shareId", ObjectSerializer.serialize(shareId, "string", ""));
        }


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(createTriggerRO, "CreateTriggerRO", ""),
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
     * Delete automation action
     * @param resourceId node id
     * @param actionId action id
     * @param robotId robot id
     */
    public async deleteAction(resourceId: string, actionId: string, robotId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'resourceId' is not null or undefined
        if (resourceId === null || resourceId === undefined) {
            throw new RequiredError("AutomationApi", "deleteAction", "resourceId");
        }


        // verify required parameter 'actionId' is not null or undefined
        if (actionId === null || actionId === undefined) {
            throw new RequiredError("AutomationApi", "deleteAction", "actionId");
        }


        // verify required parameter 'robotId' is not null or undefined
        if (robotId === null || robotId === undefined) {
            throw new RequiredError("AutomationApi", "deleteAction", "robotId");
        }


        // Path Params
        const localVarPath = '/automation/{resourceId}/actions/{actionId}'
            .replace('{' + 'resourceId' + '}', encodeURIComponent(String(resourceId)))
            .replace('{' + 'actionId' + '}', encodeURIComponent(String(actionId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.DELETE);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (robotId !== undefined) {
            requestContext.setQueryParam("robotId", ObjectSerializer.serialize(robotId, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Delete automation robot
     * @param resourceId node id
     * @param robotId robot id
     */
    public async deleteRobot(resourceId: string, robotId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'resourceId' is not null or undefined
        if (resourceId === null || resourceId === undefined) {
            throw new RequiredError("AutomationApi", "deleteRobot", "resourceId");
        }


        // verify required parameter 'robotId' is not null or undefined
        if (robotId === null || robotId === undefined) {
            throw new RequiredError("AutomationApi", "deleteRobot", "robotId");
        }


        // Path Params
        const localVarPath = '/automation/{resourceId}/robots/{robotId}'
            .replace('{' + 'resourceId' + '}', encodeURIComponent(String(resourceId)))
            .replace('{' + 'robotId' + '}', encodeURIComponent(String(robotId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.DELETE);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Delete automation trigger
     * @param resourceId node id
     * @param triggerId trigger id
     * @param robotId robot id
     */
    public async deleteTrigger(resourceId: string, triggerId: string, robotId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'resourceId' is not null or undefined
        if (resourceId === null || resourceId === undefined) {
            throw new RequiredError("AutomationApi", "deleteTrigger", "resourceId");
        }


        // verify required parameter 'triggerId' is not null or undefined
        if (triggerId === null || triggerId === undefined) {
            throw new RequiredError("AutomationApi", "deleteTrigger", "triggerId");
        }


        // verify required parameter 'robotId' is not null or undefined
        if (robotId === null || robotId === undefined) {
            throw new RequiredError("AutomationApi", "deleteTrigger", "robotId");
        }


        // Path Params
        const localVarPath = '/automation/{resourceId}/triggers/{triggerId}'
            .replace('{' + 'resourceId' + '}', encodeURIComponent(String(resourceId)))
            .replace('{' + 'triggerId' + '}', encodeURIComponent(String(triggerId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.DELETE);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (robotId !== undefined) {
            requestContext.setQueryParam("robotId", ObjectSerializer.serialize(robotId, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Get node automation detail. 
     * @param resourceId node id
     * @param robotId robot id
     * @param shareId share id
     */
    public async getNodeRobot(resourceId: string, robotId: string, shareId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'resourceId' is not null or undefined
        if (resourceId === null || resourceId === undefined) {
            throw new RequiredError("AutomationApi", "getNodeRobot", "resourceId");
        }


        // verify required parameter 'robotId' is not null or undefined
        if (robotId === null || robotId === undefined) {
            throw new RequiredError("AutomationApi", "getNodeRobot", "robotId");
        }


        // verify required parameter 'shareId' is not null or undefined
        if (shareId === null || shareId === undefined) {
            throw new RequiredError("AutomationApi", "getNodeRobot", "shareId");
        }


        // Path Params
        const localVarPath = '/automation/{resourceId}/robots/{robotId}'
            .replace('{' + 'resourceId' + '}', encodeURIComponent(String(resourceId)))
            .replace('{' + 'robotId' + '}', encodeURIComponent(String(robotId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (shareId !== undefined) {
            requestContext.setQueryParam("shareId", ObjectSerializer.serialize(shareId, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Get automation robots
     * @param resourceId node id
     * @param shareId share id
     */
    public async getResourceRobots(resourceId: string, shareId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'resourceId' is not null or undefined
        if (resourceId === null || resourceId === undefined) {
            throw new RequiredError("AutomationApi", "getResourceRobots", "resourceId");
        }


        // verify required parameter 'shareId' is not null or undefined
        if (shareId === null || shareId === undefined) {
            throw new RequiredError("AutomationApi", "getResourceRobots", "shareId");
        }


        // Path Params
        const localVarPath = '/automation/robots';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (resourceId !== undefined) {
            requestContext.setQueryParam("resourceId", ObjectSerializer.serialize(resourceId, "string", ""));
        }

        // Query Params
        if (shareId !== undefined) {
            requestContext.setQueryParam("shareId", ObjectSerializer.serialize(shareId, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Get automation run history
     * @param pageNum Current page number, default: 1
     * @param shareId share id
     * @param resourceId node id
     * @param robotId robot id
     * @param pageSize Page size, default: 20
     */
    public async getRunHistory(pageNum: number, shareId: string, resourceId: string, robotId: string, pageSize?: number, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'pageNum' is not null or undefined
        if (pageNum === null || pageNum === undefined) {
            throw new RequiredError("AutomationApi", "getRunHistory", "pageNum");
        }


        // verify required parameter 'shareId' is not null or undefined
        if (shareId === null || shareId === undefined) {
            throw new RequiredError("AutomationApi", "getRunHistory", "shareId");
        }


        // verify required parameter 'resourceId' is not null or undefined
        if (resourceId === null || resourceId === undefined) {
            throw new RequiredError("AutomationApi", "getRunHistory", "resourceId");
        }


        // verify required parameter 'robotId' is not null or undefined
        if (robotId === null || robotId === undefined) {
            throw new RequiredError("AutomationApi", "getRunHistory", "robotId");
        }



        // Path Params
        const localVarPath = '/automation/{resourceId}/roots/{robotId}/run-history'
            .replace('{' + 'resourceId' + '}', encodeURIComponent(String(resourceId)))
            .replace('{' + 'robotId' + '}', encodeURIComponent(String(robotId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (pageSize !== undefined) {
            requestContext.setQueryParam("pageSize", ObjectSerializer.serialize(pageSize, "number", ""));
        }

        // Query Params
        if (pageNum !== undefined) {
            requestContext.setQueryParam("pageNum", ObjectSerializer.serialize(pageNum, "number", ""));
        }

        // Query Params
        if (shareId !== undefined) {
            requestContext.setQueryParam("shareId", ObjectSerializer.serialize(shareId, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Update automation info.
     * @param updateRobotRO 
     * @param resourceId node id
     * @param robotId robot id
     * @param shareId share id
     */
    public async modifyRobot(updateRobotRO: UpdateRobotRO, resourceId: string, robotId: string, shareId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'updateRobotRO' is not null or undefined
        if (updateRobotRO === null || updateRobotRO === undefined) {
            throw new RequiredError("AutomationApi", "modifyRobot", "updateRobotRO");
        }


        // verify required parameter 'resourceId' is not null or undefined
        if (resourceId === null || resourceId === undefined) {
            throw new RequiredError("AutomationApi", "modifyRobot", "resourceId");
        }


        // verify required parameter 'robotId' is not null or undefined
        if (robotId === null || robotId === undefined) {
            throw new RequiredError("AutomationApi", "modifyRobot", "robotId");
        }


        // verify required parameter 'shareId' is not null or undefined
        if (shareId === null || shareId === undefined) {
            throw new RequiredError("AutomationApi", "modifyRobot", "shareId");
        }


        // Path Params
        const localVarPath = '/automation/{resourceId}/robots/{robotId}'
            .replace('{' + 'resourceId' + '}', encodeURIComponent(String(resourceId)))
            .replace('{' + 'robotId' + '}', encodeURIComponent(String(robotId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.PATCH);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (shareId !== undefined) {
            requestContext.setQueryParam("shareId", ObjectSerializer.serialize(shareId, "string", ""));
        }


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(updateRobotRO, "UpdateRobotRO", ""),
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
     * Update automation action
     * @param updateActionRO 
     * @param resourceId node id
     * @param actionId action id
     * @param shareId share id
     */
    public async updateAction(updateActionRO: UpdateActionRO, resourceId: string, actionId: string, shareId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'updateActionRO' is not null or undefined
        if (updateActionRO === null || updateActionRO === undefined) {
            throw new RequiredError("AutomationApi", "updateAction", "updateActionRO");
        }


        // verify required parameter 'resourceId' is not null or undefined
        if (resourceId === null || resourceId === undefined) {
            throw new RequiredError("AutomationApi", "updateAction", "resourceId");
        }


        // verify required parameter 'actionId' is not null or undefined
        if (actionId === null || actionId === undefined) {
            throw new RequiredError("AutomationApi", "updateAction", "actionId");
        }


        // verify required parameter 'shareId' is not null or undefined
        if (shareId === null || shareId === undefined) {
            throw new RequiredError("AutomationApi", "updateAction", "shareId");
        }


        // Path Params
        const localVarPath = '/automation/{resourceId}/actions/{actionId}'
            .replace('{' + 'resourceId' + '}', encodeURIComponent(String(resourceId)))
            .replace('{' + 'actionId' + '}', encodeURIComponent(String(actionId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.PATCH);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (shareId !== undefined) {
            requestContext.setQueryParam("shareId", ObjectSerializer.serialize(shareId, "string", ""));
        }


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(updateActionRO, "UpdateActionRO", ""),
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
     * Update automation robot trigger
     * @param updateTriggerRO 
     * @param resourceId node id
     * @param triggerId trigger id
     * @param shareId share id
     */
    public async updateTrigger(updateTriggerRO: UpdateTriggerRO, resourceId: string, triggerId: string, shareId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'updateTriggerRO' is not null or undefined
        if (updateTriggerRO === null || updateTriggerRO === undefined) {
            throw new RequiredError("AutomationApi", "updateTrigger", "updateTriggerRO");
        }


        // verify required parameter 'resourceId' is not null or undefined
        if (resourceId === null || resourceId === undefined) {
            throw new RequiredError("AutomationApi", "updateTrigger", "resourceId");
        }


        // verify required parameter 'triggerId' is not null or undefined
        if (triggerId === null || triggerId === undefined) {
            throw new RequiredError("AutomationApi", "updateTrigger", "triggerId");
        }


        // verify required parameter 'shareId' is not null or undefined
        if (shareId === null || shareId === undefined) {
            throw new RequiredError("AutomationApi", "updateTrigger", "shareId");
        }


        // Path Params
        const localVarPath = '/automation/{resourceId}/triggers/{triggerId}'
            .replace('{' + 'resourceId' + '}', encodeURIComponent(String(resourceId)))
            .replace('{' + 'triggerId' + '}', encodeURIComponent(String(triggerId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.PATCH);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (shareId !== undefined) {
            requestContext.setQueryParam("shareId", ObjectSerializer.serialize(shareId, "string", ""));
        }


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(updateTriggerRO, "UpdateTriggerRO", ""),
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

export class AutomationApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to createAction
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async createActionWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataListActionVO >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataListActionVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataListActionVO", ""
            ) as ResponseDataListActionVO;
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
            const body: ResponseDataListActionVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataListActionVO", ""
            ) as ResponseDataListActionVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to createTrigger
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async createTriggerWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataListTriggerVO >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataListTriggerVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataListTriggerVO", ""
            ) as ResponseDataListTriggerVO;
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
            const body: ResponseDataListTriggerVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataListTriggerVO", ""
            ) as ResponseDataListTriggerVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to deleteAction
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async deleteActionWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
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
     * @params response Response returned by the server for a request to deleteRobot
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async deleteRobotWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
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
     * @params response Response returned by the server for a request to deleteTrigger
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async deleteTriggerWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
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
     * @params response Response returned by the server for a request to getNodeRobot
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getNodeRobotWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataAutomationVO >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataAutomationVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataAutomationVO", ""
            ) as ResponseDataAutomationVO;
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
            const body: ResponseDataAutomationVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataAutomationVO", ""
            ) as ResponseDataAutomationVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getResourceRobots
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getResourceRobotsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataListAutomationSimpleVO >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataListAutomationSimpleVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataListAutomationSimpleVO", ""
            ) as ResponseDataListAutomationSimpleVO;
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
            const body: ResponseDataListAutomationSimpleVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataListAutomationSimpleVO", ""
            ) as ResponseDataListAutomationSimpleVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getRunHistory
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getRunHistoryWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataListAutomationTaskSimpleVO >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataListAutomationTaskSimpleVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataListAutomationTaskSimpleVO", ""
            ) as ResponseDataListAutomationTaskSimpleVO;
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
            const body: ResponseDataListAutomationTaskSimpleVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataListAutomationTaskSimpleVO", ""
            ) as ResponseDataListAutomationTaskSimpleVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to modifyRobot
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async modifyRobotWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
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
     * @params response Response returned by the server for a request to updateAction
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async updateActionWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataListActionVO >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataListActionVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataListActionVO", ""
            ) as ResponseDataListActionVO;
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
            const body: ResponseDataListActionVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataListActionVO", ""
            ) as ResponseDataListActionVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to updateTrigger
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async updateTriggerWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataListTriggerVO >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataListTriggerVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataListTriggerVO", ""
            ) as ResponseDataListTriggerVO;
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
            const body: ResponseDataListTriggerVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataListTriggerVO", ""
            ) as ResponseDataListTriggerVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

}
