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

package com.apitable.template.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;

import cn.hutool.core.collection.CollUtil;
import com.apitable.AbstractIntegrationTest;
import com.apitable.shared.cache.bean.CategoryDto;
import com.apitable.template.enums.TemplatePropertyType;
import com.apitable.template.mapper.TemplatePropertyMapper;
import com.apitable.template.mapper.TemplatePropertyRelMapper;
import com.apitable.template.model.TemplatePropertyDto;
import com.apitable.template.model.TemplatePropertyRelDto;
import com.apitable.template.service.ITemplatePropertyService;
import java.util.List;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;

@Disabled
public class TemplatePropertyServiceImplTest extends AbstractIntegrationTest {

    @MockBean
    private TemplatePropertyMapper templatePropertyMapper;

    @MockBean
    private TemplatePropertyRelMapper templatePropertyRelMapper;

    @Autowired
    private ITemplatePropertyService templatePropertyService;

    @Test
    void testGetCategories() {
        String lang = "zh_CN";
        List<TemplatePropertyDto> properties = CollUtil.newArrayList(
                TemplatePropertyDto.builder().propertyCode("pc1").propertyName("pcn1").build(),
                TemplatePropertyDto.builder().propertyCode("pc2").propertyName("pcn2").build(),
                TemplatePropertyDto.builder().propertyCode("pc3").propertyName("pcn3").build()
        );
        given(templatePropertyMapper.selectTemplatePropertiesWithLangAndOrder(
                TemplatePropertyType.CATEGORY.getType(), lang))
                .willReturn(properties);
        List<String> propertyCodes = CollUtil.newArrayList("pc1", "pc2", "pc3");
        List<TemplatePropertyRelDto> templatePropertyRelList = CollUtil.newArrayList(
                TemplatePropertyRelDto.builder().propertyCode("pc1").templateId("tpl1").build(),
                TemplatePropertyRelDto.builder().propertyCode("pc1").templateId("tpl2").build(),
                TemplatePropertyRelDto.builder().propertyCode("pc2").templateId("tpl3").build(),
                TemplatePropertyRelDto.builder().propertyCode("pc2").templateId("tpl4").build(),
                TemplatePropertyRelDto.builder().propertyCode("pc3").templateId("tpl5").build(),
                TemplatePropertyRelDto.builder().propertyCode("pc3").templateId("tpl6").build()
        );
        given(templatePropertyRelMapper.selectTemplateIdsByPropertyIds(propertyCodes))
                .willReturn(templatePropertyRelList);
        List<CategoryDto> categories = templatePropertyService.getCategories(lang);
        assertThat(categories).isNotNull();
        assertThat(categories.size()).isEqualTo(3);
        assertThat(categories.get(0).getTemplateIds().size()).isEqualTo(2);
    }

}
