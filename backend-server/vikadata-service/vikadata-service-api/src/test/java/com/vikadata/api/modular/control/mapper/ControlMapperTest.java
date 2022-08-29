package com.vikadata.api.modular.control.mapper;

import java.util.List;

import org.assertj.core.api.Assertions;
import org.assertj.core.util.Lists;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.control.ControlType;
import com.vikadata.api.modular.control.model.ControlTypeDTO;
import com.vikadata.api.modular.control.model.ControlUnitDTO;
import com.vikadata.entity.ControlEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * 数据访问层测试：权限控制表测试
 * @author Shawn Deng
 * @date 2022-03-28 11:50:38
 */
public class ControlMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    private ControlMapper controlMapper;

    @Test
    @Sql("/testdata/control-data.sql")
    void testSelectByControlId() {
        ControlEntity controlEntity = controlMapper.selectByControlId("dst895mJZVVTUoy9GF");
        assertThat(controlEntity).isNotNull();
    }

    @Test
    @Sql("/testdata/control-data.sql")
    void testSelectCountByControlId() {
        Integer count = controlMapper.selectCountByControlId("dst895mJZVVTUoy9GF");
        assertThat(count).isNotNull().isEqualTo(1);
    }

    @Test
    @Sql("/testdata/control-data.sql")
    void selectControlIdByControlIdPrefixAndType() {
        List<String> controlIds = controlMapper.selectControlIdByControlIdPrefixAndType("dst895mJZVVTUoy9GF", 1);
        Assertions.assertThat(controlIds).isNotEmpty();
    }

    @Test
    @Sql("/testdata/control-data.sql")
    void selectControlIdByControlIds() {
        List<String> selectControlIds = Lists.list("dst895mJZVVTUoy9GF",
                "dst895mJZVVTUoy9GF-fldQaavrdDK8K",
                "dst895mJZVVTUoy9GF-fldjki1tL7iaK");
        List<String> controlIds = controlMapper.selectControlIdByControlIds(selectControlIds);
        assertThat(controlIds).isNotEmpty();
    }

    @Test
    @Sql({ "/testdata/control-data.sql", "/testdata/unit-data.sql", "/testdata/member-data.sql" })
    void testSelectOwnerControlUnitDTO() {
        List<ControlUnitDTO> controlUnitDTOS = controlMapper.selectOwnerControlUnitDTO(
                Lists.list(
                        "dst895mJZVVTUoy9GF-fldQaavrdDK8K",
                        "dst895mJZVVTUoy9GF-fldjki1tL7iaK"));
        assertThat(controlUnitDTOS).isNotEmpty();
    }

    @Test
    @Sql("/testdata/control-data.sql")
    void testSelectControlTypeDTO() {
        List<ControlTypeDTO> controlTypeDTO = controlMapper.selectControlTypeDTO("spcYVmyayXYbq");
        assertThat(controlTypeDTO).isNotEmpty();
    }

    @Test
    @Sql("/testdata/control-data.sql")
    void testSelectDeletedByControlIdAndSpaceId() {
        ControlEntity entity = controlMapper.selectDeletedByControlIdAndSpaceId(
                "dst895mJZVVTUoy9GF-fldj2j392k3aK",
                "spcYVmyayXYbq", ControlType.DATASHEET_FIELD);
        assertThat(entity).isNotNull();
    }
}
