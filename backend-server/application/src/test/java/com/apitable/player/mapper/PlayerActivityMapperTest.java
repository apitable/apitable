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

package com.apitable.player.mapper;

import org.junit.jupiter.api.Test;

import com.apitable.AbstractMyBatisMapperTest;

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
    @Sql("/sql/player-activity-data.sql")
    void testSelectActionsByUserId() {
        String action = playerActivityMapper.selectActionsByUserId(41L);
        assertThat(action).isEqualTo("{\"key\": \"value\"}");
    }

    @Test
    @Sql("/sql/player-activity-data.sql")
    void testCountByUserId() {
        Integer count = playerActivityMapper.countByUserId(41L);
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql("/sql/player-activity-data.sql")
    void testSelectActionsVal() {
        Object key = playerActivityMapper.selectActionsVal(41L, "key");
        assertThat(key).isEqualTo("\"value\"");
    }


}
