package com.vikadata.api.modular.social.service.impl;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Objects;

import javax.annotation.Resource;

import cn.hutool.core.io.IoUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.FileHelper;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.modular.finance.service.ISocialDingTalkOrderService;
import com.vikadata.api.modular.finance.service.ISocialDingTalkRefundService;
import com.vikadata.api.modular.finance.strategy.SocialOrderStrategyFactory;
import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.api.modular.social.service.ISocialTenantService;
import com.vikadata.api.modular.space.model.vo.SpaceSubscribeVo;
import com.vikadata.api.util.billing.BillingConfigManager;
import com.vikadata.api.util.billing.DingTalkPlanConfigManager;
import com.vikadata.api.util.billing.model.ProductChannel;
import com.vikadata.entity.SocialTenantBindEntity;
import com.vikadata.entity.SocialTenantEntity;
import com.vikadata.entity.SpaceEntity;
import com.vikadata.social.dingtalk.event.order.SyncHttpMarketOrderEvent;
import com.vikadata.social.dingtalk.event.order.SyncHttpMarketServiceCloseEvent;
import com.vikadata.system.config.billing.Plan;
import com.vikadata.system.config.billing.Price;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * DingTalk Order Service Test
 */
public class DingTalkOrderServiceImplTest extends AbstractIntegrationTest {
    @Resource
    private ISocialDingTalkOrderService iSocialDingTalkOrderService;

    @Resource
    private ISocialDingTalkRefundService iSocialDingTalkRefundService;

    @Resource
    private ISocialTenantService iSocialTenantService;

    @Test
    public void testTrailPlan() {
        SyncHttpMarketOrderEvent event = getOrderPaidEvent("social/dingtalk/order/base_trail.json");
        assertThat(event).as("data could not be parsed:base_trail").isNotNull();
        // Payment scheme for order purchase
        Price price = DingTalkPlanConfigManager.getPriceByItemCodeAndMonth(event.getItemCode());
        assertThat(price).as("dingtalk trial plan configuration error").isNotNull();
    }

    @Test
    public void testTrailOrder() {
        SyncHttpMarketOrderEvent event = getOrderPaidEvent("social/dingtalk/order/base_trail.json");
        String spaceId = "spc" + IdWorker.get32UUID();
        prepareSocialBindInfo(spaceId, Objects.requireNonNull(event).getCorpId(), event.getSuiteId());
        // Purchase trial order
        LocalDateTime now = getClock().getNow(testTimeZone).toLocalDateTime();
        event.setServiceStartTime(now.toInstant(testTimeZone).toEpochMilli());
        event.setServiceStopTime(now.plusMonths(1).toInstant(testTimeZone).toEpochMilli());
        SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderPaidEvent(event);
        // Payment scheme for order purchase
        Price price = DingTalkPlanConfigManager.getPriceByItemCodeAndMonth(event.getItemCode());
        SpaceSubscribeVo vo = iSpaceSubscriptionService.getSpaceSubscription(spaceId);
        assertThat(vo.getOnTrial()).isTrue();
        assertThat(vo.getPlan()).isEqualTo(Objects.requireNonNull(price).getPlanId());
    }

    @Test
    public void testPriceTenAndOneYearOrder() {
        String spaceId = "spc" + IdWorker.get32UUID();
        SyncHttpMarketOrderEvent trailEvent = getOrderPaidEvent("social/dingtalk/order/base_trail.json");
        prepareSocialBindInfo(spaceId, Objects.requireNonNull(trailEvent).getCorpId(), trailEvent.getSuiteId());
        SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderPaidEvent(trailEvent);

        SyncHttpMarketOrderEvent event = getOrderPaidEvent("social/dingtalk/order/base_10_1_per_year.json");
        SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderPaidEvent(event);
        SpaceSubscribeVo vo = iSpaceSubscriptionService.getSpaceSubscription(spaceId);
        Price price = DingTalkPlanConfigManager.getPriceByItemCodeAndMonth(event.getItemCode());
        assertThat(vo.getOnTrial()).isFalse();
        assertThat(vo.getPlan()).isEqualTo(Objects.requireNonNull(price).getPlanId());
    }

    @Test
    public void testPriceHundredV1AndOneYearOrder() {
        String spaceId = "spc" + IdWorker.get32UUID();
        SyncHttpMarketOrderEvent trailEvent = getOrderPaidEvent("social/dingtalk/order/base_trail.json");
        prepareSocialBindInfo(spaceId, Objects.requireNonNull(trailEvent).getCorpId(), trailEvent.getSuiteId());
        SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderPaidEvent(trailEvent);

        SyncHttpMarketOrderEvent event = getOrderPaidEvent("social/dingtalk/order/base_100_1_per_year.json");
        SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderPaidEvent(event);
        SpaceSubscribeVo vo = iSpaceSubscriptionService.getSpaceSubscription(spaceId);
        Price price = DingTalkPlanConfigManager.getPriceByItemCodeAndMonth(event.getItemCode());
        assertThat(vo.getOnTrial()).isFalse();
        assertThat(vo.getPlan()).isEqualTo(Objects.requireNonNull(price).getPlanId());
    }

