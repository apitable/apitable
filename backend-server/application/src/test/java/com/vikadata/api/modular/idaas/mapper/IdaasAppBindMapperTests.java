package com.vikadata.api.modular.idaas.mapper;

import javax.annotation.Resource;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.enterprise.idaas.mapper.IdaasAppBindMapper;
import com.vikadata.entity.IdaasAppBindEntity;

import org.springframework.test.context.jdbc.Sql;

/**
 * <p>
 * IDaaS Bind application test
 * </p>
 */
class IdaasAppBindMapperTests extends AbstractMyBatisMapperTest {

    @Resource
    private IdaasAppBindMapper idaasAppBindMapper;

    @Test
    @Sql("/testdata/idaas-app-bind-data.sql")
    void selectBySpaceIdtest() {
        IdaasAppBindEntity entity = idaasAppBindMapper.selectBySpaceId("spc6jJS5lX9UJ");

        Assertions.assertNotNull(entity);
        Assertions.assertEquals("spc6jJS5lX9UJ", entity.getSpaceId());
    }

}
