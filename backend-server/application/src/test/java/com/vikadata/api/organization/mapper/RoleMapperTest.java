package com.vikadata.api.organization.mapper;

import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.organization.mapper.RoleMapper;
import com.vikadata.api.organization.dto.RoleBaseInfoDto;
import com.vikadata.api.organization.dto.RoleInfoDTO;

import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

public class RoleMapperTest extends AbstractMyBatisMapperTest {

    @Resource
    RoleMapper roleMapper;

    @Test
    @Sql("/testdata/unit-role-data.sql")
    void givenRowWhenSelectCountBySpaceIdAndRoleNameThenGetOne() {
        Integer count = roleMapper.selectCountBySpaceIdAndRoleName("spc20220824", "vika boy");
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql("/testdata/unit-role-data.sql")
    void givenRowWhenSelectMaxSequenceBySpaceIdThenGetOne() {
        Integer maxSequence = roleMapper.selectMaxSequenceBySpaceId("spc20220824");
        assertThat(maxSequence).isEqualTo(1);
    }

    @Test
    @Sql("/testdata/unit-role-data.sql")
    void givenRowWhenSelectCountByIdAndSpaceIdThenGetOne() {
        Integer count = roleMapper.selectCountByIdAndSpaceId(20220824L, "spc20220824");
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql({"/testdata/unit-role-data.sql", "/testdata/unit-data.sql"})
    void givenRowWhenSelectBySpaceIdThenGetOne() {
        List<RoleInfoDTO> roles = roleMapper.selectBySpaceId("spc20220824");
        assertThat(roles.size()).isEqualTo(1);
    }

    @Test
    @Sql("/testdata/unit-role-data.sql")
    void givenRoleWhenSelectRoleNameByIdThenGetRoleName() {
        String roleName = roleMapper.selectRoleNameById(20220824L);
        assertThat(roleName).isEqualTo("vika boy");
    }

    @Test
    @Sql({"/testdata/unit-role-data.sql", "/testdata/unit-data.sql"})
    void givenWhenSelectRoleInfoDTOByIdsThen() {
        List<RoleInfoDTO> roles = roleMapper.selectRoleInfoDtoByIds(CollUtil.newArrayList(20220824L));
        assertThat(roles.size()).isEqualTo(1);
        assertThat(roles.get(0).getUnitId()).isEqualTo(20220824L);
    }

    @Test
    @Sql("/testdata/unit-role-data.sql")
    void givenWhenSelectIdsLikeRoleNameThen() {
        List<Long> ids = roleMapper.selectIdsBySpaceIdAndLikeRoleName("spc20220824", "a");
        assertThat(ids.size()).isEqualTo(1);
        assertThat(ids.get(0)).isEqualTo(20220824L);
    }

    @Test
    @Sql("/testdata/unit-role-data.sql")
    void givenWhenSelectRoleBaseInfoDtoByIdThen() {
        List<RoleBaseInfoDto> roleBaseInfoDtoList = roleMapper.selectRoleBaseInfoDtoByIds(CollUtil.newArrayList(20220824L));
        assertThat(roleBaseInfoDtoList.size()).isEqualTo(1);
        assertThat(roleBaseInfoDtoList.get(0).getRoleName()).isEqualTo("vika boy");
    }

    @Test
    @Sql({"/testdata/unit-role-data.sql", "/testdata/unit-data.sql"})
    void givenWhenSelectRoleInfoDtoByIdsAndSpaceIdThen() {
        List<RoleInfoDTO> roleInfos = roleMapper.selectRoleInfoDtoByIdsAndSpaceId(CollUtil.newArrayList(20220824L), "spc20220824");
        assertThat(roleInfos.size()).isEqualTo(1);
    }

}
