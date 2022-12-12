package com.vikadata.api.enterprise.social.mapper;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     Data access layer test: third-party platform integration - enterprise WeCom user binding table and related table test
 * </p>
 */
@Disabled
public class SocialCpUserBindMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    SocialCpUserBindMapper socialCpUserBindMapper;

    @Test
    @Sql("/enterprise/sql/social-cp-user-bind-data.sql")
    void testSelectUserIdByCpTenantUserId() {
        Long id = socialCpUserBindMapper.selectUserIdByCpTenantUserId(41L);
        assertThat(id).isEqualTo(41);
    }
    @Test
    @Sql({ "/enterprise/sql/social-cp-tenant-user-data.sql", "/enterprise/sql/social-cp-user-bind-data.sql" })
    void testSelectUserIdByTenantIdAndCpUserId() {
        Long id = socialCpUserBindMapper.selectUserIdByTenantIdAndCpUserId("ww41", "ui41");
        assertThat(id).isEqualTo(41L);
    }
    @Test
    @Sql({ "/enterprise/sql/social-cp-tenant-user-data.sql", "/enterprise/sql/social-cp-user-bind-data.sql" })
    void testSelectOpenIdByTenantIdAndUserId() {
        String cpUserId = socialCpUserBindMapper.selectOpenIdByTenantIdAndUserId("ww41", 41L);
        assertThat(cpUserId).isEqualTo("ui41");
    }
    @Test
    @Sql({ "/enterprise/sql/social-cp-tenant-user-data.sql", "/enterprise/sql/social-cp-user-bind-data.sql" })
    void testCountTenantBindByUserId() {
        Long count = socialCpUserBindMapper.countTenantBindByUserId("ww41", 41L);
        assertThat(count).isEqualTo(1);
    }
    @Test
    @Sql({ "/enterprise/sql/social-cp-user-bind-data.sql" })
    void testDeleteByUserId() {
        int res = socialCpUserBindMapper.deleteByUserId(41L);
        assertThat(res).isEqualTo(1);
    }



}
