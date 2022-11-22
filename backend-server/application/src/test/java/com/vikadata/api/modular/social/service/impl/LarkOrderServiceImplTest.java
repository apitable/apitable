package com.vikadata.api.modular.social.service.impl;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.Objects;

import cn.hutool.core.io.IoUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.enterprise.billing.strategy.SocialOrderStrategyFactory;
import com.vikadata.api.enterprise.billing.util.LarkPlanConfigManager;
import com.vikadata.api.enterprise.social.enums.SocialPlatformType;
import com.vikadata.api.interfaces.billing.model.SubscriptionInfo;
import com.vikadata.api.shared.sysconfig.billing.Price;
import com.vikadata.entity.SocialTenantBindEntity;
import com.vikadata.entity.SpaceEntity;
import com.vikadata.social.feishu.enums.PricePlanType;
import com.vikadata.social.feishu.event.app.OrderPaidEvent;

import org.springframework.core.io.ClassPathResource;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Lark order service test
 */
public class LarkOrderServiceImplTest extends AbstractIntegrationTest {

    @Test
    public void testPriceTenAndOneYear() {
        OrderPaidEvent event = getOrderPaidEvent("social/feishu/order/base_10_1_trail.json");
        assertThat(event).as("data could not be parsed:base_10_1_trail").isNotNull();

        Price price = LarkPlanConfigManager.getPriceByLarkPlanId(event.getPricePlanId());
        assertThat(price).as("Feishu Standard Edition (10 people) configuration error").isNotNull();
    }

    @Test
    public void testPriceTwentyAndOneYear() {
        OrderPaidEvent event = getOrderPaidEvent("social/feishu/order/base_20_1_upgrade.json");
        assertThat(event).as("Data could not be parsed:base_20_1_upgrade").isNotNull();

        Price price = LarkPlanConfigManager.getPriceByLarkPlanId(event.getPricePlanId());
        assertThat(price).as("Feishu Standard Edition (20 people) is misconfigured").isNotNull();
    }

    @Test
    public void testPriceThirtyAndOneYear() {
        OrderPaidEvent event = getOrderPaidEvent("social/feishu/order/base_30_1_renew_trail.json");
        assertThat(event).as("Data could not be parsed:base_30_1_renew_trail").isNotNull();

        Price price = LarkPlanConfigManager.getPriceByLarkPlanId(event.getPricePlanId());
        assertThat(price).as("Feishu Standard Edition (30 people) is misconfigured").isNotNull();
    }

    @Test
    public void testEnterprisePriceThirtyAndOneYear() {
        OrderPaidEvent event = getOrderPaidEvent("social/feishu/order/enterprise_30_1_upgrade_after_renew.json");
        assertThat(event).as("data could not be parsed:enterprise_30_1_upgrade_after_renew").isNotNull();

        Price price = LarkPlanConfigManager.getPriceByLarkPlanId(event.getPricePlanId());
        assertThat(price).as("Feishu Enterprise Edition (30 people) configuration error").isNotNull();
    }

    @Test
    @Disabled("no assert")
    public void testTrailOrder() {
        OrderPaidEvent event = getOrderPaidEvent("social/feishu/order/base_10_1_trail.json");
        Objects.requireNonNull(event).setPricePlanType(PricePlanType.TRIAL.getType());
        String spaceId = "spc" + IdWorker.get32UUID();
        prepareSocialBindInfo(spaceId, Objects.requireNonNull(event).getTenantKey(), event.getAppId());
        SocialOrderStrategyFactory.getService(SocialPlatformType.FEISHU).retrieveOrderPaidEvent(event);
        // init now time
        final OffsetDateTime nowTime = OffsetDateTime.of(2022, 6, 7, 19, 10, 30, 0, testTimeZone);
        getClock().setTime(nowTime);
        SubscriptionInfo subscriptionInfo = iSpaceSubscriptionService.getPlanInfoBySpaceId(spaceId);
        assertThat(subscriptionInfo.onTrial()).isTrue();
        LocalDateTime startDate =
                LocalDateTime.ofInstant(Instant.ofEpochSecond(Long.parseLong(event.getPayTime())), testTimeZone);
        LocalDateTime endDate = startDate.plusDays(15);
        assertThat(endDate.toLocalDate()).isEqualTo(subscriptionInfo.getEndDate());
    }

    @Test
    public void testPriceTenAndOneYearOrder() {
        String spaceId = "spc" + IdWorker.get32UUID();
        OrderPaidEvent trailEvent = getOrderPaidEvent("social/feishu/order/base_10_1_trail.json");
        prepareSocialBindInfo(spaceId, Objects.requireNonNull(trailEvent).getTenantKey(), trailEvent.getAppId());
        SocialOrderStrategyFactory.getService(SocialPlatformType.FEISHU).retrieveOrderPaidEvent(trailEvent);

        OrderPaidEvent event = getOrderPaidEvent("social/feishu/order/base_10_1_per_year.json");
        SocialOrderStrategyFactory.getService(SocialPlatformType.FEISHU).retrieveOrderPaidEvent(event);
        SubscriptionInfo subscriptionInfo = iSpaceSubscriptionService.getPlanInfoBySpaceId(spaceId);
        Price price = LarkPlanConfigManager.getPriceByLarkPlanId(Objects.requireNonNull(event).getPricePlanId());
        assertThat(subscriptionInfo.onTrial()).isFalse();
        assertThat(subscriptionInfo.getBasePlan()).isEqualTo(Objects.requireNonNull(price).getPlanId());
    }

