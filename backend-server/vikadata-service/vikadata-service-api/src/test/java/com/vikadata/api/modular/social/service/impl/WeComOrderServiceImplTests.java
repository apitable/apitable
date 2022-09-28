package com.vikadata.api.modular.social.service.impl;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import cn.hutool.core.io.IoUtil;
import cn.hutool.json.JSONUtil;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractWecomIsvTest;
import com.vikadata.api.FileHelper;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.modular.finance.model.SocialOrderContext;
import com.vikadata.api.modular.finance.strategy.SocialOrderStrategyFactory;
import com.vikadata.api.modular.finance.strategy.impl.WeComOrderServiceImpl;
import com.vikadata.api.modular.social.factory.SocialFactory;
import com.vikadata.api.modular.space.model.vo.SpaceSubscribeVo;
import com.vikadata.api.util.billing.WeComPlanConfigManager;
import com.vikadata.social.wecom.event.order.WeComOrderPaidEvent;
import com.vikadata.social.wecom.event.order.WeComOrderRefundEvent;
import com.vikadata.system.config.billing.Price;

/**
 * <p>
 * {@link WeComOrderServiceImpl} unit tests
 * </p>
 * @author Codeman
 * @date 2022-08-29 19:06:46
 */
class WeComOrderServiceImplTests extends AbstractWecomIsvTest {

