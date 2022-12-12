package com.vikadata.api.space.mapper;

import java.util.List;

import org.assertj.core.util.Lists;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.space.mapper.LabsFeatureMapper;
import com.vikadata.entity.LabsFeaturesEntity;

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
