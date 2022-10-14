package com.vikadata.api.modular.finance.service.impl;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.enums.finance.OrderType;
import com.vikadata.api.mock.bean.MockUserSpace;
import com.vikadata.api.modular.developer.model.CreateBusinessOrderRo;
import com.vikadata.api.modular.developer.model.CreateEntitlementWithAddOn;
import com.vikadata.api.modular.finance.core.DefaultOrderArguments;
import com.vikadata.api.modular.finance.core.OrderArguments;
import com.vikadata.api.modular.finance.util.EntitlementChecker.ExpectedBundleCheck;
import com.vikadata.api.modular.finance.util.EntitlementChecker.ExpectedSpaceEntitlementCheck;
import com.vikadata.api.modular.finance.util.EntitlementChecker.ExpectedSubscriptionCheck;
import com.vikadata.api.modular.space.model.vo.SpaceCapacityPageVO;
import com.vikadata.api.util.billing.BillingConfigManager;
import com.vikadata.api.util.billing.model.ProductChannel;
import com.vikadata.api.util.billing.model.ProductEnum;
import com.vikadata.system.config.billing.Price;

import static com.vikadata.api.util.billing.BillingConfigManager.getBillingConfig;
import static com.vikadata.api.util.billing.BillingConfigManager.getFreePlan;
import static com.vikadata.api.util.billing.BillingConfigManager.getPlan;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.util.Lists.list;

@Disabled("no assert")
public class BillingOfflineServiceImplTest extends AbstractIntegrationTest {

    protected static final Logger log = LoggerFactory.getLogger(BillingOfflineServiceImplTest.class);

    @Test
    public void testCreateBusinessOrderOnNewBuyWithoutTargetDate() {
        log.info("initial user and space");
        final MockUserSpace mockUserSpace = createSingleUserAndSpace();
        // chose product to buy
        ProductEnum toBuy = ProductEnum.SILVER;

        CreateBusinessOrderRo data = new CreateBusinessOrderRo();
        data.setSpaceId(mockUserSpace.getSpaceId());
        data.setType(OrderType.BUY.name());
        data.setProduct(toBuy.name());
        data.setSeat(20);
        data.setMonths(1);

        final LocalDate nowToday = getClock().getToday(testTimeZone);

        iBillingOfflineService.createBusinessOrder(data);

        final LocalDate shouldExpireDate = nowToday.plusMonths(1);

        // check space entitlement
        entitlementChecker.checkBundle(mockUserSpace.getSpaceId(),
                new ExpectedBundleCheck(nowToday, shouldExpireDate));
        entitlementChecker.checkSubscription(mockUserSpace.getSpaceId(),
                new ExpectedSubscriptionCheck(toBuy, nowToday, shouldExpireDate));
    }

    @Test
    public void testCreateBusinessOrderOnNewBuyWithTargetDate() {
        log.info("initial user and space");
        final MockUserSpace mockUserSpace = createSingleUserAndSpace();
        // chose product to buy
        ProductEnum toBuy = ProductEnum.SILVER;

        final LocalDate nowToday = getClock().getToday(testTimeZone);
        LocalDate startDate = nowToday.minusDays(10);

        CreateBusinessOrderRo data = new CreateBusinessOrderRo();
        data.setSpaceId(mockUserSpace.getSpaceId());
        data.setType(OrderType.BUY.name());
        data.setProduct(toBuy.name());
        data.setSeat(20);
        data.setMonths(1);
        data.setStartDate(startDate.format(DateTimeFormatter.ISO_LOCAL_DATE));

        iBillingOfflineService.createBusinessOrder(data);

        final LocalDate shouldExpireDate = startDate.plusMonths(1);

        // check space entitlement
        entitlementChecker.checkBundle(mockUserSpace.getSpaceId(),
                new ExpectedBundleCheck(startDate, shouldExpireDate));
        entitlementChecker.checkSubscription(mockUserSpace.getSpaceId(),
                new ExpectedSubscriptionCheck(toBuy, startDate, shouldExpireDate));
    }

