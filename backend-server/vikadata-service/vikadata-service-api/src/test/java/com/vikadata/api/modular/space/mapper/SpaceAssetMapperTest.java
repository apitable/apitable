package com.vikadata.api.modular.space.mapper;

import java.util.Collections;
import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.model.dto.space.NodeAssetDto;
import com.vikadata.api.model.dto.space.SpaceAssetDto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     数据访问层测试：工作台-附件表测试
 * </p>
 * @author wuyitao
 * @date 2022/4/5 1:13 AM
 */
public class SpaceAssetMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    SpaceAssetMapper spaceAssetMapper;

    @Test
    @Sql("/testdata/space-asset-data.sql")
    void testSelectDistinctAssetIdByNodeIdIn() {
        List<Long> assetIds = spaceAssetMapper.selectDistinctAssetIdByNodeIdIn(Collections.singleton("ni41"));
        assertThat(assetIds).isNotNull();
    }

    @Test
    @Sql("/testdata/space-asset-data.sql")
    void testSelectDto() {
        SpaceAssetDto entity = spaceAssetMapper.selectDto("spc41", "ni41", 41L);
        assertThat(entity).isNotNull();
    }


    @Test
    @Sql("/testdata/space-asset-data.sql")
    void testSelectDtoByAssetIdsAndType() {
        List<SpaceAssetDto> entities = spaceAssetMapper.selectDtoByAssetIdsAndType("spc41", "ni41", 2, CollUtil.newArrayList(41L));
        assertThat(entities).isNotEmpty();
    }


    @Test
    @Sql("/testdata/space-asset-data.sql")
    void testSelectNodeAssetDto() {
        List<NodeAssetDto> entities = spaceAssetMapper.selectNodeAssetDto(CollUtil.newArrayList("ni41"));
        assertThat(entities).isNotEmpty();
    }


    @Test
    @Sql("/testdata/space-asset-data.sql")
    void testCountBySpaceIdAndAssetChecksum() {
        Integer count = spaceAssetMapper.countBySpaceIdAndAssetChecksum("spc41", "checksum");
        assertThat(count).isEqualTo(1);
    }


    @Test
    @Sql({ "/testdata/space-asset-data.sql", "/testdata/asset-data.sql" })
    void testSelectFileSizeBySpaceId() {
        List<Integer> entities = spaceAssetMapper.selectFileSizeBySpaceId("spc41");
        assertThat(entities).isNotEmpty();
    }

}
