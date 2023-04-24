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

public class SpaceMemberRoleRelMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    SpaceMemberRoleRelMapper spaceMemberRoleRelMapper;

    @Test
    @Sql({"/sql/space-member-role-rel-data.sql", "/sql/space-role-resource-rel-data.sql"})
    void testSelectSubAdminBySpaceId() {
        List<Long> ids = spaceMemberRoleRelMapper.selectSubAdminBySpaceId("spc41");
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql({"/sql/space-member-role-rel-data.sql"})
    void testSelectRoleCodesBySpaceId() {
        List<String> entities = spaceMemberRoleRelMapper.selectRoleCodesBySpaceId("spc41");
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql({"/sql/space-member-role-rel-data.sql"})
    void testSelectCountBySpaceIdAndMemberId() {
        Integer count = spaceMemberRoleRelMapper.selectCountBySpaceIdAndMemberId("spc41", 41L);
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql({"/sql/space-member-role-rel-data.sql"})
    void testSelectCountBySpaceIdAndMemberIds() {
        Integer count = spaceMemberRoleRelMapper.selectCountBySpaceIdAndMemberIds("spc41",
            CollUtil.newArrayList(41L));
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql({"/sql/space-member-role-rel-data.sql"})
    void testSelectRoleCodeByMemberId() {
        String role = spaceMemberRoleRelMapper.selectRoleCodeByMemberId("spc41", 41L);
        assertThat(role).isEqualTo("ROLE_SPCWYNIGV7BQF_95D9F5");
    }

    @Test
    @Sql({"/sql/space-member-role-rel-data.sql"})
    void testSelectRoleCodesBySpaceIdAndRoleCodes() {
        List<String> roles = spaceMemberRoleRelMapper.selectRoleCodesBySpaceIdAndRoleCodes("spc41",
            CollUtil.newArrayList("ROLE_SPCWYNIGV7BQF_95D9F5"));
        assertThat(roles).isNotEmpty();
    }

    @Test
    @Sql({"/sql/space-member-role-rel-data.sql"})
    void testSelectMemberIdBySpaceIdAndRoleCodes() {
        List<Long> ids = spaceMemberRoleRelMapper.selectMemberIdBySpaceIdAndRoleCodes("spc41",
            CollUtil.newArrayList("ROLE_SPCWYNIGV7BQF_95D9F5"));
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql({"/sql/space-member-role-rel-data.sql"})
    void testSelectRoleCodeByMemberIds() {
        List<String> roles =
            spaceMemberRoleRelMapper.selectRoleCodeByMemberIds("spc41", CollUtil.newArrayList(41L));
        assertThat(roles).isNotEmpty();
    }
}