    @Test
    public void testCreateBusinessOrderOnRenew() {
        log.info("initial user and space");
        final MockUserSpace mockUserSpace = createSingleUserAndSpace();
        // chose product to buy
        ProductEnum toBuy = ProductEnum.GOLD;
        CreateBusinessOrderRo data = new CreateBusinessOrderRo();
        data.setSpaceId(mockUserSpace.getSpaceId());
        data.setType(OrderType.BUY.name());
        data.setProduct(toBuy.name());
        data.setSeat(100);
        data.setMonths(4);

        // create new buy order
        iBillingOfflineService.createBusinessOrder(data);

        final LocalDate nowToday = getClock().getToday(testTimeZone);
        final LocalDate shouldExpireDate = nowToday.plusMonths(4);

        // check space entitlement
        entitlementChecker.checkBundle(mockUserSpace.getSpaceId(),
                new ExpectedBundleCheck(nowToday, shouldExpireDate));
        entitlementChecker.checkSubscription(mockUserSpace.getSpaceId(),
                new ExpectedSubscriptionCheck(toBuy, nowToday, shouldExpireDate));

        // move clock
        getClock().addDays(100);

        CreateBusinessOrderRo renewData = new CreateBusinessOrderRo();
        renewData.setSpaceId(mockUserSpace.getSpaceId());
        renewData.setType(OrderType.RENEW.name());
        renewData.setMonths(3);

        // create renew order
        iBillingOfflineService.createBusinessOrder(renewData);

        final LocalDate renewShouldExpireDate = nowToday.plusMonths(7);
        // check space entitlement
        entitlementChecker.checkBundle(mockUserSpace.getSpaceId(),
                new ExpectedBundleCheck(nowToday, renewShouldExpireDate));
        entitlementChecker.checkSubscription(mockUserSpace.getSpaceId(),
                new ExpectedSubscriptionCheck(toBuy, nowToday, renewShouldExpireDate));
    }

    @Test
    public void testCreateBusinessOrderOnUpgrade() {
        log.info("initial user and space");
        final MockUserSpace mockUserSpace = createSingleUserAndSpace();
        // chose product to buy
        ProductEnum toBuy = ProductEnum.GOLD;
        CreateBusinessOrderRo data = new CreateBusinessOrderRo();
        data.setSpaceId(mockUserSpace.getSpaceId());
        data.setType(OrderType.BUY.name());
        data.setProduct(toBuy.name());
        data.setSeat(100);
        data.setMonths(4);

        // create new buy order
        iBillingOfflineService.createBusinessOrder(data);

        final LocalDate nowToday = getClock().getToday(testTimeZone);
        final LocalDate shouldExpireDate = nowToday.plusMonths(4);

        // check space entitlement
        entitlementChecker.checkBundle(mockUserSpace.getSpaceId(),
                new ExpectedBundleCheck(nowToday, shouldExpireDate));
        entitlementChecker.checkSubscription(mockUserSpace.getSpaceId(),
                new ExpectedSubscriptionCheck(toBuy, nowToday, shouldExpireDate));

        // move clock
        getClock().addDays(100);

        ProductEnum upgrade = ProductEnum.ENTERPRISE;
        CreateBusinessOrderRo upgradeData = new CreateBusinessOrderRo();
        upgradeData.setSpaceId(mockUserSpace.getSpaceId());
        upgradeData.setType(OrderType.UPGRADE.name());
        upgradeData.setProduct(upgrade.name());
        upgradeData.setSeat(100);
        upgradeData.setMonths(3);

        // create upgrade order
        iBillingOfflineService.createBusinessOrder(upgradeData);

        final LocalDate nowTodayOfUpgrade = getClock().getToday(testTimeZone);
        final LocalDate renewShouldExpireDate = nowTodayOfUpgrade.plusMonths(3);
        // check space entitlement
        entitlementChecker.checkBundle(mockUserSpace.getSpaceId(),
                new ExpectedBundleCheck(nowTodayOfUpgrade, renewShouldExpireDate));
        entitlementChecker.checkSubscription(mockUserSpace.getSpaceId(),
                new ExpectedSubscriptionCheck(upgrade, nowTodayOfUpgrade, renewShouldExpireDate));
    }

    @Test
    public void testCreateSubscriptionWithAddWithoutTargetDateOnConditionOnNoSubscription() {
        log.info("initial user and space");
        final MockUserSpace mockUserSpace = createSingleUserAndSpace();

        // choose plan to reward
        CreateEntitlementWithAddOn data = new CreateEntitlementWithAddOn();
        data.setSpaceId(mockUserSpace.getSpaceId());
        data.setPlanId("capacity_100G");
        data.setMonths(3);

        final LocalDate nowToday = getClock().getToday(testTimeZone);

        iBillingOfflineService.createSubscriptionWithAddOn(data);

        final LocalDate shouldExpireDate = nowToday.plusMonths(3);

        // check space entitlement
        entitlementChecker.checkBundle(mockUserSpace.getSpaceId(),
                new ExpectedBundleCheck(nowToday, shouldExpireDate));
        final List<ExpectedSubscriptionCheck> expectedSubscriptions = new ArrayList<>();
        expectedSubscriptions.add(new ExpectedSubscriptionCheck(ProductEnum.BRONZE, nowToday, shouldExpireDate));
        expectedSubscriptions.add(new ExpectedSubscriptionCheck(ProductEnum.CAPACITY, nowToday, shouldExpireDate));
        entitlementChecker.checkSubscription(mockUserSpace.getSpaceId(), expectedSubscriptions);
        // check space subscription
        entitlementChecker.checkSpaceEntitlement(mockUserSpace.getSpaceId(),
                new ExpectedSpaceEntitlementCheck(ProductEnum.BRONZE.getName(), null,
                        getFreePlan(ProductChannel.VIKA),
                        Collections.singletonList(getBillingConfig().getPlans().get("capacity_100G"))));
    }

