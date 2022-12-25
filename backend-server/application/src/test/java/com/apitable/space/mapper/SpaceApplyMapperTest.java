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

package com.apitable.space.mapper;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.apitable.AbstractMyBatisMapperTest;
import com.apitable.space.dto.SpaceApplyDTO;

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
