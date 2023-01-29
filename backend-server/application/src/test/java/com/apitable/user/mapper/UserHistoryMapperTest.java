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

package com.apitable.user.mapper;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.Test;

import com.apitable.AbstractMyBatisMapperTest;
import com.apitable.user.dto.PausedUserHistoryDto;
import com.apitable.user.entity.UserHistoryEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     Data access layer test: user history table test
 * </p>
 */
public class UserHistoryMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    UserHistoryMapper userHistoryMapper;

    @Test
    @Sql("/sql/user-history-data.sql")
    void testSelectLatest() {
        UserHistoryEntity entity = userHistoryMapper.selectLatest(41L, 1);
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql("/sql/user-history-data.sql")
    void testSelectUserHistoryDtos() {
        List<PausedUserHistoryDto> entities = userHistoryMapper.selectUserHistoryDtos(LocalDateTime.of(2020, 10, 1, 0, 0),
                LocalDateTime.of(2022, 10, 30, 23, 59), 1);
        assertThat(entities).isNotEmpty();
    }

}