    /**
     * test step:
     * 1. initial date on 2022-2-1, create future add-on subscription between (2022-2-2 and 2022-3-2)
     * 2. then create add-on subscription between (2022-2-1 and 2022-3-1)
     * 3. check entitlement on 2022-2-1, (2022-2-2 and 2022-3-2) should not be active, (2022-2-1 and 2022-3-1) should be active
     * 4. move clock on 2022-2-2, all should be active
     */
    @Test
    public void testCreateSubscriptionWithAddWithoutTargetDateDoubleTime() {
        // initial date on 2022-2-1 19:10:30
        final OffsetDateTime initialCreateDate = OffsetDateTime.of(2022, 2, 1, 19, 10, 30, 0, testTimeZone);
        getClock().setTime(initialCreateDate);
        log.info("initial user and space");
        final MockUserSpace mockUserSpace = createSingleUserAndSpace();

        // choose plan to reward
        CreateEntitlementWithAddOn first = new CreateEntitlementWithAddOn();
        first.setSpaceId(mockUserSpace.getSpaceId());
        first.setPlanId("capacity_100G");
        first.setStartDate("2022-02-02");
        first.setMonths(1);

        iBillingOfflineService.createSubscriptionWithAddOn(first);

        // check space entitlement
        entitlementChecker.checkBundle(mockUserSpace.getSpaceId(),
                new ExpectedBundleCheck(LocalDate.of(2022, 2, 2), LocalDate.of(2022, 3, 2)));
        final List<ExpectedSubscriptionCheck> expectedSubscriptions = new ArrayList<>();
        expectedSubscriptions.add(new ExpectedSubscriptionCheck(ProductEnum.BRONZE, LocalDate.of(2022, 2, 2), LocalDate.of(2022, 3, 2)));
        expectedSubscriptions.add(new ExpectedSubscriptionCheck(ProductEnum.CAPACITY, LocalDate.of(2022, 2, 2), LocalDate.of(2022, 3, 2)));
        entitlementChecker.checkSubscription(mockUserSpace.getSpaceId(), expectedSubscriptions);
        // check space subscription
        entitlementChecker.checkSpaceEntitlement(mockUserSpace.getSpaceId(),
                new ExpectedSpaceEntitlementCheck(ProductEnum.BRONZE.getName(), null,
                        getFreePlan(ProductChannel.VIKA),
                        Collections.emptyList()
                )
        );

        // create again on today
        CreateEntitlementWithAddOn second = new CreateEntitlementWithAddOn();
        second.setSpaceId(mockUserSpace.getSpaceId());
        second.setPlanId("capacity_50G");
        second.setMonths(1);

        iBillingOfflineService.createSubscriptionWithAddOn(second);

        // check space entitlement
        expectedSubscriptions.clear();
        entitlementChecker.checkBundle(mockUserSpace.getSpaceId(),
                new ExpectedBundleCheck(LocalDate.of(2022, 2, 2), LocalDate.of(2022, 3, 2)));
        expectedSubscriptions.add(new ExpectedSubscriptionCheck(ProductEnum.BRONZE, LocalDate.of(2022, 2, 2), LocalDate.of(2022, 3, 2)));
        expectedSubscriptions.add(new ExpectedSubscriptionCheck(ProductEnum.CAPACITY, LocalDate.of(2022, 2, 2), LocalDate.of(2022, 3, 2)));
        expectedSubscriptions.add(new ExpectedSubscriptionCheck(ProductEnum.CAPACITY, LocalDate.of(2022, 2, 1), LocalDate.of(2022, 3, 1)));
        entitlementChecker.checkSubscription(mockUserSpace.getSpaceId(), expectedSubscriptions);
        // check space subscription
        entitlementChecker.checkSpaceEntitlement(mockUserSpace.getSpaceId(),
                new ExpectedSpaceEntitlementCheck(ProductEnum.BRONZE.getName(), null,
                        getFreePlan(ProductChannel.VIKA),
                        list(getBillingConfig().getPlans().get("capacity_50G"))
                )
        );

        // move clock to 2022-2-2
        getClock().setTime(OffsetDateTime.of(2022, 2, 2, 0, 1, 1, 0, testTimeZone));
        expectedSubscriptions.clear();
        entitlementChecker.checkBundle(mockUserSpace.getSpaceId(),
                new ExpectedBundleCheck(LocalDate.of(2022, 2, 2), LocalDate.of(2022, 3, 2)));
        expectedSubscriptions.add(new ExpectedSubscriptionCheck(ProductEnum.BRONZE, LocalDate.of(2022, 2, 2), LocalDate.of(2022, 3, 2)));
        expectedSubscriptions.add(new ExpectedSubscriptionCheck(ProductEnum.CAPACITY, LocalDate.of(2022, 2, 2), LocalDate.of(2022, 3, 2)));
        expectedSubscriptions.add(new ExpectedSubscriptionCheck(ProductEnum.CAPACITY, LocalDate.of(2022, 2, 1), LocalDate.of(2022, 3, 1)));
        entitlementChecker.checkSubscription(mockUserSpace.getSpaceId(), expectedSubscriptions);
        // check space subscription
        entitlementChecker.checkSpaceEntitlement(mockUserSpace.getSpaceId(),
                new ExpectedSpaceEntitlementCheck(ProductEnum.BRONZE.getName(), null,
                        getFreePlan(ProductChannel.VIKA),
                        list(
                                getBillingConfig().getPlans().get("capacity_50G"),
                                getBillingConfig().getPlans().get("capacity_100G")
                        )
                )
        );
    }

