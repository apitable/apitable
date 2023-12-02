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
import com.apitable.organization.entity.TeamMemberRelEntity;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

public class TeamMemberRelMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    TeamMemberRelMapper teamMemberRelMapper;

    @Test
    @Sql({"/sql/unit-team-member-rel-data.sql", "/sql/unit-team-data.sql"})
    void testSelectTeamIdsByMemberId() {
        List<Long> ids = teamMemberRelMapper.selectTeamIdsByMemberId(41L);
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql({"/sql/unit-team-member-rel-data.sql", "/sql/unit-member-data.sql"})
    void testCountByTeamId() {
        Long count = teamMemberRelMapper.countByTeamId(CollUtil.newArrayList(41L));
        assertThat(count).isEqualTo(1L);
    }

    @Test
    @Sql({"/sql/unit-team-member-rel-data.sql", "/sql/unit-team-data.sql"})
    void testSelectByMemberIds() {
        List<TeamMemberRelEntity> entities =
            teamMemberRelMapper.selectByMemberIds(CollUtil.newArrayList(41L));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql({"/sql/unit-team-member-rel-data.sql", "/sql/unit-team-data.sql"})
    void testSelectByTeamIds() {
        List<TeamMemberRelEntity> entities =
            teamMemberRelMapper.selectByTeamIds(CollUtil.newArrayList(41L));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql({"/sql/unit-team-member-rel-data.sql"})
    void testSelectMemberIdsByTeamId() {
        List<Long> ids = teamMemberRelMapper.selectMemberIdsByTeamId(41L);
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql({"/sql/unit-member-data.sql", "/sql/unit-team-data.sql",
        "/sql/unit-team-member-rel-data.sql"})
    void testSelectMemberIdsByTeamIds() {
        List<Long> ids = teamMemberRelMapper.selectMemberIdsByTeamIds(CollUtil.newArrayList(41L));
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql({"/sql/unit-member-data.sql", "/sql/unit-team-data.sql",
        "/sql/unit-team-member-rel-data.sql"})
    void testSelectActiveMemberIdsByTeamIds() {
        List<Long> ids =
            teamMemberRelMapper.selectActiveMemberIdsByTeamIds(CollUtil.newArrayList(41L));
        assertThat(ids).isNotEmpty();
    }

}
