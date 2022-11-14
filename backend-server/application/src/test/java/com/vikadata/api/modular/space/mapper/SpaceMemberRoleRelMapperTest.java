package com.vikadata.api.modular.space.mapper;

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.space.mapper.SpaceMemberRoleRelMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

@Disabled
public class SpaceMemberRoleRelMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    SpaceMemberRoleRelMapper spaceMemberRoleRelMapper;

    @Test
    @Sql({ "/testdata/space-member-role-rel-data.sql", "/testdata/space-role-resource-rel-data.sql" })
    void testSelectSubAdminBySpaceId() {
        List<Long> ids = spaceMemberRoleRelMapper.selectSubAdminBySpaceId("spc41");
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql({ "/testdata/space-member-role-rel-data.sql" })
    void testSelectRoleCodesBySpaceId() {
        List<String> entities = spaceMemberRoleRelMapper.selectRoleCodesBySpaceId("spc41");
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql({ "/testdata/space-member-role-rel-data.sql" })
    void testSelectCountBySpaceIdAndMemberId() {
        Integer count = spaceMemberRoleRelMapper.selectCountBySpaceIdAndMemberId("spc41", 41L);
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql({ "/testdata/space-member-role-rel-data.sql" })
    void testSelectCountBySpaceIdAndMemberIds() {
        Integer count = spaceMemberRoleRelMapper.selectCountBySpaceIdAndMemberIds("spc41", CollUtil.newArrayList(41L));
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql({ "/testdata/space-member-role-rel-data.sql" })
    void testSelectRoleCodeByMemberId() {
        String role = spaceMemberRoleRelMapper.selectRoleCodeByMemberId("spc41", 41L);
        assertThat(role).isEqualTo("ROLE_SPCWYNIGV7BQF_95D9F5");
    }

    @Test
    @Sql({ "/testdata/space-member-role-rel-data.sql" })
    void testSelectRoleCodesBySpaceIdAndRoleCodes() {
        List<String> roles = spaceMemberRoleRelMapper.selectRoleCodesBySpaceIdAndRoleCodes("spc41", CollUtil.newArrayList("ROLE_SPCWYNIGV7BQF_95D9F5"));
        assertThat(roles).isNotEmpty();
    }

    @Test
    @Sql({ "/testdata/space-member-role-rel-data.sql" })
    void testSelectMemberIdBySpaceIdAndRoleCodes() {
        List<Long> ids = spaceMemberRoleRelMapper.selectMemberIdBySpaceIdAndRoleCodes("spc41", CollUtil.newArrayList("ROLE_SPCWYNIGV7BQF_95D9F5"));
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql({ "/testdata/space-member-role-rel-data.sql" })
    void testSelectRoleCodeByMemberIds() {
        List<String> roles = spaceMemberRoleRelMapper.selectRoleCodeByMemberIds("spc41", CollUtil.newArrayList(41L));
        assertThat(roles).isNotEmpty();
    }
}
