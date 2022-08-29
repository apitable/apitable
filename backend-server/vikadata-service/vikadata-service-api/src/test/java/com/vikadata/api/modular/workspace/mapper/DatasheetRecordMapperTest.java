package com.vikadata.api.modular.workspace.mapper;

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.model.dto.datasheet.DataSheetRecordDto;
import com.vikadata.api.model.dto.datasheet.DataSheetRecordGroupDto;
import com.vikadata.api.model.vo.datasheet.DatasheetRecordVo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     数据访问层测试：工作台-数表记录表测试
 * </p>
 * @author wuyitao
 * @date 2022/4/6 2:41 PM
 */
public class DatasheetRecordMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    DatasheetRecordMapper datasheetRecordMapper;

    @Test
    @Sql("/testdata/datasheet-record-data.sql")
    void testSelectListByDstId() {
        List<DatasheetRecordVo> entities = datasheetRecordMapper.selectListByDstId("dst0ZDEBxQPJxoaQ1h");
        assertThat(entities).isNotNull();
    }

    @Test
    @Sql("/testdata/datasheet-record-data.sql")
    void testSelectDtoByDstId() {
        List<DataSheetRecordDto> entities = datasheetRecordMapper.selectDtoByDstId("dst0ZDEBxQPJxoaQ1h");
        assertThat(entities).isNotEmpty();
    }


    @Test
    @Sql("/testdata/datasheet-record-data.sql")
    void testSelectDtoByDstIds() {
        List<DataSheetRecordDto> entities = datasheetRecordMapper.selectDtoByDstIds(CollUtil.newArrayList("dst0ZDEBxQPJxoaQ1h"));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/testdata/datasheet-record-data.sql")
    void testSelectGroupDtoByDstIds() {
        List<DataSheetRecordGroupDto> entities = datasheetRecordMapper.selectGroupDtoByDstIds(CollUtil.newArrayList("dst0ZDEBxQPJxoaQ1h"));
        assertThat(entities);
    }

}
