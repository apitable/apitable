package com.vikadata.api.modular.workspace.mapper;

import java.util.Collections;
import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.model.dto.node.UrlNodeInfoDTO;
import com.vikadata.api.model.vo.node.BaseNodeInfo;
import com.vikadata.api.model.vo.node.NodeInfo;
import com.vikadata.api.model.vo.node.NodeInfoTreeVo;
import com.vikadata.api.model.vo.node.NodeInfoVo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

@Disabled
public class NodeMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    NodeMapper nodeMapper;

    @Test
    @Sql("/testdata/node-data.sql")
    void testSelectSpaceIdByNodeIdIncludeDeleted() {
        String id = nodeMapper.selectSpaceIdByNodeIdIncludeDeleted("ni41");
        assertThat(id).isEqualTo("spc41");
    }


    @Test
    @Sql("/testdata/node-data.sql")
    void testSelectNodeIdBySpaceIdAndType() {
        List<String> ids = nodeMapper.selectNodeIdBySpaceIdAndType("spc41", 0);
        assertThat(ids).isNotEmpty();
    }


    @Test
    @Sql("/testdata/node-data.sql")
    void testSelectNodeIdByNodeIdIn() {
        List<String> ids = nodeMapper.selectNodeIdByNodeIdIn(CollUtil.newArrayList("ni41"));
        assertThat(ids).isNotEmpty();
    }


    @Test
    @Sql("/testdata/node-data.sql")
    void testSelectNodeNameByNodeId() {
        String name = nodeMapper.selectNodeNameByNodeId("ni41");
        assertThat(name).isEqualTo("vika body'space");
    }


    @Test
    @Sql("/testdata/node-data.sql")
    void testSelectNodeNameByNodeIdIncludeDeleted() {
        String name = nodeMapper.selectNodeNameByNodeIdIncludeDeleted("ni41");
        assertThat(name).isEqualTo("vika boy'space'");
    }


    @Test
    @Sql("/testdata/node-data.sql")
    void testSelectRootNodeIdBySpaceId() {
        String id = nodeMapper.selectRootNodeIdBySpaceId("spc41");
        assertThat(id).isEqualTo("ni41");
    }


    @Test
    @Sql("/testdata/node-data.sql")
    void testSelectLikeNodeName() {
        List<String> ids = nodeMapper.selectLikeNodeName("spc41", "vika boy");
        assertThat(ids).isNotEmpty();
    }


    @Test
    @Sql({ "/testdata/node-data.sql", "/testdata/space-data.sql" })
    void testSelectNodeInfoByNodeIds() {
        List<NodeInfoVo> entities = nodeMapper.selectNodeInfoByNodeIds(CollUtil.newArrayList("ni41"), 41L);
        assertThat(entities).isNotEmpty();
    }


    @Test
    @Sql({ "/testdata/node-data.sql", "/testdata/space-data.sql" })
    void testSelectNodeInfoTreeByNodeIds() {
        List<NodeInfoTreeVo> entities = nodeMapper.selectNodeInfoTreeByNodeIds(CollUtil.newArrayList("ni41"), 41L);
        assertThat(entities).isNotEmpty();
    }


    @Test
    @Sql("/testdata/node-data.sql")
    void testSelectBaseNodeInfoByNodeId() {
        BaseNodeInfo entity = nodeMapper.selectBaseNodeInfoByNodeId("ni41");
        assertThat(entity).isNotNull();
    }


    @Test
    @Sql("/testdata/node-data.sql")
    void testSelectBaseNodeInfoByNodeIds() {
        List<BaseNodeInfo> entities = nodeMapper.selectBaseNodeInfoByNodeIds(CollUtil.newArrayList("ni41"));
        assertThat(entities).isNotEmpty();
    }


    @Test
    @Sql("/testdata/node-data.sql")
    void testSelectInfoByNodeIds() {
        List<NodeInfo> entities = nodeMapper.selectInfoByNodeIds(CollUtil.newArrayList("ni41"));
        assertThat(entities).isNotEmpty();
    }


    @Test
    @Sql({ "/testdata/node-data.sql", "/testdata/space-data.sql" })
    void testSelectNodeInfoByNodeId() {
        NodeInfoVo entity = nodeMapper.selectNodeInfoByNodeId("ni41");
        assertThat(entity).isNotNull();
    }


    @Test
    @Sql("/testdata/node-data.sql")
    void testSelectSubNodesByOrder() {
        // nodeMapper.selectSubNodesByOrder();
        // assertThat();
    }


    @Test
    @Sql("/testdata/node-data.sql")
    void testSelectParentNodesByOrder() {
        // nodeMapper.selectParentNodesByOrder();
        // assertThat();
    }


    @Test
    @Sql("/testdata/node-data.sql")
    void testSelectSubNodeIds() {
        List<String> ids = nodeMapper.selectSubNodeIds("0");
        assertThat(ids).isNotEmpty();
    }


    // @Test
    // @Sql("/testdata/node-data.sql")
    // void testSelectOrderSubNodeIds() {
    //     nodeMapper.selectOrderSubNodeIds();
    //     assertThat();
    // }
    //
    //
    // @Test
    // @Sql("/testdata/node-data.sql")
    // void testSelectShareTreeByNodeId() {
    //     nodeMapper.selectShareTreeByNodeId();
    //     assertThat();
    // }
    //
    //
    // @Test
    // @Sql("/testdata/node-data.sql")
    // void testSelectShareTree() {
    //     nodeMapper.selectShareTree();
    //     assertThat();
    // }
    //
    //
    // @Test
    // @Sql("/testdata/node-data.sql")
    // void testSelectHasChildren() {
    //     nodeMapper.selectHasChildren();
    //     assertThat();
    // }
    //
    //
    // @Test
    // @Sql("/testdata/node-data.sql")
    // void testSelectAllSubNodeIds() {
    //     nodeMapper.selectAllSubNodeIds();
    //     assertThat();
    // }
    //
    //
    // @Test
    // @Sql("/testdata/node-data.sql")
    // void testSelectAllSubNodeIdsByNodeType() {
    //     nodeMapper.selectAllSubNodeIdsByNodeType();
    //     assertThat();
    // }
    //
    //
    // @Test
    // @Sql("/testdata/node-data.sql")
    // void testSelectNameList() {
    //     nodeMapper.selectNameList();
    //     assertThat();
    // }
    //
    //
    // @Test
    // @Sql("/testdata/node-data.sql")
    // void testSelectBatchAllSubNodeIds() {
    //     nodeMapper.selectBatchAllSubNodeIds();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/testdata/node-data.sql")
    // void testCountBySpaceIdAndType() {
    //     nodeMapper.countBySpaceIdAndType();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/testdata/node-data.sql")
    // void testCountByNodeIds() {
    //     nodeMapper.countByNodeIds();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/testdata/node-data.sql")
    // void testSelectSpaceIdByNodeId() {
    //     nodeMapper.selectSpaceIdByNodeId();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/testdata/node-data.sql")
    // void testSelectSpaceIdsByNodeIds() {
    //     nodeMapper.selectSpaceIdsByNodeIds();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/testdata/node-data.sql")
    // void testSelectSpaceIdByNodeIdAndType() {
    //     nodeMapper.selectSpaceIdByNodeIdAndType();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/testdata/node-data.sql")
    // void testSelectByNodeId() {
    //     nodeMapper.selectByNodeId();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/testdata/node-data.sql")
    // void testSelectByNodeIds() {
    //     nodeMapper.selectByNodeIds();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/testdata/node-data.sql")
    // void testSelectParentNodePath() {
    //     nodeMapper.selectParentNodePath();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/testdata/node-data.sql")
    // void testSelectParentNodeListByNodeId() {
    //     nodeMapper.selectParentNodeListByNodeId();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/testdata/node-data.sql")
    // void testSelectParentNodeByNodeIds() {
    //     nodeMapper.selectParentNodeByNodeIds();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/testdata/node-data.sql")
    // void testSelectParentIdByNodeId() {
    //     nodeMapper.selectParentIdByNodeId();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/testdata/node-data.sql")
    // void testSelectNodeTypeByNodeId() {
    //     nodeMapper.selectNodeTypeByNodeId();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/testdata/node-data.sql")
    // void testSelectNodeIdByPreNodeIdIn() {
    //     nodeMapper.selectNodeIdByPreNodeIdIn();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/testdata/node-data.sql")
    // void testSelectAllParentNodeIdsByNodeIds() {
    //     nodeMapper.selectAllParentNodeIdsByNodeIds();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/testdata/node-data.sql")
    // void testSelectIsTemplateByNodeId() {
    //     nodeMapper.selectIsTemplateByNodeId();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/testdata/node-data.sql")
    // void testSelectBaseNodeInfoByNodeIdsIncludeDelete() {
    //     nodeMapper.selectBaseNodeInfoByNodeIdsIncludeDelete();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/testdata/node-data.sql")
    // void testSelectRubbishUpdatedAtByNodeId() {
    //     nodeMapper.selectRubbishUpdatedAtByNodeId();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/testdata/node-data.sql")
    // void testSelectRubbishNodeIds() {
    //     nodeMapper.selectRubbishNodeIds();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/testdata/node-data.sql")
    // void testSelectRubbishNodeInfo() {
    //     nodeMapper.selectRubbishNodeInfo();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/testdata/node-data.sql")
    // void testSelectNodeBaseInfoByNodeId() {
    //     nodeMapper.selectNodeBaseInfoByNodeId();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/testdata/node-data.sql")
    // void testSelectDingTalkDaStatusByNodeId() {
    //     nodeMapper.selectDingTalkDaStatusByNodeId();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/testdata/node-data.sql")
    // void testSelectExtraByNodeId() {
    //     nodeMapper.selectExtraByNodeId();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("/testdata/node-data.sql")
    // void testSelectNodeIdByNodeIds() {
    //     nodeMapper.selectNodeIdByNodeIds();
    //     assertThat();
    // }

    @Test
    @Sql("/testdata/node-data.sql")
    void testSelectSpaceIdAndNodeNameByNodeId() {
        UrlNodeInfoDTO dto = nodeMapper.selectSpaceIdAndNodeNameByNodeId("ni45");
        assertThat(dto.getSpaceId()).isEqualTo("spc41");
    }

    @Test
    @Sql("/testdata/node-data.sql")
    void testSelectSpaceIdAndNodeNameByNodeIds() {
        List<UrlNodeInfoDTO> dto = nodeMapper.selectSpaceIdAndNodeNameByNodeIds(Collections.singletonList("ni45"));
        assertThat(dto.size()).isEqualTo(1);
    }
}
