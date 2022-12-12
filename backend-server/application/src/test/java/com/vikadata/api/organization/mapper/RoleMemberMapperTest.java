package com.vikadata.api.organization.mapper;

import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.organization.mapper.RoleMemberMapper;
import com.vikadata.api.organization.dto.RoleMemberInfoDTO;

import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

public class RoleMemberMapperTest extends AbstractMyBatisMapperTest {

    @Resource
    RoleMemberMapper roleMemberMapper;

    @Test
    @Sql("/sql/unit-role-member-data.sql")
    void givenTwoRoleMembersWhenSelectUnitRefIdsByRoleIdThenGetTwoMemberIds() {
        Set<Long> memberIds = roleMemberMapper.selectUnitRefIdsByRoleId(20220824L);
        assertThat(memberIds.size()).isEqualTo(2);
    }


    @Test
    @Sql("/sql/unit-role-member-data.sql")
    void givenTwoRoleMembersWhenDeleteByRoleIdAndUnitRefIdsThenGetZeroMemberIds() {
        Integer count = roleMemberMapper.deleteByRoleIdAndUnitRefIds(20220824L, CollUtil.newArrayList(2022082401L, 2022082402L));
        assertThat(count).isEqualTo(2);
        Set<Long> memberIds = roleMemberMapper.selectUnitRefIdsByRoleId(20220824L);
        assertThat(memberIds.size()).isEqualTo(0);
    }

    @Test
    @Sql("/sql/unit-role-member-data.sql")
    void givenRoleWithTwoRoleMembersWhenDeleteByRoleIdThenGetZeroMemberIds() {
        Integer count = roleMemberMapper.deleteByRoleId(20220824L);
        assertThat(count).isEqualTo(2);
        Set<Long> memberIds = roleMemberMapper.selectUnitRefIdsByRoleId(20220824L);
        assertThat(memberIds.size()).isEqualTo(0);
    }

    @Test
    @Sql({"/sql/unit-role-member-data.sql", "/sql/unit-data.sql"})
    void givenTwoRoleMembersWhenSelectRoleMembersByRoleIdsThenTwoRoleMebers() {
        List<RoleMemberInfoDTO> roleMembers = roleMemberMapper.selectRoleMembersByRoleIds(CollUtil.newArrayList(20220824L));
        assertThat(roleMembers.size()).isEqualTo(2);
    }

    @Test
    @Sql({"/sql/unit-role-member-data.sql", "/sql/unit-data.sql"})
    void givenTwoRoleMembersWhenSelectRoleMembersByRoleIdThenPageRecordsEqualsTwo() {
        Page<Void> page = new Page<>();
        IPage<RoleMemberInfoDTO> roleMemberPage = roleMemberMapper.selectRoleMembersByRoleId(20220824L, page);
        assertThat(roleMemberPage.getRecords().size()).isEqualTo(2);
    }

    @Test
    @Sql("/sql/unit-role-member-data.sql")
    void givenTowRoleMembersWhenDeleteByUnitRefIdsThenSuccess() {
        int count = roleMemberMapper.deleteByUnitRefIds(CollUtil.newArrayList(2022082401L, 2022082402L));
        assertThat(count).isEqualTo(2);
        Set<Long> memberIds = roleMemberMapper.selectUnitRefIdsByRoleId(20220824L);
        assertThat(memberIds.size()).isEqualTo(0);
    }

    @Test
    @Sql("/sql/unit-role-member-data.sql")
    void givenTowRoleMembersWhenSelectRoleIdByUnitRefIdsThenGetOneRoleId() {
        List<Long> roleIds = roleMemberMapper.selectRoleIdsByUnitRefId(2022082401L);
        assertThat(roleIds.size()).isEqualTo(1);
        assertThat(roleIds.get(0)).isEqualTo(20220824L);
    }

    @Test
    @Sql({"/sql/unit-role-member-data.sql", "/sql/unit-data.sql"})
    void givenTowRoleMembersWhenSelectRoleMembersByRoleIdAndUnitRefIdsThenRoleMembers() {
        List<RoleMemberInfoDTO> roleMembers = roleMemberMapper.selectRoleMembersByRoleIdAndUnitRefIds(20220824L, CollUtil.newArrayList(2022082401L, 2022082402L));
        assertThat(roleMembers.size()).isEqualTo(2);
    }

}
