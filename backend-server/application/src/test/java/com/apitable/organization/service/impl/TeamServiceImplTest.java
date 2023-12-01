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

package com.apitable.organization.service.impl;

import static org.assertj.core.api.Assertions.assertThat;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.json.JSONUtil;
import com.apitable.AbstractIntegrationTest;
import com.apitable.organization.entity.MemberEntity;
import com.apitable.organization.entity.TeamEntity;
import com.apitable.organization.entity.TeamMemberRelEntity;
import com.apitable.organization.vo.MemberTeamPathInfo;
import com.apitable.organization.vo.TeamTreeVo;
import com.apitable.space.entity.SpaceEntity;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.assertj.core.util.Lists;
import org.junit.jupiter.api.Test;

public class TeamServiceImplTest extends AbstractIntegrationTest {

    @Test
    void testGetTeamTree() {
        initSpace();
        // Member in root team
        List<TeamTreeVo> treeVos =
            iTeamService.getTeamTree("spczdmQDfBAn5", 2L, 2);
        assertThat(treeVos.size()).isEqualTo(1);
        assertThat(treeVos.get(0).getChildren().size()).isEqualTo(3);

        // Member does not in root team
        List<TeamTreeVo> treeVos2 =
            iTeamService.getTeamTree("spczdmQDfBAn5", 1L, 1);
        assertThat(treeVos2.size()).isEqualTo(3);
    }

    @Test
    void testBuild() {
        String spaceId = "spczdmQDfBAn5";
        initTeamTree(spaceId);

        List<TeamTreeVo> treeVos = iTeamService.build(spaceId, 5L);
        assertThat(treeVos.size()).isEqualTo(13);
    }

    @Test
    void testBuildTree() {
        String spaceId = "spczdmQDfBAn5";
        initTeamTree(spaceId);

        List<Long> teamIds = Lists.list(5L, 10L, 2L, 4L);
        List<TeamTreeVo> treeVos = iTeamService.buildTree(spaceId, teamIds);
        assertThat(treeVos.size()).isEqualTo(4);
    }

    @Test
    public void testBatchGetFullHierarchyTeamNamesWithOneMemberInRootTeam() {
        // prepare member and team info
        this.prepareMemberAndTeamInfo();

        // prepare member and team rel
        TeamMemberRelEntity rel =
            TeamMemberRelEntity.builder().id(111L).memberId(101L).teamId(1L).build();
        iTeamMemberRelService.save(rel);

        List<Long> memberIds = CollUtil.newArrayList(101L);
        Map<Long, List<MemberTeamPathInfo>> memberToTeamMap =
            iTeamService.batchGetFullHierarchyTeamNames(memberIds, "spc1");
        assertThat(memberToTeamMap.get(101L).get(0).getTeamId()).isEqualTo(1);
        assertThat(memberToTeamMap.get(101L).get(0).getFullHierarchyTeamName()).isEqualTo(
            "root team");
    }

    @Test
    public void testBatchGetFullHierarchyTeamNamesWithOneMemberNotInRootTeam() {
        // prepare member and team info
        this.prepareMemberAndTeamInfo();

        // prepare member and team rel
        TeamMemberRelEntity rel =
            TeamMemberRelEntity.builder().id(111L).memberId(101L).teamId(11L).build();
        iTeamMemberRelService.save(rel);

        List<Long> memberIds = CollUtil.newArrayList(101L);
        Map<Long, List<MemberTeamPathInfo>> memberToTeamMap =
            iTeamService.batchGetFullHierarchyTeamNames(memberIds, "spc1");
        assertThat(memberToTeamMap.get(101L).get(0).getTeamId()).isEqualTo(11);
        assertThat(memberToTeamMap.get(101L).get(0).getFullHierarchyTeamName()).isEqualTo(
            "NO.1 first-level team");
    }

    @Test
    public void testBatchGetFullHierarchyTeamNamesWithOneMemberInDifferentTeams() {
        // prepare member and team info
        this.prepareMemberAndTeamInfo();

        // prepare member and team rel
        TeamMemberRelEntity rel1 =
            TeamMemberRelEntity.builder().id(111L).memberId(101L).teamId(11L).build();
        iTeamMemberRelService.save(rel1);
        TeamMemberRelEntity rel2 =
            TeamMemberRelEntity.builder().id(222L).memberId(101L).teamId(31L).build();
        iTeamMemberRelService.save(rel2);

        List<Long> memberIds = CollUtil.newArrayList(101L);
        Map<Long, List<MemberTeamPathInfo>> memberToTeamMap =
            iTeamService.batchGetFullHierarchyTeamNames(memberIds, "spc1");
        assertThat(memberToTeamMap.get(101L).get(0).getTeamId()).isEqualTo(11);
        assertThat(memberToTeamMap.get(101L).get(0).getFullHierarchyTeamName()).isEqualTo(
            "NO.1 first-level team");
        assertThat(memberToTeamMap.get(101L).get(1).getTeamId()).isEqualTo(31);
        assertThat(memberToTeamMap.get(101L).get(1).getFullHierarchyTeamName()).isEqualTo(
            "NO.1 first-level team/NO.1 second-level team/NO.1 third-level team");
    }

