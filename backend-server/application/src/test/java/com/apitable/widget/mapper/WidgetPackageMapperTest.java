package com.apitable.widget.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import com.apitable.AbstractMyBatisMapperTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

public class WidgetPackageMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    WidgetPackageMapper widgetPackageMapper;

    @Test
    @Sql("/sql/widget-package-data.sql")
    void givenWidgetBodyWhenUpdateWidgetPackageThen() {
        int count = widgetPackageMapper.updateWidgetBodyById(41L, "{}");
        assertThat(count).isEqualTo(1);
    }
}
