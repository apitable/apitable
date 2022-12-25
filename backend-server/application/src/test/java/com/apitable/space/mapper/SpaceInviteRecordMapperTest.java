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

import org.junit.jupiter.api.Test;

import com.apitable.AbstractMyBatisMapperTest;
import com.apitable.space.entity.SpaceInviteRecordEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

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

}