    @Test
    public void testBatchGetFullHierarchyTeamNamesWithMembersInDifferentTeams() {
        // prepare info
        this.prepareMemberAndTeamInfo();

        // prepare team and member rel
        TeamMemberRelEntity rel1 =
            TeamMemberRelEntity.builder().id(111L).memberId(101L).teamId(1L).build();
        iTeamMemberRelService.save(rel1);

        TeamMemberRelEntity rel2 =
            TeamMemberRelEntity.builder().id(222L).memberId(102L).teamId(11L).build();
        iTeamMemberRelService.save(rel2);

        TeamMemberRelEntity rel3 =
            TeamMemberRelEntity.builder().id(333L).memberId(102L).teamId(31L).build();
        iTeamMemberRelService.save(rel3);

        TeamMemberRelEntity rel4 =
            TeamMemberRelEntity.builder().id(444L).memberId(102L).teamId(22L).build();
        iTeamMemberRelService.save(rel4);

        List<Long> memberIds = CollUtil.newArrayList(101L, 102L);
        Map<Long, List<MemberTeamPathInfo>> memberToTeamMap =
            iTeamService.batchGetFullHierarchyTeamNames(memberIds, "spc1");
        assertThat(memberToTeamMap.get(101L).get(0).getFullHierarchyTeamName()).isEqualTo(
            "root team");
        assertThat(memberToTeamMap.get(101L).get(0).getTeamId()).isEqualTo(1);
        assertThat(memberToTeamMap.get(102L).get(0).getFullHierarchyTeamName()).isEqualTo(
            "NO.1 first-level team");
        assertThat(memberToTeamMap.get(102L).get(0).getTeamId()).isEqualTo(11);
        assertThat(memberToTeamMap.get(102L).get(1).getFullHierarchyTeamName()).isEqualTo(
            "NO.1 first-level team/NO.1 second-level team/NO.1 third-level team");
        assertThat(memberToTeamMap.get(102L).get(1).getTeamId()).isEqualTo(31);
        assertThat(memberToTeamMap.get(102L).get(2).getFullHierarchyTeamName()).isEqualTo(
            "NO.2 first-level team/NO.2 second-level team");
        assertThat(memberToTeamMap.get(102L).get(2).getTeamId()).isEqualTo(22);
    }

    @Test
    public void testBatchGetFullHierarchyTeamNamesThatTeamWithSameParentTeam() {
        // prepare member and team info
        this.prepareMemberAndTeamInfo();

        // prepare member and team rel
        TeamMemberRelEntity rel =
            TeamMemberRelEntity.builder().id(111L).memberId(101L).teamId(21L).build();
        iTeamMemberRelService.save(rel);
        TeamMemberRelEntity rel2 =
            TeamMemberRelEntity.builder().id(222L).memberId(101L).teamId(221L).build();
        iTeamMemberRelService.save(rel2);

        List<Long> memberIds = CollUtil.newArrayList(101L);
        Map<Long, List<MemberTeamPathInfo>> memberToTeamMap =
            iTeamService.batchGetFullHierarchyTeamNames(memberIds, "spc1");
        assertThat(memberToTeamMap.get(101L).get(0).getTeamId()).isEqualTo(21);
        assertThat(memberToTeamMap.get(101L).get(0).getFullHierarchyTeamName()).isEqualTo(
            "NO.1 first-level team/NO.1 second-level team");
        assertThat(memberToTeamMap.get(101L).get(1).getTeamId()).isEqualTo(221);
        assertThat(memberToTeamMap.get(101L).get(1).getFullHierarchyTeamName()).isEqualTo(
            "NO.1 first-level team/NO.1 second-level 2 team");
    }

