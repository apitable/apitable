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
        List<String> ids = nodeMapper.selectLikeNodeName("spczJrh2i3tLW", "1");
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
    void testSelectSubNodesByOrder() {
        // nodeMapper.selectSubNodesByOrder();
        // assertThat();
    }


    @Test
    @Sql("/sql/node-data.sql")
    void testSelectParentNodesByOrder() {
        // nodeMapper.selectParentNodesByOrder();
        // assertThat();
    }


    @Test
    @Sql("/sql/node-data.sql")
    void testSelectSubNodeIds() {
        List<String> ids = nodeMapper.selectSubNodeIds("0");
        assertThat(ids).isNotEmpty();
    }


    // @Test
    // @Sql("/sql/node-data.sql")
    // void testSelectOrderSubNodeIds() {
    //     nodeMapper.selectOrderSubNodeIds();
    //     assertThat();
    // }
    //
    //
    // @Test
    // @Sql("/sql/node-data.sql")
    // void testSelectShareTreeByNodeId() {
    //     nodeMapper.selectShareTreeByNodeId();
    //     assertThat();
    // }
    //
    //
    // @Test
    // @Sql("/sql/node-data.sql")
    // void testSelectShareTree() {
    //     nodeMapper.selectShareTree();
    //     assertThat();
    // }
    //
    //
    // @Test
    // @Sql("/sql/node-data.sql")
    // void testSelectHasChildren() {
    //     nodeMapper.selectHasChildren();
    //     assertThat();
    // }
    //
    //
    // @Test
    // @Sql("/sql/node-data.sql")
    // void testSelectAllSubNodeIds() {
    //     nodeMapper.selectAllSubNodeIds();
    //     assertThat();
    // }
    //
    //
    // @Test
    // @Sql("/sql/node-data.sql")
    // void testSelectAllSubNodeIdsByNodeType() {
    //     nodeMapper.selectAllSubNodeIdsByNodeType();
    //     assertThat();
    // }
    //
    //
    // @Test
    // @Sql("/sql/node-data.sql")
    // void testSelectNameList() {
    //     nodeMapper.selectNameList();
    //     assertThat();
    // }
    //
    //
    // @Test
    // @Sql("/sql/node-data.sql")
    // void testSelectBatchAllSubNodeIds() {
    //     nodeMapper.selectBatchAllSubNodeIds();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/sql/node-data.sql")
    // void testCountBySpaceIdAndType() {
    //     nodeMapper.countBySpaceIdAndType();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/sql/node-data.sql")
    // void testCountByNodeIds() {
    //     nodeMapper.countByNodeIds();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/sql/node-data.sql")
    // void testSelectSpaceIdByNodeId() {
    //     nodeMapper.selectSpaceIdByNodeId();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/sql/node-data.sql")
    // void testSelectSpaceIdsByNodeIds() {
    //     nodeMapper.selectSpaceIdsByNodeIds();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/sql/node-data.sql")
    // void testSelectSpaceIdByNodeIdAndType() {
    //     nodeMapper.selectSpaceIdByNodeIdAndType();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/sql/node-data.sql")
    // void testSelectByNodeId() {
    //     nodeMapper.selectByNodeId();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/sql/node-data.sql")
    // void testSelectByNodeIds() {
    //     nodeMapper.selectByNodeIds();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/sql/node-data.sql")
    // void testSelectParentNodePath() {
    //     nodeMapper.selectParentNodePath();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/sql/node-data.sql")
    // void testSelectParentNodeListByNodeId() {
    //     nodeMapper.selectParentNodeListByNodeId();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/sql/node-data.sql")
    // void testSelectParentNodeByNodeIds() {
    //     nodeMapper.selectParentNodeByNodeIds();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/sql/node-data.sql")
    // void testSelectParentIdByNodeId() {
    //     nodeMapper.selectParentIdByNodeId();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/sql/node-data.sql")
    // void testSelectNodeTypeByNodeId() {
    //     nodeMapper.selectNodeTypeByNodeId();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/sql/node-data.sql")
    // void testSelectNodeIdByPreNodeIdIn() {
    //     nodeMapper.selectNodeIdByPreNodeIdIn();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/sql/node-data.sql")
    // void testSelectAllParentNodeIdsByNodeIds() {
    //     nodeMapper.selectAllParentNodeIdsByNodeIds();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/sql/node-data.sql")
    // void testSelectIsTemplateByNodeId() {
    //     nodeMapper.selectIsTemplateByNodeId();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/sql/node-data.sql")
    // void testSelectBaseNodeInfoByNodeIdsIncludeDelete() {
    //     nodeMapper.selectBaseNodeInfoByNodeIdsIncludeDelete();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/sql/node-data.sql")
    // void testSelectRubbishUpdatedAtByNodeId() {
    //     nodeMapper.selectRubbishUpdatedAtByNodeId();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/sql/node-data.sql")
    // void testSelectRubbishNodeIds() {
    //     nodeMapper.selectRubbishNodeIds();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/sql/node-data.sql")
    // void testSelectRubbishNodeInfo() {
    //     nodeMapper.selectRubbishNodeInfo();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/sql/node-data.sql")
    // void testSelectNodeBaseInfoByNodeId() {
    //     nodeMapper.selectNodeBaseInfoByNodeId();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/sql/node-data.sql")
    // void testSelectDingTalkDaStatusByNodeId() {
    //     nodeMapper.selectDingTalkDaStatusByNodeId();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/sql/node-data.sql")
    // void testSelectExtraByNodeId() {
    //     nodeMapper.selectExtraByNodeId();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/sql/node-data.sql")
    // void testSelectNodeIdByNodeIds() {
    //     nodeMapper.selectNodeIdByNodeIds();
    //     assertThat();
    // }

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
    void test() {
        List<String> nodeIds =
            nodeMapper.selectNodeIdsBySpaceIdAndTypeAndKeyword("spczJrh2i3tLW", 1, "A2");
        assertThat(nodeIds).contains("fodBa5JGDQZbQ");
    }
}