    @Test
    public void testCreateSubscriptionWithAddWithTargetDateOnConditionOnNoSubscription() {
        final OffsetDateTime initialCreateDate = OffsetDateTime.of(2022, 2, 1, 19, 10, 30, 0, testTimeZone);
        getClock().setTime(initialCreateDate);
        log.info("initial user and space");
        final MockUserSpace mockUserSpace = createSingleUserAndSpace();

        // choose plan to reward
        CreateEntitlementWithAddOn data = new CreateEntitlementWithAddOn();
        data.setSpaceId(mockUserSpace.getSpaceId());
        data.setPlanId("capacity_100G");
        data.setStartDate("2022-02-02");
        data.setMonths(3);

        iBillingOfflineService.createSubscriptionWithAddOn(data);

        // check space entitlement
        entitlementChecker.checkBundle(mockUserSpace.getSpaceId(),
                new ExpectedBundleCheck(LocalDate.of(2022, 2, 2), LocalDate.of(2022, 5, 2)));
        final List<ExpectedSubscriptionCheck> expectedSubscriptions = new ArrayList<>();
        expectedSubscriptions.add(new ExpectedSubscriptionCheck(ProductEnum.BRONZE, LocalDate.of(2022, 2, 2), LocalDate.of(2022, 5, 2)));
        expectedSubscriptions.add(new ExpectedSubscriptionCheck(ProductEnum.CAPACITY, LocalDate.of(2022, 2, 2), LocalDate.of(2022, 5, 2)));
        entitlementChecker.checkSubscription(mockUserSpace.getSpaceId(), expectedSubscriptions);
        // check space subscription
        entitlementChecker.checkSpaceEntitlement(mockUserSpace.getSpaceId(),
                new ExpectedSpaceEntitlementCheck(ProductEnum.BRONZE.getName(), null,
                        getFreePlan(ProductChannel.VIKA),
                        Collections.emptyList()));
        // move clock to 2022-02-02, add-on entitlement should be active
        getClock().setTime(OffsetDateTime.of(2022, 2, 2, 0, 10, 30, 0, testTimeZone));
        entitlementChecker.checkSpaceEntitlement(mockUserSpace.getSpaceId(),
                new ExpectedSpaceEntitlementCheck(ProductEnum.BRONZE.getName(), null,
                        getFreePlan(ProductChannel.VIKA),
                        Collections.singletonList(getBillingConfig().getPlans().get("capacity_100G"))));
    }

