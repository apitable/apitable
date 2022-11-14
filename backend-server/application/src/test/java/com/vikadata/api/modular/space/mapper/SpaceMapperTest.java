package com.vikadata.api.modular.space.mapper;

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.space.dto.BaseSpaceInfoDTO;
import com.vikadata.api.space.dto.SpaceAdminInfoDTO;
import com.vikadata.api.space.mapper.SpaceMapper;
import com.vikadata.api.space.vo.SpaceVO;
import com.vikadata.entity.SpaceEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

@Disabled
public class SpaceMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    SpaceMapper spaceMapper;

    @Test
    @Sql("/testdata/space-data.sql")
    void testSelectSpaceNameBySpaceId() {
        String name = spaceMapper.selectSpaceNameBySpaceId("spc41");
        assertThat(name).isEqualTo("41'space");
    }

    @Test
    @Sql("/testdata/space-data.sql")
    void testSelectBySpaceId() {
        SpaceEntity entity = spaceMapper.selectBySpaceId("spc41");
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql("/testdata/space-data.sql")
    void testSelectBySpaceIds() {
        List<SpaceEntity> entities = spaceMapper.selectBySpaceIds(CollUtil.newArrayList("spc41"));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql({ "/testdata/space-data.sql", "/testdata/unit-member-data.sql" })
    void testSelectListByUserId() {
        List<SpaceVO> entities = spaceMapper.selectListByUserId(41L);
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql({ "/testdata/space-data.sql", "/testdata/unit-member-data.sql" })
    void testGetAdminSpaceCount() {
        Integer count = spaceMapper.getAdminSpaceCount(41L);
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql({ "/testdata/space-data.sql", "/testdata/unit-member-data.sql", "/testdata/user-data.sql"})
    void testSelectAdminInfoDto() {
        SpaceAdminInfoDTO entity = spaceMapper.selectAdminInfoDto("spc41");
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql("/testdata/space-data.sql")
    void testSelectSpaceMainAdmin() {
        Long id = spaceMapper.selectSpaceMainAdmin("spc41");
        assertThat(id).isEqualTo(41L);
    }

    @Test
    @Sql("/testdata/space-data.sql")
    void testSelectPropsBySpaceId() {
        String props = spaceMapper.selectPropsBySpaceId("spc41");
        assertThat(props).isEqualTo("{\"joinable\": 1, \"invitable\": 1, \"mobileShowable\": 0, \"nodeExportable\": 0, \"watermarkEnable\": 0}");
    }

    @Test
    @Sql("/testdata/space-data.sql")
    void testCountBySpaceId() {
        Integer count = spaceMapper.countBySpaceId("spc41", null);
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql({ "/testdata/space-data.sql", "/testdata/unit-member-data.sql" })
    void testSelectSpaceIdByUserIdAndName() {
        String id = spaceMapper.selectSpaceIdByUserIdAndName(41L, "41");
        assertThat(id).isEqualTo("spc41");
    }

    @Test
    @Sql("/testdata/space-data.sql")
    void testSelectBaseSpaceInfo() {
        List<BaseSpaceInfoDTO> entities = spaceMapper.selectBaseSpaceInfo(CollUtil.newArrayList("spc41"));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql({ "/testdata/space-data.sql", "/testdata/unit-member-data.sql" })
    void testSelectByUserId() {
        List<SpaceEntity> entities = spaceMapper.selectByUserId(41L);
        assertThat(entities).isNotEmpty();
    }
}