    /**
     * Test build standard trial context
     *
     * @author Codeman
     * @date 2022-08-30 11:31:33
     */
    @Test
    void standardTrialContextTest() {
        // 1 prepare wecom isv env
        createWecomIsvTenant("ww0506baa4d734acb9", "wpOhr1DQAAk84XQXi-sYU1P8PGcNztsw");
        // 2 build context
        WeComOrderPaidEvent paidEvent = getOrderPaidEvent("social/wecom/order/standard_trial_new.json");
        SocialOrderContext context = SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM)
                .buildSocialOrderContext(paidEvent);
        Assertions.assertNotNull(context);
    }

    /**
     * Test paid for standard trial edition
     *
     * @author Codeman
     * @date 2022-08-30 11:32:42
     */
    @Test
    void standardTrialOrderTest() {
        // 1 prepare wecom isv env
        String spaceId = createWecomIsvTenant("ww0506baa4d734acb9", "wpOhr1DQAAk84XQXi-sYU1P8PGcNztsw");
        // 2 handle new trial paid event
        WeComOrderPaidEvent paidEvent = getOrderPaidEvent("social/wecom/order/standard_trial_new.json");
        paidEvent.setPaidTime(getClock().getNow(testTimeZone).toEpochSecond());
        paidEvent.setOrderTime(getClock().getNow(testTimeZone).toEpochSecond());
        paidEvent.setBeginTime(getClock().getNow(testTimeZone).toEpochSecond());
        paidEvent.setEndTime(getClock().getNow(testTimeZone).plusDays(15).toEpochSecond());
        SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM)
                .retrieveOrderPaidEvent(paidEvent);
        // 3 assert subscription
        SpaceSubscribeVo subscribeVo = iSpaceSubscriptionService.getSpaceSubscription(spaceId);
        Assertions.assertTrue(subscribeVo.getOnTrial());
        Assertions.assertEquals(WeComPlanConfigManager.getPaidPlanFromWeComTrial().getId(), subscribeVo.getPlan());
    }

    @Test
    public void testStandardRenewTrialOrder() {
        // 1 prepare wecom isv env
        String spaceId = createWecomIsvTenant("ww0506baa4d734acb9", "wpOhr1DQAAk84XQXi-sYU1P8PGcNztsw");
        // 2 handle new trial paid event
        WeComOrderPaidEvent paidEvent = getOrderPaidEvent("social/wecom/order/standard_trial_new.json");
        paidEvent.setPaidTime(getClock().getNow(testTimeZone).toEpochSecond());
        paidEvent.setOrderTime(getClock().getNow(testTimeZone).toEpochSecond());
        paidEvent.setBeginTime(getClock().getNow(testTimeZone).minusDays(15).toEpochSecond());
        paidEvent.setEndTime(getClock().getNow(testTimeZone).minusMinutes(1).toEpochSecond());
        SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM)
                .retrieveOrderPaidEvent(paidEvent);
        // 3 handle renewal trial paid event
        paidEvent = getOrderPaidEvent("social/wecom/order/standard_trial_renewal.json");
        paidEvent.setBeginTime(getClock().getNow(testTimeZone).toEpochSecond());
        paidEvent.setEndTime(getClock().getNow(testTimeZone).plusDays(15).toEpochSecond());
        SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM)
                .retrieveOrderPaidEvent(paidEvent);
        // 4 assert subscription
        SpaceSubscribeVo subscribeVo = iSpaceSubscriptionService.getSpaceSubscription(spaceId);
        Assertions.assertTrue(subscribeVo.getOnTrial());
        Assertions.assertEquals(WeComPlanConfigManager.getPaidPlanFromWeComTrial().getId(), subscribeVo.getPlan());
    }

    /**
     * Test for new standard edition with 10 people and 1 year
     *
     * @author Codeman
     * @date 2022-08-30 14:11:08
     */
    @Test
    void standardTenPeopleAndOneYearOrderTest() {
        // 1 prepare wecom isv env
        String spaceId = createWecomIsvTenant("ww0506baa4d734acb9", "wpOhr1DQAAk84XQXi-sYU1P8PGcNztsw");
        // 2 handle new trial paid event
        WeComOrderPaidEvent paidEvent = getOrderPaidEvent("social/wecom/order/standard_trial_new.json");
        SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM)
                .retrieveOrderPaidEvent(paidEvent);
        // 3 handle new paid event
        paidEvent = getOrderPaidEvent("social/wecom/order/standard_10_1_per_year_new.json");
        paidEvent.setBeginTime(getClock().getNow(testTimeZone).toEpochSecond());
        paidEvent.setEndTime(getClock().getNow(testTimeZone).plusDays(paidEvent.getOrderPeriod()).toEpochSecond());
        SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM)
                .retrieveOrderPaidEvent(paidEvent);
        // 4 assert subscription
        SpaceSubscribeVo subscribeVo = iSpaceSubscriptionService.getSpaceSubscription(spaceId);
        Price price = WeComPlanConfigManager.getPriceByWeComEditionIdAndMonth(paidEvent.getEditionId(),
                paidEvent.getUserCount(), SocialFactory.getWeComOrderMonth(paidEvent.getOrderPeriod()));
        Assertions.assertNotNull(price);
        Assertions.assertFalse(subscribeVo.getOnTrial());
        Assertions.assertEquals(price.getPlanId(), subscribeVo.getPlan());
    }

    /**
     * Test for renewal standard edition with 10 people and 1 year
     *
     * @author Codeman
     * @date 2022-08-30 16:36:31
     */
    @Test
    void standardTenPeopleAndOneYearRenewalTest() {
        // 1 prepare wecom isv env
        String spaceId = createWecomIsvTenant("ww0506baa4d734acb9", "wpOhr1DQAAk84XQXi-sYU1P8PGcNztsw");
        // 2 handle new paid event
        WeComOrderPaidEvent paidEvent = getOrderPaidEvent("social/wecom/order/standard_10_1_per_year_new.json");
        SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM)
                .retrieveOrderPaidEvent(paidEvent);
        // 3 assert subscription
        SpaceSubscribeVo subscribeVo = iSpaceSubscriptionService.getSpaceSubscription(spaceId);
        Price price = WeComPlanConfigManager.getPriceByWeComEditionIdAndMonth(paidEvent.getEditionId(),
                paidEvent.getUserCount(), SocialFactory.getWeComOrderMonth(paidEvent.getOrderPeriod()));
        Assertions.assertNotNull(price);
        Assertions.assertFalse(subscribeVo.getOnTrial());
        Assertions.assertEquals(price.getPlanId(), subscribeVo.getPlan());
        // 4 handle renewal paid event
        paidEvent = getOrderPaidEvent("social/wecom/order/standard_10_1_per_year_renewal.json");
        SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM)
                .retrieveOrderPaidEvent(paidEvent);
        // 5 assert subscription
        subscribeVo = iSpaceSubscriptionService.getSpaceSubscription(spaceId);
        price = WeComPlanConfigManager.getPriceByWeComEditionIdAndMonth(paidEvent.getEditionId(),
                paidEvent.getUserCount(), SocialFactory.getWeComOrderMonth(paidEvent.getOrderPeriod()));
        Assertions.assertNotNull(price);
        Assertions.assertFalse(subscribeVo.getOnTrial());
        Assertions.assertEquals(price.getPlanId(), subscribeVo.getPlan());
    }

    /**
     * Test for upgrade standard edition with 10 people and 1 year
     *
     * @author Codeman
     * @date 2022-08-30 17:53:40
     */
    @Test
    void standardTenPeopleAndOneYearUpgradeTest() {
        // 1 prepare wecom isv env
        String spaceId = createWecomIsvTenant("ww0506baa4d734acb9", "wpOhr1DQAAk84XQXi-sYU1P8PGcNztsw");
        // 2 handle new paid event
        WeComOrderPaidEvent paidEvent = getOrderPaidEvent("social/wecom/order/standard_10_1_per_year_new.json");
        SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM)
                .retrieveOrderPaidEvent(paidEvent);
        // 3 assert subscription
        SpaceSubscribeVo subscribeVo = iSpaceSubscriptionService.getSpaceSubscription(spaceId);
        Price price = WeComPlanConfigManager.getPriceByWeComEditionIdAndMonth(paidEvent.getEditionId(),
                paidEvent.getUserCount(), SocialFactory.getWeComOrderMonth(paidEvent.getOrderPeriod()));
        Assertions.assertNotNull(price);
        Assertions.assertFalse(subscribeVo.getOnTrial());
        Assertions.assertEquals(price.getPlanId(), subscribeVo.getPlan());
        // 4 handle upgrade paid event
        paidEvent = getOrderPaidEvent("social/wecom/order/standard_10_1_per_year_upgrade.json");
        SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM)
                .retrieveOrderPaidEvent(paidEvent);
        // 5 assert subscription
        subscribeVo = iSpaceSubscriptionService.getSpaceSubscription(spaceId);
        price = WeComPlanConfigManager.getPriceByWeComEditionIdAndMonth(paidEvent.getEditionId(),
                paidEvent.getUserCount(), SocialFactory.getWeComOrderMonth(paidEvent.getOrderPeriod()));
        Assertions.assertNotNull(price);
        Assertions.assertFalse(subscribeVo.getOnTrial());
        Assertions.assertEquals(price.getPlanId(), subscribeVo.getPlan());
    }

    /**
     * Test for upgrade standard edition with 10 people and 1 year, then refund
     *
     * @author Codeman
     * @date 2022-08-30 18:51:11
     */
    @Test
    void standardTenPeopleAndOneYearUpgradeRefundTest() {
        // 1 prepare wecom isv env
        String spaceId = createWecomIsvTenant("ww0506baa4d734acb9", "wpOhr1DQAAk84XQXi-sYU1P8PGcNztsw");
        // 2 handle new paid event
        WeComOrderPaidEvent paidEvent = getOrderPaidEvent("social/wecom/order/standard_10_1_per_year_new.json");
        SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM)
                .retrieveOrderPaidEvent(paidEvent);
        // 3 assert subscription
        SpaceSubscribeVo subscribeVo = iSpaceSubscriptionService.getSpaceSubscription(spaceId);
        Price price = WeComPlanConfigManager.getPriceByWeComEditionIdAndMonth(paidEvent.getEditionId(),
                paidEvent.getUserCount(), SocialFactory.getWeComOrderMonth(paidEvent.getOrderPeriod()));
        Assertions.assertNotNull(price);
        Assertions.assertFalse(subscribeVo.getOnTrial());
        Assertions.assertEquals(price.getPlanId(), subscribeVo.getPlan());
        // 4 handle upgrade paid event
        paidEvent = getOrderPaidEvent("social/wecom/order/standard_10_1_per_year_upgrade.json");
        SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM)
                .retrieveOrderPaidEvent(paidEvent);
        // 5 handle upgrade refund event
        WeComOrderRefundEvent refundEvent = getOrderRefundEvent("social/wecom/order/standard_10_1_per_year_upgrade_refund.json");
        SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM)
                .retrieveOrderRefundEvent(refundEvent);
        // 6 assert subscription
        subscribeVo = iSpaceSubscriptionService.getSpaceSubscription(spaceId);
        Assertions.assertNotNull(price);
        Assertions.assertFalse(subscribeVo.getOnTrial());
        Assertions.assertEquals(price.getPlanId(), subscribeVo.getPlan());
    }

    /**
     * Test for renew standard edition with 10 people and 1 year, then refund
     *
     * @author Codeman
     * @date 2022-08-31 16:45:15
     */
    @Test
    void standardTenPeopleAndOneYearRenewalRefundTest() {
        // 1 prepare wecom isv env
        String spaceId = createWecomIsvTenant("ww0506baa4d734acb9", "wpOhr1DQAAk84XQXi-sYU1P8PGcNztsw");
        // 2 handle new paid event
        WeComOrderPaidEvent paidEvent = getOrderPaidEvent("social/wecom/order/standard_10_1_per_year_new.json");
        SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM)
                .retrieveOrderPaidEvent(paidEvent);
        // 3 assert subscription
        SpaceSubscribeVo subscribeVo = iSpaceSubscriptionService.getSpaceSubscription(spaceId);
        Price price = WeComPlanConfigManager.getPriceByWeComEditionIdAndMonth(paidEvent.getEditionId(),
                paidEvent.getUserCount(), SocialFactory.getWeComOrderMonth(paidEvent.getOrderPeriod()));
        Assertions.assertNotNull(price);
        Assertions.assertFalse(subscribeVo.getOnTrial());
        Assertions.assertEquals(price.getPlanId(), subscribeVo.getPlan());
        // 4 handle renewal paid event
        paidEvent = getOrderPaidEvent("social/wecom/order/standard_10_1_per_year_renewal.json");
        SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM)
                .retrieveOrderPaidEvent(paidEvent);
        // 5 handle renewal refund event
        WeComOrderRefundEvent refundEvent = getOrderRefundEvent("social/wecom/order/standard_10_1_per_year_renewal_refund.json");
        SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM)
                .retrieveOrderRefundEvent(refundEvent);
        // 6 assert subscription
        subscribeVo = iSpaceSubscriptionService.getSpaceSubscription(spaceId);
        Assertions.assertNotNull(price);
        Assertions.assertFalse(subscribeVo.getOnTrial());
        Assertions.assertEquals(price.getPlanId(), subscribeVo.getPlan());
    }

    /**
     * Test for new standard edition with 10 people and 1 year, then refund
     *
     * @author Codeman
     * @date 2022-08-31 16:50:21
     */
    @Test
    void standardTenPeopleAndOneYearRefundTest() {
        // 1 prepare wecom isv env
        String spaceId = createWecomIsvTenant("ww0506baa4d734acb9", "wpOhr1DQAAk84XQXi-sYU1P8PGcNztsw");
        // 1.1 get the base trial subscription without any paid subscriptions
        SpaceSubscribeVo baseSubscriptionVo = iSpaceSubscriptionService.getSpaceSubscription(spaceId);
        // 2 handle new trial paid event
        WeComOrderPaidEvent paidEvent = getOrderPaidEvent("social/wecom/order/standard_trial_new.json");
        SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM)
                .retrieveOrderPaidEvent(paidEvent);
        // 3 handle new paid event
        paidEvent = getOrderPaidEvent("social/wecom/order/standard_10_1_per_year_new.json");
        paidEvent.setBeginTime(getClock().getNow(testTimeZone).toEpochSecond());
        paidEvent.setEndTime(getClock().getNow(testTimeZone).plusDays(paidEvent.getOrderPeriod()).toEpochSecond());
        SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM).retrieveOrderPaidEvent(paidEvent);
        // 5 handle new refund event
        WeComOrderRefundEvent refundEvent = getOrderRefundEvent("social/wecom/order/standard_10_1_per_year_new_refund.json");
        SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM).retrieveOrderRefundEvent(refundEvent);
        // 6 assert subscription
        SpaceSubscribeVo subscribeVo = iSpaceSubscriptionService.getSpaceSubscription(spaceId);
        Assertions.assertFalse(subscribeVo.getOnTrial());
        Assertions.assertEquals(baseSubscriptionVo.getPlan(), subscribeVo.getPlan());
    }

    /**
     * Test for new standard edition with 10 people and 2 year
     *
     * @author Codeman
     * @date 2022-08-31 17:45:25
     */
    @Test
    void standardTenPeopleAndTwoYearOrderTest() {
        // 1 prepare wecom isv env
        String spaceId = createWecomIsvTenant("ww0506baa4d734acb9", "wpOhr1DQAAk84XQXi-sYU1P8PGcNztsw");
        // 2 handle new trial paid event
        WeComOrderPaidEvent paidEvent = getOrderPaidEvent("social/wecom/order/standard_trial_new.json");
        SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM)
                .retrieveOrderPaidEvent(paidEvent);
        // 3 handle new paid event
        paidEvent = getOrderPaidEvent("social/wecom/order/standard_10_2_per_year_new.json");
        paidEvent.setBeginTime(getClock().getNow(testTimeZone).toEpochSecond());
        paidEvent.setEndTime(getClock().getNow(testTimeZone).plusDays(paidEvent.getOrderPeriod()).toEpochSecond());
        SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM)
                .retrieveOrderPaidEvent(paidEvent);
        // 4 assert subscription
        SpaceSubscribeVo subscribeVo = iSpaceSubscriptionService.getSpaceSubscription(spaceId);
        Price price = WeComPlanConfigManager.getPriceByWeComEditionIdAndMonth(paidEvent.getEditionId(),
                paidEvent.getUserCount(), SocialFactory.getWeComOrderMonth(paidEvent.getOrderPeriod()));
        Assertions.assertNotNull(price);
        Assertions.assertFalse(subscribeVo.getOnTrial());
        Assertions.assertEquals(price.getPlanId(), subscribeVo.getPlan());
    }

    /**
     * Test for new standard edition with 10 people and 3 year
     *
     * @author Codeman
     * @date 2022-08-31 17:47:29
     */
    @Test
    void standardTenPeopleAndThreeYearOrderTest() {
        // 1 prepare wecom isv env
        String spaceId = createWecomIsvTenant("ww0506baa4d734acb9", "wpOhr1DQAAk84XQXi-sYU1P8PGcNztsw");
        // 2 handle new trial paid event
        WeComOrderPaidEvent paidEvent = getOrderPaidEvent("social/wecom/order/standard_trial_new.json");
        SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM).retrieveOrderPaidEvent(paidEvent);
        // 3 handle new paid event
        paidEvent = getOrderPaidEvent("social/wecom/order/standard_10_3_per_year_new.json");
        paidEvent.setBeginTime(getClock().getNow(testTimeZone).toEpochSecond());
        paidEvent.setEndTime(getClock().getNow(testTimeZone).plusDays(paidEvent.getOrderPeriod()).toEpochSecond());
        SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM).retrieveOrderPaidEvent(paidEvent);
        // 5 assert subscription
        SpaceSubscribeVo subscribeVo = iSpaceSubscriptionService.getSpaceSubscription(spaceId);
        Price price = WeComPlanConfigManager.getPriceByWeComEditionIdAndMonth(paidEvent.getEditionId(),
                paidEvent.getUserCount(), SocialFactory.getWeComOrderMonth(paidEvent.getOrderPeriod()));
        Assertions.assertNotNull(price);
        Assertions.assertFalse(subscribeVo.getOnTrial());
        Assertions.assertEquals(price.getPlanId(), subscribeVo.getPlan());
    }

    /**
     * Test for new standard edition with 20 people and 1 year
     *
     * @author Codeman
     * @date 2022-08-31 17:47:29
     */
    @Test
    void standardTwentyPeopleAndOneYearOrderTest() {
        // 1 prepare wecom isv env
        String spaceId = createWecomIsvTenant("ww0506baa4d734acb9", "wpOhr1DQAAk84XQXi-sYU1P8PGcNztsw");
        // 2 handle new trial paid event
        WeComOrderPaidEvent paidEvent = getOrderPaidEvent("social/wecom/order/standard_trial_new.json");
        SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM).retrieveOrderPaidEvent(paidEvent);
        // 3 handle new paid event
        paidEvent = getOrderPaidEvent("social/wecom/order/standard_20_1_per_year_new.json");
        paidEvent.setBeginTime(getClock().getNow(testTimeZone).toEpochSecond());
        paidEvent.setEndTime(getClock().getNow(testTimeZone).plusDays(paidEvent.getOrderPeriod()).toEpochSecond());
        SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM).retrieveOrderPaidEvent(paidEvent);
        // 4 assert subscription
        SpaceSubscribeVo subscribeVo = iSpaceSubscriptionService.getSpaceSubscription(spaceId);
        Price price = WeComPlanConfigManager.getPriceByWeComEditionIdAndMonth(paidEvent.getEditionId(),
                paidEvent.getUserCount(), SocialFactory.getWeComOrderMonth(paidEvent.getOrderPeriod()));
        Assertions.assertNotNull(price);
        Assertions.assertFalse(subscribeVo.getOnTrial());
        Assertions.assertEquals(price.getPlanId(), subscribeVo.getPlan());
    }

    /**
     * Test for new standard edition with 20 people and 2 year
     *
     * @author Codeman
     * @date 2022-08-31 17:47:29
     */
    @Test
    void standardTwentyPeopleAndTwoYearOrderTest() {
        // 1 prepare wecom isv env
        String spaceId = createWecomIsvTenant("ww0506baa4d734acb9", "wpOhr1DQAAk84XQXi-sYU1P8PGcNztsw");
        // 2 handle new trial paid event
        WeComOrderPaidEvent paidEvent = getOrderPaidEvent("social/wecom/order/standard_trial_new.json");
        SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM).retrieveOrderPaidEvent(paidEvent);
        // 4 handle new paid event
        paidEvent = getOrderPaidEvent("social/wecom/order/standard_20_2_per_year_new.json");
        paidEvent.setBeginTime(getClock().getNow(testTimeZone).toEpochSecond());
        paidEvent.setEndTime(getClock().getNow(testTimeZone).plusDays(paidEvent.getOrderPeriod()).toEpochSecond());
        SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM).retrieveOrderPaidEvent(paidEvent);
        // 5 assert subscription
        SpaceSubscribeVo subscribeVo = iSpaceSubscriptionService.getSpaceSubscription(spaceId);
        Price price = WeComPlanConfigManager.getPriceByWeComEditionIdAndMonth(paidEvent.getEditionId(),
                paidEvent.getUserCount(), SocialFactory.getWeComOrderMonth(paidEvent.getOrderPeriod()));
        Assertions.assertNotNull(price);
        Assertions.assertFalse(subscribeVo.getOnTrial());
        Assertions.assertEquals(price.getPlanId(), subscribeVo.getPlan());
    }

    /**
     * Test for new standard edition with 20 people and 3 year
     *
     * @author Codeman
     * @date 2022-08-31 17:47:29
     */
    @Test
    void standardTwentyPeopleAndThreeYearOrderTest() {
        // 1 prepare wecom isv env
        String spaceId = createWecomIsvTenant("ww0506baa4d734acb9", "wpOhr1DQAAk84XQXi-sYU1P8PGcNztsw");
        // 2 handle new trial paid event
        WeComOrderPaidEvent paidEvent = getOrderPaidEvent("social/wecom/order/standard_trial_new.json");
        SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM)
                .retrieveOrderPaidEvent(paidEvent);
        // 4 handle new paid event
        paidEvent = getOrderPaidEvent("social/wecom/order/standard_20_3_per_year_new.json");
        paidEvent.setBeginTime(getClock().getNow(testTimeZone).toEpochSecond());
        paidEvent.setEndTime(getClock().getNow(testTimeZone).plusDays(paidEvent.getOrderPeriod()).toEpochSecond());
        SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM)
                .retrieveOrderPaidEvent(paidEvent);
        // 5 assert subscription
        SpaceSubscribeVo subscribeVo = iSpaceSubscriptionService.getSpaceSubscription(spaceId);
        Price price = WeComPlanConfigManager.getPriceByWeComEditionIdAndMonth(paidEvent.getEditionId(),
                paidEvent.getUserCount(), SocialFactory.getWeComOrderMonth(paidEvent.getOrderPeriod()));
        Assertions.assertNotNull(price);
        Assertions.assertFalse(subscribeVo.getOnTrial());
        Assertions.assertEquals(price.getPlanId(), subscribeVo.getPlan());
    }

    /**
     * Test for change standard edition with 10 people and 1 year to enterprise edition with 120 people and 1 year
     *
     * @author Codeman
     * @date 2022-08-31 16:45:15
     */
    @Test
    void standardTenPeopleAndOneYearChangeTest() {
        // 1 prepare wecom isv env
        String spaceId = createWecomIsvTenant("ww0506baa4d734acb9", "wpOhr1DQAAk84XQXi-sYU1P8PGcNztsw");
        // 2 handle new paid event
        WeComOrderPaidEvent paidEvent = getOrderPaidEvent("social/wecom/order/standard_10_1_per_year_new.json");
        SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM)
                .retrieveOrderPaidEvent(paidEvent);
        // 3 assert subscription
        SpaceSubscribeVo subscribeVo = iSpaceSubscriptionService.getSpaceSubscription(spaceId);
        Price price = WeComPlanConfigManager.getPriceByWeComEditionIdAndMonth(paidEvent.getEditionId(),
                paidEvent.getUserCount(), SocialFactory.getWeComOrderMonth(paidEvent.getOrderPeriod()));
        Assertions.assertNotNull(price);
        Assertions.assertFalse(subscribeVo.getOnTrial());
        Assertions.assertEquals(price.getPlanId(), subscribeVo.getPlan());
        // 4 handle change edition paid event
        paidEvent = getOrderPaidEvent("social/wecom/order/enterprise_120_1_per_year_change.json");
        SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM)
                .retrieveOrderPaidEvent(paidEvent);
        // 5 assert subscription
        subscribeVo = iSpaceSubscriptionService.getSpaceSubscription(spaceId);
        Assertions.assertNotNull(price);
        Assertions.assertFalse(subscribeVo.getOnTrial());
        Assertions.assertEquals(price.getPlanId(), subscribeVo.getPlan());
    }

    /**
     * Test for change standard edition with 10 people and 1 year to enterprise edition with 120 people and 1 year, then refund
     *
     * @author Codeman
     * @date 2022-08-31 16:45:15
     */
    @Test
    void standardTenPeopleAndOneYearChangeRefundTest() {
        // 1 prepare wecom isv env
        String spaceId = createWecomIsvTenant("ww0506baa4d734acb9", "wpOhr1DQAAk84XQXi-sYU1P8PGcNztsw");
        // 2 handle new paid event
        WeComOrderPaidEvent paidEvent = getOrderPaidEvent("social/wecom/order/standard_10_1_per_year_new.json");
        SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM)
                .retrieveOrderPaidEvent(paidEvent);
        // 3 assert subscription
        SpaceSubscribeVo subscribeVo = iSpaceSubscriptionService.getSpaceSubscription(spaceId);
        Price price = WeComPlanConfigManager.getPriceByWeComEditionIdAndMonth(paidEvent.getEditionId(),
                paidEvent.getUserCount(), SocialFactory.getWeComOrderMonth(paidEvent.getOrderPeriod()));
        Assertions.assertNotNull(price);
        Assertions.assertFalse(subscribeVo.getOnTrial());
        Assertions.assertEquals(price.getPlanId(), subscribeVo.getPlan());
        // 4 handle change edition paid event
        paidEvent = getOrderPaidEvent("social/wecom/order/enterprise_120_1_per_year_change.json");
        SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM)
                .retrieveOrderPaidEvent(paidEvent);
        // 5 handle change edition refund event
        WeComOrderRefundEvent refundEvent = getOrderRefundEvent("social/wecom/order/enterprise_120_1_per_year_change_refund.json");
        SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM)
                .retrieveOrderRefundEvent(refundEvent);
        // 6 assert subscription
        subscribeVo = iSpaceSubscriptionService.getSpaceSubscription(spaceId);
        Assertions.assertNotNull(price);
        Assertions.assertFalse(subscribeVo.getOnTrial());
        Assertions.assertEquals(price.getPlanId(), subscribeVo.getPlan());
    }

    /**
     * Test for new enterprise edition with 120 people and 1 year
     *
     * @author Codeman
     * @date 2022-08-30 14:11:08
     */
    @Test
    void enterpriseOneHundredAndTwentyPeopleAndOneYearOrderTest() {
        // 1 prepare wecom isv env
        String spaceId = createWecomIsvTenant("ww0506baa4d734acb9", "wpOhr1DQAAk84XQXi-sYU1P8PGcNztsw");
        // 2 handle new trial paid event
        WeComOrderPaidEvent paidEvent = getOrderPaidEvent("social/wecom/order/standard_trial_new.json");
        SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM)
                .retrieveOrderPaidEvent(paidEvent);
        // 4 handle new paid event
        paidEvent = getOrderPaidEvent("social/wecom/order/enterprise_120_1_per_year_new.json");
        paidEvent.setBeginTime(getClock().getNow(testTimeZone).toEpochSecond());
        paidEvent.setEndTime(getClock().getNow(testTimeZone).plusDays(paidEvent.getOrderPeriod()).toEpochSecond());
        SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM)
                .retrieveOrderPaidEvent(paidEvent);
        // 5 assert subscription
        SpaceSubscribeVo subscribeVo = iSpaceSubscriptionService.getSpaceSubscription(spaceId);
        Price price = WeComPlanConfigManager.getPriceByWeComEditionIdAndMonth(paidEvent.getEditionId(),
                paidEvent.getUserCount(), SocialFactory.getWeComOrderMonth(paidEvent.getOrderPeriod()));
        Assertions.assertNotNull(price);
        Assertions.assertFalse(subscribeVo.getOnTrial());
        Assertions.assertEquals(price.getPlanId(), subscribeVo.getPlan());
    }

    /**
     * Get paid event info from json file
     *
     * @param filePath Json file path
     * @return Paid event info
     * @author Codeman
     * @date 2022-08-30 11:21:47
     */
    private WeComOrderPaidEvent getOrderPaidEvent(String filePath) {
        InputStream resourceAsStream = FileHelper.getInputStreamFromResource(filePath);
        String jsonString = IoUtil.read(resourceAsStream, StandardCharsets.UTF_8);
        return JSONUtil.toBean(jsonString, WeComOrderPaidEvent.class);
    }

    /**
     * Get refund event info from json file
     *
     * @param filePath Json file path
     * @return Refund event info
     * @author Codeman
     * @date 2022-08-30 18:53:50
     */
    private WeComOrderRefundEvent getOrderRefundEvent(String filePath) {
        InputStream resourceAsStream = FileHelper.getInputStreamFromResource(filePath);
        String jsonString = IoUtil.read(resourceAsStream, StandardCharsets.UTF_8);
        return JSONUtil.toBean(jsonString, WeComOrderRefundEvent.class);
    }

}
