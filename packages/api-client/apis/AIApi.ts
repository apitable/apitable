// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { AiUpdateParams } from '../models/AiUpdateParams';
import { FeedbackCreateParam } from '../models/FeedbackCreateParam';
import { FeedbackUpdateParam } from '../models/FeedbackUpdateParam';
import { ResponseDataAiInfoVO } from '../models/ResponseDataAiInfoVO';
import { ResponseDataFeedback } from '../models/ResponseDataFeedback';
import { ResponseDataFeedbackPagination } from '../models/ResponseDataFeedbackPagination';
import { ResponseDataFeedbackVO } from '../models/ResponseDataFeedbackVO';
import { ResponseDataListTrainingInfoVO } from '../models/ResponseDataListTrainingInfoVO';
import { ResponseDataMessageCreditUsageVO } from '../models/ResponseDataMessageCreditUsageVO';
import { ResponseDataPaginationMessage } from '../models/ResponseDataPaginationMessage';
import { ResponseDataPureJson } from '../models/ResponseDataPureJson';
import { ResponseDataSuggestionVO } from '../models/ResponseDataSuggestionVO';
import { ResponseDataTrainingPredictResult } from '../models/ResponseDataTrainingPredictResult';
import { ResponseDataTrainingStatusVO } from '../models/ResponseDataTrainingStatusVO';
import { ResponseDataVoid } from '../models/ResponseDataVoid';
import { SendMessageParam } from '../models/SendMessageParam';
import { SuggestionParams } from '../models/SuggestionParams';
import { TrainingPredictParams } from '../models/TrainingPredictParams';

/**
 * no description
 */
