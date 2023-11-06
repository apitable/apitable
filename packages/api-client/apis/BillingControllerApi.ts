// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { ResponseDataBillingInfo } from '../models/ResponseDataBillingInfo';
import { ResponseDataBillingSessionVO } from '../models/ResponseDataBillingSessionVO';
import { ResponseDataCustomerInvoices } from '../models/ResponseDataCustomerInvoices';
import { ResponseDataVoid } from '../models/ResponseDataVoid';

/**
 * no description
 */
export class BillingControllerApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * @param spaceId 
     * @param subscriptionId 
     */
    public async cancelSubscription(spaceId: string, subscriptionId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'spaceId' is not null or undefined
        if (spaceId === null || spaceId === undefined) {
            throw new RequiredError("BillingControllerApi", "cancelSubscription", "spaceId");
        }


        // verify required parameter 'subscriptionId' is not null or undefined
        if (subscriptionId === null || subscriptionId === undefined) {
            throw new RequiredError("BillingControllerApi", "cancelSubscription", "subscriptionId");
        }


        // Path Params
        const localVarPath = '/billing/cancelSubscription';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (spaceId !== undefined) {
            requestContext.setQueryParam("spaceId", ObjectSerializer.serialize(spaceId, "string", ""));
        }

        // Query Params
        if (subscriptionId !== undefined) {
            requestContext.setQueryParam("subscriptionId", ObjectSerializer.serialize(subscriptionId, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * @param spaceId 
     */
    public async changePaymentMethod(spaceId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'spaceId' is not null or undefined
        if (spaceId === null || spaceId === undefined) {
            throw new RequiredError("BillingControllerApi", "changePaymentMethod", "spaceId");
        }


        // Path Params
        const localVarPath = '/billing/changePaymentMethod';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (spaceId !== undefined) {
            requestContext.setQueryParam("spaceId", ObjectSerializer.serialize(spaceId, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * @param spaceId 
     */
    public async customerPortalUrl(spaceId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'spaceId' is not null or undefined
        if (spaceId === null || spaceId === undefined) {
            throw new RequiredError("BillingControllerApi", "customerPortalUrl", "spaceId");
        }


        // Path Params
        const localVarPath = '/billing/customers/portal';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (spaceId !== undefined) {
            requestContext.setQueryParam("spaceId", ObjectSerializer.serialize(spaceId, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * @param spaceId 
     * @param startingAfter 
     * @param endingBefore 
     * @param limit 
     */
    public async getInvoices(spaceId: string, startingAfter?: string, endingBefore?: string, limit?: number, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'spaceId' is not null or undefined
        if (spaceId === null || spaceId === undefined) {
            throw new RequiredError("BillingControllerApi", "getInvoices", "spaceId");
        }





        // Path Params
        const localVarPath = '/billing/invoices';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (spaceId !== undefined) {
            requestContext.setQueryParam("spaceId", ObjectSerializer.serialize(spaceId, "string", ""));
        }

        // Query Params
        if (startingAfter !== undefined) {
            requestContext.setQueryParam("startingAfter", ObjectSerializer.serialize(startingAfter, "string", ""));
        }

        // Query Params
        if (endingBefore !== undefined) {
            requestContext.setQueryParam("endingBefore", ObjectSerializer.serialize(endingBefore, "string", ""));
        }

        // Query Params
        if (limit !== undefined) {
            requestContext.setQueryParam("limit", ObjectSerializer.serialize(limit, "number", "int64"));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * @param spaceId 
     */
    public async getSubscriptions(spaceId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'spaceId' is not null or undefined
        if (spaceId === null || spaceId === undefined) {
            throw new RequiredError("BillingControllerApi", "getSubscriptions", "spaceId");
        }


        // Path Params
        const localVarPath = '/billing/subscriptions';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (spaceId !== undefined) {
            requestContext.setQueryParam("spaceId", ObjectSerializer.serialize(spaceId, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * @param spaceId 
     * @param subscriptionId 
     * @param action 
     */
    public async updateSubscription(spaceId: string, subscriptionId: string, action?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'spaceId' is not null or undefined
        if (spaceId === null || spaceId === undefined) {
            throw new RequiredError("BillingControllerApi", "updateSubscription", "spaceId");
        }


        // verify required parameter 'subscriptionId' is not null or undefined
        if (subscriptionId === null || subscriptionId === undefined) {
            throw new RequiredError("BillingControllerApi", "updateSubscription", "subscriptionId");
        }



        // Path Params
        const localVarPath = '/billing/updateSubscription';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (spaceId !== undefined) {
            requestContext.setQueryParam("spaceId", ObjectSerializer.serialize(spaceId, "string", ""));
        }

        // Query Params
        if (subscriptionId !== undefined) {
            requestContext.setQueryParam("subscriptionId", ObjectSerializer.serialize(subscriptionId, "string", ""));
        }

        // Query Params
        if (action !== undefined) {
            requestContext.setQueryParam("action", ObjectSerializer.serialize(action, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * @param spaceId 
     * @param subscriptionId 
     * @param priceId 
     */
    public async updateSubscriptionConfirm(spaceId: string, subscriptionId: string, priceId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'spaceId' is not null or undefined
        if (spaceId === null || spaceId === undefined) {
            throw new RequiredError("BillingControllerApi", "updateSubscriptionConfirm", "spaceId");
        }


        // verify required parameter 'subscriptionId' is not null or undefined
        if (subscriptionId === null || subscriptionId === undefined) {
            throw new RequiredError("BillingControllerApi", "updateSubscriptionConfirm", "subscriptionId");
        }


        // verify required parameter 'priceId' is not null or undefined
        if (priceId === null || priceId === undefined) {
            throw new RequiredError("BillingControllerApi", "updateSubscriptionConfirm", "priceId");
        }


        // Path Params
        const localVarPath = '/billing/updateSubscriptionConfirm';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (spaceId !== undefined) {
            requestContext.setQueryParam("spaceId", ObjectSerializer.serialize(spaceId, "string", ""));
        }

        // Query Params
        if (subscriptionId !== undefined) {
            requestContext.setQueryParam("subscriptionId", ObjectSerializer.serialize(subscriptionId, "string", ""));
        }

        // Query Params
        if (priceId !== undefined) {
            requestContext.setQueryParam("priceId", ObjectSerializer.serialize(priceId, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

}

export class BillingControllerApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to cancelSubscription
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async cancelSubscriptionWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataBillingSessionVO >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataBillingSessionVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataBillingSessionVO", ""
            ) as ResponseDataBillingSessionVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataBillingSessionVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataBillingSessionVO", ""
            ) as ResponseDataBillingSessionVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to changePaymentMethod
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async changePaymentMethodWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataBillingSessionVO >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataBillingSessionVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataBillingSessionVO", ""
            ) as ResponseDataBillingSessionVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataBillingSessionVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataBillingSessionVO", ""
            ) as ResponseDataBillingSessionVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to customerPortalUrl
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async customerPortalUrlWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataBillingSessionVO >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataBillingSessionVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataBillingSessionVO", ""
            ) as ResponseDataBillingSessionVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataBillingSessionVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataBillingSessionVO", ""
            ) as ResponseDataBillingSessionVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getInvoices
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getInvoicesWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataCustomerInvoices >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataCustomerInvoices = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataCustomerInvoices", ""
            ) as ResponseDataCustomerInvoices;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataCustomerInvoices = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataCustomerInvoices", ""
            ) as ResponseDataCustomerInvoices;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getSubscriptions
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getSubscriptionsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataBillingInfo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataBillingInfo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataBillingInfo", ""
            ) as ResponseDataBillingInfo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataBillingInfo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataBillingInfo", ""
            ) as ResponseDataBillingInfo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to updateSubscription
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async updateSubscriptionWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataBillingSessionVO >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataBillingSessionVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataBillingSessionVO", ""
            ) as ResponseDataBillingSessionVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataBillingSessionVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataBillingSessionVO", ""
            ) as ResponseDataBillingSessionVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to updateSubscriptionConfirm
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async updateSubscriptionConfirmWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataBillingSessionVO >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataBillingSessionVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataBillingSessionVO", ""
            ) as ResponseDataBillingSessionVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataBillingSessionVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataBillingSessionVO", ""
            ) as ResponseDataBillingSessionVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

}
