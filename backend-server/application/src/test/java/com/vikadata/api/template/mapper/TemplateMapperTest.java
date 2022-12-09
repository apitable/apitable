package com.vikadata.api.template.mapper;

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.template.dto.TemplateDto;
import com.vikadata.api.template.dto.TemplateInfo;
import com.vikadata.api.template.mapper.TemplateMapper;
import com.vikadata.api.template.model.OnlineTemplateDto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 * Template Mapper Test
 * </p>
 */
@Disabled
public class TemplateMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    TemplateMapper templateMapper;

    @Test
    @Sql("/testdata/template-data.sql")
    void testCountByTypeId() {
        Integer count = templateMapper.countByTypeId("spc41");
        assertThat(count).isEqualTo(1);
    }


    @Test
    @Sql("/testdata/template-data.sql")
    void testSelectIdByTypeIdAndName() {
        Long id = templateMapper.selectIdByTypeIdAndName("spc41", "name");
        assertThat(id).isEqualTo(41L);
    }


    @Test
    @Sql("/testdata/template-data.sql")
    void testSelectNodeIdByTempId() {
        String id = templateMapper.selectNodeIdByTempId("tp41");
        assertThat(id).isEqualTo("ni41");
    }


    @Test
    @Sql("/testdata/template-data.sql")
    void testSelectNameByTemplateIdIncludeDelete() {
        String name = templateMapper.selectNameByTemplateIdIncludeDelete("tp41");
        assertThat(name).isEqualTo("name");
    }


    @Test
    @Sql("/testdata/template-data.sql")
    void testSelectUpdatersByTempId() {
        Long id = templateMapper.selectUpdatersByTempId("tp41");
        assertThat(id).isEqualTo(41L);
    }


    @Test
    @Sql("/testdata/template-data.sql")
    void testSelectTypeIdByTempId() {
        String id = templateMapper.selectTypeIdByTempId("tp41");
        assertThat(id).isEqualTo("spc41");
    }


    @Test
    @Sql({ "/testdata/template-data.sql", "/testdata/node-data.sql", "/testdata/user-data.sql",
            "/testdata/space-data.sql"})
    void testSelectDtoByTypeId() {
        List<TemplateDto> entities = templateMapper.selectDtoByTypeId("spc41", CollUtil.newArrayList("tp41"));
        assertThat(entities).isNotEmpty();
    }


    @Test
    @Sql({ "/testdata/template-data.sql", "/testdata/node-data.sql", "/testdata/user-data.sql",
            "/testdata/space-data.sql"})
    void testSelectDtoByTempId() {
        TemplateDto entity = templateMapper.selectDtoByTempId("tp41");
        assertThat(entity).isNotNull();
    }


    @Test
    @Sql("/testdata/template-data.sql")
    void testSelectInfoByTempId() {
        TemplateInfo entity = templateMapper.selectInfoByTempId("tp41");
        assertThat(entity).isNotNull();
    }


    @Test
    @Sql("/testdata/template-data.sql")
    void testSelectInfoById() {
        TemplateInfo entity = templateMapper.selectInfoById(41L);
        assertThat(entity).isNotNull();
    }


    @Test
    @Sql("/testdata/template-data.sql")
    void testSelectInfoByTypeId() {
        List<TemplateInfo> entities = templateMapper.selectInfoByTypeId("spc41");
        assertThat(entities).isNotEmpty();
    }


    @Test
    @Sql("/testdata/template-data.sql")
    void testSelectNodeIdByTempIdAndType() {
        String id = templateMapper.selectNodeIdByTempIdAndType("tp41", 1);
        assertThat(id).isEqualTo("ni41");
    }

    @Test
    @Sql({ "/testdata/template-data.sql", "/testdata/template-property-data.sql",
            "/testdata/template-property-rel-data.sql" })
    void testSelectByTemplateIds() {
        List<OnlineTemplateDto> entities = templateMapper.selectByTemplateIds(CollUtil.newHashSet("tp41"));
        assertThat(entities).isNotEmpty();
    }

}
