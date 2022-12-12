package com.vikadata.api.space.mapper;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.space.dto.SpaceApplyDTO;
import com.vikadata.api.space.mapper.SpaceApplyMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

@Disabled
public class SpaceApplyMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    SpaceApplyMapper spaceApplyMapper;

    @Test
    @Sql("/sql/space-apply-data.sql")
    void testCountBySpaceIdAndCreatedByAndStatus() {
        Integer count = spaceApplyMapper.countBySpaceIdAndCreatedByAndStatus(45L, "spc41", 0);
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql({ "/sql/space-apply-data.sql", "/sql/player-notification-data.sql" })
    void testSelectSpaceApplyDto() {
        SpaceApplyDTO entity = spaceApplyMapper.selectSpaceApplyDto(45L, 41L, "assigned_to_group", "\"id\"", "\"status\"");
        assertThat(entity).isNotNull();
    }

}
