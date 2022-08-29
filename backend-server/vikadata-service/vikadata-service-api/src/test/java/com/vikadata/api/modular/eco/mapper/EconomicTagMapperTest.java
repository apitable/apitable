package com.vikadata.api.modular.eco.mapper;

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.entity.EconomicTagEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     数据访问层测试：经济模块-标签表测试
 * </p>
 *
 * @author wuyitao
 * @date 2022/3/31 9:50 AM
 */
public class EconomicTagMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    EconomicTagMapper economicTagMapper;

    @Test
    @Sql("/testdata/economic-tag-data.sql")
    void testSelectByObjectId() {
        List<EconomicTagEntity> entities = economicTagMapper.selectByObjectId("107b83b1-f482-40d4-8a45-40f386f95c2a");
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/testdata/economic-tag-data.sql")
    void testSelectByObjectIds() {
        List<EconomicTagEntity> entities = economicTagMapper.selectByObjectIds(CollUtil.newArrayList("107b83b1-f482-40d4-8a45-40f386f95c2a"));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/testdata/economic-tag-data.sql")
    void testSelectByTagIdAndObjectIds() {
        List<EconomicTagEntity> entities = economicTagMapper.selectByTagIdAndObjectIds("001", CollUtil.newArrayList("107b83b1-f482-40d4-8a45-40f386f95c2a"));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/testdata/economic-tag-data.sql")
    void testSelectCountByObjectIdAndTagId() {
        Integer count = economicTagMapper.selectCountByObjectIdAndTagId("107b83b1-f482-40d4-8a45-40f386f95c2a", "001");
        assertThat(count).isEqualTo(1);
    }

}
