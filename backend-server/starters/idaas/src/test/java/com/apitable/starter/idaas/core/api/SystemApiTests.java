package com.apitable.starter.idaas.core.api;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import cn.hutool.core.io.IoUtil;
import cn.hutool.json.JSONUtil;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.apitable.starter.idaas.core.IdaasApiException;
import com.apitable.starter.idaas.core.IdaasConfig;
import com.apitable.starter.idaas.core.IdaasTemplate;
import com.apitable.starter.idaas.core.model.TenantRequest;
import com.apitable.starter.idaas.core.model.TenantResponse;
import com.apitable.starter.idaas.core.model.WellKnowResponse;
import com.apitable.starter.idaas.core.support.ServiceAccount;

/**
 * <p>
 * IDaaS system config API test
 * </p>
 *
 */
class SystemApiTests {

    private static final String TEST_TENANT_NAME = "junit-test-20220606";

    private static SystemApi systemApi;

    private static ServiceAccount systemServiceAccount;

    @BeforeAll
    static void init() {
        IdaasConfig idaasConfig = new IdaasConfig();
        idaasConfig.setSystemHost("https://demo-admin.cig.tencentcs.com");
        idaasConfig.setContactHost("https://{tenantName}-admin.cig.tencentcs.com");
        IdaasTemplate idaasTemplate = new IdaasTemplate(idaasConfig);
        systemApi = idaasTemplate.getSystemApi();
        InputStream inputStream = FileHelper.getInputStreamFromResource("system_service_account.json");
        String jsonString = IoUtil.read(inputStream, StandardCharsets.UTF_8);
        systemServiceAccount = JSONUtil.toBean(jsonString, ServiceAccount.class);
    }

    @Test
    void tenantTests() throws IdaasApiException {
        TenantRequest tenantRequest = new TenantRequest();
        tenantRequest.setName(TEST_TENANT_NAME);
        tenantRequest.setDisplayName("junit test user");
        TenantRequest.Admin tenantAdmin = new TenantRequest.Admin();
        tenantAdmin.setUsername("junit-test");
        tenantAdmin.setPassword("123456");
        tenantRequest.setAdmin(tenantAdmin);
        TenantResponse tenantResponse = systemApi.tenant(tenantRequest, systemServiceAccount);
        System.out.println(JSONUtil.toJsonStr(tenantResponse));

        Assertions.assertNotNull(tenantResponse);
    }

    @Test
    @Disabled("Each execution will create a new tenant ServiceAccount, disable")
    void serviceAccountTest() throws IdaasApiException {
        ServiceAccount tenantServiceAccount = systemApi.serviceAccount(TEST_TENANT_NAME, systemServiceAccount);
        System.out.println(JSONUtil.toJsonStr(tenantServiceAccount));

        Assertions.assertNotNull(tenantServiceAccount);
    }

    @Test
    void fetchWellKnownTest() throws IdaasApiException {
        WellKnowResponse wellKnowResponse = systemApi.fetchWellKnown("https://junit-test-20220606-idp.cig.tencentcs.com/sso/tn-5ca4c595009a48b0bc90ff7cb14b6953/ai-4f094c3982594df4a65519db8aba8c43/oidc/.well-known/openid-configuration");
        System.out.println(JSONUtil.toJsonStr(wellKnowResponse));

        Assertions.assertNotNull(wellKnowResponse);
    }

}
