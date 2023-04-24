package com.apitable.widget.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import com.apitable.AbstractMyBatisMapperTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

public class WidgetPackageAuthSpaceMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    WidgetPackageAuthSpaceMapper widgetPackageAuthSpaceMapper;

    @Test
    @Sql("/sql/widget-package-auth-space-data.sql")
    void testSelectSpaceIdByPackageId() {
        String id = widgetPackageAuthSpaceMapper.selectSpaceIdByPackageId("wpk41");
        assertThat(id).isEqualTo("spc41");
    }
}