    /**
     * test step:
     * 1. initial date on 2022-2-1, create future add-on subscription between (2022-2-2 and 2022-5-2)
     * 2. then pay charge subscription with 1 month silver(20) product on current date(2022-2-1), active date between 2022-2-1 and 2022-3-1
     * 3. and move clock to 2022-3-2, base subscription should expire, but add-on subscription still be active
     * 4. and move clock to 2022-5-3, all subscription should be expired
     */
    @Test
    public void testCreateAddOnSubscriptionWithTargetDateThenPayChargeSubscription() {
        // initial date on 2022-2-1 19:10:30
        final OffsetDateTime initialCreateDate = OffsetDateTime.of(2022, 2, 1, 19, 10, 30, 0, testTimeZone);
        getClock().setTime(initialCreateDate);

        log.info("initial user and space");
        final MockUserSpace mockUserSpace = createSingleUserAndSpace();

        // choose plan to reward
        CreateEntitlementWithAddOn data = new CreateEntitlementWithAddOn();
        data.setSpaceId(mockUserSpace.getSpaceId());
        data.setPlanId("capacity_100G");
        data.setStartDate("2022-02-02");
        data.setMonths(3);

        iBillingOfflineService.createSubscriptionWithAddOn(data);

        // check space entitlement
        final List<ExpectedSubscriptionCheck> expectedSubscriptions = new ArrayList<>();
        expectedSubscriptions.add(new ExpectedSubscriptionCheck(ProductEnum.BRONZE, LocalDate.of(2022, 2, 2), LocalDate.of(2022, 5, 2)));
        expectedSubscriptions.add(new ExpectedSubscriptionCheck(ProductEnum.CAPACITY, LocalDate.of(2022, 2, 2), LocalDate.of(2022, 5, 2)));
        entitlementChecker.checkSubscription(mockUserSpace.getSpaceId(), expectedSubscriptions);
        entitlementChecker.checkSpaceEntitlement(mockUserSpace.getSpaceId(), new ExpectedSpaceEntitlementCheck(
                ProductEnum.BRONZE.getName(), null,
                getFreePlan(ProductChannel.VIKA),
                Collections.emptyList()
        ));

        expectedSubscriptions.clear();

        // buy charge product on current date
        Price silverPrice = BillingConfigManager.getPriceBySeatAndMonths(ProductEnum.SILVER, 20, 1);
        assertThat(silverPrice).isNotNull();
        final OrderArguments orderArguments = new DefaultOrderArguments(mockUserSpace.getSpaceId(), silverPrice);
        // paid Time
        final OffsetDateTime paidTime = getClock().getNow(testTimeZone).plusMinutes(5);
        autoOrderPayProcessor(mockUserSpace.getUserId(), orderArguments, paidTime);

        // check subscription
        expectedSubscriptions.add(new ExpectedSubscriptionCheck(ProductEnum.SILVER, LocalDate.of(2022, 2, 1), LocalDate.of(2022, 3, 1)));
        expectedSubscriptions.add(new ExpectedSubscriptionCheck(ProductEnum.CAPACITY, LocalDate.of(2022, 2, 2), LocalDate.of(2022, 5, 2)));
        entitlementChecker.checkSubscription(mockUserSpace.getSpaceId(), expectedSubscriptions);
        entitlementChecker.checkSpaceEntitlement(mockUserSpace.getSpaceId(),
                new ExpectedSpaceEntitlementCheck(ProductEnum.SILVER.getName(), LocalDate.of(2022, 3, 1),
                        getBillingConfig().getPlans().get(silverPrice.getPlanId()),
                        Collections.emptyList()
                ));
        // move clock on 2022-02-02, add-on subscription should be activated
        expectedSubscriptions.clear();
        getClock().setTime(OffsetDateTime.of(2022, 2, 2, 0, 1, 1, 0, testTimeZone));
        entitlementChecker.checkSpaceEntitlement(mockUserSpace.getSpaceId(),
                new ExpectedSpaceEntitlementCheck(ProductEnum.SILVER.getName(), LocalDate.of(2022, 3, 1),
                        getBillingConfig().getPlans().get(silverPrice.getPlanId()),
                        Collections.singletonList(getBillingConfig().getPlans().get("capacity_100G"))
                )
        );

        // move clock on 2022-03-02, make base subscription expire, but add-on subscription still be active
        expectedSubscriptions.clear();
        getClock().setTime(OffsetDateTime.of(2022, 3, 2, 0, 1, 1, 0, testTimeZone));
        // check space entitlement
        entitlementChecker.checkSpaceEntitlement(mockUserSpace.getSpaceId(),
                new ExpectedSpaceEntitlementCheck(ProductEnum.BRONZE.getName(), null,
                        getFreePlan(ProductChannel.VIKA),
                        Collections.singletonList(getBillingConfig().getPlans().get("capacity_100G"))));

        // move clock on 2022-05-03, all subscription should be expired
        expectedSubscriptions.clear();
        getClock().setTime(OffsetDateTime.of(2022, 5, 3, 0, 1, 1, 0, testTimeZone));
        // check space entitlement
        entitlementChecker.checkSpaceEntitlement(mockUserSpace.getSpaceId(),
                new ExpectedSpaceEntitlementCheck(ProductEnum.BRONZE.getName(), null,
                        getFreePlan(ProductChannel.VIKA),
                        Collections.emptyList()
                )
        );
    }

