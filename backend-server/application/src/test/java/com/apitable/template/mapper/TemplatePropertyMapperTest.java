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

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.apitable.AbstractMyBatisMapperTest;
import com.apitable.template.model.TemplateKeyWordSearchDto;
import com.apitable.template.model.TemplatePropertyDto;
import com.apitable.template.model.TemplatePropertyRelDto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 * Template Property Mapper Test
 * </p>
 */
@Disabled
public class TemplatePropertyMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    TemplatePropertyMapper templatePropertyMapper;

    @Test
    @Sql("/sql/template-property-data.sql")
    void testSelectTemplateProperties() {
        List<TemplatePropertyDto> entities = templatePropertyMapper.selectTemplatePropertiesWithI18n("zh_CN");
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/template-property-data.sql")
    void testSelectTemplatePropertiesWithOrder() {
        List<TemplatePropertyDto> entities = templatePropertyMapper.selectTemplatePropertiesWithI18n(null);
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/template-property-data.sql")
    void testSelectIdByCodeAndType() {
        Long id = templatePropertyMapper.selectIdByCodeAndType("property code", 1);
        assertThat(id).isEqualTo(41L);
    }

    @Test
    @Sql({ "/sql/template-property-data.sql", "/sql/template-property-rel-data.sql" })
    void testSelectPropertiesByTemplateIdsAndType() {
        List<TemplatePropertyRelDto> entities = templatePropertyMapper.selectPropertiesByTemplateIdsAndType(CollUtil.newArrayList("tp41"), 1);
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql({ "/sql/template-data.sql", "/sql/template-property-data.sql",
            "/sql/template-property-rel-data.sql" })
    void testSelectTemplateByPropertyName() {
        List<TemplateKeyWordSearchDto> entities = templatePropertyMapper.selectTemplateByPropertyNameAndLang("name", "zh_CN");
        assertThat(entities).isNotEmpty();
    }

}
