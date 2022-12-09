package com.vikadata.api.enterprise.widget.mapper;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.enterprise.widget.mapper.WidgetPackageAuthSpaceMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

@Disabled
public class WidgetPackageAuthSpaceMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    WidgetPackageAuthSpaceMapper widgetPackageAuthSpaceMapper;

    @Test
    @Sql("/testdata/widget-package-auth-space-data.sql")
    void testSelectSpaceIdByPackageId() {
        String id = widgetPackageAuthSpaceMapper.selectSpaceIdByPackageId("wpk41");
        assertThat(id).isEqualTo("spc41");
    }
}
