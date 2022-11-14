package com.vikadata.api.modular.idaas.service;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import javax.annotation.Resource;

import cn.hutool.core.io.IoUtil;
import cn.hutool.json.JSONUtil;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.FileHelper;
import com.vikadata.api.enterprise.idaas.model.IdaasAppBindRo;
import com.vikadata.api.enterprise.idaas.model.IdaasAppBindVo;
import com.vikadata.api.enterprise.idaas.model.IdaasTenantCreateRo;
import com.vikadata.api.enterprise.idaas.model.IdaasTenantCreateRo.ServiceAccount;
import com.vikadata.api.enterprise.idaas.model.IdaasTenantCreateVo;
import com.vikadata.api.enterprise.idaas.service.IIdaasAppBindService;
import com.vikadata.api.enterprise.idaas.service.IIdaasContactService;
import com.vikadata.api.enterprise.idaas.service.IIdaasTenantService;

/**
 * <p>
 * IDaaS Tenant and application related tests
 * </p>
 */
class IdaasServiceTests extends AbstractIntegrationTest {

    private static final String TEST_TENANT_NAME = "junit-test-20220620";

    private static final String TEST_SPACE_ID = "spcqk4UBqLRP1";

    private static ServiceAccount systemServiceAccount;

    @Resource
    private IIdaasAppBindService idaasAppBindService;

    @Resource
    private IIdaasContactService idaasContactService;

    @Resource
    private IIdaasTenantService idaasTenantService;

    @BeforeAll
    static void init() {
        InputStream inputStream = FileHelper.getInputStreamFromResource("idaas/system_service_account.json");
        String jsonString = IoUtil.read(inputStream, StandardCharsets.UTF_8);
        systemServiceAccount = JSONUtil.toBean(jsonString, ServiceAccount.class);
    }

    /**
     * Test the process of creating tenants, binding applications, and synchronizing address books
     *
     * <p>
     * Each of the current processes depends on the data in the previous step, so they are put into the same test
     * </p>
     */
    @Test
    void tenantAppContactTest() {
        // 1 Create Tenant
        IdaasTenantCreateRo idaasTenantCreateRo = new IdaasTenantCreateRo();
        idaasTenantCreateRo.setTenantName(TEST_TENANT_NAME);
        idaasTenantCreateRo.setCorpName("junit test tenant");
        idaasTenantCreateRo.setAdminUsername("junit-test");
        idaasTenantCreateRo.setAdminPassword("123456");
        idaasTenantCreateRo.setServiceAccount(systemServiceAccount);
        IdaasTenantCreateVo idaasTenantCreateVo = idaasTenantService.createTenant(idaasTenantCreateRo);
        Assertions.assertNotNull(idaasTenantCreateVo);
        // 2 Bind application to space station
        IdaasAppBindRo idaasAppBindRo = new IdaasAppBindRo();
        idaasAppBindRo.setTenantName(TEST_TENANT_NAME);
        idaasAppBindRo.setAppClientId("ai-96154ae6a70741b0bc4e9cbc59745b37");
        idaasAppBindRo.setAppClientSecret("7nVSfISobnLOIU2qVVBTJj9U");
        idaasAppBindRo.setAppWellKnown("https://junit-test-20220620-idp.cig.tencentcs.com/sso/tn-f774a958f7bf48a9b9a73774d5b53e9b/ai-96154ae6a70741b0bc4e9cbc59745b37/oidc/.well-known/openid-configuration");
        idaasAppBindRo.setSpaceId(TEST_SPACE_ID);
        IdaasAppBindVo idaasAppBindVo = idaasAppBindService.bindTenantApp(idaasAppBindRo);
        Assertions.assertNotNull(idaasAppBindVo);
        // 3 Synchronize contacts
        idaasContactService.syncContact(TEST_SPACE_ID, null);
        Assertions.assertTrue(true);
    }

}
