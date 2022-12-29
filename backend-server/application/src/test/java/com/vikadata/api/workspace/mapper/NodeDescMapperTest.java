package com.vikadata.api.workspace.mapper;

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.workspace.dto.NodeDescDTO;
import com.vikadata.api.workspace.mapper.NodeDescMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

public class NodeDescMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    NodeDescMapper nodeDescMapper;

    @Test
    @Sql("/sql/node-desc-data.sql")
    void testSelectIdByNodeId() {
        Long id = nodeDescMapper.selectIdByNodeId("dstB6QLFlvNsaZLa7Y");
        assertThat(id).isEqualTo(41);
    }

    @Test
    @Sql("/sql/node-desc-data.sql")
    void testSelectDescriptionByNodeId() {
        String description = nodeDescMapper.selectDescriptionByNodeId("dstB6QLFlvNsaZLa7Y");
        assertThat(description).isEqualTo("description");
    }

    @Test
    @Sql("/sql/node-desc-data.sql")
    void testSelectByNodeIds() {
        List<NodeDescDTO> entities = nodeDescMapper.selectByNodeIds(CollUtil.newArrayList("dstB6QLFlvNsaZLa7Y"));
        assertThat(entities).isNotEmpty();
    }

}
