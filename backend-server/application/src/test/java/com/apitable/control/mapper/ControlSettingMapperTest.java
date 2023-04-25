/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.control.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import cn.hutool.core.collection.CollUtil;
import com.apitable.AbstractMyBatisMapperTest;
import com.apitable.control.entity.ControlSettingEntity;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

/**
 * <p>
 *     Data access layer test: workbench permission control unit setting table test
 * </p>
 */
public class ControlSettingMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    ControlSettingMapper controlSettingMapper;

    @Test
    @Sql("/sql/control-setting-data.sql")
    void testSelectByControlId() {
        ControlSettingEntity entity = controlSettingMapper.selectByControlId("dsto4uywza5GtqbVXC-fldANfgcPuGVS");
        assertThat(entity).isNotNull();
        assertThat(entity.getId()).isEqualTo(1387315293590966274L);
    }

    @Test
    @Sql("/sql/control-setting-data.sql")
    void testSelectBatchByControlIds() {
        List<ControlSettingEntity> entities = controlSettingMapper.selectBatchByControlIds(CollUtil.newArrayList("dsto4uywza5GtqbVXC-fldANfgcPuGVS"));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/control-setting-data.sql")
    void testSelectDeletedByControlId() {
        ControlSettingEntity entity = controlSettingMapper.selectDeletedByControlId("dstYC0guLbv91jawRb-fld4c0bJCN4Cz");
        assertThat(entity).isNotNull();
        assertThat(entity.getId()).isEqualTo(1387695187619319809L);
    }
}
