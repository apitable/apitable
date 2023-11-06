// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { ResponseDataPageInfoSpaceAuditPageVO } from '../models/ResponseDataPageInfoSpaceAuditPageVO';
import { ResponseDataVoid } from '../models/ResponseDataVoid';

/**
 * no description
 */
export class SpaceAuditApiApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * Query space audit logs in pages
     * @param spaceId space id
     * @param beginTime beginTime(format：yyyy-MM-dd HH:mm:ss)
     * @param endTime endTime(format：yyyy-MM-dd HH:mm:ss)
     * @param memberIds member ids
     * @param actions actions
     * @param keyword keyword
     * @param pageNo page no(default 1)
     * @param pageSize page size(default 20，max 100)
     */
    public async audit(spaceId: string, beginTime?: Date, endTime?: Date, memberIds?: string, actions?: string, keyword?: string, pageNo?: number, pageSize?: number, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'spaceId' is not null or undefined
        if (spaceId === null || spaceId === undefined) {
            throw new RequiredError("SpaceAuditApiApi", "audit", "spaceId");
        }









        // Path Params
        const localVarPath = '/space/{spaceId}/audit'
            .replace('{' + 'spaceId' + '}', encodeURIComponent(String(spaceId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (beginTime !== undefined) {
            requestContext.setQueryParam("beginTime", ObjectSerializer.serialize(beginTime, "Date", "date-time"));
        }

        // Query Params
        if (endTime !== undefined) {
            requestContext.setQueryParam("endTime", ObjectSerializer.serialize(endTime, "Date", "date-time"));
        }

        // Query Params
        if (memberIds !== undefined) {
            requestContext.setQueryParam("memberIds", ObjectSerializer.serialize(memberIds, "string", ""));
        }

        // Query Params
        if (actions !== undefined) {
            requestContext.setQueryParam("actions", ObjectSerializer.serialize(actions, "string", ""));
        }

        // Query Params
        if (keyword !== undefined) {
            requestContext.setQueryParam("keyword", ObjectSerializer.serialize(keyword, "string", ""));
        }

        // Query Params
        if (pageNo !== undefined) {
            requestContext.setQueryParam("pageNo", ObjectSerializer.serialize(pageNo, "number", ""));
        }

        // Query Params
        if (pageSize !== undefined) {
            requestContext.setQueryParam("pageSize", ObjectSerializer.serialize(pageSize, "number", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

}

export class SpaceAuditApiApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to audit
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async auditWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataPageInfoSpaceAuditPageVO >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataPageInfoSpaceAuditPageVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataPageInfoSpaceAuditPageVO", ""
            ) as ResponseDataPageInfoSpaceAuditPageVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataPageInfoSpaceAuditPageVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataPageInfoSpaceAuditPageVO", ""
            ) as ResponseDataPageInfoSpaceAuditPageVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

}
