/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.workspace.mapper;

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Test;

import com.apitable.AbstractMyBatisMapperTest;
import com.apitable.workspace.dto.DataSheetRecordDTO;
import com.apitable.workspace.dto.DataSheetRecordGroupDTO;
import com.apitable.workspace.vo.DatasheetRecordVo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

public class DatasheetRecordMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    DatasheetRecordMapper datasheetRecordMapper;

    @Test
    @Sql("/sql/datasheet-record-data.sql")
    void testSelectListByDstId() {
        List<DatasheetRecordVo> entities = datasheetRecordMapper.selectListByDstId("dst0ZDEBxQPJxoaQ1h");
        assertThat(entities).isNotNull();
    }

    @Test
    @Sql("/sql/datasheet-record-data.sql")
    void testSelectDtoByDstId() {
        List<DataSheetRecordDTO> entities = datasheetRecordMapper.selectDtoByDstId("dst0ZDEBxQPJxoaQ1h");
        assertThat(entities).isNotEmpty();
    }


    @Test
    @Sql("/sql/datasheet-record-data.sql")
    void testSelectDtoByDstIds() {
        List<DataSheetRecordDTO> entities = datasheetRecordMapper.selectDtoByDstIds(CollUtil.newArrayList("dst0ZDEBxQPJxoaQ1h"));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/datasheet-record-data.sql")
    void testSelectGroupDtoByDstIds() {
        List<DataSheetRecordGroupDTO> entities = datasheetRecordMapper.selectGroupDtoByDstIds(CollUtil.newArrayList("dst0ZDEBxQPJxoaQ1h"));
        assertThat(entities);
    }

}
