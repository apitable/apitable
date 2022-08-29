package com.vikadata.api.modular.idaas.mapper;

import javax.annotation.Resource;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.entity.IdaasAppEntity;

import org.springframework.test.context.jdbc.Sql;

/**
 * <p>
 * 玉符 IDaaS 应用测试
 * </p>
 * @author 刘斌华
 * @date 2022-06-22 18:50:55
 */
class IdaasAppMapperTests extends AbstractMyBatisMapperTest {

    @Resource
    private IdaasAppMapper idaasAppMapper;

    @Test
    @Sql("/testdata/idaas-app-data.sql")
    void selectByClientIdTest() {
        IdaasAppEntity entity = idaasAppMapper.selectByClientId("ai-cf92ca1c0ac24777a0a13ddc0f49a724");

        Assertions.assertNotNull(entity);
        Assertions.assertEquals("ai-cf92ca1c0ac24777a0a13ddc0f49a724", entity.getClientId());
    }

}
