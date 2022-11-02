package com.vikadata.api.modular.finance.mapper;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.enums.finance.SubscriptionState;
import com.vikadata.api.util.billing.model.ProductCategory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 * Subscription Billing System - Subscription Mapper Test
 * </p>
 */
public class SubscriptionMapperTest extends AbstractIntegrationTest {

    @Autowired
    private SubscriptionMapper subscriptionMapper;

    @Test
    @Sql("/testdata/billing-subscription-data.sql")
    public void testSelectUnExpireCapacityBySpaceId(){
        String spaceId = "spcSueRmAkuPP";
        assertThat(subscriptionMapper.selectUnExpireCapacityBySpaceId(spaceId, new Page<>(), SubscriptionState.ACTIVATED)).isNotNull();
    }

    @Test
    @Sql("/testdata/billing-subscription-data.sql")
    public void testSelectExpireCapacityBySpaceId(){
        String spaceId = "spcSueRmAkuPP";
        assertThat(subscriptionMapper.selectExpireCapacityBySpaceId(spaceId, new Page<>()).getRecords()).isEmpty();
    }

    @Test
    @Sql("/testdata/billing-subscription-data.sql")
    public void testSelectUnExpireGiftCapacityBySpaceId(){
        String spaceId = "spcSueRmAkuPP";
        String planId = "capacity_300_MB";
        assertThat(subscriptionMapper.selectUnExpireGiftCapacityBySpaceId(spaceId,planId, SubscriptionState.ACTIVATED)).isNotNull();
    }

    @Test
    @Sql("/testdata/billing-subscription-data.sql")
    public void testSelectUnExpireBaseProductBySpaceId(){
        String spaceId = "spcSueRmAkuPP";
        assertThat(subscriptionMapper.selectUnExpireBaseProductBySpaceId(spaceId, SubscriptionState.ACTIVATED, ProductCategory.BASE)).isEqualTo(0);
    }
}
