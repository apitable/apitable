package com.vikadata.api.modular.space.mapper;

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     数据访问层测试：工作台-角色权限资源关联表测试
 * </p>
 * @author wuyitao
 * @date 2022/4/5 1:16 AM
 */
public class SpaceRoleResourceRelMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    SpaceRoleResourceRelMapper spaceRoleResourceRelMapper;

    @Test
    @Sql("/testdata/space-role-resource-rel-data.sql")
    void testSelectRoleCodeByResourceCodes() {
        List<String> roles = spaceRoleResourceRelMapper.selectRoleCodeByResourceCodes(CollUtil.newArrayList("MANAGE_WORKBENCH"));
        assertThat(roles).isNotEmpty();
    }

    @Test
    @Sql("/testdata/space-role-resource-rel-data.sql")
    void testSelectResourceCodesByRoleCode() {
        List<String> resourceCodes = spaceRoleResourceRelMapper.selectResourceCodesByRoleCode("ROLE_SPCWYNIGV7BQF_95D9F5");
        assertThat(resourceCodes).isNotEmpty();
        assertThat(resourceCodes.size()).isEqualTo(1);
        assertThat(resourceCodes.get(0)).isEqualTo("MANAGE_WORKBENCH");
    }

}
