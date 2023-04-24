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

package com.apitable.workspace.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import com.apitable.AbstractMyBatisMapperTest;
import com.apitable.workspace.dto.NodeTreeDTO;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

public class NodeFavoriteMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    NodeFavoriteMapper nodeFavoriteMapper;

    @Test
    @Sql("/sql/node-favorite-data.sql")
    void testSelectOrderNodeIdByMemberId() {
        List<NodeTreeDTO> nodes = nodeFavoriteMapper.selectNodeTreeDTOByMemberId(41L);
        assertThat(nodes).isNotEmpty();
    }

    @Test
    @Sql("/sql/node-favorite-data.sql")
    void testSelectNodeIdByMemberId() {
        List<String> ids = nodeFavoriteMapper.selectNodeIdByMemberId(41L);
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql("/sql/node-favorite-data.sql")
    void testCountByMemberIdAndNodeId() {
        Integer count = nodeFavoriteMapper.countByMemberIdAndNodeId(41L, "ni41");
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql("/sql/node-favorite-data.sql")
    void testSelectPreNodeIdByMemberIdAndNodeId() {
        String id = nodeFavoriteMapper.selectPreNodeIdByMemberIdAndNodeId(41L, "ni41");
        assertThat(id).isNull();
    }

}