    @Test
    public void testPriceTenAndOneYearOrderActivity() {
        String spaceId = "spc" + IdWorker.get32UUID();
        SyncHttpMarketOrderEvent trailEvent = getOrderPaidEvent("social/dingtalk/order/base_trail.json");
        prepareSocialBindInfo(spaceId, Objects.requireNonNull(trailEvent).getCorpId(), trailEvent.getSuiteId());
        SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderPaidEvent(trailEvent);

        SyncHttpMarketOrderEvent tmpEvent = getOrderPaidEvent("social/dingtalk/order/base_10_1_per_year.json");
        SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderPaidEvent(tmpEvent);

        SyncHttpMarketOrderEvent event = getOrderPaidEvent("social/dingtalk/order/base_10_1_per_year_activity.json");
        SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderPaidEvent(event);

        SpaceSubscribeVo vo = iSpaceSubscriptionService.getSpaceSubscription(spaceId);
        Price price = DingTalkPlanConfigManager.getPriceByItemCodeAndMonth(event.getItemCode());
        assertThat(vo.getPlan()).isEqualTo(Objects.requireNonNull(price).getPlanId());
    }

    @Test
    public void testPriceTenAndOneYearOrderRefund() {
        String spaceId = "spc" + IdWorker.get32UUID();
        SyncHttpMarketOrderEvent trailEvent = getOrderPaidEvent("social/dingtalk/order/base_trail.json");
        prepareSocialBindInfo(spaceId, Objects.requireNonNull(trailEvent).getCorpId(), trailEvent.getSuiteId());
        SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderPaidEvent(trailEvent);

        SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderPaidEvent(getOrderPaidEvent("social/dingtalk/order/base_10_1_per_year.json"));

        SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderPaidEvent(getOrderPaidEvent("social/dingtalk/order/base_10_1_per_year_activity.json"));

        SyncHttpMarketServiceCloseEvent event = getOrderRefundEvent("social/dingtalk/order/base_10_1_per_year_refund.json");
        SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderRefundEvent(event);

        SpaceSubscribeVo vo = iSpaceSubscriptionService.getSpaceSubscription(spaceId);
        // Payment scheme for order purchase
        Plan plan = BillingConfigManager.getFreePlan(ProductChannel.DINGTALK);
        assertThat(vo.getOnTrial()).isFalse();
        assertThat(vo.getPlan()).isEqualTo(Objects.requireNonNull(plan).getId());
    }

    @Test
    public void testPriceTenAndOneYearOrderAgain() {
        String spaceId = "spc" + IdWorker.get32UUID();
        SyncHttpMarketOrderEvent trailEvent = getOrderPaidEvent("social/dingtalk/order/base_trail.json");
        prepareSocialBindInfo(spaceId, Objects.requireNonNull(trailEvent).getCorpId(), trailEvent.getSuiteId());
        SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderPaidEvent(trailEvent);

        SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderPaidEvent(getOrderPaidEvent("social/dingtalk/order/base_10_1_per_year.json"));

        SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderPaidEvent(getOrderPaidEvent("social/dingtalk/order/base_10_1_per_year_activity.json"));

        SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderRefundEvent(getOrderRefundEvent("social/dingtalk/order/base_10_1_per_year_refund.json"));

        SyncHttpMarketOrderEvent event = getOrderPaidEvent("social/dingtalk/order/base_10_1_per_year_twice.json");
        SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderPaidEvent(event);

        SpaceSubscribeVo vo = iSpaceSubscriptionService.getSpaceSubscription(spaceId);
        Price price = DingTalkPlanConfigManager.getPriceByItemCodeAndMonth(event.getItemCode());
        assertThat(vo.getPlan()).isEqualTo(Objects.requireNonNull(price).getPlanId());
    }

    @Test
    public void testPriceTwentyAndOneYearOrderUpgrade() {
        String spaceId = "spc" + IdWorker.get32UUID();
        SyncHttpMarketOrderEvent trailEvent = getOrderPaidEvent("social/dingtalk/order/base_trail.json");
        prepareSocialBindInfo(spaceId, Objects.requireNonNull(trailEvent).getCorpId(), trailEvent.getSuiteId());
        SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderPaidEvent(trailEvent);

        SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderPaidEvent(getOrderPaidEvent("social/dingtalk/order/base_10_1_per_year.json"));

        SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderPaidEvent(getOrderPaidEvent("social/dingtalk/order/base_10_1_per_year_activity.json"));

        SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderRefundEvent(getOrderRefundEvent("social/dingtalk/order/base_10_1_per_year_refund.json"));

        SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderPaidEvent(getOrderPaidEvent("social/dingtalk/order/base_10_1_per_year_twice.json"));

        SyncHttpMarketOrderEvent event = getOrderPaidEvent("social/dingtalk/order/base_20_1_per_year_upgrade.json");
        SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderPaidEvent(event);

        SpaceSubscribeVo vo = iSpaceSubscriptionService.getSpaceSubscription(spaceId);
        Price price = DingTalkPlanConfigManager.getPriceByItemCodeAndMonth(event.getItemCode());
        assertThat(vo.getPlan()).isEqualTo(Objects.requireNonNull(price).getPlanId());
    }