    @Test
    public void testPriceTwentyAndOneYearOrderUpgrade() {
        String spaceId = "spc" + IdWorker.get32UUID();
        OrderPaidEvent trailEvent = getOrderPaidEvent("social/feishu/order/base_10_1_trail.json");
        prepareSocialBindInfo(spaceId, Objects.requireNonNull(trailEvent).getTenantKey(), trailEvent.getAppId());
        SocialOrderStrategyFactory.getService(SocialPlatformType.FEISHU).retrieveOrderPaidEvent(trailEvent);

        SocialOrderStrategyFactory.getService(SocialPlatformType.FEISHU)
                .retrieveOrderPaidEvent(getOrderPaidEvent("social/feishu/order/base_10_1_per_year.json"));

        OrderPaidEvent event = getOrderPaidEvent("social/feishu/order/base_20_1_upgrade.json");
        SocialOrderStrategyFactory.getService(SocialPlatformType.FEISHU).retrieveOrderPaidEvent(event);
        SubscriptionInfo subscription = iSpaceSubscriptionService.getPlanInfoBySpaceId(spaceId);
        Price price = LarkPlanConfigManager.getPriceByLarkPlanId(Objects.requireNonNull(event).getPricePlanId());
        assertThat(subscription.getBasePlan()).isEqualTo(Objects.requireNonNull(price).getPlanId());
    }

    @Test
    public void testPriceThirtyAndOneYearOrderRenewTrail() {
        String spaceId = "spc" + IdWorker.get32UUID();
        OrderPaidEvent trailEvent = getOrderPaidEvent("social/feishu/order/base_10_1_trail.json");
        prepareSocialBindInfo(spaceId, Objects.requireNonNull(trailEvent).getTenantKey(), trailEvent.getAppId());

        SocialOrderStrategyFactory.getService(SocialPlatformType.FEISHU).retrieveOrderPaidEvent(trailEvent);

        SocialOrderStrategyFactory.getService(SocialPlatformType.FEISHU)
                .retrieveOrderPaidEvent(getOrderPaidEvent("social/feishu/order/base_10_1_per_year.json"));

        OrderPaidEvent event = getOrderPaidEvent("social/feishu/order/base_20_1_upgrade.json");
        SocialOrderStrategyFactory.getService(SocialPlatformType.FEISHU).retrieveOrderPaidEvent(event);
        SubscriptionInfo before = iSpaceSubscriptionService.getPlanInfoBySpaceId(spaceId);
        // Renewal upgrade to 30 people for trial, to be effective
        SocialOrderStrategyFactory.getService(SocialPlatformType.FEISHU).retrieveOrderPaidEvent(getOrderPaidEvent(
                "social/feishu/order/base_30_1_renew_trail.json"));
        SubscriptionInfo after = iSpaceSubscriptionService.getPlanInfoBySpaceId(spaceId);
        assertThat(after.getBasePlan()).isEqualTo(before.getBasePlan());
    }

    @Test
    public void testEnterprisePriceThirtyAndOneYearUpgradeAfterRenew() {
        String spaceId = "spc" + IdWorker.get32UUID();
        OrderPaidEvent trailEvent = getOrderPaidEvent("social/feishu/order/base_10_1_trail.json");
        prepareSocialBindInfo(spaceId, Objects.requireNonNull(trailEvent).getTenantKey(), trailEvent.getAppId());
        // 1. ON TRIAL
        SocialOrderStrategyFactory.getService(SocialPlatformType.FEISHU).retrieveOrderPaidEvent(trailEvent);
        // 2. Buy
        SocialOrderStrategyFactory.getService(SocialPlatformType.FEISHU)
                .retrieveOrderPaidEvent(getOrderPaidEvent("social/feishu/order/base_10_1_per_year.json"));
        // 3 Upgrade
        SocialOrderStrategyFactory.getService(SocialPlatformType.FEISHU)
                .retrieveOrderPaidEvent(getOrderPaidEvent("social/feishu/order/base_20_1_upgrade.json"));
        // 4 Renewal upgrade to 30 people for trial, to be effective
        SocialOrderStrategyFactory.getService(SocialPlatformType.FEISHU).retrieveOrderPaidEvent(getOrderPaidEvent(
                "social/feishu/order/base_30_1_renew_trail.json"));
        // 5 After renewal and upgrade, upgrade the original scheme again
        OrderPaidEvent event = getOrderPaidEvent("social/feishu/order/enterprise_30_1_upgrade_after_renew.json");
        SocialOrderStrategyFactory.getService(SocialPlatformType.FEISHU).retrieveOrderPaidEvent(event);
        SubscriptionInfo subscription = iSpaceSubscriptionService.getPlanInfoBySpaceId(spaceId);
        Price price = LarkPlanConfigManager.getPriceByLarkPlanId(Objects.requireNonNull(event).getPricePlanId());
        assertThat(subscription.getBasePlan()).isEqualTo(Objects.requireNonNull(price).getPlanId());
    }


    private OrderPaidEvent getOrderPaidEvent(String filePath) {
        InputStream resourceAsStream = ClassPathResource.class.getClassLoader().getResourceAsStream(filePath);
        if (resourceAsStream == null) {
            return null;
        }
        String jsonString = IoUtil.read(resourceAsStream, StandardCharsets.UTF_8);
        return JSONUtil.toBean(jsonString, OrderPaidEvent.class);
    }

    private void prepareSocialBindInfo(String spaceId, String tenantId, String appId) {
        prepareSpaceData(spaceId);
        SocialTenantBindEntity entity =
                SocialTenantBindEntity.builder().id(IdWorker.getId()).tenantId(tenantId).appId(appId).spaceId(spaceId).build();
        iSocialTenantBindService.save(entity);
    }

    private void prepareSpaceData(String spaceId) {
        // Initialize space information
        SpaceEntity spaceEntity = SpaceEntity.builder().spaceId(spaceId).name("test space").build();
        iSpaceService.save(spaceEntity);
    }
}
