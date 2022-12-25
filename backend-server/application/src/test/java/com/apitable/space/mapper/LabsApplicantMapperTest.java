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

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.apitable.AbstractMyBatisMapperTest;
import com.apitable.space.entity.LabsApplicantEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     Data access layer test: experimental function internal test application form test
 * </p>
 */
@Disabled
public class LabsApplicantMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    LabsApplicantMapper labsApplicantMapper;

    @Test
    @Sql("/sql/labs-applicant-data.sql")
    void testSelectUserFeaturesByApplicant() {
        List<String> entities = labsApplicantMapper.selectUserFeaturesByApplicant(CollUtil.newArrayList("spca33AJDEVhL"));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/labs-features-data.sql")
    void testSelectFeatureKeyByType() {
        List<String> entities = labsApplicantMapper.selectFeatureKeyByType(3);
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/labs-applicant-data.sql")
    void testSelectApplicantAndFeatureKey() {
        LabsApplicantEntity entity = labsApplicantMapper.selectApplicantAndFeatureKey("spca33AJDEVhL", "ROBOT");
        assertThat(entity).isNotNull();
    }

}
