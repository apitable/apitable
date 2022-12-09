package com.vikadata.api.workspace.mapper;

import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.workspace.mapper.DatasheetMapper;
import com.vikadata.entity.DatasheetEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

public class DatasheetMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    DatasheetMapper datasheetMapper;

    @Test
    @Sql("/testdata/datasheet-data.sql")
    void testSelectByDstId() {
        DatasheetEntity entity = datasheetMapper.selectByDstId("ni41");
        assertThat(entity).isNotNull();
    }

}
