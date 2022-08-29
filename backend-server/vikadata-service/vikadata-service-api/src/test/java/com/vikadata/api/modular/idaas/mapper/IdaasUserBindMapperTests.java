package com.vikadata.api.modular.idaas.mapper;

import java.util.Collections;
import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.entity.IdaasUserBindEntity;

import org.springframework.test.context.jdbc.Sql;

/**
 * <p>
 * 玉符 IDaaS 绑定用户测试
 * </p>
 * @author 刘斌华
 * @date 2022-06-22 19:19:50
 */
class IdaasUserBindMapperTests extends AbstractMyBatisMapperTest {

    @Resource
    private IdaasUserBindMapper idaasUserBindMapper;

    @Test
    @Sql("/testdata/idaas-user-bind-data.sql")
    void selectByUserIdTest() {
        IdaasUserBindEntity entity = idaasUserBindMapper.selectByUserId("us-fd0a293b0c934707ba744682418d2685");

        Assertions.assertNotNull(entity);
        Assertions.assertEquals("us-fd0a293b0c934707ba744682418d2685", entity.getUserId());
    }

    @Test
    @Sql("/testdata/idaas-user-bind-data.sql")
    void selectAllByUserIdsIgnoreDeletedTest() {
        List<IdaasUserBindEntity> entities = idaasUserBindMapper
                .selectAllByUserIdsIgnoreDeleted(Collections.singletonList("us-9bf50b5d19554ae597397ead5e9ebb27"));

        Assertions.assertTrue(CollUtil.isNotEmpty(entities));
    }

    @Test
    @Sql("/testdata/idaas-user-bind-data.sql")
    void selectAllByVikaUserIdsIgnoreDeletedTest() {
        List<IdaasUserBindEntity> entities = idaasUserBindMapper
                .selectAllByVikaUserIdsIgnoreDeleted(Collections.singletonList(1537680923105239041L));

        Assertions.assertTrue(CollUtil.isNotEmpty(entities));
    }

}
