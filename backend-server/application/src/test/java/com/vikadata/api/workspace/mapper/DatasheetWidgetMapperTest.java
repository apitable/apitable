package com.vikadata.api.workspace.mapper;

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.workspace.dto.DatasheetWidgetDTO;
import com.vikadata.api.workspace.mapper.DatasheetWidgetMapper;
import com.vikadata.entity.DatasheetWidgetEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

public class DatasheetWidgetMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    DatasheetWidgetMapper datasheetWidgetMapper;


    @Test
    @Sql("/testdata/datasheet-widget-data.sql")
    void testSelectByWidgetId() {
        DatasheetWidgetEntity entity = datasheetWidgetMapper.selectByWidgetId("wi41");
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql("/testdata/datasheet-widget-data.sql")
    void testSelectDtoByWidgetIds() {
        List<DatasheetWidgetDTO> entities = datasheetWidgetMapper.selectDtoByWidgetIds(CollUtil.newArrayList("wi41"));
        assertThat(entities).isNotEmpty();
    }
}
