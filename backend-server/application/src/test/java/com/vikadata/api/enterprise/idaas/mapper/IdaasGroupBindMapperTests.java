package com.vikadata.api.enterprise.idaas.mapper;

import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.entity.IdaasGroupBindEntity;

import org.springframework.test.context.jdbc.Sql;

/**
 * <p>
 * IDaaS Bind User Group Test
 * </p>
 */
class IdaasGroupBindMapperTests extends AbstractMyBatisMapperTest {

    @Resource
    private IdaasGroupBindMapper idaasGroupBindMapper;

    @Test
    @Sql("/enterprise/sql/idaas-group-bind-data.sql")
    void selectAllBySpaceIdTest() {
        List<IdaasGroupBindEntity> entities = idaasGroupBindMapper.selectAllBySpaceId("spc6jJS5lX9UJ");

        Assertions.assertTrue(CollUtil.isNotEmpty(entities));
    }

    @Test
    @Sql("/enterprise/sql/idaas-group-bind-data.sql")
    void selectAllBySpaceIdIgnoreDeletedTest() {
        List<IdaasGroupBindEntity> entities = idaasGroupBindMapper.selectAllBySpaceIdIgnoreDeleted("spc6jJS5lX9UJ");

        Assertions.assertTrue(CollUtil.isNotEmpty(entities));
    }

}
