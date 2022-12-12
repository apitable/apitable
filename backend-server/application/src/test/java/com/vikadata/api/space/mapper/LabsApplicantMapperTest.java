package com.vikadata.api.space.mapper;

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.space.mapper.LabsApplicantMapper;
import com.vikadata.entity.LabsApplicantEntity;

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
