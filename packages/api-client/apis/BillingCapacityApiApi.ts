// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { Page } from '../models/Page';
import { ResponseDataPageInfoSpaceCapacityPageVO } from '../models/ResponseDataPageInfoSpaceCapacityPageVO';
import { ResponseDataVoid } from '../models/ResponseDataVoid';

/**
 * no description
 */
export class BillingCapacityApiApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * Get space capacity detail info
     * @param page 
     * @param xSpaceId space id
     * @param pageObjectParams paging parameter
     * @param isExpire Whether the attachment capacity has expired. By default, it has not expired
     */
    public async getCapacityDetail(page: Page, xSpaceId: string, pageObjectParams: string, isExpire?: boolean, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'page' is not null or undefined
        if (page === null || page === undefined) {
            throw new RequiredError("BillingCapacityApiApi", "getCapacityDetail", "page");
        }


        // verify required parameter 'xSpaceId' is not null or undefined
        if (xSpaceId === null || xSpaceId === undefined) {
            throw new RequiredError("BillingCapacityApiApi", "getCapacityDetail", "xSpaceId");
        }


        // verify required parameter 'pageObjectParams' is not null or undefined
        if (pageObjectParams === null || pageObjectParams === undefined) {
            throw new RequiredError("BillingCapacityApiApi", "getCapacityDetail", "pageObjectParams");
        }



        // Path Params
        const localVarPath = '/space/capacity/detail';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (isExpire !== undefined) {
            requestContext.setQueryParam("isExpire", ObjectSerializer.serialize(isExpire, "boolean", ""));
        }

        // Query Params
        if (page !== undefined) {
            requestContext.setQueryParam("page", ObjectSerializer.serialize(page, "Page", ""));
        }

        // Query Params
        if (pageObjectParams !== undefined) {
            requestContext.setQueryParam("pageObjectParams", ObjectSerializer.serialize(pageObjectParams, "string", ""));
        }

        // Header Params
        requestContext.setHeaderParam("X-Space-Id", ObjectSerializer.serialize(xSpaceId, "string", ""));


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

}

export class BillingCapacityApiApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getCapacityDetail
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getCapacityDetailWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataPageInfoSpaceCapacityPageVO >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataPageInfoSpaceCapacityPageVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataPageInfoSpaceCapacityPageVO", ""
            ) as ResponseDataPageInfoSpaceCapacityPageVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataPageInfoSpaceCapacityPageVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataPageInfoSpaceCapacityPageVO", ""
            ) as ResponseDataPageInfoSpaceCapacityPageVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

}
