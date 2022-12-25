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

import java.util.List;

import org.assertj.core.api.Assertions;
import org.assertj.core.util.Lists;
import org.junit.jupiter.api.Test;

import com.apitable.AbstractMyBatisMapperTest;
import com.apitable.control.entity.ControlEntity;
import com.apitable.control.infrastructure.ControlType;
import com.apitable.control.model.ControlTypeDTO;
import com.apitable.control.model.ControlUnitDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Data access layer test: permission control table test
 */
public class ControlMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    private ControlMapper controlMapper;

    @Test
    @Sql("/sql/control-data.sql")
    void testSelectByControlId() {
        ControlEntity controlEntity = controlMapper.selectByControlId("dst895mJZVVTUoy9GF");
        assertThat(controlEntity).isNotNull();
    }

    @Test
    @Sql("/sql/control-data.sql")
    void testSelectCountByControlId() {
        Integer count = controlMapper.selectCountByControlId("dst895mJZVVTUoy9GF");
        assertThat(count).isNotNull().isEqualTo(1);
    }

    @Test
    @Sql("/sql/control-data.sql")
    void selectControlIdByControlIdPrefixAndType() {
        List<String> controlIds = controlMapper.selectControlIdByControlIdPrefixAndType("dst895mJZVVTUoy9GF", 1);
        Assertions.assertThat(controlIds).isNotEmpty();
    }

    @Test
    @Sql("/sql/control-data.sql")
    void selectControlIdByControlIds() {
        List<String> selectControlIds = Lists.list("dst895mJZVVTUoy9GF",
                "dst895mJZVVTUoy9GF-fldQaavrdDK8K",
                "dst895mJZVVTUoy9GF-fldjki1tL7iaK");
        List<String> controlIds = controlMapper.selectControlIdByControlIds(selectControlIds);
        assertThat(controlIds).isNotEmpty();
    }

    @Test
    @Sql({ "/sql/control-data.sql", "/sql/unit-data.sql", "/sql/member-data.sql" })
    void testSelectOwnerControlUnitDTO() {
        List<ControlUnitDTO> controlUnitDTOS = controlMapper.selectOwnerControlUnitDTO(
                Lists.list(
                        "dst895mJZVVTUoy9GF-fldQaavrdDK8K",
                        "dst895mJZVVTUoy9GF-fldjki1tL7iaK"));
        assertThat(controlUnitDTOS).isNotEmpty();
    }

    @Test
    @Sql("/sql/control-data.sql")
    void testSelectControlTypeDTO() {
        List<ControlTypeDTO> controlTypeDTO = controlMapper.selectControlTypeDTO("spcYVmyayXYbq");
        assertThat(controlTypeDTO).isNotEmpty();
    }

    @Test
    @Sql("/sql/control-data.sql")
    void testSelectDeletedByControlIdAndSpaceId() {
        ControlEntity entity = controlMapper.selectDeletedByControlIdAndSpaceId(
                "dst895mJZVVTUoy9GF-fldj2j392k3aK",
                "spcYVmyayXYbq", ControlType.DATASHEET_FIELD);
        assertThat(entity).isNotNull();
    }
}
