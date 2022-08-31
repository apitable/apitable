package com.vikadata.api.modular.template.service.impl;

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.cache.bean.CategoryDto;
import com.vikadata.api.enums.template.TemplatePropertyType;
import com.vikadata.api.modular.template.mapper.TemplatePropertyMapper;
import com.vikadata.api.modular.template.mapper.TemplatePropertyRelMapper;
import com.vikadata.api.modular.template.model.TemplatePropertyDto;
import com.vikadata.api.modular.template.model.TemplatePropertyRelDto;
import com.vikadata.api.modular.template.service.ITemplatePropertyService;

import org.springframework.boot.test.mock.mockito.SpyBean;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;


/**
 * @author tao
 */
@Disabled("no assert")
public class TemplatePropertyServiceImplTest extends AbstractIntegrationTest {

    @SpyBean
    private TemplatePropertyMapper templatePropertyMapper;

    @SpyBean
    private TemplatePropertyRelMapper templatePropertyRelMapper;

    @SpyBean
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
