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

import org.junit.jupiter.api.Test;

import com.apitable.AbstractMyBatisMapperTest;
import com.apitable.user.entity.DeveloperEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

class DeveloperMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    private DeveloperMapper developerMapper;

    @Test
    @Sql("/sql/developer-data.sql")
    void testSelectByUserId() {
        DeveloperEntity entity = developerMapper.selectByUserId(1405421703738732546L);
        assertThat(entity).isNotNull();
        assertThat(entity.getApiKey()).isEqualTo("usk7NTaCamudhiVOCqulStD");
    }

    @Test
    @Sql("/sql/developer-data.sql")
    void testSelectUserIdByApiKey() {
        Long id = developerMapper.selectUserIdByApiKey("usk9kp7HhcILVhr2V2PfyQW");
        assertThat(id).isEqualTo(1373841089819181057L);
    }
}