// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { ResponseDataNodeCollaboratorVO } from '../models/ResponseDataNodeCollaboratorVO';
import { ResponseDataVoid } from '../models/ResponseDataVoid';

/**
 * no description
 */
export class WorkbenchNodeRoleApiApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * Scene: Collaborator Card Information
     * Get Collaborator Info
     * @param uuid 
     * @param nodeId 
     * @param xSpaceId space id
     */
    public async getCollaboratorInfo(uuid: string, nodeId: string, xSpaceId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'uuid' is not null or undefined
        if (uuid === null || uuid === undefined) {
            throw new RequiredError("WorkbenchNodeRoleApiApi", "getCollaboratorInfo", "uuid");
        }


        // verify required parameter 'nodeId' is not null or undefined
        if (nodeId === null || nodeId === undefined) {
            throw new RequiredError("WorkbenchNodeRoleApiApi", "getCollaboratorInfo", "nodeId");
        }


        // verify required parameter 'xSpaceId' is not null or undefined
        if (xSpaceId === null || xSpaceId === undefined) {
            throw new RequiredError("WorkbenchNodeRoleApiApi", "getCollaboratorInfo", "xSpaceId");
        }


        // Path Params
        const localVarPath = '/node/collaborator/info';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (uuid !== undefined) {
            requestContext.setQueryParam("uuid", ObjectSerializer.serialize(uuid, "string", ""));
        }

        // Query Params
        if (nodeId !== undefined) {
            requestContext.setQueryParam("nodeId", ObjectSerializer.serialize(nodeId, "string", ""));
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

export class WorkbenchNodeRoleApiApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getCollaboratorInfo
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getCollaboratorInfoWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataNodeCollaboratorVO >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataNodeCollaboratorVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataNodeCollaboratorVO", ""
            ) as ResponseDataNodeCollaboratorVO;
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
            const body: ResponseDataNodeCollaboratorVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataNodeCollaboratorVO", ""
            ) as ResponseDataNodeCollaboratorVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

}
