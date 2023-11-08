// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { CreateTeamRo } from '../models/CreateTeamRo';
import { ResponseDataListMemberPageVo } from '../models/ResponseDataListMemberPageVo';
import { ResponseDataListTeamTreeVo } from '../models/ResponseDataListTeamTreeVo';
import { ResponseDataTeamInfoVo } from '../models/ResponseDataTeamInfoVo';
import { ResponseDataVoid } from '../models/ResponseDataVoid';
import { UpdateTeamRo } from '../models/UpdateTeamRo';

/**
 * no description
 */
export class ContactsTeamApiApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * Create team
     * Create team
     * @param createTeamRo 
     * @param xSpaceId space id
     */
    public async createTeam(createTeamRo: CreateTeamRo, xSpaceId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'createTeamRo' is not null or undefined
        if (createTeamRo === null || createTeamRo === undefined) {
            throw new RequiredError("ContactsTeamApiApi", "createTeam", "createTeamRo");
        }


        // verify required parameter 'xSpaceId' is not null or undefined
        if (xSpaceId === null || xSpaceId === undefined) {
            throw new RequiredError("ContactsTeamApiApi", "createTeam", "xSpaceId");
        }


        // Path Params
        const localVarPath = '/org/team/create';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Header Params
        requestContext.setHeaderParam("X-Space-Id", ObjectSerializer.serialize(xSpaceId, "string", ""));


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(createTeamRo, "CreateTeamRo", ""),
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
     * Delete team. If team has members, it can be deleted.
     * Delete team
     * @param teamId team id
     * @param xSpaceId space id
     */
    public async deleteTeam(teamId: string, xSpaceId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'teamId' is not null or undefined
        if (teamId === null || teamId === undefined) {
            throw new RequiredError("ContactsTeamApiApi", "deleteTeam", "teamId");
        }


        // verify required parameter 'xSpaceId' is not null or undefined
        if (xSpaceId === null || xSpaceId === undefined) {
            throw new RequiredError("ContactsTeamApiApi", "deleteTeam", "xSpaceId");
        }


        // Path Params
        const localVarPath = '/org/team/delete/{teamId}'
            .replace('{' + 'teamId' + '}', encodeURIComponent(String(teamId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.DELETE);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Header Params
        requestContext.setHeaderParam("X-Space-Id", ObjectSerializer.serialize(xSpaceId, "string", ""));


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * query sub team by team id. if team id lack, default root team.
     * Query direct sub departments
     * @param xSpaceId space id
     * @param teamId team id
     */
    public async getSubTeams(xSpaceId: string, teamId?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'xSpaceId' is not null or undefined
        if (xSpaceId === null || xSpaceId === undefined) {
            throw new RequiredError("ContactsTeamApiApi", "getSubTeams", "xSpaceId");
        }



        // Path Params
        const localVarPath = '/org/team/subTeams';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (teamId !== undefined) {
            requestContext.setQueryParam("teamId", ObjectSerializer.serialize(teamId, "string", ""));
        }

        // Header Params
        requestContext.setHeaderParam("X-Space-Id", ObjectSerializer.serialize(xSpaceId, "string", ""));


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * team branch. result is tree
     * team branch
     * @param xSpaceId space id
     */
    public async getTeamBranch(xSpaceId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'xSpaceId' is not null or undefined
        if (xSpaceId === null || xSpaceId === undefined) {
            throw new RequiredError("ContactsTeamApiApi", "getTeamBranch", "xSpaceId");
        }


        // Path Params
        const localVarPath = '/org/team/branch';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Header Params
        requestContext.setHeaderParam("X-Space-Id", ObjectSerializer.serialize(xSpaceId, "string", ""));


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Query the team\'s members, no include sub team\'s
     * Query the team\'s members
     * @param teamId team id
     * @param xSpaceId space id
     */
    public async getTeamMembers(teamId: string, xSpaceId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'teamId' is not null or undefined
        if (teamId === null || teamId === undefined) {
            throw new RequiredError("ContactsTeamApiApi", "getTeamMembers", "teamId");
        }


        // verify required parameter 'xSpaceId' is not null or undefined
        if (xSpaceId === null || xSpaceId === undefined) {
            throw new RequiredError("ContactsTeamApiApi", "getTeamMembers", "xSpaceId");
        }


        // Path Params
        const localVarPath = '/org/team/members';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (teamId !== undefined) {
            requestContext.setQueryParam("teamId", ObjectSerializer.serialize(teamId, "string", ""));
        }

        // Header Params
        requestContext.setHeaderParam("X-Space-Id", ObjectSerializer.serialize(xSpaceId, "string", ""));


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Query team tree
     * @param xSpaceId space id
     * @param depth tree depth(default:1,max:2)
     */
    public async getTeamTree(xSpaceId: string, depth?: number, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'xSpaceId' is not null or undefined
        if (xSpaceId === null || xSpaceId === undefined) {
            throw new RequiredError("ContactsTeamApiApi", "getTeamTree", "xSpaceId");
        }



        // Path Params
        const localVarPath = '/org/team/tree';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (depth !== undefined) {
            requestContext.setQueryParam("depth", ObjectSerializer.serialize(depth, "number", ""));
        }

        // Header Params
        requestContext.setHeaderParam("X-Space-Id", ObjectSerializer.serialize(xSpaceId, "string", ""));


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Query department information. if team id lack, default root team
     * Query team information
     * @param xSpaceId space id
     * @param teamId team id
     */
    public async readTeamInfo(xSpaceId: string, teamId?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'xSpaceId' is not null or undefined
        if (xSpaceId === null || xSpaceId === undefined) {
            throw new RequiredError("ContactsTeamApiApi", "readTeamInfo", "xSpaceId");
        }



        // Path Params
        const localVarPath = '/org/team/read';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (teamId !== undefined) {
            requestContext.setQueryParam("teamId", ObjectSerializer.serialize(teamId, "string", ""));
        }

        // Header Params
        requestContext.setHeaderParam("X-Space-Id", ObjectSerializer.serialize(xSpaceId, "string", ""));


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Update team info. If modify team level,default sort in the end of parent team.
     * Update team info
     * @param updateTeamRo 
     * @param xSpaceId space id
     */
    public async updateTeam(updateTeamRo: UpdateTeamRo, xSpaceId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'updateTeamRo' is not null or undefined
        if (updateTeamRo === null || updateTeamRo === undefined) {
            throw new RequiredError("ContactsTeamApiApi", "updateTeam", "updateTeamRo");
        }


        // verify required parameter 'xSpaceId' is not null or undefined
        if (xSpaceId === null || xSpaceId === undefined) {
            throw new RequiredError("ContactsTeamApiApi", "updateTeam", "xSpaceId");
        }


        // Path Params
        const localVarPath = '/org/team/update';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Header Params
        requestContext.setHeaderParam("X-Space-Id", ObjectSerializer.serialize(xSpaceId, "string", ""));


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(updateTeamRo, "UpdateTeamRo", ""),
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

export class ContactsTeamApiApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to createTeam
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async createTeamWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
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
     * @params response Response returned by the server for a request to deleteTeam
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async deleteTeamWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
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
     * @params response Response returned by the server for a request to getSubTeams
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getSubTeamsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataListTeamTreeVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataListTeamTreeVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataListTeamTreeVo", ""
            ) as ResponseDataListTeamTreeVo;
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
            const body: ResponseDataListTeamTreeVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataListTeamTreeVo", ""
            ) as ResponseDataListTeamTreeVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getTeamBranch
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getTeamBranchWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataListTeamTreeVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataListTeamTreeVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataListTeamTreeVo", ""
            ) as ResponseDataListTeamTreeVo;
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
            const body: ResponseDataListTeamTreeVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataListTeamTreeVo", ""
            ) as ResponseDataListTeamTreeVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getTeamMembers
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getTeamMembersWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataListMemberPageVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataListMemberPageVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataListMemberPageVo", ""
            ) as ResponseDataListMemberPageVo;
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
            const body: ResponseDataListMemberPageVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataListMemberPageVo", ""
            ) as ResponseDataListMemberPageVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getTeamTree
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getTeamTreeWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataListTeamTreeVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataListTeamTreeVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataListTeamTreeVo", ""
            ) as ResponseDataListTeamTreeVo;
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
            const body: ResponseDataListTeamTreeVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataListTeamTreeVo", ""
            ) as ResponseDataListTeamTreeVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to readTeamInfo
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async readTeamInfoWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataTeamInfoVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataTeamInfoVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataTeamInfoVo", ""
            ) as ResponseDataTeamInfoVo;
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
            const body: ResponseDataTeamInfoVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataTeamInfoVo", ""
            ) as ResponseDataTeamInfoVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to updateTeam
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async updateTeamWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
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
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

}
