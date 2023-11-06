// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { DingTalkAgentBindSpaceDTO } from '../models/DingTalkAgentBindSpaceDTO';
import { DingTalkDaTemplateCreateRo } from '../models/DingTalkDaTemplateCreateRo';
import { DingTalkDaTemplateDeleteRo } from '../models/DingTalkDaTemplateDeleteRo';
import { DingTalkDaTemplateUpdateRo } from '../models/DingTalkDaTemplateUpdateRo';
import { DingTalkDdConfigRo } from '../models/DingTalkDdConfigRo';
import { DingTalkInternalSkuPageRo } from '../models/DingTalkInternalSkuPageRo';
import { DingTalkIsvAminUserLoginRo } from '../models/DingTalkIsvAminUserLoginRo';
import { DingTalkIsvUserLoginRo } from '../models/DingTalkIsvUserLoginRo';
import { DingTalkTenantMainAdminChangeRo } from '../models/DingTalkTenantMainAdminChangeRo';
import { DingTalkUserLoginRo } from '../models/DingTalkUserLoginRo';
import { ResponseDataDingTalkBindSpaceVo } from '../models/ResponseDataDingTalkBindSpaceVo';
import { ResponseDataDingTalkDdConfigVo } from '../models/ResponseDataDingTalkDdConfigVo';
import { ResponseDataDingTalkIsvAdminUserLoginVo } from '../models/ResponseDataDingTalkIsvAdminUserLoginVo';
import { ResponseDataDingTalkIsvUserLoginVo } from '../models/ResponseDataDingTalkIsvUserLoginVo';
import { ResponseDataDingTalkUserLoginVo } from '../models/ResponseDataDingTalkUserLoginVo';
import { ResponseDataString } from '../models/ResponseDataString';
import { ResponseDataTenantDetailVO } from '../models/ResponseDataTenantDetailVO';
import { ResponseDataVoid } from '../models/ResponseDataVoid';

/**
 * no description
 */
