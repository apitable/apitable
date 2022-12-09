package com.vikadata.api.space.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.space.mapper.SpaceRoleMapper;
import com.vikadata.api.space.vo.SpaceRoleVo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

@Disabled
public class SpaceRoleMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    SpaceRoleMapper spaceRoleMapper;

    @Test
    @Sql({ "/testdata/space-member-role-rel-data.sql", "/testdata/space-role-resource-data.sql",
            "/testdata/space-resource-data.sql", "/testdata/space-resource-group-data.sql",
            "/testdata/unit-member-data.sql"})
    void testSelectSpaceRolePage() {
        IPage<SpaceRoleVo> page = spaceRoleMapper.selectSpaceRolePage(new Page<>(), "spa41");
        assertThat(page.getTotal()).isEqualTo(1);
    }

    @Test
    @Sql({ "/testdata/space-member-role-rel-data.sql", "/testdata/space-role-resource-rel-data.sql" })
    void testSelectResourceCodesById() {
        List<String> roles = spaceRoleMapper.selectResourceCodesById(41L);
        assertThat(roles).isNotEmpty();
    }

}