    /**
     * test step:
     * 1. create add-on subscription between (2022-2-1 and 2022-5-1)
     * 2. then pay charge subscription with 1 month silver(20) product after 5 days (2022-2-6), active date between 2022-2-6 and 2022-3-6
     * 3. and move clock to 2022-3-7, base subscription should expire, but add-on subscription still be active
     */
    @Test
    public void testCreateAddOnSubscriptionWithoutTargetDateThenPayChargeSubscriptionAfterFewDays() {
        // initial date on 2022-2-1 19:10:30
        final OffsetDateTime initialCreateDate = OffsetDateTime.of(2022, 2, 1, 19, 10, 30, 0, testTimeZone);
        getClock().setTime(initialCreateDate);

        log.info("initial user and space");
        final MockUserSpace mockUserSpace = createSingleUserAndSpace();

        // choose plan to reward
        CreateEntitlementWithAddOn data = new CreateEntitlementWithAddOn();
        data.setSpaceId(mockUserSpace.getSpaceId());
        data.setPlanId("capacity_100G");
        data.setMonths(3);

        iBillingOfflineService.createSubscriptionWithAddOn(data);

        // check space entitlement
        final List<ExpectedSubscriptionCheck> expectedSubscriptions = new ArrayList<>();
        expectedSubscriptions.add(new ExpectedSubscriptionCheck(ProductEnum.BRONZE, initialCreateDate.toLocalDate(), LocalDate.of(2022, 5, 1)));
        expectedSubscriptions.add(new ExpectedSubscriptionCheck(ProductEnum.CAPACITY, initialCreateDate.toLocalDate(), LocalDate.of(2022, 5, 1)));
        entitlementChecker.checkSubscription(mockUserSpace.getSpaceId(), expectedSubscriptions);

        expectedSubscriptions.clear();
        // buy charge product after a few day, move clock on 2022-02-06
        getClock().addDays(5);

        Price silverPrice = BillingConfigManager.getPriceBySeatAndMonths(ProductEnum.SILVER, 20, 1);
        assertThat(silverPrice).isNotNull();
        final OrderArguments orderArguments = new DefaultOrderArguments(mockUserSpace.getSpaceId(), silverPrice);
        // paid Time
        final OffsetDateTime paidTime = getClock().getNow(testTimeZone).plusMinutes(5);
        autoOrderPayProcessor(mockUserSpace.getUserId(), orderArguments, paidTime);

        expectedSubscriptions.add(new ExpectedSubscriptionCheck(ProductEnum.SILVER, LocalDate.of(2022, 2, 6), LocalDate.of(2022, 3, 6)));
        expectedSubscriptions.add(new ExpectedSubscriptionCheck(ProductEnum.CAPACITY, LocalDate.of(2022, 2, 1), LocalDate.of(2022, 5, 1)));
        // check subscription
        entitlementChecker.checkSubscription(mockUserSpace.getSpaceId(), expectedSubscriptions);
        entitlementChecker.checkSpaceEntitlement(mockUserSpace.getSpaceId(),
                new ExpectedSpaceEntitlementCheck(ProductEnum.SILVER.getName(), LocalDate.of(2022, 3, 6),
                        getBillingConfig().getPlans().get(silverPrice.getPlanId()),
                        Collections.singletonList(getBillingConfig().getPlans().get("capacity_100G"))));

        // move clock on 2022-03-07, make base subscription expire
        expectedSubscriptions.clear();
        final OffsetDateTime expireTime = OffsetDateTime.of(2022, 3, 7, 0, 1, 1, 0, testTimeZone);
        getClock().setTime(expireTime);
        // check space entitlement
        entitlementChecker.checkSpaceEntitlement(mockUserSpace.getSpaceId(),
                new ExpectedSpaceEntitlementCheck(ProductEnum.BRONZE.getName(), null,
                        getFreePlan(ProductChannel.VIKA),
                        Collections.singletonList(getBillingConfig().getPlans().get("capacity_100G"))));
    }