export class AIApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * Create Feedback
     * Create Feedback
     * @param feedbackCreateParam 
     * @param aiId 
     */
    public async createFeedback1(feedbackCreateParam: FeedbackCreateParam, aiId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'feedbackCreateParam' is not null or undefined
        if (feedbackCreateParam === null || feedbackCreateParam === undefined) {
            throw new RequiredError("AIApi", "createFeedback1", "feedbackCreateParam");
        }


        // verify required parameter 'aiId' is not null or undefined
        if (aiId === null || aiId === undefined) {
            throw new RequiredError("AIApi", "createFeedback1", "aiId");
        }


        // Path Params
        const localVarPath = '/ai/{aiId}/feedback'
            .replace('{' + 'aiId' + '}', encodeURIComponent(String(aiId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(feedbackCreateParam, "FeedbackCreateParam", ""),
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
     * Retrieve Conversation Feedback
     * Retrieve Conversation Feedback
     * @param aiId 
     * @param conversationId 
     */
    public async getConversationFeedback1(aiId: string, conversationId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'aiId' is not null or undefined
        if (aiId === null || aiId === undefined) {
            throw new RequiredError("AIApi", "getConversationFeedback1", "aiId");
        }


        // verify required parameter 'conversationId' is not null or undefined
        if (conversationId === null || conversationId === undefined) {
            throw new RequiredError("AIApi", "getConversationFeedback1", "conversationId");
        }


        // Path Params
        const localVarPath = '/ai/{aiId}/conversations/{conversationId}/feedback'
            .replace('{' + 'aiId' + '}', encodeURIComponent(String(aiId)))
            .replace('{' + 'conversationId' + '}', encodeURIComponent(String(conversationId)));

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
     * Retrieve Latest Training Status
     * Retrieve Credit Usage
     * @param aiId 
     */
    public async getCreditUsage(aiId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'aiId' is not null or undefined
        if (aiId === null || aiId === undefined) {
            throw new RequiredError("AIApi", "getCreditUsage", "aiId");
        }


        // Path Params
        const localVarPath = '/ai/{aiId}/credit/usage'
            .replace('{' + 'aiId' + '}', encodeURIComponent(String(aiId)));

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
     * Retrieve Latest Training Status
     * Retrieve Latest Training Status
     * @param aiId 
     */
    public async getLastTrainingStatus1(aiId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'aiId' is not null or undefined
        if (aiId === null || aiId === undefined) {
            throw new RequiredError("AIApi", "getLastTrainingStatus1", "aiId");
        }


        // Path Params
        const localVarPath = '/ai/{aiId}/training/status'
            .replace('{' + 'aiId' + '}', encodeURIComponent(String(aiId)));

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
     * Retrieve Conversation Message
     * Retrieve Conversation Message
     * @param aiId 
     * @param trainingId 
     * @param conversationId 
     * @param cursor 
     * @param limit 
     */
    public async getMessagePagination1(aiId: string, trainingId?: string, conversationId?: string, cursor?: string, limit?: number, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'aiId' is not null or undefined
        if (aiId === null || aiId === undefined) {
            throw new RequiredError("AIApi", "getMessagePagination1", "aiId");
        }






        // Path Params
        const localVarPath = '/ai/{aiId}/messages'
            .replace('{' + 'aiId' + '}', encodeURIComponent(String(aiId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (trainingId !== undefined) {
            requestContext.setQueryParam("trainingId", ObjectSerializer.serialize(trainingId, "string", ""));
        }

        // Query Params
        if (conversationId !== undefined) {
            requestContext.setQueryParam("conversationId", ObjectSerializer.serialize(conversationId, "string", ""));
        }

        // Query Params
        if (cursor !== undefined) {
            requestContext.setQueryParam("cursor", ObjectSerializer.serialize(cursor, "string", ""));
        }

        // Query Params
        if (limit !== undefined) {
            requestContext.setQueryParam("limit", ObjectSerializer.serialize(limit, "number", "int32"));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Retrieve Feedback Pagination
     * Retrieve Feedback Pagination
     * @param aiId 
     * @param pageNum 
     * @param pageSize 
     * @param state 
     * @param search 
     */
    public async getMessagesFeedback1(aiId: string, pageNum?: number, pageSize?: number, state?: number, search?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'aiId' is not null or undefined
        if (aiId === null || aiId === undefined) {
            throw new RequiredError("AIApi", "getMessagesFeedback1", "aiId");
        }






        // Path Params
        const localVarPath = '/ai/{aiId}/feedback'
            .replace('{' + 'aiId' + '}', encodeURIComponent(String(aiId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (pageNum !== undefined) {
            requestContext.setQueryParam("pageNum", ObjectSerializer.serialize(pageNum, "number", "int32"));
        }

        // Query Params
        if (pageSize !== undefined) {
            requestContext.setQueryParam("pageSize", ObjectSerializer.serialize(pageSize, "number", "int32"));
        }

        // Query Params
        if (state !== undefined) {
            requestContext.setQueryParam("state", ObjectSerializer.serialize(state, "number", "int32"));
        }

        // Query Params
        if (search !== undefined) {
            requestContext.setQueryParam("search", ObjectSerializer.serialize(search, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Get Suggestions
     * Get Suggestions
     * @param suggestionParams 
     * @param aiId 
     */
    public async getSuggestions1(suggestionParams: SuggestionParams, aiId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'suggestionParams' is not null or undefined
        if (suggestionParams === null || suggestionParams === undefined) {
            throw new RequiredError("AIApi", "getSuggestions1", "suggestionParams");
        }


        // verify required parameter 'aiId' is not null or undefined
        if (aiId === null || aiId === undefined) {
            throw new RequiredError("AIApi", "getSuggestions1", "aiId");
        }


        // Path Params
        const localVarPath = '/ai/{aiId}/suggestions'
            .replace('{' + 'aiId' + '}', encodeURIComponent(String(aiId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(suggestionParams, "SuggestionParams", ""),
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
     * Retrieve AI Info by ai id
     * Retrieve AI Info
     * @param aiId 
     */
    public async retrieve1(aiId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'aiId' is not null or undefined
        if (aiId === null || aiId === undefined) {
            throw new RequiredError("AIApi", "retrieve1", "aiId");
        }


        // Path Params
        const localVarPath = '/ai/{aiId}'
            .replace('{' + 'aiId' + '}', encodeURIComponent(String(aiId)));

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
     * Retrieve AI Setting by ai id
     * Retrieve AI Setting
     * @param aiId 
     * @param type 
     */
    public async retrieveSetting(aiId: string, type?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'aiId' is not null or undefined
        if (aiId === null || aiId === undefined) {
            throw new RequiredError("AIApi", "retrieveSetting", "aiId");
        }



        // Path Params
        const localVarPath = '/ai/{aiId}/setting'
            .replace('{' + 'aiId' + '}', encodeURIComponent(String(aiId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (type !== undefined) {
            requestContext.setQueryParam("type", ObjectSerializer.serialize(type, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Retrieve AI training list by ai id
     * Retrieve AI Training List
     * @param aiId 
     */
    public async retrieveTrainings(aiId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'aiId' is not null or undefined
        if (aiId === null || aiId === undefined) {
            throw new RequiredError("AIApi", "retrieveTrainings", "aiId");
        }


        // Path Params
        const localVarPath = '/ai/{aiId}/trainings'
            .replace('{' + 'aiId' + '}', encodeURIComponent(String(aiId)));

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
     * Send Message
     * Send Message
     * @param sendMessageParam 
     * @param aiId 
     */
    public async sendMessage1(sendMessageParam: SendMessageParam, aiId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'sendMessageParam' is not null or undefined
        if (sendMessageParam === null || sendMessageParam === undefined) {
            throw new RequiredError("AIApi", "sendMessage1", "sendMessageParam");
        }


        // verify required parameter 'aiId' is not null or undefined
        if (aiId === null || aiId === undefined) {
            throw new RequiredError("AIApi", "sendMessage1", "aiId");
        }


        // Path Params
        const localVarPath = '/ai/{aiId}/messages'
            .replace('{' + 'aiId' + '}', encodeURIComponent(String(aiId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(sendMessageParam, "SendMessageParam", ""),
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
     * Train
     * Train
     * @param aiId 
     */
    public async train1(aiId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'aiId' is not null or undefined
        if (aiId === null || aiId === undefined) {
            throw new RequiredError("AIApi", "train1", "aiId");
        }


        // Path Params
        const localVarPath = '/ai/{aiId}/train'
            .replace('{' + 'aiId' + '}', encodeURIComponent(String(aiId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Train Predict
     * Train Predict
     * @param trainingPredictParams 
     * @param aiId 
     */
    public async trainPredict1(trainingPredictParams: TrainingPredictParams, aiId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'trainingPredictParams' is not null or undefined
        if (trainingPredictParams === null || trainingPredictParams === undefined) {
            throw new RequiredError("AIApi", "trainPredict1", "trainingPredictParams");
        }


        // verify required parameter 'aiId' is not null or undefined
        if (aiId === null || aiId === undefined) {
            throw new RequiredError("AIApi", "trainPredict1", "aiId");
        }


        // Path Params
        const localVarPath = '/ai/{aiId}/train/predict'
            .replace('{' + 'aiId' + '}', encodeURIComponent(String(aiId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(trainingPredictParams, "TrainingPredictParams", ""),
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
     * Update AI Info
     * Update AI Info
     * @param aiUpdateParams 
     * @param aiId 
     */
    public async update1(aiUpdateParams: AiUpdateParams, aiId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'aiUpdateParams' is not null or undefined
        if (aiUpdateParams === null || aiUpdateParams === undefined) {
            throw new RequiredError("AIApi", "update1", "aiUpdateParams");
        }


        // verify required parameter 'aiId' is not null or undefined
        if (aiId === null || aiId === undefined) {
            throw new RequiredError("AIApi", "update1", "aiId");
        }


        // Path Params
        const localVarPath = '/ai/{aiId}'
            .replace('{' + 'aiId' + '}', encodeURIComponent(String(aiId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.PUT);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(aiUpdateParams, "AiUpdateParams", ""),
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
     * Update Feedback
     * Update Feedback
     * @param feedbackUpdateParam 
     * @param aiId 
     * @param feedbackId 
     */
    public async updateFeedback1(feedbackUpdateParam: FeedbackUpdateParam, aiId: string, feedbackId: number, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'feedbackUpdateParam' is not null or undefined
        if (feedbackUpdateParam === null || feedbackUpdateParam === undefined) {
            throw new RequiredError("AIApi", "updateFeedback1", "feedbackUpdateParam");
        }


        // verify required parameter 'aiId' is not null or undefined
        if (aiId === null || aiId === undefined) {
            throw new RequiredError("AIApi", "updateFeedback1", "aiId");
        }


        // verify required parameter 'feedbackId' is not null or undefined
        if (feedbackId === null || feedbackId === undefined) {
            throw new RequiredError("AIApi", "updateFeedback1", "feedbackId");
        }


        // Path Params
        const localVarPath = '/ai/{aiId}/feedback/{feedbackId}'
            .replace('{' + 'aiId' + '}', encodeURIComponent(String(aiId)))
            .replace('{' + 'feedbackId' + '}', encodeURIComponent(String(feedbackId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.PUT);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(feedbackUpdateParam, "FeedbackUpdateParam", ""),
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

export class AIApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to createFeedback1
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async createFeedback1WithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataFeedback >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataFeedback = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataFeedback", ""
            ) as ResponseDataFeedback;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataFeedback = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataFeedback", ""
            ) as ResponseDataFeedback;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getConversationFeedback1
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getConversationFeedback1WithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataFeedbackVO >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataFeedbackVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataFeedbackVO", ""
            ) as ResponseDataFeedbackVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataFeedbackVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataFeedbackVO", ""
            ) as ResponseDataFeedbackVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getCreditUsage
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getCreditUsageWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataMessageCreditUsageVO >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataMessageCreditUsageVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataMessageCreditUsageVO", ""
            ) as ResponseDataMessageCreditUsageVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataMessageCreditUsageVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataMessageCreditUsageVO", ""
            ) as ResponseDataMessageCreditUsageVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getLastTrainingStatus1
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getLastTrainingStatus1WithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataTrainingStatusVO >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataTrainingStatusVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataTrainingStatusVO", ""
            ) as ResponseDataTrainingStatusVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataTrainingStatusVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataTrainingStatusVO", ""
            ) as ResponseDataTrainingStatusVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getMessagePagination1
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getMessagePagination1WithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataPaginationMessage >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataPaginationMessage = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataPaginationMessage", ""
            ) as ResponseDataPaginationMessage;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataPaginationMessage = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataPaginationMessage", ""
            ) as ResponseDataPaginationMessage;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getMessagesFeedback1
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getMessagesFeedback1WithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataFeedbackPagination >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataFeedbackPagination = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataFeedbackPagination", ""
            ) as ResponseDataFeedbackPagination;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataFeedbackPagination = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataFeedbackPagination", ""
            ) as ResponseDataFeedbackPagination;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getSuggestions1
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getSuggestions1WithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataSuggestionVO >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataSuggestionVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataSuggestionVO", ""
            ) as ResponseDataSuggestionVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataSuggestionVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataSuggestionVO", ""
            ) as ResponseDataSuggestionVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to retrieve1
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async retrieve1WithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataAiInfoVO >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataAiInfoVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataAiInfoVO", ""
            ) as ResponseDataAiInfoVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataAiInfoVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataAiInfoVO", ""
            ) as ResponseDataAiInfoVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to retrieveSetting
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async retrieveSettingWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataPureJson >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataPureJson = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataPureJson", ""
            ) as ResponseDataPureJson;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataPureJson = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataPureJson", ""
            ) as ResponseDataPureJson;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to retrieveTrainings
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async retrieveTrainingsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataListTrainingInfoVO >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataListTrainingInfoVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataListTrainingInfoVO", ""
            ) as ResponseDataListTrainingInfoVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataListTrainingInfoVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataListTrainingInfoVO", ""
            ) as ResponseDataListTrainingInfoVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to sendMessage1
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async sendMessage1WithHttpInfo(response: ResponseContext): Promise<HttpInfo<Array<any> >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: Array<any> = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Array<any>", ""
            ) as Array<any>;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: Array<any> = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Array<any>", ""
            ) as Array<any>;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to train1
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async train1WithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
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
     * @params response Response returned by the server for a request to trainPredict1
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async trainPredict1WithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataTrainingPredictResult >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataTrainingPredictResult = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataTrainingPredictResult", ""
            ) as ResponseDataTrainingPredictResult;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataTrainingPredictResult = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataTrainingPredictResult", ""
            ) as ResponseDataTrainingPredictResult;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to update1
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async update1WithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataAiInfoVO >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataAiInfoVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataAiInfoVO", ""
            ) as ResponseDataAiInfoVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataAiInfoVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataAiInfoVO", ""
            ) as ResponseDataAiInfoVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to updateFeedback1
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async updateFeedback1WithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
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
