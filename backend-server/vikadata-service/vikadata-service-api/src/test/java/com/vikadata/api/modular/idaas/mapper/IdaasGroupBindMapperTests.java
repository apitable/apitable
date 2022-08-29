package com.vikadata.api.modular.idaas.mapper;

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
 * 玉符 IDaaS 绑定用户组测试
 * </p>
 * @author 刘斌华
 * @date 2022-06-22 19:07:56
 */
class IdaasGroupBindMapperTests extends AbstractMyBatisMapperTest {

    @Resource
    private IdaasGroupBindMapper idaasGroupBindMapper;

    @Test
    @Sql("/testdata/idaas-group-bind-data.sql")
    void selectAllBySpaceIdTest() {
        List<IdaasGroupBindEntity> entities = idaasGroupBindMapper.selectAllBySpaceId("spc6jJS5lX9UJ");

        Assertions.assertTrue(CollUtil.isNotEmpty(entities));
    }

    @Test
    @Sql("/testdata/idaas-group-bind-data.sql")
    void selectAllBySpaceIdIgnoreDeletedTest() {
        List<IdaasGroupBindEntity> entities = idaasGroupBindMapper.selectAllBySpaceIdIgnoreDeleted("spc6jJS5lX9UJ");

        Assertions.assertTrue(CollUtil.isNotEmpty(entities));
    }

}
