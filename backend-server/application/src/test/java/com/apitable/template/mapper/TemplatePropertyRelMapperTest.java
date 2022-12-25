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
import org.junit.jupiter.api.Test;

import com.apitable.AbstractMyBatisMapperTest;
import com.apitable.template.model.TemplatePropertyRelDto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

public class TemplatePropertyRelMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    private TemplatePropertyRelMapper templatePropertyRelMapper;

    @Test
    @Sql("/sql/template-property-rel-data.sql")
    void testSelectTemplateIdsByPropertyIds() {
        List<String> propertyCodes = CollUtil.newArrayList("pc1", "pc2", "pc3");
        List<TemplatePropertyRelDto> templatePropertyRelDtoList = templatePropertyRelMapper.selectTemplateIdsByPropertyIds(propertyCodes);
        assertThat(templatePropertyRelDtoList).isNotNull();
        assertThat(templatePropertyRelDtoList.size()).isEqualTo(3);
    }

}