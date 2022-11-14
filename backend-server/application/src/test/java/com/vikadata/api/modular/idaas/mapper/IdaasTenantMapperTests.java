package com.vikadata.api.modular.idaas.mapper;

import javax.annotation.Resource;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.enterprise.idaas.mapper.IdaasTenantMapper;
import com.vikadata.entity.IdaasTenantEntity;

import org.springframework.test.context.jdbc.Sql;

/**
 * <p>
 * IDaaS Tenant Test
 * </p>
 */
class IdaasTenantMapperTests extends AbstractMyBatisMapperTest {

    @Resource
    private IdaasTenantMapper idaasTenantMapper;

    @Test
    @Sql("/testdata/idaas-tenant-data.sql")
    void selectByTenantNameTest() {
        IdaasTenantEntity entity = idaasTenantMapper.selectByTenantName("test-20220617");

        Assertions.assertNotNull(entity);
        Assertions.assertEquals("test-20220617", entity.getTenantName());
    }

}
