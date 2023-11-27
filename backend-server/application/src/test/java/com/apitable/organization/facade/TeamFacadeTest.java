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

package com.apitable.organization.facade;

import static org.assertj.core.api.Assertions.assertThat;

import cn.hutool.core.collection.CollUtil;
import com.apitable.organization.dto.TeamCteInfo;
import com.apitable.organization.dto.TeamPathInfo;
import com.apitable.organization.mapper.TeamMapper;
import com.apitable.organization.service.impl.TeamServiceImplTest;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Team facade test.
 */
public class TeamFacadeTest extends TeamServiceImplTest {

    @Autowired
    private TeamMapper teamMapper;

    private DefaultCTETeamFacadeImpl defaultCTETeamFacade;

    private NonCTETeamFacadeImpl nonCTETeamFacade;

    @BeforeEach
    public void beforeMethod() {
        super.beforeMethod();
        this.defaultCTETeamFacade = new DefaultCTETeamFacadeImpl(teamMapper);
        this.nonCTETeamFacade = new NonCTETeamFacadeImpl(teamMapper);
    }

    @Test
    public void testGetAllParentTeamIds() {
        super.prepareMemberAndTeamInfo();
        List<Long> teamIds = CollUtil.newArrayList(1L, 11L, 21L, 31L);
        // default cte team facade implement class
        List<Long> parentTeamIds101 = defaultCTETeamFacade.getAllParentTeamIds(31L);
        assertThat(parentTeamIds101.size()).isEqualTo(4);
        assertThat(CollUtil.disjunction(teamIds, parentTeamIds101)).isEmpty();

        // non cte team facade implement class
        List<Long> parentTeamIds201 = nonCTETeamFacade.getAllParentTeamIds(31L);
        assertThat(parentTeamIds201.size()).isEqualTo(4);
        assertThat(CollUtil.disjunction(teamIds, parentTeamIds201)).isEmpty();
    }

    @Test
    public void testGetAllParentTeam() {
        super.prepareMemberAndTeamInfo();
        List<Long> teamIds = CollUtil.newArrayList(11L);
        // default cte team facade implement class
        List<TeamPathInfo> infos101 = defaultCTETeamFacade.getAllParentTeam(teamIds);
        assertThat(infos101.size()).isEqualTo(2);

        // non cte team facade implement class
        List<TeamPathInfo> infos201 = nonCTETeamFacade.getAllParentTeam(teamIds);
        assertThat(infos201.size()).isEqualTo(2);
    }

    @Test
    public void testGetAllChildTeam() {
        super.prepareMemberAndTeamInfo();
        List<Long> teamIds1 = CollUtil.newArrayList(1L);
        List<Long> teamIds2 = CollUtil.newArrayList(11L, 21L);
        List<Long> teamIds3 = CollUtil.newArrayList(0L);
        // default cte team facade implement class
        List<TeamCteInfo> infos101 = defaultCTETeamFacade.getAllChildTeam(teamIds1);
        assertThat(infos101.size()).isEqualTo(7);
        List<TeamCteInfo> infos102 = defaultCTETeamFacade.getAllChildTeam(teamIds2);
        assertThat(infos102.size()).isEqualTo(4);
        List<TeamCteInfo> infos103 = defaultCTETeamFacade.getAllChildTeam(teamIds3);
        assertThat(infos103).isEmpty();

        // non cte team facade implement class
        List<TeamCteInfo> infos201 = nonCTETeamFacade.getAllChildTeam(teamIds1);
        assertThat(infos201.size()).isEqualTo(7);
        List<TeamCteInfo> infos202 = nonCTETeamFacade.getAllChildTeam(teamIds2);
        assertThat(infos202.size()).isEqualTo(4);
        List<TeamCteInfo> infos203 = nonCTETeamFacade.getAllChildTeam(teamIds3);
        assertThat(infos203).isEmpty();
    }
}
