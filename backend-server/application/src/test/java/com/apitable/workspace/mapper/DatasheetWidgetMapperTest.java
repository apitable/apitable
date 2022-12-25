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
import com.apitable.workspace.dto.DatasheetWidgetDTO;
import com.apitable.workspace.entity.DatasheetWidgetEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

public class DatasheetWidgetMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    DatasheetWidgetMapper datasheetWidgetMapper;


    @Test
    @Sql("/sql/datasheet-widget-data.sql")
    void testSelectByWidgetId() {
        DatasheetWidgetEntity entity = datasheetWidgetMapper.selectByWidgetId("wi41");
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql("/sql/datasheet-widget-data.sql")
    void testSelectDtoByWidgetIds() {
        List<DatasheetWidgetDTO> entities = datasheetWidgetMapper.selectDtoByWidgetIds(CollUtil.newArrayList("wi41"));
        assertThat(entities).isNotEmpty();
    }
}
