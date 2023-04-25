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

package com.apitable.template.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import cn.hutool.core.collection.CollUtil;
import com.apitable.AbstractMyBatisMapperTest;
import com.apitable.template.dto.TemplateDto;
import com.apitable.template.dto.TemplateInfo;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

/**
 * <p>
 * Template Mapper Test
 * </p>
 */
public class TemplateMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    TemplateMapper templateMapper;

    @Test
    @Sql("/sql/template-data.sql")
    void testCountByTypeId() {
        Integer count = templateMapper.countByTypeId("spc41");
        assertThat(count).isEqualTo(1);
    }


    @Test
    @Sql("/sql/template-data.sql")
    void testSelectIdByTypeIdAndName() {
        Long id = templateMapper.selectIdByTypeIdAndName("spc41", "name");
        assertThat(id).isEqualTo(41L);
    }


    @Test
    @Sql("/sql/template-data.sql")
    void testSelectNodeIdByTempId() {
        String id = templateMapper.selectNodeIdByTempId("tp41");
        assertThat(id).isEqualTo("ni45");
    }


    @Test
    @Sql("/sql/template-data.sql")
    void testSelectNameByTemplateIdIncludeDelete() {
        String name = templateMapper.selectNameByTemplateIdIncludeDelete("tp41");
        assertThat(name).isEqualTo("name");
    }


    @Test
    @Sql("/sql/template-data.sql")
    void testSelectUpdatersByTempId() {
        Long id = templateMapper.selectUpdatersByTempId("tp41");
        assertThat(id).isEqualTo(41L);
    }


    @Test
    @Sql("/sql/template-data.sql")
    void testSelectTypeIdByTempId() {
        String id = templateMapper.selectTypeIdByTempId("tp41");
        assertThat(id).isEqualTo("spc41");
    }


    @Test
    @Sql({"/sql/template-data.sql", "/sql/node-data.sql", "/sql/user-data.sql",
        "/sql/space-data.sql"})
    void testSelectDtoByTypeId() {
        List<TemplateDto> entities =
            templateMapper.selectDtoByTypeId("spc41", CollUtil.newArrayList("tp41"));
        assertThat(entities).isNotEmpty();
    }


    @Test
    @Sql({"/sql/template-data.sql", "/sql/node-data.sql", "/sql/user-data.sql",
        "/sql/space-data.sql"})
    void testSelectDtoByTempId() {
        TemplateDto entity = templateMapper.selectDtoByTempId("tp41");
        assertThat(entity).isNotNull();
    }


    @Test
    @Sql("/sql/template-data.sql")
    void testSelectInfoByTempId() {
        TemplateInfo entity = templateMapper.selectInfoByTempId("tp41");
        assertThat(entity).isNotNull();
    }


    @Test
    @Sql("/sql/template-data.sql")
    void testSelectInfoById() {
        TemplateInfo entity = templateMapper.selectInfoById(41L);
        assertThat(entity).isNotNull();
    }


    @Test
    @Sql("/sql/template-data.sql")
    void testSelectInfoByTypeId() {
        List<TemplateInfo> entities = templateMapper.selectInfoByTypeId("spc41");
        assertThat(entities).isNotEmpty();
    }


    @Test
    @Sql("/sql/template-data.sql")
    void testSelectNodeIdByTempIdAndType() {
        String id = templateMapper.selectNodeIdByTempIdAndType("tp41", 1);
        assertThat(id).isEqualTo("ni45");
    }

}
