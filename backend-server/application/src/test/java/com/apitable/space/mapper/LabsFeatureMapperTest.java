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

package com.apitable.space.mapper;

import java.util.List;

import org.assertj.core.util.Lists;
import org.junit.jupiter.api.Test;

import com.apitable.AbstractMyBatisMapperTest;
import com.apitable.space.entity.LabsFeaturesEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     Data access layer test: experimental menu test
 * </p>
 */
public class LabsFeatureMapperTest extends AbstractMyBatisMapperTest {


    @Autowired
    private LabsFeatureMapper labsFeatureMapper;

    @Test
    @Sql("/sql/labs-features-data.sql")
    void testSelectAllByFeatureKeys() {
        List<LabsFeaturesEntity> entities = labsFeatureMapper.selectAllByFeatureKeys(Lists.list("RENDER_PROMPT", "WIDGET_CENTER"));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/labs-features-data.sql")
    void testSelectAllFeaturesByType() {
        List<LabsFeaturesEntity> entities = labsFeatureMapper.selectAllFeaturesByType(Lists.list(3));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/labs-features-data.sql")
    void testSelectIdByFeatureKey() {
        Long id = labsFeatureMapper.selectIdByFeatureKey("RENDER_PROMPT");
        assertThat(id).isEqualTo(1453186392616861697L);
    }

    @Test
    @Sql("/sql/labs-features-data.sql")
    void testSelectByFeatureKey() {
        LabsFeaturesEntity entity = labsFeatureMapper.selectByFeatureKey("RENDER_PROMPT");
        assertThat(entity).isNotNull();
        assertThat(entity.getId()).isEqualTo(1453186392616861697L);
    }

    @Test
    @Sql("/sql/labs-features-data.sql")
    void testSelectByFeatureKeyAndFeatureScope() {
        LabsFeaturesEntity entity = labsFeatureMapper.selectByFeatureKeyAndFeatureScope("RENDER_PROMPT", 1);
        assertThat(entity).isNotNull();
        assertThat(entity.getId()).isEqualTo(1453186392616861697L);
    }

}
