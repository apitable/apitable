package com.vikadata.api.organization.mapper;

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.organization.mapper.TeamMemberRelMapper;
import com.vikadata.api.organization.entity.TeamMemberRelEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

@Disabled
public class TeamMemberRelMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    TeamMemberRelMapper teamMemberRelMapper;

    @Test
    @Sql({ "/sql/unit-team-member-rel-data.sql", "/sql/unit-team-data.sql" })
    void testSelectTeamIdsByMemberId() {
        List<Long> ids = teamMemberRelMapper.selectTeamIdsByMemberId(41L);
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql({ "/sql/unit-team-member-rel-data.sql", "/sql/unit-member-data.sql" })
    void testCountByTeamId() {
        Integer count = teamMemberRelMapper.countByTeamId(CollUtil.newArrayList(41L));
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql({ "/sql/unit-team-member-rel-data.sql", "/sql/unit-team-data.sql" })
    void testSelectByMemberIds() {
        List<TeamMemberRelEntity> entities = teamMemberRelMapper.selectByMemberIds(CollUtil.newArrayList(41L));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql({ "/sql/unit-team-member-rel-data.sql", "/sql/unit-team-data.sql" })
    void testSelectByTeamIds() {
        List<TeamMemberRelEntity> entities = teamMemberRelMapper.selectByTeamIds(CollUtil.newArrayList(41L));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql({ "/sql/unit-team-member-rel-data.sql" })
    void testSelectMemberIdsByTeamId() {
        List<Long> ids = teamMemberRelMapper.selectMemberIdsByTeamId(41L);
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql({ "/sql/unit-member-data.sql", "/sql/unit-team-data.sql",
            "/sql/unit-team-member-rel-data.sql"})
    void testSelectMemberIdsByTeamIds() {
        List<Long> ids = teamMemberRelMapper.selectMemberIdsByTeamIds(CollUtil.newArrayList(41L));
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql({ "/sql/unit-member-data.sql", "/sql/unit-team-data.sql",
            "/sql/unit-team-member-rel-data.sql"})
    void testSelectActiveMemberIdsByTeamIds() {
        List<Long> ids = teamMemberRelMapper.selectActiveMemberIdsByTeamIds(CollUtil.newArrayList(41L));
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql({ "/sql/unit-team-member-rel-data.sql", "/sql/unit-team-data.sql" })
    void testSelectAllTeamIdByMemberId() {
        List<Long> ids = teamMemberRelMapper.selectAllTeamIdByMemberId(41L);
        assertThat(ids).isNotEmpty();
    }

}
