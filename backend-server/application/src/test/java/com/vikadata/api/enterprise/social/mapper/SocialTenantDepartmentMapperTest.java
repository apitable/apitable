package com.vikadata.api.enterprise.social.mapper;

import java.util.List;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.enterprise.social.mapper.SocialTenantDepartmentMapper;
import com.vikadata.api.enterprise.social.model.TenantDepartmentBindDTO;
import com.vikadata.api.enterprise.social.entity.SocialTenantDepartmentEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     Data layer access test: third-party platform integration - enterprise tenant department table test
 * </p>
 */
@Disabled
public class SocialTenantDepartmentMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    SocialTenantDepartmentMapper socialTenantDepartmentMapper;

    @Test
    @Sql("/testdata/social-tenant-department-data.sql")
    void testSelectIdByDepartmentId() {
        Long id = socialTenantDepartmentMapper.selectIdByDepartmentId("spc41", "ww41", "di41");
        assertThat(id).isEqualTo(41);
    }

    @Test
    @Sql("/testdata/social-tenant-department-data.sql")
    void testSelectByDepartmentId() {
        SocialTenantDepartmentEntity entity = socialTenantDepartmentMapper.selectByDepartmentId("spc41", "ww41", "di41");
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql("/testdata/social-tenant-department-data.sql")
    void testSelectDepartmentIdsByTenantId() {
        List<String> ids = socialTenantDepartmentMapper.selectDepartmentIdsByTenantId("ww41", "spc41");
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql("/testdata/social-tenant-department-data.sql")
    void testSelectByTenantIdAndDeptId() {
        SocialTenantDepartmentEntity entity = socialTenantDepartmentMapper.selectByTenantIdAndDeptId("spc41", "ww41", "odi41");
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql({ "/testdata/social-tenant-department-data.sql",
            "/testdata/social-tenant-department-bind-data.sql",
            "/testdata/unit-team-data.sql" })
    void testSelectTenantBindTeamListBySpaceId() {
        List<TenantDepartmentBindDTO> entities = socialTenantDepartmentMapper.selectTenantBindTeamListBySpaceId("spc41");
        assertThat(entities).isNotEmpty();
    }

}
