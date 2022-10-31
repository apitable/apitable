package com.vikadata.api.modular.workspace.mapper;

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.model.dto.datasheet.DatasheetMetaDTO;
import com.vikadata.api.modular.workspace.model.DatasheetSnapshot;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

public class DatasheetMetaMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    DatasheetMetaMapper datasheetMetaMapper;

    @Test
    @Sql("/testdata/datasheet-meta-data.sql")
    void testSelectByDstId() {
        DatasheetSnapshot entity = datasheetMetaMapper.selectByDstId("ni41");
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql("/testdata/datasheet-meta-data.sql")
    void testSelectDtoByDstIds() {
        List<DatasheetMetaDTO> entities = datasheetMetaMapper.selectDtoByDstIds(CollUtil.newArrayList("ni41"));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/testdata/datasheet-meta-data.sql")
    void testCountByMetaData() {
        Integer count = datasheetMetaMapper.countByMetaData(CollUtil.newArrayList("ni41"), "表格视图");
        assertThat(count).isEqualTo(1);
    }

}
