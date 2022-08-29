package com.vikadata.api.modular.labs.mapper;

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.entity.LabsApplicantEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     数据访问层测试：实验性功能内测申请表测试
 * </p>
 *
 * @author wuyitao
 * @date 2022/3/31 2:24 PM
 */
@Disabled
public class LabsApplicantMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    LabsApplicantMapper labsApplicantMapper;

    @Test
    @Sql("/testdata/labs-applicant-data.sql")
    void testSelectUserFeaturesByApplicant() {
        List<String> entities = labsApplicantMapper.selectUserFeaturesByApplicant(CollUtil.newArrayList("spca33AJDEVhL"));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/testdata/labs-features-data.sql")
    void testSelectFeatureKeyByType() {
        List<String> entities = labsApplicantMapper.selectFeatureKeyByType(3);
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/testdata/labs-applicant-data.sql")
    void testSelectApplicantAndFeatureKey() {
        LabsApplicantEntity entity = labsApplicantMapper.selectApplicantAndFeatureKey("spca33AJDEVhL", "ROBOT");
        assertThat(entity).isNotNull();
    }

}