export class ThirdPartyPlatformIntegrationInterfaceDingTalkApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * DingTalk application bind space
     * DingTalk The application enterprise binds the space
     * @param dingTalkAgentBindSpaceDTO 
     * @param agentId 
     */
    public async bindSpace1(dingTalkAgentBindSpaceDTO: DingTalkAgentBindSpaceDTO, agentId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'dingTalkAgentBindSpaceDTO' is not null or undefined
        if (dingTalkAgentBindSpaceDTO === null || dingTalkAgentBindSpaceDTO === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceDingTalkApi", "bindSpace1", "dingTalkAgentBindSpaceDTO");
        }


        // verify required parameter 'agentId' is not null or undefined
        if (agentId === null || agentId === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceDingTalkApi", "bindSpace1", "agentId");
        }


        // Path Params
        const localVarPath = '/social/dingtalk/agent/{agentId}/bindSpace'
            .replace('{' + 'agentId' + '}', encodeURIComponent(String(agentId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(dingTalkAgentBindSpaceDTO, "DingTalkAgentBindSpaceDTO", ""),
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
     * Get the space station ID of the application binding, and jump to the login page when success=false
     * Get the space station ID bound by the application
     * @param agentId 
     */
    public async bindSpaceInfo1(agentId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'agentId' is not null or undefined
        if (agentId === null || agentId === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceDingTalkApi", "bindSpaceInfo1", "agentId");
        }


        // Path Params
        const localVarPath = '/social/dingtalk/agent/{agentId}/bindSpace'
            .replace('{' + 'agentId' + '}', encodeURIComponent(String(agentId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Replace the master administrator
     * Tenant space replacement master administrator
     * @param dingTalkTenantMainAdminChangeRo 
     * @param suiteId kit ID
     */
    public async changeAdmin1(dingTalkTenantMainAdminChangeRo: DingTalkTenantMainAdminChangeRo, suiteId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'dingTalkTenantMainAdminChangeRo' is not null or undefined
        if (dingTalkTenantMainAdminChangeRo === null || dingTalkTenantMainAdminChangeRo === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceDingTalkApi", "changeAdmin1", "dingTalkTenantMainAdminChangeRo");
        }


        // verify required parameter 'suiteId' is not null or undefined
        if (suiteId === null || suiteId === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceDingTalkApi", "changeAdmin1", "suiteId");
        }


        // Path Params
        const localVarPath = '/social/dingtalk/suite/{suiteId}/changeAdmin';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (suiteId !== undefined) {
            requestContext.setQueryParam("suiteId", ObjectSerializer.serialize(suiteId, "string", ""));
        }


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(dingTalkTenantMainAdminChangeRo, "DingTalkTenantMainAdminChangeRo", ""),
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
     * DingTalk Callback interface--Template Creation
     * DingTalk Callback interface--Template Creation
     * @param dingTalkDaTemplateCreateRo 
     * @param dingTalkDaAppId 
     */
    public async dingTalkDaTemplateCreate(dingTalkDaTemplateCreateRo: DingTalkDaTemplateCreateRo, dingTalkDaAppId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'dingTalkDaTemplateCreateRo' is not null or undefined
        if (dingTalkDaTemplateCreateRo === null || dingTalkDaTemplateCreateRo === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceDingTalkApi", "dingTalkDaTemplateCreate", "dingTalkDaTemplateCreateRo");
        }


        // verify required parameter 'dingTalkDaAppId' is not null or undefined
        if (dingTalkDaAppId === null || dingTalkDaAppId === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceDingTalkApi", "dingTalkDaTemplateCreate", "dingTalkDaAppId");
        }


        // Path Params
        const localVarPath = '/social/dingtalk/template/{dingTalkDaAppId}/create'
            .replace('{' + 'dingTalkDaAppId' + '}', encodeURIComponent(String(dingTalkDaAppId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(dingTalkDaTemplateCreateRo, "DingTalkDaTemplateCreateRo", ""),
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
     * DingTalk Callback interface--Template application deletion
     * DingTalk Callback interface--Template application deletion
     * @param dingTalkDaTemplateDeleteRo 
     * @param dingTalkDaAppId 
     */
    public async dingTalkDaTemplateDelete(dingTalkDaTemplateDeleteRo: DingTalkDaTemplateDeleteRo, dingTalkDaAppId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'dingTalkDaTemplateDeleteRo' is not null or undefined
        if (dingTalkDaTemplateDeleteRo === null || dingTalkDaTemplateDeleteRo === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceDingTalkApi", "dingTalkDaTemplateDelete", "dingTalkDaTemplateDeleteRo");
        }


        // verify required parameter 'dingTalkDaAppId' is not null or undefined
        if (dingTalkDaAppId === null || dingTalkDaAppId === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceDingTalkApi", "dingTalkDaTemplateDelete", "dingTalkDaAppId");
        }


        // Path Params
        const localVarPath = '/social/dingtalk/template/{dingTalkDaAppId}/delete'
            .replace('{' + 'dingTalkDaAppId' + '}', encodeURIComponent(String(dingTalkDaAppId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(dingTalkDaTemplateDeleteRo, "DingTalkDaTemplateDeleteRo", ""),
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
     * DingTalk Callback interface--Template application modification
     * DingTalk Callback interface--Template application modification
     * @param dingTalkDaTemplateUpdateRo 
     * @param dingTalkDaAppId 
     */
    public async dingTalkDaTemplateUpdate(dingTalkDaTemplateUpdateRo: DingTalkDaTemplateUpdateRo, dingTalkDaAppId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'dingTalkDaTemplateUpdateRo' is not null or undefined
        if (dingTalkDaTemplateUpdateRo === null || dingTalkDaTemplateUpdateRo === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceDingTalkApi", "dingTalkDaTemplateUpdate", "dingTalkDaTemplateUpdateRo");
        }


        // verify required parameter 'dingTalkDaAppId' is not null or undefined
        if (dingTalkDaAppId === null || dingTalkDaAppId === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceDingTalkApi", "dingTalkDaTemplateUpdate", "dingTalkDaAppId");
        }


        // Path Params
        const localVarPath = '/social/dingtalk/template/{dingTalkDaAppId}/update'
            .replace('{' + 'dingTalkDaAppId' + '}', encodeURIComponent(String(dingTalkDaAppId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(dingTalkDaTemplateUpdateRo, "DingTalkDaTemplateUpdateRo", ""),
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
     * Use DingTalk login user identity to authorize login. If no user is bound, return parameters to guide registration
     * DingTalk Application user login
     * @param dingTalkUserLoginRo 
     * @param agentId 
     */
    public async dingTalkUserLogin(dingTalkUserLoginRo: DingTalkUserLoginRo, agentId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'dingTalkUserLoginRo' is not null or undefined
        if (dingTalkUserLoginRo === null || dingTalkUserLoginRo === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceDingTalkApi", "dingTalkUserLogin", "dingTalkUserLoginRo");
        }


        // verify required parameter 'agentId' is not null or undefined
        if (agentId === null || agentId === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceDingTalkApi", "dingTalkUserLogin", "agentId");
        }


        // Path Params
        const localVarPath = '/social/dingtalk/agent/{agentId}/user/login'
            .replace('{' + 'agentId' + '}', encodeURIComponent(String(agentId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(dingTalkUserLoginRo, "DingTalkUserLoginRo", ""),
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
     * Get the dd.config parameter
     * Get the dd.config parameter
     * @param dingTalkDdConfigRo 
     */
    public async getDdConfigParam(dingTalkDdConfigRo: DingTalkDdConfigRo, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'dingTalkDdConfigRo' is not null or undefined
        if (dingTalkDdConfigRo === null || dingTalkDdConfigRo === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceDingTalkApi", "getDdConfigParam", "dingTalkDdConfigRo");
        }


        // Path Params
        const localVarPath = '/social/dingtalk/ddconfig';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(dingTalkDdConfigRo, "DingTalkDdConfigRo", ""),
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
     * Get the SKU page address of domestic products
     * Get the SKU page address of domestic products
     * @param dingTalkInternalSkuPageRo 
     */
    public async getSkuPage(dingTalkInternalSkuPageRo: DingTalkInternalSkuPageRo, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'dingTalkInternalSkuPageRo' is not null or undefined
        if (dingTalkInternalSkuPageRo === null || dingTalkInternalSkuPageRo === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceDingTalkApi", "getSkuPage", "dingTalkInternalSkuPageRo");
        }


        // Path Params
        const localVarPath = '/social/dingtalk/skuPage';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(dingTalkInternalSkuPageRo, "DingTalkInternalSkuPageRo", ""),
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
     * Get the space information bound by the tenant
     * Get tenant binding information
     * @param suiteId kit ID
     * @param corpId current organization ID
     */
    public async getTenantInfo2(suiteId: string, corpId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'suiteId' is not null or undefined
        if (suiteId === null || suiteId === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceDingTalkApi", "getTenantInfo2", "suiteId");
        }


        // verify required parameter 'corpId' is not null or undefined
        if (corpId === null || corpId === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceDingTalkApi", "getTenantInfo2", "corpId");
        }


        // Path Params
        const localVarPath = '/social/dingtalk/suite/{suiteId}/detail'
            .replace('{' + 'suiteId' + '}', encodeURIComponent(String(suiteId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (corpId !== undefined) {
            requestContext.setQueryParam("corpId", ObjectSerializer.serialize(corpId, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * DingTalk workbench entry, administrator login
     * ISV third-party DingTalk application background administrator login
     * @param dingTalkIsvAminUserLoginRo 
     * @param suiteId kit ID
     */
    public async isvAminUserLogin(dingTalkIsvAminUserLoginRo: DingTalkIsvAminUserLoginRo, suiteId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'dingTalkIsvAminUserLoginRo' is not null or undefined
        if (dingTalkIsvAminUserLoginRo === null || dingTalkIsvAminUserLoginRo === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceDingTalkApi", "isvAminUserLogin", "dingTalkIsvAminUserLoginRo");
        }


        // verify required parameter 'suiteId' is not null or undefined
        if (suiteId === null || suiteId === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceDingTalkApi", "isvAminUserLogin", "suiteId");
        }


        // Path Params
        const localVarPath = '/social/dingtalk/suite/{suiteId}/admin/login';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (suiteId !== undefined) {
            requestContext.setQueryParam("suiteId", ObjectSerializer.serialize(suiteId, "string", ""));
        }


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(dingTalkIsvAminUserLoginRo, "DingTalkIsvAminUserLoginRo", ""),
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
     * Get the space station ID of the application binding, and jump to the login page when success=false
     * ISV Third party application obtains the space ID bound by the application
     * @param suiteId kit ID
     * @param corpId Current Organization ID
     */
    public async isvBindSpaceInfo(suiteId: string, corpId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'suiteId' is not null or undefined
        if (suiteId === null || suiteId === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceDingTalkApi", "isvBindSpaceInfo", "suiteId");
        }


        // verify required parameter 'corpId' is not null or undefined
        if (corpId === null || corpId === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceDingTalkApi", "isvBindSpaceInfo", "corpId");
        }


        // Path Params
        const localVarPath = '/social/dingtalk/suite/{suiteId}/bindSpace'
            .replace('{' + 'suiteId' + '}', encodeURIComponent(String(suiteId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (corpId !== undefined) {
            requestContext.setQueryParam("corpId", ObjectSerializer.serialize(corpId, "string", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Use the third-party DingTalk login user identity to authorize login. If no user is bound, return the parameter to guide the registration
     * ISV Third party Ding Talk application user login
     * @param dingTalkIsvUserLoginRo 
     * @param suiteId kit ID
     */
    public async isvUserLogin(dingTalkIsvUserLoginRo: DingTalkIsvUserLoginRo, suiteId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'dingTalkIsvUserLoginRo' is not null or undefined
        if (dingTalkIsvUserLoginRo === null || dingTalkIsvUserLoginRo === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceDingTalkApi", "isvUserLogin", "dingTalkIsvUserLoginRo");
        }


        // verify required parameter 'suiteId' is not null or undefined
        if (suiteId === null || suiteId === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceDingTalkApi", "isvUserLogin", "suiteId");
        }


        // Path Params
        const localVarPath = '/social/dingtalk/suite/{suiteId}/user/login'
            .replace('{' + 'suiteId' + '}', encodeURIComponent(String(suiteId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(dingTalkIsvUserLoginRo, "DingTalkIsvUserLoginRo", ""),
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
     * Refresh the address book of DingTalk application
     * Refresh the address book of DingTalk application
     * @param xSpaceId space id
     */
    public async refreshContact1(xSpaceId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'xSpaceId' is not null or undefined
        if (xSpaceId === null || xSpaceId === undefined) {
            throw new RequiredError("ThirdPartyPlatformIntegrationInterfaceDingTalkApi", "refreshContact1", "xSpaceId");
        }


        // Path Params
        const localVarPath = '/social/dingtalk/agent/refresh/contact';

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

}

export class ThirdPartyPlatformIntegrationInterfaceDingTalkApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to bindSpace1
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async bindSpace1WithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
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
     * @params response Response returned by the server for a request to bindSpaceInfo1
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async bindSpaceInfo1WithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataDingTalkBindSpaceVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataDingTalkBindSpaceVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataDingTalkBindSpaceVo", ""
            ) as ResponseDataDingTalkBindSpaceVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataDingTalkBindSpaceVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataDingTalkBindSpaceVo", ""
            ) as ResponseDataDingTalkBindSpaceVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to changeAdmin1
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async changeAdmin1WithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
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
     * @params response Response returned by the server for a request to dingTalkDaTemplateCreate
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async dingTalkDaTemplateCreateWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, undefined);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: void = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "void", ""
            ) as void;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to dingTalkDaTemplateDelete
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async dingTalkDaTemplateDeleteWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, undefined);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: void = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "void", ""
            ) as void;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to dingTalkDaTemplateUpdate
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async dingTalkDaTemplateUpdateWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, undefined);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: void = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "void", ""
            ) as void;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to dingTalkUserLogin
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async dingTalkUserLoginWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataDingTalkUserLoginVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataDingTalkUserLoginVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataDingTalkUserLoginVo", ""
            ) as ResponseDataDingTalkUserLoginVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataDingTalkUserLoginVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataDingTalkUserLoginVo", ""
            ) as ResponseDataDingTalkUserLoginVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getDdConfigParam
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getDdConfigParamWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataDingTalkDdConfigVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataDingTalkDdConfigVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataDingTalkDdConfigVo", ""
            ) as ResponseDataDingTalkDdConfigVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataDingTalkDdConfigVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataDingTalkDdConfigVo", ""
            ) as ResponseDataDingTalkDdConfigVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getSkuPage
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getSkuPageWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataString >> {
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

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getTenantInfo2
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getTenantInfo2WithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataTenantDetailVO >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataTenantDetailVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataTenantDetailVO", ""
            ) as ResponseDataTenantDetailVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataTenantDetailVO = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataTenantDetailVO", ""
            ) as ResponseDataTenantDetailVO;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to isvAminUserLogin
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async isvAminUserLoginWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataDingTalkIsvAdminUserLoginVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataDingTalkIsvAdminUserLoginVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataDingTalkIsvAdminUserLoginVo", ""
            ) as ResponseDataDingTalkIsvAdminUserLoginVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataDingTalkIsvAdminUserLoginVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataDingTalkIsvAdminUserLoginVo", ""
            ) as ResponseDataDingTalkIsvAdminUserLoginVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to isvBindSpaceInfo
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async isvBindSpaceInfoWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataDingTalkBindSpaceVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataDingTalkBindSpaceVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataDingTalkBindSpaceVo", ""
            ) as ResponseDataDingTalkBindSpaceVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataDingTalkBindSpaceVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataDingTalkBindSpaceVo", ""
            ) as ResponseDataDingTalkBindSpaceVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to isvUserLogin
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async isvUserLoginWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataDingTalkIsvUserLoginVo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataDingTalkIsvUserLoginVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataDingTalkIsvUserLoginVo", ""
            ) as ResponseDataDingTalkIsvUserLoginVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ResponseDataDingTalkIsvUserLoginVo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataDingTalkIsvUserLoginVo", ""
            ) as ResponseDataDingTalkIsvUserLoginVo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to refreshContact1
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async refreshContact1WithHttpInfo(response: ResponseContext): Promise<HttpInfo<ResponseDataVoid >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            throw new ApiException<ResponseDataVoid>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ResponseDataVoid = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ResponseDataVoid", ""
            ) as ResponseDataVoid;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
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
