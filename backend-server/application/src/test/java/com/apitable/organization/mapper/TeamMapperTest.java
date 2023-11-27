/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.organization.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import cn.hutool.core.collection.CollUtil;
import com.apitable.AbstractMyBatisMapperTest;
import com.apitable.organization.dto.TeamBaseInfoDTO;
import com.apitable.organization.dto.TeamCteInfo;
import com.apitable.organization.dto.TeamMemberDTO;
import com.apitable.organization.dto.TeamPathInfo;
import com.apitable.organization.entity.TeamEntity;
import com.apitable.organization.vo.MemberPageVo;
import com.apitable.organization.vo.SearchTeamResultVo;
import com.apitable.organization.vo.UnitTeamVo;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

public class TeamMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    private TeamMapper teamMapper;

    @Test
    @Sql("/sql/unit-team-data.sql")
    void testSelectRootIdBySpaceId() {
        Long id = teamMapper.selectRootIdBySpaceId("spc41");
        assertThat(id).isEqualTo(41L);
    }

    @Test
    @Sql("/sql/unit-team-data.sql")
    void testSelectParentIdByTeamId() {
        Long id = teamMapper.selectParentIdByTeamId(41L);
        assertThat(id).isEqualTo(0L);
    }

    @Test
    @Sql({"/sql/unit-team-data.sql"})
    void testSelectByTeamName() {
        List<SearchTeamResultVo> entities = teamMapper.selectByTeamName("spc41", "team");
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/unit-team-data.sql")
    void testExistChildrenByParentId() {
        Integer bool = teamMapper.existChildrenByParentId(41L);
        assertThat(bool).isEqualTo(1);
    }

    @Test
    @Sql("/sql/unit-team-data.sql")
    void testSelectMaxSequenceByParentId() {
        Integer sequence = teamMapper.selectMaxSequenceByParentId(41L);
        assertThat(sequence).isEqualTo(1);
    }

    @Test
    @Sql("/sql/unit-team-data.sql")
    void testSelectTeamIdsByParentId() {
        List<Long> ids = teamMapper.selectTeamIdsByParentId("spc41", 41L);
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql({"/sql/unit-team-data.sql", "/sql/unit-team-member-rel-data.sql",
        "/sql/unit-member-data.sql"})
    void testSelectMembersByRootTeamId() {
        List<MemberPageVo> entities = teamMapper.selectMembersByRootTeamId("spc41");
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql({"/sql/unit-team-data.sql", "/sql/unit-team-member-rel-data.sql",
        "/sql/unit-member-data.sql"})
    void testSelectMembersByRootTeamId2() {
        IPage<MemberPageVo> entities =
            teamMapper.selectMembersByRootTeamId(new Page<>(), "spc41", null);
        assertThat(entities.getTotal()).isEqualTo(1);
    }

    @Test
    @Sql({"/sql/unit-team-member-rel-data.sql", "/sql/unit-member-data.sql"})
    void testSelectMembersByTeamId() {
        List<MemberPageVo> entities = teamMapper.selectMembersByTeamId(CollUtil.newArrayList(41L));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql({"/sql/unit-team-data.sql", "/sql/unit-team-member-rel-data.sql",
        "/sql/unit-member-data.sql"})
    void testSelectMemberPageByTeamId() {
        IPage<MemberPageVo> entities =
            teamMapper.selectMemberPageByTeamId(new Page<>(), CollUtil.newArrayList(41L), null);
        assertThat(entities.getTotal()).isEqualTo(1);
    }

    @Test
    @Sql("/sql/unit-team-data.sql")
    void testSelectTeamsBySpaceId() {
        List<TeamMemberDTO> entities = teamMapper.selectTeamsBySpaceId("spc41", 0L);
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/unit-team-data.sql")
    void testSelectBySpaceIdAndName() {
        TeamEntity entity = teamMapper.selectBySpaceIdAndName("spc41", "team41", 0L);
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql({"/sql/unit-team-data.sql", "/sql/unit-team-member-rel-data.sql",
        "/sql/unit-member-data.sql"})
    void testSelectTeamsByIds() {
        List<TeamMemberDTO> entities = teamMapper.selectTeamsByIds(CollUtil.newArrayList(45L));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/unit-team-data.sql")
    void testSelectTeamIdsLikeName() {
        List<Long> ids = teamMapper.selectTeamIdsLikeName("spc41", "team");
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql("/sql/unit-team-data.sql")
    void testSelectIdBySpaceIdAndNames() {
        List<Long> ids =
            teamMapper.selectIdBySpaceIdAndNames("spc41", CollUtil.newArrayList("team41"));
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql({"/sql/unit-team-data.sql", "/sql/unit-data.sql"})
    void testSelectUnitTeamVoByTeamId() {
        UnitTeamVo entity = teamMapper.selectUnitTeamVoByTeamId("spc41", 41L);
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql({"/sql/unit-team-data.sql", "/sql/unit-data.sql"})
    void testSelectUnitTeamVoByTeamIds() {
        List<UnitTeamVo> entities =
            teamMapper.selectUnitTeamVoByTeamIds("spc41", CollUtil.newArrayList(41L));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/unit-team-data.sql")
    void testSelectSpaceIdById() {
        String id = teamMapper.selectSpaceIdById(41L);
        assertThat(id).isEqualTo("spc41");
    }

    @Test
    @Sql("/sql/unit-team-data.sql")
    void testSelectTeamNameById() {
        String teamName = teamMapper.selectTeamNameById(41L);
        assertThat(teamName).isEqualTo("team41");
    }

    @Test
    @Sql("/sql/unit-team-data.sql")
    void testSelectBaseInfoDTOByIds() {
        List<TeamBaseInfoDTO> entities =
            teamMapper.selectBaseInfoDTOByIds(CollUtil.newArrayList(41L));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql({"/sql/unit-team-member-rel-data.sql", "/sql/unit-member-data.sql"})
    void testSelectMemberCountByTeamId() {
        Integer count = teamMapper.selectMemberCountByTeamId(41L);
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql({"/sql/unit-team-member-rel-data.sql", "/sql/unit-member-data.sql"})
    void testSelectActiveMemberCountByTeamId() {
        Integer count = teamMapper.selectActiveMemberCountByTeamId(41L);
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql("/sql/unit-team-data.sql")
    void testSelectTeamAllIdBySpaceId() {
        List<Long> ids = teamMapper.selectTeamAllIdBySpaceId("spc41");
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql("/sql/unit-team-data.sql")
    void testSelectChildTreeTeamIds() {
        List<TeamCteInfo> teamIds =
            teamMapper.selectChildTeamTree(CollUtil.newArrayList(41L));
        assertThat(teamIds).isNotEmpty();
    }

    @Test
    @Sql({"/sql/unit-team-data.sql", "/sql/unit-team-member-rel-data.sql",
        "/sql/unit-member-data.sql"})
    void testSelectMemberTeamsBySpaceIdAndTeamIds() {
        List<TeamMemberDTO> entities =
            teamMapper.selectMemberTeamsBySpaceIdAndTeamIds("spc41", CollUtil.newArrayList(41L));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/unit-team-data.sql")
    void testSelectParentTreeByTeamIds() {
        List<Long> teamIds = CollUtil.newArrayList(41L);
        List<TeamPathInfo> teamPathInfos = teamMapper.selectParentTeamTree(teamIds);
        assertThat(teamPathInfos.get(0).getTeamName()).isEqualTo("team41");
    }
}
