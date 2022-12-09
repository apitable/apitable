package com.vikadata.api.enterprise.social.mapper;

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.enterprise.social.mapper.SocialTenantBindMapper;
import com.vikadata.api.enterprise.social.enums.SocialPlatformType;
import com.vikadata.api.enterprise.social.enums.SocialAppType;
import com.vikadata.api.enterprise.social.model.SpaceBindTenantInfoDTO;
import com.vikadata.api.enterprise.social.model.TenantBindDTO;
import com.vikadata.api.enterprise.social.entity.SocialTenantBindEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *      Data access layer test: third-party platform integration - enterprise tenant binding space table test
 * </p>
 */
@Disabled
public class SocialTenantBindMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    SocialTenantBindMapper socialTenantBindMapper;

    @Test
    @Sql("/testdata/social-tenant-bind-data.sql")
    void testSelectCountBySpaceId() {
        Integer count = socialTenantBindMapper.selectCountBySpaceId("spc41");
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql("/testdata/social-tenant-bind-data.sql")
    void testSelectCountByTenantId() {
        Integer count = socialTenantBindMapper.selectCountByTenantId("ww41");
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql("/testdata/social-tenant-bind-data.sql")
    void testSelectTenantIdBySpaceId() {
        List<String> ids = socialTenantBindMapper.selectTenantIdBySpaceId("spc41");
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql("/testdata/social-tenant-bind-data.sql")
    void testSelectSpaceIdByTenantId() {
        List<String> ids = socialTenantBindMapper.selectSpaceIdByTenantId("ww41");
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql("/testdata/social-tenant-bind-data.sql")
    void testSelectSpaceIdsByTenantIdAndAppId() {
        List<String> ids = socialTenantBindMapper.selectSpaceIdsByTenantIdAndAppId("ww41", "ai41");
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql({ "/testdata/social-tenant-bind-data.sql", "/testdata/social-tenant-data.sql"})
    void testSelectBaseInfoBySpaceId() {
        TenantBindDTO entity = socialTenantBindMapper.selectBaseInfoBySpaceId("spc41");
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql("/testdata/social-tenant-bind-data.sql")
    void testSelectCountByTenantIdAndAppId() {
        Integer count = socialTenantBindMapper.selectCountByTenantIdAndAppId("ww41", "ai41");
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql("/testdata/social-tenant-bind-data.sql")
    void testSelectSpaceIdByTenantIdAndAppId() {
        String id = socialTenantBindMapper.selectSpaceIdByTenantIdAndAppId("ww41", "ai41");
        assertThat(id).isEqualTo("spc41");
    }

    @Test
    @Sql({ "/testdata/social-tenant-bind-data.sql", "/testdata/social-tenant-data.sql"})
    void testSelectCountBySpaceIdAndPlatform() {
        Integer count = socialTenantBindMapper.selectCountBySpaceIdAndPlatform("spc41", 2);
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql({ "/testdata/social-tenant-bind-data.sql", "/testdata/social-tenant-data.sql"})
    void testSelectSpaceBindTenantInfoByPlatform() {
        SpaceBindTenantInfoDTO entity = socialTenantBindMapper.selectSpaceBindTenantInfoByPlatform("spc41", 2);
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql({ "/testdata/social-tenant-bind-data.sql", "/testdata/social-tenant-data.sql"})
    void testSelectSpaceIdByPlatformTypeAndAppType() {
        List<String> ids = socialTenantBindMapper.selectSpaceIdByPlatformTypeAndAppType(SocialPlatformType.DINGTALK, SocialAppType.INTERNAL);
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql("/testdata/social-tenant-bind-data.sql")
    void testSelectBySpaceIdAndTenantId() {
        List<SocialTenantBindEntity> entities = socialTenantBindMapper.selectBySpaceIdAndTenantId("spc41", "ww41");
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/testdata/social-tenant-bind-data.sql")
    void testSelectBySpaceId() {
        SocialTenantBindEntity entity = socialTenantBindMapper.selectBySpaceId("spc41");
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql("/testdata/social-tenant-bind-data.sql")
    void selectAllSpaceIdsByAppIdTest() {
        List<String> spaceIds = socialTenantBindMapper.selectAllSpaceIdsByAppId("ai41");
        Assertions.assertTrue(CollUtil.isNotEmpty(spaceIds));
    }

}
