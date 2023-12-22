// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { ResponseDataUrlAwareContentsVo } from '../models/ResponseDataUrlAwareContentsVo';
import { ResponseDataVoid } from '../models/ResponseDataVoid';
import { UrlsWrapperRo } from '../models/UrlsWrapperRo';

/**
 * no description
 */
export class InternalServiceFieldServiceInterfaceApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * get url related information
     * get url related information
     * @param urlsWrapperRo 
     */
    public async urlContentsAwareFill(urlsWrapperRo: UrlsWrapperRo, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'urlsWrapperRo' is not null or undefined
        if (urlsWrapperRo === null || urlsWrapperRo === undefined) {
            throw new RequiredError("InternalServiceFieldServiceInterfaceApi", "urlContentsAwareFill", "urlsWrapperRo");
        }


        // Path Params
        const localVarPath = '/internal/field/url/awareContents';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(urlsWrapperRo, "UrlsWrapperRo", ""),
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

export class InternalServiceFieldServiceInterfaceApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to urlContentsAwareFill
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async urlContentsAwareFillWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataUrlAwareContentsVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataUrlAwareContentsVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataUrlAwareContentsVo", ""
            ) as ResponseDataUrlAwareContentsVo;
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
            const body: ResponseDataUrlAwareContentsVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataUrlAwareContentsVo", ""
            ) as ResponseDataUrlAwareContentsVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

}
