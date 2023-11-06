// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { ResponseDataPageInfoAppInfo } from '../models/ResponseDataPageInfoAppInfo';
import { ResponseDataVoid } from '../models/ResponseDataVoid';

/**
 * no description
 */
export class AppStoreRelevantServiceInterfacesOfTheApplicationStoreApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * Pagination query. If no query parameter is transferred, the default query will be used
     * Query application list
     * @param pageIndex Page Index
     * @param pageSize Quantity per page
     * @param orderBy Sort field
     * @param sortBy Collation,asc&#x3D;positive sequence,desc&#x3D;reverse order
     */
    public async fetchAppStoreApps(pageIndex?: string, pageSize?: string, orderBy?: string, sortBy?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;





        // Path Params
        const localVarPath = '/appstores/apps';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (pageIndex !== undefined) {
            requestContext.setQueryParam("pageIndex", ObjectSerializer.serialize(pageIndex, "string", ""));
        }

        // Query Params
        if (pageSize !== undefined) {
            requestContext.setQueryParam("pageSize", ObjectSerializer.serialize(pageSize, "string", ""));
        }

        // Query Params
        if (orderBy !== undefined) {
            requestContext.setQueryParam("orderBy", ObjectSerializer.serialize(orderBy, "string", ""));
        }

        // Query Params
        if (sortBy !== undefined) {
            requestContext.setQueryParam("sortBy", ObjectSerializer.serialize(sortBy, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

}

export class AppStoreRelevantServiceInterfacesOfTheApplicationStoreApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to fetchAppStoreApps
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async fetchAppStoreAppsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataPageInfoAppInfo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataPageInfoAppInfo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataPageInfoAppInfo", ""
            ) as ResponseDataPageInfoAppInfo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataPageInfoAppInfo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataPageInfoAppInfo", ""
            ) as ResponseDataPageInfoAppInfo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

}