    /**
     * test step:
     * 1. create base subscription between 2022-2-1 and 2023-2-1
     * 2. then create add-on subscription between 2022-2-8 and 2022-5-8
     * 3. move clock to 2022-5-9, add-on subscription should be expire, but base subscription still be active
     */
    @Test
    public void testCreateSubscriptionWithAddOnAfterPayChargeSubscription() {
        // initial date on 2022-2-1 19:10:30
        final OffsetDateTime initialCreateDate = OffsetDateTime.of(2022, 2, 1, 19, 10, 30, 0, testTimeZone);
        getClock().setTime(initialCreateDate);

        log.info("initial user and space");
        final MockUserSpace mockUserSpace = createSingleUserAndSpace();
        // chose product to buy
        Price silverPrice = BillingConfigManager.getPriceBySeatAndMonths(ProductEnum.SILVER, 20, 12);
        assertThat(silverPrice).isNotNull();
        final OrderArguments orderArguments = new DefaultOrderArguments(mockUserSpace.getSpaceId(), silverPrice);
        // paid Time
        final OffsetDateTime paidTime = initialCreateDate.plusMinutes(5);
        autoOrderPayProcessor(mockUserSpace.getUserId(), orderArguments, paidTime);

        // check space entitlement
        entitlementChecker.checkBundle(mockUserSpace.getSpaceId(), new ExpectedBundleCheck(initialCreateDate.toLocalDate(), LocalDate.of(2023, 2, 1)));
        entitlementChecker.checkSubscription(mockUserSpace.getSpaceId(),
                new ExpectedSubscriptionCheck(ProductEnum.SILVER, initialCreateDate.toLocalDate(), LocalDate.of(2023, 2, 1)));
        entitlementChecker.checkSpaceEntitlement(mockUserSpace.getSpaceId(), new ExpectedSpaceEntitlementCheck(
                ProductEnum.SILVER.getName(), LocalDate.of(2023, 2, 1),
                getBillingConfig().getPlans().get(silverPrice.getPlanId()),
                Collections.emptyList()
        ));

        // after a week, initial date on 2022-2-8 create add-on subscription
        getClock().addWeeks(1);
        CreateEntitlementWithAddOn data = new CreateEntitlementWithAddOn();
        data.setSpaceId(mockUserSpace.getSpaceId());
        data.setPlanId("capacity_100G");
        data.setMonths(3);

        iBillingOfflineService.createSubscriptionWithAddOn(data);

        // check space entitlement
        entitlementChecker.checkBundle(mockUserSpace.getSpaceId(), new ExpectedBundleCheck(initialCreateDate.toLocalDate(), LocalDate.of(2023, 2, 1)));
        final List<ExpectedSubscriptionCheck> expectedSubscriptions = new ArrayList<>();
        expectedSubscriptions.add(new ExpectedSubscriptionCheck(ProductEnum.SILVER, initialCreateDate.toLocalDate(), LocalDate.of(2023, 2, 1)));
        expectedSubscriptions.add(new ExpectedSubscriptionCheck(ProductEnum.CAPACITY, LocalDate.of(2022, 2, 8), LocalDate.of(2022, 5, 8)));
        entitlementChecker.checkSubscription(mockUserSpace.getSpaceId(), expectedSubscriptions);
        entitlementChecker.checkSpaceEntitlement(mockUserSpace.getSpaceId(), new ExpectedSpaceEntitlementCheck(
                ProductEnum.SILVER.getName(), LocalDate.of(2023, 2, 1),
                getBillingConfig().getPlans().get(silverPrice.getPlanId()),
                Collections.singletonList(getBillingConfig().getPlans().get("capacity_100G"))
        ));

        // move clock to 2022-5-9
        final OffsetDateTime expireTime = OffsetDateTime.of(2022, 5, 9, 0, 1, 1, 0, testTimeZone);
        getClock().setTime(expireTime);
        entitlementChecker.checkSpaceEntitlement(mockUserSpace.getSpaceId(), new ExpectedSpaceEntitlementCheck(
                ProductEnum.SILVER.getName(), LocalDate.of(2023, 2, 1),
                getBillingConfig().getPlans().get(silverPrice.getPlanId()),
                Collections.emptyList()
        ));
    }