    @Test
    public void testBatchGetFullHierarchyTeamNamesThatMemberInDifferentTeamsWithSameBranch() {
        // prepare member and team info
        this.prepareMemberAndTeamInfo();

        // prepare member and team rel
        TeamMemberRelEntity rel =
            TeamMemberRelEntity.builder().id(111L).memberId(101L).teamId(11L).build();
        iTeamMemberRelService.save(rel);
        TeamMemberRelEntity rel2 =
            TeamMemberRelEntity.builder().id(222L).memberId(101L).teamId(21L).build();
        iTeamMemberRelService.save(rel2);
        TeamMemberRelEntity rel3 =
            TeamMemberRelEntity.builder().id(333L).memberId(101L).teamId(31L).build();
        iTeamMemberRelService.save(rel3);

        List<Long> memberIds = CollUtil.newArrayList(101L);
        Map<Long, List<MemberTeamPathInfo>> memberToTeamMap =
            iTeamService.batchGetFullHierarchyTeamNames(memberIds, "spc1");
        assertThat(memberToTeamMap.get(101L).get(0).getFullHierarchyTeamName()).isEqualTo(
            "NO.1 first-level team");
        assertThat(memberToTeamMap.get(101L).get(0).getTeamId()).isEqualTo(11);
        assertThat(memberToTeamMap.get(101L).get(1).getFullHierarchyTeamName()).isEqualTo(
            "NO.1 first-level team/NO.1 second-level team");
        assertThat(memberToTeamMap.get(101L).get(1).getTeamId()).isEqualTo(21);
        assertThat(memberToTeamMap.get(101L).get(2).getFullHierarchyTeamName()).isEqualTo(
            "NO.1 first-level team/NO.1 second-level team/NO.1 third-level team");
        assertThat(memberToTeamMap.get(101L).get(2).getTeamId()).isEqualTo(31);
    }

    protected void prepareMemberAndTeamInfo() {
        // prepare root team
        TeamEntity rootTeam =
            TeamEntity.builder().id(1L).spaceId("spc1").parentId(0L).teamName("root team").build();
        iTeamService.save(rootTeam);

        // prepare first-level teams
        TeamEntity firstLevelOneTeam = TeamEntity.builder().id(11L).spaceId("spc1").parentId(1L)
            .teamName("NO.1 first-level team").build();
        iTeamService.save(firstLevelOneTeam);
        TeamEntity firstLevelSecondTeam = TeamEntity.builder().id(12L).spaceId("spc1").parentId(1L)
            .teamName("NO.2 first-level team").build();
        iTeamService.save(firstLevelSecondTeam);

        // prepare second-level teams
        TeamEntity secondLevelOneTeam = TeamEntity.builder().id(21L).spaceId("spc1").parentId(11L)
            .teamName("NO.1 second-level team").build();
        iTeamService.save(secondLevelOneTeam);
        TeamEntity secondLevelOneTeamWithSameParentTeam =
            TeamEntity.builder().id(221L).spaceId("spc1").parentId(11L)
                .teamName("NO.1 second-level 2 team").build();
        iTeamService.save(secondLevelOneTeamWithSameParentTeam);
        TeamEntity secondLevelSecondTeam =
            TeamEntity.builder().id(22L).spaceId("spc1").parentId(12L)
                .teamName("NO.2 second-level team").build();
        iTeamService.save(secondLevelSecondTeam);

        // prepare third-level team
        TeamEntity thirdLevelOneTeam = TeamEntity.builder().id(31L).spaceId("spc1").parentId(21L)
            .teamName("NO.1 third-level team").build();
        iTeamService.save(thirdLevelOneTeam);
    }

    private void initSpace() {
        SpaceEntity spaceEntity = SpaceEntity.builder()
            .spaceId("spczdmQDfBAn5")
            .name("Space")
            .props(JSONUtil.createObj().putOnce("orgIsolated", 1).toString())
            .build();
        iSpaceService.save(spaceEntity);
        initIsolateTeam(spaceEntity.getSpaceId());
    }

