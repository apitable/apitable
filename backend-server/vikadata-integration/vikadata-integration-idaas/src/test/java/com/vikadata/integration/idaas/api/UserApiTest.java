package com.vikadata.integration.idaas.api;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Collections;

import cn.hutool.core.io.IoUtil;
import cn.hutool.json.JSONUtil;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import com.vikadata.integration.idaas.IdaasApiException;
import com.vikadata.integration.idaas.IdaasConfig;
import com.vikadata.integration.idaas.IdaasTemplate;
import com.vikadata.integration.idaas.model.UsersRequest;
import com.vikadata.integration.idaas.model.UsersResponse;
import com.vikadata.integration.idaas.support.ServiceAccount;

/**
 * <p>
 * 玉符 IDaaS 用户 API 测试
 * </p>
 * @author 刘斌华
 * @date 2022-06-08 14:40:44
 */
class UserApiTest {

    private static final String TEST_TENANT_NAME = "test-20220606";

    private static UserApi userApi;

    private static ServiceAccount tenantServiceAccount;

    @BeforeAll
    static void init() {
        IdaasConfig idaasConfig = new IdaasConfig();
        idaasConfig.setSystemHost("https://demo-admin.cig.tencentcs.com");
        idaasConfig.setContactHost("https://{tenantName}-admin.cig.tencentcs.com");
        IdaasTemplate idaasTemplate = new IdaasTemplate(idaasConfig);
        userApi = idaasTemplate.getUserApi();
        InputStream inputStream = FileHelper.getInputStreamFromResource("tenant_service_account.json");
        String jsonString = IoUtil.read(inputStream, StandardCharsets.UTF_8);
        tenantServiceAccount = JSONUtil.toBean(jsonString, ServiceAccount.class);
    }

    @Test
    void usersTest() throws IdaasApiException {
        UsersRequest usersRequest = new UsersRequest();
        usersRequest.setStatus("ACTIVE");
        usersRequest.setEndTime(Instant.now().toEpochMilli());
        usersRequest.setPageIndex(0);
        usersRequest.setPageSize(500);
        usersRequest.setOrderBy(Collections.singletonList("_createdOn"));
        UsersResponse usersResponse = userApi.users(usersRequest, tenantServiceAccount, TEST_TENANT_NAME);
        System.out.println(JSONUtil.toJsonStr(usersResponse));

        Assertions.assertNotNull(usersResponse);
    }

}
