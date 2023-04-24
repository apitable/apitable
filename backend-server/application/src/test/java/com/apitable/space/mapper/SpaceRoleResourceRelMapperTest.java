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

import cn.hutool.core.collection.CollUtil;
import com.apitable.AbstractMyBatisMapperTest;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

public class SpaceRoleResourceRelMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    SpaceRoleResourceRelMapper spaceRoleResourceRelMapper;

    @Test
    @Sql("/sql/space-role-resource-rel-data.sql")
    void testSelectRoleCodeByResourceCodes() {
        List<String> roles = spaceRoleResourceRelMapper.selectRoleCodeByResourceCodes(CollUtil.newArrayList("MANAGE_WORKBENCH_SETTING"));
        assertThat(roles).isNotEmpty();
    }

    @Test
    @Sql("/sql/space-role-resource-rel-data.sql")
    void testSelectResourceCodesByRoleCode() {
        List<String> resourceCodes = spaceRoleResourceRelMapper.selectResourceCodesByRoleCode("ROLE_SPCWYNIGV7BQF_95D9F5");
        assertThat(resourceCodes).isNotEmpty();
        assertThat(resourceCodes.size()).isEqualTo(1);
        assertThat(resourceCodes.get(0)).isEqualTo("MANAGE_WORKBENCH_SETTING");
    }

}
