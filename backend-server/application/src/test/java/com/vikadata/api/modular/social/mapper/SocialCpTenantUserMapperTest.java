package com.vikadata.api.modular.social.mapper;

import java.util.List;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.enterprise.social.mapper.SocialCpTenantUserMapper;
import com.vikadata.api.enterprise.social.model.CpTenantUserDTO;
import com.vikadata.api.enterprise.social.entity.SocialCpTenantUserEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     Data access layer test: third-party platform integration - enterprise WeCom tenant users and their related tables test
 * </p>
 */
@Disabled
public class SocialCpTenantUserMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    SocialCpTenantUserMapper socialCpTenantUserMapper;

    @Test
    @Sql("/testdata/social-cp-tenant-user-data.sql")
    void testSelectOpenIdsByTenantId() {
        List<CpTenantUserDTO> entities = socialCpTenantUserMapper.selectOpenIdsByTenantId("ww41", "ai41");
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/testdata/social-cp-tenant-user-data.sql")
    void testSelectByTenantIdAndAppIdAndCpUserId() {
        SocialCpTenantUserEntity entity = socialCpTenantUserMapper.selectByTenantIdAndAppIdAndCpUserId("ww41", "ai41", "ui41");
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql({ "/testdata/social-cp-tenant-user-data.sql", "/testdata/social-cp-user-bind-data.sql"})
    void testSelectByTenantIdAndAppIdAndUserId() {
        SocialCpTenantUserEntity entity = socialCpTenantUserMapper.selectByTenantIdAndAppIdAndUserId("ww41", "ai41", 41L);
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql("/testdata/social-cp-tenant-user-data.sql")
    void testSelectIdByTenantIdAndAppIdAndCpUserId() {
        Long id = socialCpTenantUserMapper.selectIdByTenantIdAndAppIdAndCpUserId("ww41", "ai41", "ui41");
        assertThat(id).isEqualTo(41L);
    }

}
