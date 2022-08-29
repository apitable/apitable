package com.vikadata.api.modular.social.mapper;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     数据访问层测试：第三方平台集成-企业微信用户绑定表及其相关表测试
 * </p>
 *
 * @author wuyitao
 * @date 2022/4/4 4:40 PM
 */
@Disabled
public class SocialCpUserBindMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    SocialCpUserBindMapper socialCpUserBindMapper;

    @Test
    @Sql("/testdata/social-cp-user-bind-data.sql")
    void testSelectUserIdByCpTenantUserId() {
        Long id = socialCpUserBindMapper.selectUserIdByCpTenantUserId(41L);
        assertThat(id).isEqualTo(41);
    }
    @Test
    @Sql({ "/testdata/social-cp-tenant-user-data.sql", "/testdata/social-cp-user-bind-data.sql"})
    void testSelectUserIdByTenantIdAndCpUserId() {
        Long id = socialCpUserBindMapper.selectUserIdByTenantIdAndCpUserId("ww41", "ui41");
        assertThat(id).isEqualTo(41L);
    }
    @Test
    @Sql({ "/testdata/social-cp-tenant-user-data.sql", "/testdata/social-cp-user-bind-data.sql"})
    void testSelectOpenIdByTenantIdAndUserId() {
        String cpUserId = socialCpUserBindMapper.selectOpenIdByTenantIdAndUserId("ww41", 41L);
        assertThat(cpUserId).isEqualTo("ui41");
    }
    @Test
    @Sql({ "/testdata/social-cp-tenant-user-data.sql", "/testdata/social-cp-user-bind-data.sql"})
    void testCountTenantBindByUserId() {
        Long count = socialCpUserBindMapper.countTenantBindByUserId("ww41", 41L);
        assertThat(count).isEqualTo(1);
    }
    @Test
    @Sql({"/testdata/social-cp-user-bind-data.sql"})
    void testDeleteByUserId() {
        int res = socialCpUserBindMapper.deleteByUserId(41L);
        assertThat(res).isEqualTo(1);
    }



}
