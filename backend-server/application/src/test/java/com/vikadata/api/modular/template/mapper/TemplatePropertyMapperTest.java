package com.vikadata.api.modular.template.mapper;

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.template.mapper.TemplatePropertyMapper;
import com.vikadata.api.template.model.TemplateKeyWordSearchDto;
import com.vikadata.api.template.model.TemplatePropertyDto;
import com.vikadata.api.template.model.TemplatePropertyRelDto;

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
    @Sql("/testdata/template-property-data.sql")
    void testSelectTemplateProperties() {
        List<TemplatePropertyDto> entities = templatePropertyMapper.selectTemplatePropertiesWithI18n("zh_CN");
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/testdata/template-property-data.sql")
    void testSelectTemplatePropertiesWithOrder() {
        List<TemplatePropertyDto> entities = templatePropertyMapper.selectTemplatePropertiesWithI18n(null);
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/testdata/template-property-data.sql")
    void testSelectIdByCodeAndType() {
        Long id = templatePropertyMapper.selectIdByCodeAndType("property code", 1);
        assertThat(id).isEqualTo(41L);
    }

    @Test
    @Sql({ "/testdata/template-property-data.sql", "/testdata/template-property-rel-data.sql" })
    void testSelectPropertiesByTemplateIdsAndType() {
        List<TemplatePropertyRelDto> entities = templatePropertyMapper.selectPropertiesByTemplateIdsAndType(CollUtil.newArrayList("tp41"), 1);
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql({ "/testdata/template-data.sql", "/testdata/template-property-data.sql",
            "/testdata/template-property-rel-data.sql" })
    void testSelectTemplateByPropertyName() {
        List<TemplateKeyWordSearchDto> entities = templatePropertyMapper.selectTemplateByPropertyNameAndLang("name", "zh_CN");
        assertThat(entities).isNotEmpty();
    }

}
