package com.vikadata.api.enterprise.wechat.mapper;

import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.enterprise.wechat.mapper.AuthorizationMapper;
import com.vikadata.entity.WechatAuthorizationEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 * Authorization Mapper Test
 * </p>
 */
public class AuthorizationMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    AuthorizationMapper authorizationMapper;

    @Test
    @Sql("/testdata/wechat-authorization-data.sql")
    void testCountByAuthorizerAppid() {
        Integer count = authorizationMapper.countByAuthorizerAppid("wx3ccd2f6264309a7c");
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql("/testdata/wechat-authorization-data.sql")
    void testFindByAuthorizerAppid() {
        WechatAuthorizationEntity entity = authorizationMapper.findByAuthorizerAppid("wx3ccd2f6264309a7c");
        assertThat(entity).isNotNull();
    }

}
