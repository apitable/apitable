package com.vikadata.api.space.mapper;

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.space.mapper.SpaceRoleResourceRelMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

public class SpaceRoleResourceRelMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    SpaceRoleResourceRelMapper spaceRoleResourceRelMapper;

    @Test
    @Sql("/sql/space-role-resource-rel-data.sql")
    void testSelectRoleCodeByResourceCodes() {
        List<String> roles = spaceRoleResourceRelMapper.selectRoleCodeByResourceCodes(CollUtil.newArrayList("MANAGE_WORKBENCH"));
        assertThat(roles).isNotEmpty();
    }

    @Test
    @Sql("/sql/space-role-resource-rel-data.sql")
    void testSelectResourceCodesByRoleCode() {
        List<String> resourceCodes = spaceRoleResourceRelMapper.selectResourceCodesByRoleCode("ROLE_SPCWYNIGV7BQF_95D9F5");
        assertThat(resourceCodes).isNotEmpty();
        assertThat(resourceCodes.size()).isEqualTo(1);
        assertThat(resourceCodes.get(0)).isEqualTo("MANAGE_WORKBENCH");
    }

}
