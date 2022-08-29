package com.vikadata.api.modular.workspace.mapper;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *  数据访问层测试：工作台-组件授权空间表测试
 * </p>
 * @author wuyitao
 * @date 2022/4/6 2:46 PM
 */
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
