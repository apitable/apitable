package com.vikadata.api.control.mapper;

import java.util.List;

import org.assertj.core.api.Assertions;
import org.assertj.core.util.Lists;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.control.infrastructure.ControlType;
import com.vikadata.api.control.mapper.ControlMapper;
import com.vikadata.api.control.model.ControlTypeDTO;
import com.vikadata.api.control.model.ControlUnitDTO;
import com.vikadata.entity.ControlEntity;

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
