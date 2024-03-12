// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { ResponseDataListWidgetUploadTokenVo } from '../models/ResponseDataListWidgetUploadTokenVo';
import { ResponseDataVoid } from '../models/ResponseDataVoid';
import { ResponseDataWidgetUploadMetaVo } from '../models/ResponseDataWidgetUploadMetaVo';
import { WidgetAssetUploadCertificateRO } from '../models/WidgetAssetUploadCertificateRO';

/**
 * no description
 */
export class WidgetUploadAPIApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * Get widget file upload pre signed url
     * @param widgetAssetUploadCertificateRO 
     * @param packageId 
     */
    public async generateWidgetPreSignedUrl(widgetAssetUploadCertificateRO: WidgetAssetUploadCertificateRO, packageId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'widgetAssetUploadCertificateRO' is not null or undefined
        if (widgetAssetUploadCertificateRO === null || widgetAssetUploadCertificateRO === undefined) {
            throw new RequiredError("WidgetUploadAPIApi", "generateWidgetPreSignedUrl", "widgetAssetUploadCertificateRO");
        }


        // verify required parameter 'packageId' is not null or undefined
        if (packageId === null || packageId === undefined) {
            throw new RequiredError("WidgetUploadAPIApi", "generateWidgetPreSignedUrl", "packageId");
        }


        // Path Params
        const localVarPath = '/asset/widget/{packageId}/uploadPreSignedUrl'
            .replace('{' + 'packageId' + '}', encodeURIComponent(String(packageId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(widgetAssetUploadCertificateRO, "WidgetAssetUploadCertificateRO", ""),
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
     * get widget upload meta
     * get widget upload meta
     */
    public async getWidgetUploadMeta(_options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // Path Params
        const localVarPath = '/asset/widget/uploadMeta';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

}

export class WidgetUploadAPIApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to generateWidgetPreSignedUrl
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async generateWidgetPreSignedUrlWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataListWidgetUploadTokenVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataListWidgetUploadTokenVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataListWidgetUploadTokenVo", ""
            ) as ResponseDataListWidgetUploadTokenVo;
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
            const body: ResponseDataListWidgetUploadTokenVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataListWidgetUploadTokenVo", ""
            ) as ResponseDataListWidgetUploadTokenVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getWidgetUploadMeta
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getWidgetUploadMetaWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataWidgetUploadMetaVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataWidgetUploadMetaVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataWidgetUploadMetaVo", ""
            ) as ResponseDataWidgetUploadMetaVo;
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
            const body: ResponseDataWidgetUploadMetaVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataWidgetUploadMetaVo", ""
            ) as ResponseDataWidgetUploadMetaVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

}
