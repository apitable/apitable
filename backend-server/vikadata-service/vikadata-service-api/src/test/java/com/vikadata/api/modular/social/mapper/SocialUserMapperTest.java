package com.vikadata.api.modular.social.mapper;

import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.entity.SocialUserEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     Data access layer test: third-party platform integration - user table test
 * </p>
 */
public class SocialUserMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    SocialUserMapper socialUserMapper;

    @Test
    @Sql("/testdata/social-user-data.sql")
    void testSelectByUnionId() {
        SocialUserEntity entity = socialUserMapper.selectByUnionId("ui41");
        assertThat(entity).isNotNull();
    }

}