    private void initIsolateTeam(String spaceId) {
        List<TeamEntity> teamEntities = new ArrayList<>();
        teamEntities.add(
            TeamEntity.builder().id(1L).spaceId(spaceId).parentId(0L).teamName("root team")
                .build());
        teamEntities.add(
            TeamEntity.builder().id(2L).spaceId(spaceId).parentId(1L).teamName("Engineering")
                .sequence(1).build());
        teamEntities.add(
            TeamEntity.builder().id(3L).spaceId(spaceId).parentId(1L).teamName("Product")
                .sequence(2).build());
        teamEntities.add(
            TeamEntity.builder().id(4L).spaceId(spaceId).parentId(1L).teamName("Marketing")
                .sequence(3).build());
        teamEntities.add(
            TeamEntity.builder().id(5L).spaceId(spaceId).parentId(2L).teamName("UX Engineering")
                .sequence(4).build());
        teamEntities.add(
            TeamEntity.builder().id(6L).spaceId(spaceId).parentId(2L).teamName("BackendEngineering")
                .sequence(5).build());
        teamEntities.add(TeamEntity.builder().id(7L).spaceId(spaceId).parentId(2L)
            .teamName("Quality Engineering").sequence(5).build());
        teamEntities.add(
            TeamEntity.builder().id(8L).spaceId(spaceId).parentId(2L).teamName("Mobile Engineering")
                .sequence(5).build());
        teamEntities.add(
            TeamEntity.builder().id(9L).spaceId(spaceId).parentId(2L).teamName("Infra").sequence(5)
                .build());
        teamEntities.add(
            TeamEntity.builder().id(10L).spaceId(spaceId).parentId(3L).teamName("Product Community")
                .sequence(1).build());
        teamEntities.add(
            TeamEntity.builder().id(11L).spaceId(spaceId).parentId(3L).teamName("Product Platform")
                .sequence(2).build());
        teamEntities.add(
            TeamEntity.builder().id(12L).spaceId(spaceId).parentId(3L).teamName("Product Design")
                .sequence(3).build());
        teamEntities.add(TeamEntity.builder().id(13L).spaceId(spaceId).parentId(6L)
            .teamName("BackendEngineering one").sequence(1).build());
        iTeamService.saveBatch(teamEntities);

        List<MemberEntity> memberEntities = new ArrayList<>();
        memberEntities.add(
            MemberEntity.builder().id(1L).spaceId(spaceId).userId(1478241862259765250L)
                .isActive(true).nameModified(false).build());
        memberEntities.add(
            MemberEntity.builder().id(2L).spaceId(spaceId).userId(1478241862259765251L)
                .isActive(true).nameModified(false).build());
        iMemberService.saveBatch(memberEntities);

        List<TeamMemberRelEntity> teamMemberRelEntities = new ArrayList<>();
        teamMemberRelEntities.add(TeamMemberRelEntity.builder().memberId(2L).teamId(1L).build());
        teamMemberRelEntities.add(TeamMemberRelEntity.builder().memberId(1L).teamId(2L).build());
        teamMemberRelEntities.add(TeamMemberRelEntity.builder().memberId(1L).teamId(4L).build());
        teamMemberRelEntities.add(TeamMemberRelEntity.builder().memberId(1L).teamId(5L).build());
        teamMemberRelEntities.add(TeamMemberRelEntity.builder().memberId(1L).teamId(10L).build());
        iTeamMemberRelService.saveBatch(teamMemberRelEntities);
    }

    private void initTeamTree(String spaceId) {
        List<TeamEntity> teamEntities = new ArrayList<>();
        teamEntities.add(
            TeamEntity.builder().id(1L).spaceId(spaceId).parentId(0L).teamName("root team")
                .build());
        teamEntities.add(
            TeamEntity.builder().id(2L).spaceId(spaceId).parentId(1L).teamName("Engineering")
                .sequence(1).build());
        teamEntities.add(
            TeamEntity.builder().id(3L).spaceId(spaceId).parentId(1L).teamName("Product")
                .sequence(2).build());
        teamEntities.add(
            TeamEntity.builder().id(4L).spaceId(spaceId).parentId(1L).teamName("GM").sequence(5)
                .build());
        teamEntities.add(
            TeamEntity.builder().id(5L).spaceId(spaceId).parentId(2L).teamName("UX Engineering")
                .sequence(1).build());
        teamEntities.add(
            TeamEntity.builder().id(6L).spaceId(spaceId).parentId(2L).teamName("BackendEngineering")
                .sequence(2).build());
        teamEntities.add(TeamEntity.builder().id(7L).spaceId(spaceId).parentId(2L)
            .teamName("Quality Engineering").sequence(3).build());
        teamEntities.add(
            TeamEntity.builder().id(8L).spaceId(spaceId).parentId(2L).teamName("Mobile Engineering")
                .sequence(4).build());
        teamEntities.add(
            TeamEntity.builder().id(9L).spaceId(spaceId).parentId(2L).teamName("Infra").sequence(5)
                .build());
        teamEntities.add(
            TeamEntity.builder().id(10L).spaceId(spaceId).parentId(3L).teamName("Product Community")
                .sequence(1).build());
        teamEntities.add(
            TeamEntity.builder().id(11L).spaceId(spaceId).parentId(3L).teamName("Product Platform")
                .sequence(2).build());
        teamEntities.add(
            TeamEntity.builder().id(12L).spaceId(spaceId).parentId(3L).teamName("Product Design")
                .sequence(3).build());
        teamEntities.add(TeamEntity.builder().id(13L).spaceId(spaceId).parentId(6L)
            .teamName("BackendEngineering one").sequence(1).build());
        iTeamService.saveBatch(teamEntities);
    }
}

