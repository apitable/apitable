// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { AttachOfficePreviewRo } from '../models/AttachOfficePreviewRo';
import { ResponseDataString } from '../models/ResponseDataString';
import { ResponseDataVoid } from '../models/ResponseDataVoid';

/**
 * no description
 */
export class OfficeOperationAPIApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * Office document preview conversion,call Yongzhong office conversion interface
     * Office document preview conversion
     * @param attachOfficePreviewRo 
     * @param spaceId 
     */
    public async officePreview(attachOfficePreviewRo: AttachOfficePreviewRo, spaceId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'attachOfficePreviewRo' is not null or undefined
        if (attachOfficePreviewRo === null || attachOfficePreviewRo === undefined) {
            throw new RequiredError("OfficeOperationAPIApi", "officePreview", "attachOfficePreviewRo");
        }


        // verify required parameter 'spaceId' is not null or undefined
        if (spaceId === null || spaceId === undefined) {
            throw new RequiredError("OfficeOperationAPIApi", "officePreview", "spaceId");
        }


        // Path Params
        const localVarPath = '/base/attach/officePreview/{spaceId}'
            .replace('{' + 'spaceId' + '}', encodeURIComponent(String(spaceId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(attachOfficePreviewRo, "AttachOfficePreviewRo", ""),
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

export class OfficeOperationAPIApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to officePreview
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async officePreviewWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataString >> {
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
