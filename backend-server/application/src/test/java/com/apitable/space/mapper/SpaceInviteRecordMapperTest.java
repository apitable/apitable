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

import static org.assertj.core.api.Assertions.assertThat;

import com.apitable.AbstractMyBatisMapperTest;
import com.apitable.space.entity.SpaceInviteRecordEntity;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

/**
 * @author wuyitao
 * @date 2022/4/5 1:14 AM
 */
public class SpaceInviteRecordMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    SpaceInviteRecordMapper spaceInviteRecordMapper;

    @Test
    @Sql("/sql/space-invite-record-data.sql")
    void testSelectByInviteToken() {
        SpaceInviteRecordEntity entity = spaceInviteRecordMapper.selectByInviteToken("token");
        assertThat(entity).isNotNull();
    }


    @Test
    @Sql("/sql/space-invite-record-data.sql")
    void testSelectCountBySpaceIdAndBetween() {
        LocalDateTime startAt = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endAt =
            LocalDateTime.now().plusDays(1).withHour(0).withMinute(0).withSecond(0);
        Integer count =
            spaceInviteRecordMapper.selectCountBySpaceIdAndBetween("spc41", startAt, endAt);
        assertThat(count).isEqualTo(1);
    }
}
