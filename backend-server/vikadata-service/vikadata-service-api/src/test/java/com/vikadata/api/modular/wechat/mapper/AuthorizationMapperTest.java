package com.vikadata.api.modular.wechat.mapper;

import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.entity.WechatAuthorizationEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *      数据访问层测试：第三方系统-微信第三方平台授权方信息表测试
 * </p>
 * @author wuyitao
 * @date 2022/4/6 1:26 PM
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
