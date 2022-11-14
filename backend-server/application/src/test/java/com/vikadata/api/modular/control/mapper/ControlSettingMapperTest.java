package com.vikadata.api.modular.control.mapper;

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.enterprise.control.mapper.ControlSettingMapper;
import com.vikadata.entity.ControlSettingEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     Data access layer test: workbench permission control unit setting table test
 * </p>
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
