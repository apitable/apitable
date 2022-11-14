package com.vikadata.api.modular.statics.mapper;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.space.mapper.StaticsMapper;
import com.vikadata.api.space.model.NodeStaticsVO;
import com.vikadata.api.space.model.NodeTypeStatics;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     Data access layer: related table calculation test
 * </p>
 */
@Disabled
public class StaticsMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    StaticsMapper staticsMapper;

    @Test
    @Sql({ "/testdata/space-member-role-rel-data.sql", "/testdata/space-role-resource-rel-data.sql"})
    void testCountSubAdminBySpaceId() {
        Long count = staticsMapper.countSubAdminBySpaceId("spc41");
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql("/testdata/unit-member-data.sql")
    void testCountMemberBySpaceId() {
        Long count = staticsMapper.countMemberBySpaceId("spc41");
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql("/testdata/unit-team-data.sql")
    void testCountTeamBySpaceId() {
        Long count = staticsMapper.countTeamBySpaceId("spc41");
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql({ "/testdata/datasheet-meta-data.sql", "/testdata/datasheet-data.sql" })
    void testCountRecordsBySpaceId() {
        Long count = staticsMapper.countRecordsBySpaceId("spc41");
        assertThat(count).isEqualTo(3);
    }

    @Test
    @Sql("/testdata/api-usage-data.sql")
    void testCountApiUsageBySpaceId() {
        Long count = staticsMapper.countApiUsageBySpaceId("spc41", 0L);
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql("/testdata/api-usage-data.sql")
    void testSelectApiUsageMinIdByCreatedAt() {
        LocalDateTime time = LocalDateTime.of(2021, 1, 1, 0, 0);
        Long id = staticsMapper.selectApiUsageMinIdByCreatedAt(0L, time);
        assertThat(id).isEqualTo(41L);
    }

    @Test
    @Sql("/testdata/api-usage-data.sql")
    void testSelectMaxId() {
        Long id = staticsMapper.selectMaxId();
        assertThat(id).isEqualTo(41L);
    }

    @Test
    @Sql("/testdata/space-asset-data.sql")
    void testSelectFileSizeBySpaceId() {
        List<Integer> entities = staticsMapper.selectFileSizeBySpaceId("spc41");
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/testdata/node-data.sql")
    void testSelectNodeStaticsBySpaceId() {
        NodeStaticsVO entity = staticsMapper.selectNodeStaticsBySpaceId("spc41");
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql("/testdata/node-data.sql")
    void testSelectNodeTypeStaticsBySpaceId() {
        List<NodeTypeStatics> entity = staticsMapper.selectNodeTypeStaticsBySpaceId("spc41");
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql({ "/testdata/datasheet-meta-data.sql", "/testdata/datasheet-data.sql" })
    void testSelectDstViewStaticsBySpaceId() {
        List<String> entities = staticsMapper.selectDstViewStaticsBySpaceId("spc41");
        assertThat(entities).isNotEmpty();
    }

}