    /**
     * test step:
     * 1. create add-on subscription between (2022-2-1 and 2022-5-1)
     * 2. then pay charge subscription with 1 month enterprise(20) product after 5 days (2022-2-6), active date between 2022-2-6 and 2022-3-6
     * 3. and move clock to 2022-3-7, base subscription should expire, but add-on subscription still be active
     */
    @Test
    public void testCreateSubscriptionWithAddOnThenCreateOfflineOrder() {
        // initial date on 2022-2-1 19:10:30
        final OffsetDateTime initialCreateDate = OffsetDateTime.of(2022, 2, 1, 19, 10, 30, 0, testTimeZone);
        getClock().setTime(initialCreateDate);

        log.info("initial user and space");
        final MockUserSpace mockUserSpace = createSingleUserAndSpace();

        // choose plan to reward
        CreateEntitlementWithAddOn data = new CreateEntitlementWithAddOn();
        data.setSpaceId(mockUserSpace.getSpaceId());
        data.setPlanId("capacity_100G");
        data.setMonths(3);

        iBillingOfflineService.createSubscriptionWithAddOn(data);

        // check space entitlement
        final List<ExpectedSubscriptionCheck> expectedSubscriptions = new ArrayList<>();
        expectedSubscriptions.add(new ExpectedSubscriptionCheck(ProductEnum.BRONZE, initialCreateDate.toLocalDate(), LocalDate.of(2022, 5, 1)));
        expectedSubscriptions.add(new ExpectedSubscriptionCheck(ProductEnum.CAPACITY, initialCreateDate.toLocalDate(), LocalDate.of(2022, 5, 1)));
        entitlementChecker.checkSubscription(mockUserSpace.getSpaceId(), expectedSubscriptions);

        expectedSubscriptions.clear();
        // buy charge product after a few day, move clock on 2022-02-06
        getClock().addDays(5);

        CreateBusinessOrderRo offlineRequest = new CreateBusinessOrderRo();
        offlineRequest.setSpaceId(mockUserSpace.getSpaceId());
        offlineRequest.setType(OrderType.BUY.name());
        offlineRequest.setProduct(ProductEnum.ENTERPRISE.name());
        offlineRequest.setSeat(20);
        offlineRequest.setMonths(1);

        iBillingOfflineService.createBusinessOrder(offlineRequest);

        expectedSubscriptions.add(new ExpectedSubscriptionCheck(ProductEnum.ENTERPRISE, LocalDate.of(2022, 2, 6), LocalDate.of(2022, 3, 6)));
        expectedSubscriptions.add(new ExpectedSubscriptionCheck(ProductEnum.CAPACITY, LocalDate.of(2022, 2, 1), LocalDate.of(2022, 5, 1)));
        // check subscription
        entitlementChecker.checkSubscription(mockUserSpace.getSpaceId(), expectedSubscriptions);
        entitlementChecker.checkSpaceEntitlement(mockUserSpace.getSpaceId(),
                new ExpectedSpaceEntitlementCheck(ProductEnum.ENTERPRISE.getName(), LocalDate.of(2022, 3, 6),
                        getPlan(ProductEnum.ENTERPRISE, 20),
                        Collections.singletonList(getBillingConfig().getPlans().get("capacity_100G"))));

        // move clock on 2022-03-07, make base subscription expire
        expectedSubscriptions.clear();
        final OffsetDateTime expireTime = OffsetDateTime.of(2022, 3, 7, 0, 1, 1, 0, testTimeZone);
        getClock().setTime(expireTime);
        // check space entitlement
        entitlementChecker.checkSpaceEntitlement(mockUserSpace.getSpaceId(),
                new ExpectedSpaceEntitlementCheck(ProductEnum.BRONZE.getName(), null,
                        getFreePlan(ProductChannel.VIKA),
                        Collections.singletonList(getBillingConfig().getPlans().get("capacity_100G"))));
    }

    @Test
    public void testCreateGiftCapacityOrder() {
        MockUserSpace mockUserSpace = createSingleUserAndSpace();
        String userName = "testUserName";
        // 下单300MB附加订阅计划
        iBillingOfflineService.createGiftCapacityOrder(mockUserSpace.getUserId(), userName, mockUserSpace.getSpaceId());
        // 查询空间赠送附件容量大小
        Long number = iSpaceSubscriptionService.getSpaceUnExpireGiftCapacity(mockUserSpace.getSpaceId());
        assertThat(number).isEqualTo(314572800L);
        IPage<SpaceCapacityPageVO> spaceCapacityPageVOIPage = iSpaceSubscriptionService.getSpaceCapacityDetail(mockUserSpace.getSpaceId(), false, new Page<>());
        assertThat(spaceCapacityPageVOIPage.getRecords().get(0).getExpireDate().length()).isEqualTo(19);
    }
}
