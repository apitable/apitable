package com.vikadata.api.modular.space.mapper;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.model.dto.space.SpaceApplyDto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

@Disabled
public class SpaceApplyMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    SpaceApplyMapper spaceApplyMapper;

    @Test
    @Sql("/testdata/space-apply-data.sql")
    void testCountBySpaceIdAndCreatedByAndStatus() {
        Integer count = spaceApplyMapper.countBySpaceIdAndCreatedByAndStatus(45L, "spc41", 0);
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql({ "/testdata/space-apply-data.sql", "/testdata/player-notification-data.sql" })
    void testSelectSpaceApplyDto() {
        SpaceApplyDto entity = spaceApplyMapper.selectSpaceApplyDto(45L, 41L, "assigned_to_group", "\"id\"", "\"status\"");
        assertThat(entity).isNotNull();
    }

}
