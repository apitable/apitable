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

import cn.hutool.core.collection.CollUtil;
import com.apitable.AbstractMyBatisMapperTest;
import com.apitable.workspace.dto.UrlNodeInfoDTO;
import com.apitable.workspace.vo.BaseNodeInfo;
import com.apitable.workspace.vo.NodeInfo;
import com.apitable.workspace.vo.NodeInfoTreeVo;
import com.apitable.workspace.vo.NodeInfoVo;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

public class NodeMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    NodeMapper nodeMapper;

    @Test
    @Sql("/sql/node-data.sql")
    void testSelectSpaceIdByNodeIdIncludeDeleted() {
        String id = nodeMapper.selectSpaceIdByNodeIdIncludeDeleted("ni41");
        assertThat(id).isEqualTo("spc41");
    }


    @Test
    @Sql("/sql/node-data.sql")
    void testSelectNodeIdBySpaceIdAndType() {
        List<String> ids = nodeMapper.selectNodeIdBySpaceIdAndType("spc41", 0);
        assertThat(ids).isNotEmpty();
    }


    @Test
    @Sql("/sql/node-data.sql")
    void testSelectNodeIdByNodeIdIn() {
        List<String> ids = nodeMapper.selectNodeIdByNodeIdIn(CollUtil.newArrayList("ni41"));
        assertThat(ids).isNotEmpty();
    }


    @Test
    @Sql("/sql/node-data.sql")
    void testSelectNodeNameByNodeId() {
        String name = nodeMapper.selectNodeNameByNodeId("ni41");
        assertThat(name).isEqualTo("apitable boy");
    }


    @Test
    @Sql("/sql/node-data.sql")
    void testSelectNodeNameByNodeIdIncludeDeleted() {
        String name = nodeMapper.selectNodeNameByNodeIdIncludeDeleted("ni41");
        assertThat(name).isEqualTo("apitable boy");
    }


    @Test
    @Sql("/sql/node-data.sql")
    void testSelectRootNodeIdBySpaceId() {
        String id = nodeMapper.selectRootNodeIdBySpaceId("spcBrtP3ulTXR");
        assertThat(id).isEqualTo("dstb1FgRa6KVzli7cm");
    }


    @Test
    @Sql("/sql/node-data.sql")
    void testSelectLikeNodeName() {
        List<String> ids =
            nodeMapper.selectLikeNodeName("spczJrh2i3tLW", Collections.singletonList(0L), "1");
        assertThat(ids).isNotEmpty();
    }


    @Test
    @Sql({"/sql/node-data.sql", "/sql/space-data.sql"})
    void testSelectNodeInfoByNodeIds() {
        List<NodeInfoVo> entities =
            nodeMapper.selectNodeInfoByNodeIds(CollUtil.newArrayList("ni41"), 41L);
        assertThat(entities).isNotEmpty();
    }


    @Test
    @Sql({"/sql/node-data.sql", "/sql/space-data.sql"})
    void testSelectNodeInfoTreeByNodeIds() {
        List<NodeInfoTreeVo> entities =
            nodeMapper.selectNodeInfoTreeByNodeIds(CollUtil.newArrayList("ni41"), 41L);
        assertThat(entities).isNotEmpty();
    }


    @Test
    @Sql("/sql/node-data.sql")
    void testSelectBaseNodeInfoByNodeId() {
        BaseNodeInfo entity = nodeMapper.selectBaseNodeInfoByNodeId("ni41");
        assertThat(entity).isNotNull();
    }


    @Test
    @Sql("/sql/node-data.sql")
    void testSelectBaseNodeInfoByNodeIds() {
        List<BaseNodeInfo> entities =
            nodeMapper.selectBaseNodeInfoByNodeIds(CollUtil.newArrayList("ni41"));
        assertThat(entities).isNotEmpty();
    }


    @Test
    @Sql("/sql/node-data.sql")
    void testSelectInfoByNodeIds() {
        List<NodeInfo> entities = nodeMapper.selectInfoByNodeIds(CollUtil.newArrayList("ni41"));
        assertThat(entities).isNotEmpty();
    }


    @Test
    @Sql({"/sql/node-data.sql", "/sql/space-data.sql"})
    void testSelectNodeInfoByNodeId() {
        NodeInfoVo entity = nodeMapper.selectNodeInfoByNodeId("ni41");
        assertThat(entity).isNotNull();
    }


    @Test
    @Sql("/sql/node-data.sql")
    void testSelectSubNodeIds() {
        List<String> ids = nodeMapper.selectSubNodeIds("0");
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql("/sql/node-data.sql")
    void testSelectSpaceIdAndNodeNameByNodeId() {
        UrlNodeInfoDTO dto = nodeMapper.selectSpaceIdAndNodeNameByNodeId("ni45");
        assertThat(dto.getSpaceId()).isEqualTo("spc41");
    }

    @Test
    @Sql("/sql/node-data.sql")
    void testSelectSpaceIdAndNodeNameByNodeIds() {
        List<UrlNodeInfoDTO> dto =
            nodeMapper.selectSpaceIdAndNodeNameByNodeIds(Collections.singletonList("ni45"));
        assertThat(dto.size()).isEqualTo(1);
    }

    @Test
    @Sql("/sql/node-data.sql")
    void testNodeIdsBySpaceIdAndTypeAndKeyword() {
        List<String> nodeIds =
            nodeMapper.selectNodeIdsBySpaceIdAndTypeAndKeyword("spczJrh2i3tLW", 1, "A2");
        assertThat(nodeIds).contains("fodBa5JGDQZbQ");
    }
}
