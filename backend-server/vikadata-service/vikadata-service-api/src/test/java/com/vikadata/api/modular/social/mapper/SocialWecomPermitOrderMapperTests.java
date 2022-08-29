package com.vikadata.api.modular.social.mapper;

import java.util.Collections;
import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.entity.SocialWecomPermitOrderEntity;

import org.springframework.test.context.jdbc.Sql;

/**
 * <p>
 * 企微服务商接口许可下单信息
 * </p>
 * @author 刘斌华
 * @date 2022-07-05 11:28:11
 */
class SocialWecomPermitOrderMapperTests extends AbstractMyBatisMapperTest {

    @Resource
    private SocialWecomPermitOrderMapper socialWecomPermitOrderMapper;

    @Test
    @Sql("/testdata/social-wecom-permit-order-data.sql")
    void selectByOrderIdTest() {
        SocialWecomPermitOrderEntity orderEntity = socialWecomPermitOrderMapper.selectByOrderId("order123xxx");
        Assertions.assertNotNull(orderEntity);
    }

    @Test
    @Sql("/testdata/social-wecom-permit-order-data.sql")
    void selectByOrderStatusesTest() {
        List<SocialWecomPermitOrderEntity> orderEntities = socialWecomPermitOrderMapper
                .selectByOrderStatuses("wwxxx123", "wwcorpx123123", Collections.singletonList(0));
        Assertions.assertTrue(CollUtil.isNotEmpty(orderEntities));
    }

}
