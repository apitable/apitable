package com.vikadata.api.modular.workspace.mapper;

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.entity.ResourceMetaEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

public class ResourceMetaMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    ResourceMetaMapper resourceMetaMapper;

    @Test
    @Sql("/testdata/resource-meta-data.sql")
    void testSelectByResourceIds() {
        List<ResourceMetaEntity> entities = resourceMetaMapper.selectByResourceIds(CollUtil.newArrayList("ri41"));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/testdata/resource-meta-data.sql")
    void testSelectMetaDataByResourceId() {
        String data = resourceMetaMapper.selectMetaDataByResourceId("ri41");
        assertThat(data).isEqualTo("{}");
    }

    @Test
    @Sql("/testdata/resource-meta-data.sql")
    void testCountDashboardWidgetNumber() {
        Integer widgetNum = resourceMetaMapper.countDashboardWidgetNumber("dsbvHRkLzQ3NjKzq01");
        assertThat(widgetNum).isEqualTo(2);

        widgetNum = resourceMetaMapper.countDashboardWidgetNumber("dsbvHRkLzQ3NjKzq01-1");
        assertThat(widgetNum).isEqualTo(0);
    }
}
