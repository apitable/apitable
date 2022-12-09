package com.vikadata.api.organization.mapper;

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.organization.mapper.UnitMapper;
import com.vikadata.api.organization.entity.UnitEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

public class UnitMapperTest extends AbstractMyBatisMapperTest {
    @Autowired
    UnitMapper unitMapper;

    @Test
    @Sql("/testdata/unit-data.sql")
    void testSelectCountBySpaceIdAndIds() {
        Integer count = unitMapper.selectCountBySpaceIdAndIds("spc41", CollUtil.newArrayList(41L));
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql("/testdata/unit-data.sql")
    void testSelectUnitIdByRefId() {
        Long id = unitMapper.selectUnitIdByRefId(41L);
        assertThat(id).isEqualTo(41L);
    }

    @Test
    @Sql("/testdata/unit-data.sql")
    void testSelectRefIdById() {
        Long id = unitMapper.selectRefIdById(41L);
        assertThat(41L).isEqualTo(id);
    }

    @Test
    @Sql("/testdata/unit-data.sql")
    void testSelectByRefId() {
        UnitEntity entity = unitMapper.selectByRefId(41L);
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql("/testdata/unit-data.sql")
    void testSelectIdBySpaceId() {
        List<Long> ids = unitMapper.selectIdBySpaceId("spc41");
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql("/testdata/unit-data.sql")
    void testSelectIdsByRefIds() {
        List<Long> ids = unitMapper.selectIdsByRefIds(CollUtil.newArrayList(41L));
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql("/testdata/unit-data.sql")
    void testSelectByRefIds() {
        List<UnitEntity> entities = unitMapper.selectByRefIds(CollUtil.newArrayList(41L));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/testdata/unit-data.sql")
    void testSelectByUnitIds() {
        List<UnitEntity> entities = unitMapper.selectByUnitIds(CollUtil.newArrayList(41L));
        assertThat(entities).isNotEmpty();
    }
}
