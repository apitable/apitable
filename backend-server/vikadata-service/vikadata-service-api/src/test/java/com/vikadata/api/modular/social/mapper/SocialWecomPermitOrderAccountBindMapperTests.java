package com.vikadata.api.modular.social.mapper;

import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;

import org.springframework.test.context.jdbc.Sql;

/**
 * <p>
 * 企微服务商接口许可账号绑定信息
 * </p>
 * @author 刘斌华
 * @date 2022-07-06 09:28:13
 */
class SocialWecomPermitOrderAccountBindMapperTests extends AbstractMyBatisMapperTest {

    @Resource
    private SocialWecomPermitOrderAccountBindMapper socialWecomPermitOrderAccountBindMapper;

    @Test
    @Sql("/testdata/social-wecom-permit-order-account-bind-data.sql")
    void selectActiveCodesByOrderIdTest() {
        List<String> activeCodes = socialWecomPermitOrderAccountBindMapper
                .selectActiveCodesByOrderId("order123xxx");
        Assertions.assertTrue(CollUtil.isNotEmpty(activeCodes));
    }

    @Test
    @Sql("/testdata/social-wecom-permit-order-account-bind-data.sql")
    void selectCountByOrderIdTest() {
        int count = socialWecomPermitOrderAccountBindMapper.selectCountByOrderId("order123xxx");
        Assertions.assertNotEquals(0, count);
    }

}
