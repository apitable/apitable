package com.vikadata.api.enterprise.idaas.mapper;

import javax.annotation.Resource;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.entity.IdaasAppEntity;

import org.springframework.test.context.jdbc.Sql;

/**
 * <p>
 * IDaaS Application test
 * </p>
 */
class IdaasAppMapperTests extends AbstractMyBatisMapperTest {

    @Resource
    private IdaasAppMapper idaasAppMapper;

    @Test
    @Sql("/enterprise/sql/idaas-app-data.sql")
    void selectByClientIdTest() {
        IdaasAppEntity entity = idaasAppMapper.selectByClientId("ai-cf92ca1c0ac24777a0a13ddc0f49a724");

        Assertions.assertNotNull(entity);
        Assertions.assertEquals("ai-cf92ca1c0ac24777a0a13ddc0f49a724", entity.getClientId());
    }

}
