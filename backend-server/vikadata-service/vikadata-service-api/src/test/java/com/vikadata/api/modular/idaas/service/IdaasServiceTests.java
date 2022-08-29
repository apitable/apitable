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
import com.vikadata.api.modular.idaas.model.IdaasAppBindRo;
import com.vikadata.api.modular.idaas.model.IdaasAppBindVo;
import com.vikadata.api.modular.idaas.model.IdaasTenantCreateRo;
import com.vikadata.api.modular.idaas.model.IdaasTenantCreateRo.ServiceAccount;
import com.vikadata.api.modular.idaas.model.IdaasTenantCreateVo;
import com.vikadata.api.modular.idaas.service.IIdaasAppBindService;
import com.vikadata.api.modular.idaas.service.IIdaasContactService;
import com.vikadata.api.modular.idaas.service.IIdaasTenantService;

/**
 * <p>
 * 玉符 IDaaS 租户和应用相关测试
 * </p>
 * @author 刘斌华
 * @date 2022-06-20 14:23:17
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
     * 创建租户、绑定应用、同步通讯录流程测试
     *
     * <p>
     * 当前流程中的每一个都依赖于上一步的数据，故放到同一个测试中
     * </p>
     *
     * @author 刘斌华
     * @date 2022-06-20 15:26:01
     */
    @Test
    void tenantAppContactTest() {
        // 1 创建租户
        IdaasTenantCreateRo idaasTenantCreateRo = new IdaasTenantCreateRo();
        idaasTenantCreateRo.setTenantName(TEST_TENANT_NAME);
        idaasTenantCreateRo.setCorpName("junit测试租户");
        idaasTenantCreateRo.setAdminUsername("junit-test");
        idaasTenantCreateRo.setAdminPassword("123456");
        idaasTenantCreateRo.setServiceAccount(systemServiceAccount);
        IdaasTenantCreateVo idaasTenantCreateVo = idaasTenantService.createTenant(idaasTenantCreateRo);
        Assertions.assertNotNull(idaasTenantCreateVo);
        // 2 绑定应用与空间站
        IdaasAppBindRo idaasAppBindRo = new IdaasAppBindRo();
        idaasAppBindRo.setTenantName(TEST_TENANT_NAME);
        idaasAppBindRo.setAppClientId("ai-96154ae6a70741b0bc4e9cbc59745b37");
        idaasAppBindRo.setAppClientSecret("7nVSfISobnLOIU2qVVBTJj9U");
        idaasAppBindRo.setAppWellKnown("https://junit-test-20220620-idp.cig.tencentcs.com/sso/tn-f774a958f7bf48a9b9a73774d5b53e9b/ai-96154ae6a70741b0bc4e9cbc59745b37/oidc/.well-known/openid-configuration");
        idaasAppBindRo.setSpaceId(TEST_SPACE_ID);
        IdaasAppBindVo idaasAppBindVo = idaasAppBindService.bindTenantApp(idaasAppBindRo);
        Assertions.assertNotNull(idaasAppBindVo);
        // 3 同步通讯录
        idaasContactService.syncContact(TEST_SPACE_ID, null);
        Assertions.assertTrue(true);
    }

}
