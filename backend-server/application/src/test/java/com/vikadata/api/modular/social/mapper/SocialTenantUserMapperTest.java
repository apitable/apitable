package com.vikadata.api.modular.social.mapper;

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.enterprise.social.mapper.SocialTenantUserMapper;
import com.vikadata.api.enterprise.social.enums.SocialPlatformType;
import com.vikadata.api.enterprise.social.model.SocialTenantUserDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     Data access layer test: third-party platform integration - enterprise tenant user table test
 * </p>
 */
@Disabled
public class SocialTenantUserMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    SocialTenantUserMapper socialTenantUserMapper;

    @Test
    @Sql("/testdata/social-tenant-user-data.sql")
    void testSelectUnionIdsByTenantId() {
        List<String> ids = socialTenantUserMapper.selectUnionIdsByTenantId("ai41", "ww41");
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql("/testdata/social-tenant-user-data.sql")
    void testSelectOpenIdsByTenantId() {
        List<String> ids = socialTenantUserMapper.selectOpenIdsByTenantId("ai41", "ww41");
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql("/testdata/social-tenant-user-data.sql")
    void testSelectCountByTenantIdAndOpenId() {
        Integer count = socialTenantUserMapper.selectCountByTenantIdAndOpenId("ai41", "ww41", "oi41");
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql("/testdata/social-tenant-user-data.sql")
    void testSelectUnionIdByOpenId() {
        String id = socialTenantUserMapper.selectUnionIdByOpenId("ai41", "ww41", "oi41");
        assertThat(id).isEqualTo("ui41");
    }

    @Test
    @Sql("/testdata/social-tenant-user-data.sql")
    void testSelectUnionIdsByOpenIds() {
        List<String> ids = socialTenantUserMapper.selectUnionIdsByOpenIds("ai41", "ww41", CollUtil.newArrayList("oi41"));
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql("/testdata/social-tenant-user-data.sql")
    void testSelectOpenIdByAppIdAndTenantIdAndUnionIds() {
        List<String> ids = socialTenantUserMapper.selectOpenIdByAppIdAndTenantIdAndUnionIds("ai41", "ww41", CollUtil.newArrayList("ui41"));
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql({ "/testdata/social-tenant-user-data.sql", "/testdata/social-tenant-data.sql"})
    void testSelectOpenIdByUnionIdAndPlatform() {
        String id = socialTenantUserMapper.selectOpenIdByUnionIdAndPlatform("ui41", SocialPlatformType.DINGTALK);
        assertThat(id).isEqualTo("oi41");
    }

    @Test
    @Sql("/testdata/social-tenant-user-data.sql")
    void testSelectOpenIdAndUnionIdByTenantId() {
        List<SocialTenantUserDTO> entities = socialTenantUserMapper.selectOpenIdAndUnionIdByTenantId("ww41", "ai41");
        assertThat(entities).isNotEmpty();
    }

}
