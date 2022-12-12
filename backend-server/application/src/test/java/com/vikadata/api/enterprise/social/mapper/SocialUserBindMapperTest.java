package com.vikadata.api.enterprise.social.mapper;

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.enterprise.social.entity.SocialUserBindEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     Data access layer test: third-party platform integration - user binding table test
 * </p>
 */
@Disabled
public class SocialUserBindMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    SocialUserBindMapper socialUserBindMapper;

    @Test
    @Sql("/enterprise/sql/social-user-bind-data.sql")
    void testSelectUserIdByUnionId() {
        Long id = socialUserBindMapper.selectUserIdByUnionId("ui41");
        assertThat(id).isEqualTo(41L);
    }


    @Test
    @Sql("/enterprise/sql/social-user-bind-data.sql")
    void testSelectUnionIdByUserId() {
        List<String> ids = socialUserBindMapper.selectUnionIdByUserId(41L);
        assertThat(ids).isNotEmpty();
    }


    @Test
    @Sql("/enterprise/sql/social-user-bind-data.sql")
    void testSelectByUnionIds() {
        List<SocialUserBindEntity> entities = socialUserBindMapper.selectByUnionIds(CollUtil.newArrayList("ui41"));
        assertThat(entities).isNotEmpty();
    }


    @Test
    @Sql({ "/enterprise/sql/social-user-bind-data.sql", "/enterprise/sql/social-tenant-user-data.sql" })
    void testSelectOpenIdByTenantIdAndUserId() {
        String id = socialUserBindMapper.selectOpenIdByTenantIdAndUserId("ai41", "ww41", 41L);
        assertThat(id).isEqualTo("oi41");
    }

}
