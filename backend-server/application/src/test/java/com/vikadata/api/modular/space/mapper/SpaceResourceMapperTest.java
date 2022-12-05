package com.vikadata.api.modular.space.mapper;

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.shared.cache.bean.SpaceResourceDto;
import com.vikadata.api.space.mapper.SpaceResourceMapper;
import com.vikadata.api.space.dto.SpaceGroupResourceDto;
import com.vikadata.api.space.dto.SpaceMemberResourceDto;
import com.vikadata.api.space.dto.SpaceMenuResourceDto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

public class SpaceResourceMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    SpaceResourceMapper spaceResourceMapper;

    @Test
    @Sql({ "/testdata/space-resource-data.sql", "/testdata/space-resource-group-data.sql" })
    void testSelectAllResource() {
        List<SpaceResourceDto> entities = spaceResourceMapper.selectAllResource();
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql({ "/testdata/space-resource-data.sql", "/testdata/space-resource-group-data.sql",
            "/testdata/space-role-resource-rel-data.sql", "/testdata/space-role-data.sql",
            "/testdata/space-member-role-rel-data.sql"})
    void testSelectResourceByMemberId() {
        List<SpaceResourceDto> entities = spaceResourceMapper.selectResourceByMemberId(41L);
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/testdata/space-resource-data.sql")
    void testSelectAssignableCountInResourceCode() {
        Integer count = spaceResourceMapper.selectAssignableCountInResourceCode(CollUtil.newArrayList("MANAGE_WORKBENCH_SETTING"));
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql({ "/testdata/space-resource-data.sql", "/testdata/space-resource-group-data.sql" })
    void testSelectGroupResource() {
        List<SpaceGroupResourceDto> entities = spaceResourceMapper.selectGroupResource();
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql({ "/testdata/space-resource-data.sql", "/testdata/space-menu-resource-rel-data.sql",
            "/testdata/space-menu-data.sql"})
    void testSelectMenuResource() {
        List<SpaceMenuResourceDto> entities = spaceResourceMapper.selectMenuResource();
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/testdata/space-resource-data.sql")
    void testSelectResourceCodesByGroupCode() {
        List<String> entities = spaceResourceMapper.selectResourceCodesByGroupCode(CollUtil.newArrayList("MANAGE_SPACE"));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql({ "/testdata/space-member-role-rel-data.sql", "/testdata/space-role-resource-rel-data.sql" })
    void testSelectResourceCodesByMemberId() {
        List<String> codes = spaceResourceMapper.selectResourceCodesByMemberId(41L);
        assertThat(codes).isNotEmpty();
    }

    @Test
    @Sql({ "/testdata/space-member-role-rel-data.sql", "/testdata/space-role-resource-rel-data.sql" })
    void testSelectMemberResource() {
        List<SpaceMemberResourceDto> entities = spaceResourceMapper.selectMemberResource(CollUtil.newArrayList(41L));
        assertThat(entities).isNotEmpty();
    }

}
