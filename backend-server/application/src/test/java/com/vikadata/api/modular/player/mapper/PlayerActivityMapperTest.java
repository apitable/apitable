package com.vikadata.api.modular.player.mapper;

import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.player.mapper.PlayerActivityMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 * Player Activity Mapper Test
 * </p>
 */
public class PlayerActivityMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    PlayerActivityMapper playerActivityMapper;

    @Test
    @Sql("/testdata/player-activity-data.sql")
    void testSelectActionsByUserId() {
        String action = playerActivityMapper.selectActionsByUserId(41L);
        assertThat(action).isEqualTo("{\"key\": \"value\"}");
    }

    @Test
    @Sql("/testdata/player-activity-data.sql")
    void testCountByUserId() {
        Integer count = playerActivityMapper.countByUserId(41L);
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql("/testdata/player-activity-data.sql")
    void testSelectActionsVal() {
        Object key = playerActivityMapper.selectActionsVal(41L, "key");
        assertThat(key).isEqualTo("\"value\"");
    }


}
