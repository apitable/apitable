package com.vikadata.api.modular.control.mapper;

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.entity.ControlSettingEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     数据访问层测试：工作台-权限控制单元设置表测试
 * </p>
 * @author wuyitao
 * @date 2022/3/31 11:22 AM
 */
public class ControlSettingMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    ControlSettingMapper controlSettingMapper;

    @Test
    @Sql("/testdata/control-setting-data.sql")
    void testSelectByControlId() {
        ControlSettingEntity entity = controlSettingMapper.selectByControlId("dsto4uywza5GtqbVXC-fldANfgcPuGVS");
        assertThat(entity).isNotNull();
        assertThat(entity.getId()).isEqualTo(1387315293590966274L);
    }

    @Test
    @Sql("/testdata/control-setting-data.sql")
    void testSelectBatchByControlIds() {
        List<ControlSettingEntity> entities = controlSettingMapper.selectBatchByControlIds(CollUtil.newArrayList("dsto4uywza5GtqbVXC-fldANfgcPuGVS"));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/testdata/control-setting-data.sql")
    void test() {
        ControlSettingEntity entity = controlSettingMapper.selectDeletedByControlId("dstYC0guLbv91jawRb-fld4c0bJCN4Cz");
        assertThat(entity).isNotNull();
        assertThat(entity.getId()).isEqualTo(1387695187619319809L);
    }
}