    @Test
    public void testPriceTwentyAndOneYearOrderRefund() {
        String spaceId = "spc" + IdWorker.get32UUID();
        SyncHttpMarketOrderEvent trailEvent = getOrderPaidEvent("social/dingtalk/order/base_trail.json");
        prepareSocialBindInfo(spaceId, Objects.requireNonNull(trailEvent).getCorpId(), trailEvent.getSuiteId());
        SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderPaidEvent(trailEvent);

        SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderPaidEvent(getOrderPaidEvent("social/dingtalk/order/base_10_1_per_year.json"));

        SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderPaidEvent(getOrderPaidEvent("social/dingtalk/order/base_10_1_per_year_activity.json"));

        SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderRefundEvent(getOrderRefundEvent("social/dingtalk/order/base_10_1_per_year_refund.json"));

        SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderPaidEvent(getOrderPaidEvent("social/dingtalk/order/base_10_1_per_year_twice.json"));

        SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderPaidEvent(getOrderPaidEvent("social/dingtalk/order/base_20_1_per_year_upgrade.json"));

        SyncHttpMarketServiceCloseEvent event = getOrderRefundEvent("social/dingtalk/order/base_20_1_per_year_upgrade.json");
        SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderRefundEvent(event);

        SpaceSubscribeVo vo = iSpaceSubscriptionService.getSpaceSubscription(spaceId);
        // Payment scheme for order purchase
        Plan plan = BillingConfigManager.getFreePlan(ProductChannel.DINGTALK);
        assertThat(vo.getOnTrial()).isFalse();
        assertThat(vo.getPlan()).isEqualTo(Objects.requireNonNull(plan).getId());
    }

    @Test
    public void testPriceTwoHundredAndOneYearOrder() {
        String spaceId = "spc" + IdWorker.get32UUID();
        SyncHttpMarketOrderEvent event = getOrderPaidEvent("social/dingtalk/order/standard_200_1_per_year.json");
        prepareSocialBindInfo(spaceId, Objects.requireNonNull(event).getCorpId(), event.getSuiteId());
        SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderPaidEvent(event);

        SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderPaidEvent(getOrderPaidEvent("social/dingtalk/order/standard_200_3_per_month.json"));

        SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderPaidEvent(getOrderPaidEvent("social/dingtalk/order/standard_200_1_renew_per_year.json"));

        SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderPaidEvent(getOrderPaidEvent("social/dingtalk/order/standard_200_3_renew_per_month.json"));

        SpaceSubscribeVo vo = iSpaceSubscriptionService.getSpaceSubscription(spaceId);
        Price price = DingTalkPlanConfigManager.getPriceByItemCodeAndMonth(event.getItemCode());
        assertThat(vo.getOnTrial()).isFalse();
        assertThat(vo.getPlan()).isEqualTo("dingtalk_base_no_billing_period");
    }


    private SyncHttpMarketOrderEvent getOrderPaidEvent(String filePath) {
        InputStream resourceAsStream = FileHelper.getInputStreamFromResource(filePath);
        String jsonString = IoUtil.read(resourceAsStream, StandardCharsets.UTF_8);
        SyncHttpMarketOrderEvent event = JSONUtil.toBean(jsonString, SyncHttpMarketOrderEvent.class);
        iSocialDingTalkOrderService.createOrder(event);
        return event;
    }

    private SyncHttpMarketServiceCloseEvent getOrderRefundEvent(String filePath) {
        InputStream resourceAsStream = FileHelper.getInputStreamFromResource(filePath);
        String jsonString = IoUtil.read(resourceAsStream, StandardCharsets.UTF_8);
        SyncHttpMarketServiceCloseEvent event = JSONUtil.toBean(jsonString, SyncHttpMarketServiceCloseEvent.class);
        iSocialDingTalkRefundService.createRefund(event);
        return event;
    }

    private void prepareSocialBindInfo(String spaceId, String tenantId, String appId) {
        prepareSpaceData(spaceId);
        SocialTenantBindEntity entity =
                SocialTenantBindEntity.builder().id(IdWorker.getId()).tenantId(tenantId).appId(appId).spaceId(spaceId).build();
        iSocialTenantBindService.save(entity);
        iSocialTenantService.save(SocialTenantEntity.builder().id(IdWorker.getId()).tenantId(tenantId).appId(appId).platform(SocialPlatformType.DINGTALK.getValue()).appType(SocialAppType.ISV.getType()).build());
    }

    private void prepareSpaceData(String spaceId) {
        // Initialize space information
        SpaceEntity spaceEntity = SpaceEntity.builder().spaceId(spaceId).name("test space").build();
        iSpaceService.save(spaceEntity);
    }
}
