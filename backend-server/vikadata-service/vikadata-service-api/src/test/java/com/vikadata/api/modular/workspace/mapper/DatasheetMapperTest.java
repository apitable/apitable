package com.vikadata.api.modular.workspace.mapper;

import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.entity.DatasheetEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     数据访问层测试：工作台-数据表格表测试
 * </p>
 * @author wuyitao
 * @date 2022/4/6 2:38 PM
 */
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
