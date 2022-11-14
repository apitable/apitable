package com.vikadata.api.modular.template.mapper;

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.template.mapper.TemplatePropertyRelMapper;
import com.vikadata.api.template.model.TemplatePropertyRelDto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

public class TemplatePropertyRelMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    private TemplatePropertyRelMapper templatePropertyRelMapper;

    @Test
    @Sql("/testdata/template-property-rel-data.sql")
    void testSelectTemplateIdsByPropertyIds() {
        List<String> propertyCodes = CollUtil.newArrayList("pc1", "pc2", "pc3");
        List<TemplatePropertyRelDto> templatePropertyRelDtoList = templatePropertyRelMapper.selectTemplateIdsByPropertyIds(propertyCodes);
        assertThat(templatePropertyRelDtoList).isNotNull();
        assertThat(templatePropertyRelDtoList.size()).isEqualTo(3);
    }

}