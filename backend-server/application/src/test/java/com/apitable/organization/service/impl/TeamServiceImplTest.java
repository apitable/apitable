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
import com.apitable.AbstractIntegrationTest;
import com.apitable.FileHelper;
import com.apitable.organization.entity.TeamEntity;
import com.apitable.organization.entity.TeamMemberRelEntity;
import com.apitable.organization.vo.MemberTeamPathInfo;
import com.apitable.organization.vo.TeamTreeVo;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import org.apache.commons.io.IOUtils;
import org.junit.jupiter.api.Test;

public class TeamServiceImplTest extends AbstractIntegrationTest {

    @Test
    void testGetTeamTree() throws IOException {
        String resourceName = "sql/orgIsolated-data.sql";
        InputStream inputStream = FileHelper.getInputStreamFromResource(resourceName);
        String sqlStr = IOUtils.toString(inputStream, StandardCharsets.UTF_8);
        String[] sqlArray = sqlStr.split(";");
        for (String sql : sqlArray) {
            execute(sql);
        }
        // Member in root team
        List<TeamTreeVo> treeVos =
            iTeamService.getTeamTree("spczdmQDfBAn5", 1478202310895792131L, 2);
        assertThat(treeVos.size()).isEqualTo(1);
        assertThat(treeVos.get(0).getChildren().size()).isEqualTo(3);

        // Member does not in root team
        List<TeamTreeVo> treeVos2 =
            iTeamService.getTeamTree("spczdmQDfBAn5", 1478202310895792130L, 1);
        assertThat(treeVos2.size()).isEqualTo(3);
    }

    @Test
    void testBuild() throws IOException {
        String resourceName = "sql/orgIsolated-vut-data.sql";
        InputStream inputStream = FileHelper.getInputStreamFromResource(resourceName);
        String sql = IOUtils.toString(inputStream, StandardCharsets.UTF_8);
        execute(sql);

        List<TeamTreeVo> treeVos = iTeamService.build("spczdmQDfBAn5", 1279306279580438529L);
        assertThat(treeVos.size()).isEqualTo(13);
    }

    @Test
    void testBuildTree() throws IOException {
        List<Long> teamIds =
            CollUtil.newArrayList(1279306279580438529L, 1342304314473648129L, 1236159916641619970L,
                1283285207447699457L);
        String resourceName = "sql/orgIsolated-vut-data.sql";
        InputStream inputStream = FileHelper.getInputStreamFromResource(resourceName);
        String sql = IOUtils.toString(inputStream, StandardCharsets.UTF_8);
        execute(sql);

        List<TeamTreeVo> treeVos = iTeamService.buildTree("spczdmQDfBAn5", teamIds);
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
}

