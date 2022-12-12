package com.vikadata.api.workspace.mapper;

import java.util.List;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.workspace.mapper.NodeFavoriteMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

@Disabled
public class NodeFavoriteMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    NodeFavoriteMapper nodeFavoriteMapper;

    @Test
    @Sql("/sql/node-favorite-data.sql")
    void testSelectOrderNodeIdByMemberId() {
        List<String> ids = nodeFavoriteMapper.selectOrderNodeIdByMemberId(41L);
        assertThat(ids).isNotEmpty();
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
