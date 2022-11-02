package com.vikadata.api.modular.organization.mapper;

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.vikadata.api.modular.organization.model.TeamCteInfo;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.model.dto.organization.TeamMemberDto;
import com.vikadata.api.model.vo.organization.MemberPageVo;
import com.vikadata.api.model.vo.organization.SearchTeamResultVo;
import com.vikadata.api.model.vo.organization.TeamInfoVo;
import com.vikadata.api.model.vo.organization.UnitTeamVo;
import com.vikadata.api.modular.organization.model.TeamBaseInfoDTO;
import com.vikadata.api.modular.organization.model.TeamPathInfo;
import com.vikadata.entity.TeamEntity;

import org.springframework.test.context.jdbc.Sql;

import javax.annotation.Resource;

import static org.assertj.core.api.Assertions.assertThat;

@Disabled
public class TeamMapperTest extends AbstractMyBatisMapperTest {

    @Resource
    private TeamMapper teamMapper;

    @Test
    @Sql("/testdata/unit-team-data.sql")
    void testSelectRootIdBySpaceId() {
        Long id = teamMapper.selectRootIdBySpaceId("spc41");
        assertThat(id).isEqualTo(41L);
    }

    @Test
    @Sql("/testdata/unit-team-data.sql")
    void testSelectParentIdByTeamId() {
        Long id = teamMapper.selectParentIdByTeamId(41L);
        assertThat(id).isEqualTo(0L);
    }

