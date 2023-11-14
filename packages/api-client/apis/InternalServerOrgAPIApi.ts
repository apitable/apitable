// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { LoadSearchDTO } from '../models/LoadSearchDTO';
import { ResponseDataListUnitInfoVo } from '../models/ResponseDataListUnitInfoVo';
import { ResponseDataVoid } from '../models/ResponseDataVoid';

/**
 * no description
 */
export class InternalServerOrgAPIApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * The most recently selected units are loaded by default when not keyword. The most recently added member of the same group are loaded when not selected. Load max 10
     * Load/search departments and members
     * @param params 
     * @param xSpaceId space id
     * @param userId user id
     * @param keyword keyword
     * @param unitIds unitIds
     * @param filterIds specifies the organizational unit to filter
     * @param all whether to load all departments and members
     * @param searchEmail whether to search for emails
     */
    public async loadOrSearch1(params: LoadSearchDTO, xSpaceId?: string, userId?: string, keyword?: string, unitIds?: string, filterIds?: string, all?: boolean, searchEmail?: boolean, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'params' is not null or undefined
        if (params === null || params === undefined) {
            throw new RequiredError("InternalServerOrgAPIApi", "loadOrSearch1", "params");
        }









        // Path Params
        const localVarPath = '/internal/org/loadOrSearch';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (params !== undefined) {
            requestContext.setQueryParam("params", ObjectSerializer.serialize(params, "LoadSearchDTO", ""));
        }

        // Query Params
        if (userId !== undefined) {
            requestContext.setQueryParam("userId", ObjectSerializer.serialize(userId, "string", ""));
        }

        // Query Params
        if (keyword !== undefined) {
            requestContext.setQueryParam("keyword", ObjectSerializer.serialize(keyword, "string", ""));
        }

        // Query Params
        if (unitIds !== undefined) {
            requestContext.setQueryParam("unitIds", ObjectSerializer.serialize(unitIds, "string", ""));
        }

        // Query Params
        if (filterIds !== undefined) {
            requestContext.setQueryParam("filterIds", ObjectSerializer.serialize(filterIds, "string", ""));
        }

        // Query Params
        if (all !== undefined) {
            requestContext.setQueryParam("all", ObjectSerializer.serialize(all, "boolean", ""));
        }

        // Query Params
        if (searchEmail !== undefined) {
            requestContext.setQueryParam("searchEmail", ObjectSerializer.serialize(searchEmail, "boolean", ""));
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

export class InternalServerOrgAPIApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to loadOrSearch1
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async loadOrSearch1WithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataListUnitInfoVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataListUnitInfoVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataListUnitInfoVo", ""
            ) as ResponseDataListUnitInfoVo;
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
            const body: ResponseDataListUnitInfoVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataListUnitInfoVo", ""
            ) as ResponseDataListUnitInfoVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

}
