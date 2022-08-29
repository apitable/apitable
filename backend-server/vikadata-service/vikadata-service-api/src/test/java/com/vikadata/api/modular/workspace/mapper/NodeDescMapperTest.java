package com.vikadata.api.modular.workspace.mapper;

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.model.dto.node.NodeDescDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     数据访问层测试：工作台-节点描述表测试
 * </p>
 * @author wuyitao
 * @date 2022/4/6 2:42 PM
 */
public class NodeDescMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    NodeDescMapper nodeDescMapper;

    @Test
    @Sql("/testdata/node-desc-data.sql")
    void testSelectIdByNodeId() {
        Long id = nodeDescMapper.selectIdByNodeId("dstB6QLFlvNsaZLa7Y");
        assertThat(id).isEqualTo(41);
    }

    @Test
    @Sql("/testdata/node-desc-data.sql")
    void testSelectDescriptionByNodeId() {
        String description = nodeDescMapper.selectDescriptionByNodeId("dstB6QLFlvNsaZLa7Y");
        assertThat(description).isEqualTo("description");
    }

    @Test
    @Sql("/testdata/node-desc-data.sql")
    void testSelectByNodeIds() {
        List<NodeDescDTO> entities = nodeDescMapper.selectByNodeIds(CollUtil.newArrayList("dstB6QLFlvNsaZLa7Y"));
        assertThat(entities).isNotEmpty();
    }

}