    @Test
    @Sql({ "/testdata/unit-team-data.sql" })
    void testSelectByTeamName() {
        List<SearchTeamResultVo> entities = teamMapper.selectByTeamName("spc41", "team");
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/testdata/unit-team-data.sql")
    void testExistChildrenByParentId() {
        Integer bool = teamMapper.existChildrenByParentId(41L);
        assertThat(bool).isEqualTo(1);
    }

    @Test
    @Sql("/testdata/unit-team-data.sql")
    void testSelectMaxSequenceByParentId() {
        Integer sequence = teamMapper.selectMaxSequenceByParentId(41L);
        assertThat(sequence).isEqualTo(1);
    }

    @Test
    @Sql({ "/testdata/unit-team-data.sql" })
    void testSelectRootSubTeams() {
        List<TeamInfoVo> entities = teamMapper.selectRootSubTeams("spc41", 41L);
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql({ "/testdata/unit-team-data.sql" })
    void testSelectSubTeamsByParentId() {
        List<TeamInfoVo> entities = teamMapper.selectSubTeamsByParentId("spc41", 41L);
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/testdata/unit-team-data.sql")
    void testSelectTeamIdsByParentId() {
        List<Long> ids = teamMapper.selectTeamIdsByParentId("spc41", 41L);
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql("/testdata/unit-team-data.sql")
    void testSelectAllParentTeamIds() {
        List<Long> ids = teamMapper.selectAllParentTeamIds(45L, false);
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql("/testdata/unit-team-data.sql")
    void testSelectAllSubTeamIdsByParentId() {
        List<Long> ids = teamMapper.selectAllSubTeamIdsByParentId(41L, false);
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql("/testdata/unit-team-data.sql")
    void testSelectAllSubTeamIds() {
        List<Long> ids = teamMapper.selectAllSubTeamIds(CollUtil.newArrayList(41L));
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql({ "/testdata/unit-team-data.sql", "/testdata/unit-team-member-rel-data.sql",
            "/testdata/unit-member-data.sql" })
    void testSelectMembersByRootTeamId() {
        List<MemberPageVo> entities = teamMapper.selectMembersByRootTeamId("spc41");
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql({ "/testdata/unit-team-data.sql", "/testdata/unit-team-member-rel-data.sql",
            "/testdata/unit-member-data.sql" })
    void testSelectMembersByRootTeamId2() {
        IPage<MemberPageVo> entities = teamMapper.selectMembersByRootTeamId(new Page<>(), "spc41", null);
        assertThat(entities.getTotal()).isEqualTo(1);
    }

    @Test
    @Sql({ "/testdata/unit-team-member-rel-data.sql", "/testdata/unit-member-data.sql" })
    void testSelectMembersByTeamId() {
        List<MemberPageVo> entities = teamMapper.selectMembersByTeamId(CollUtil.newArrayList(41L));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql({ "/testdata/unit-team-data.sql", "/testdata/unit-team-member-rel-data.sql",
            "/testdata/unit-member-data.sql" })
    void testSelectMemberPageByTeamId() {
        IPage<MemberPageVo> entities = teamMapper.selectMemberPageByTeamId(new Page<>(), CollUtil.newArrayList(41L), null);
        assertThat(entities.getTotal()).isEqualTo(1);
    }

    @Test
    @Sql("/testdata/unit-team-data.sql")
    void testSelectTeamsBySpaceId() {
        List<TeamMemberDto> entities = teamMapper.selectTeamsBySpaceId("spc41", 0L);
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/testdata/unit-team-data.sql")
    void testSelectBySpaceIdAndName() {
        TeamEntity entity = teamMapper.selectBySpaceIdAndName("spc41", "space name", 0L);
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql({ "/testdata/unit-team-data.sql", "/testdata/unit-team-member-rel-data.sql",
            "/testdata/unit-member-data.sql" })
    void testSelectTeamsByIds() {
        List<TeamMemberDto> entities = teamMapper.selectTeamsByIds(CollUtil.newArrayList(45L));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/testdata/unit-team-data.sql")
    void testSelectAllBySpaceId() {
        List<TeamEntity> entities = teamMapper.selectAllBySpaceId("spc41");
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/testdata/unit-team-data.sql")
    void testSelectTeamIdsLikeName() {
        List<Long> ids = teamMapper.selectTeamIdsLikeName("spc41", "team");
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql("/testdata/unit-team-data.sql")
    void testSelectIdBySpaceIdAndNames() {
        List<Long> ids = teamMapper.selectIdBySpaceIdAndNames("spc41", CollUtil.newArrayList("team"));
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql({ "/testdata/unit-team-data.sql", "/testdata/unit-data.sql" })
    void testSelectUnitTeamVoByTeamId() {
        UnitTeamVo entity = teamMapper.selectUnitTeamVoByTeamId("spc41", 41L);
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql({ "/testdata/unit-team-data.sql", "/testdata/unit-data.sql" })
    void testSelectUnitTeamVoByTeamIds() {
        List<UnitTeamVo> entities = teamMapper.selectUnitTeamVoByTeamIds("spc41", CollUtil.newArrayList(41L));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/testdata/unit-team-data.sql")
    void testSelectSpaceIdById() {
        String id = teamMapper.selectSpaceIdById(41L);
        assertThat(id).isEqualTo("spc41");
    }

    @Test
    @Sql("/testdata/unit-team-data.sql")
    void testSelectTeamNameById() {
        String teamName = teamMapper.selectTeamNameById(41L);
        assertThat(teamName).isEqualTo("team41");
    }

    @Test
    @Sql("/testdata/unit-team-data.sql")
    void testSelectBaseInfoDTOByIds() {
        List<TeamBaseInfoDTO> entities = teamMapper.selectBaseInfoDTOByIds(CollUtil.newArrayList(41L));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql({ "/testdata/unit-team-member-rel-data.sql", "/testdata/unit-member-data.sql" })
    void testSelectMemberCountByTeamId() {
        Integer count = teamMapper.selectMemberCountByTeamId(41L);
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql({ "/testdata/unit-team-member-rel-data.sql" , "/testdata/unit-member-data.sql"})
    void testSelectActiveMemberCountByTeamId() {
        Integer count = teamMapper.selectActiveMemberCountByTeamId(41L);
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql("/testdata/unit-team-data.sql")
    void testSelectTeamAllIdBySpaceId() {
        List<Long> ids = teamMapper.selectTeamAllIdBySpaceId("spc41");
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql("/testdata/unit-team-data.sql")
    void testSelectTreeByTeamName() {
        List<TeamEntity> entities = teamMapper.selectTreeByTeamName("spc41", "team41");
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/testdata/unit-team-data.sql")
    void testSelectChildTreeTeamIds(){
        List<TeamCteInfo> teamIds = teamMapper.selectChildTreeByTeamIds("spc41", CollUtil.newArrayList(41L));
        assertThat(teamIds).isNotEmpty();
    }

    @Test
    @Sql({"/testdata/unit-team-data.sql", "/testdata/unit-team-member-rel-data.sql", "/testdata/unit-member-data.sql"})
    void testSelectMemberTeamsBySpaceIdAndTeamIds(){
        List<TeamMemberDto> entities = teamMapper.selectMemberTeamsBySpaceIdAndTeamIds("spc41", CollUtil.newArrayList(41L));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/testdata/unit-team-data.sql")
    void testSelectParentTreeByTeamIds(){
        List<Long> teamIds = CollUtil.newArrayList(41L);
        List<TeamPathInfo> teamPathInfos = teamMapper.selectParentTreeByTeamIds("spc41", teamIds);
        assertThat(teamPathInfos.get(0).getTeamName()).isEqualTo("team41");
    }
}
