package com.vikadata.api.enterprise.social.mapper;

import java.util.Collections;
import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.enterprise.social.entity.SocialWecomPermitOrderEntity;

import org.springframework.test.context.jdbc.Sql;

/**
 * <p>
 * WeCom Service Provider Interface License Ordering Information
 * </p>
 */
class SocialWecomPermitOrderMapperTests extends AbstractMyBatisMapperTest {

    @Resource
    private SocialWecomPermitOrderMapper socialWecomPermitOrderMapper;

    @Test
    @Sql("/enterprise/sql/social-wecom-permit-order-data.sql")
    void selectByOrderIdTest() {
        SocialWecomPermitOrderEntity orderEntity = socialWecomPermitOrderMapper.selectByOrderId("order123xxx");
        Assertions.assertNotNull(orderEntity);
    }

    @Test
    @Sql("/enterprise/sql/social-wecom-permit-order-data.sql")
    void selectByOrderStatusesTest() {
        List<SocialWecomPermitOrderEntity> orderEntities = socialWecomPermitOrderMapper
                .selectByOrderStatuses("wwxxx123", "wwcorpx123123", Collections.singletonList(0));
        Assertions.assertTrue(CollUtil.isNotEmpty(orderEntities));
    }

}
