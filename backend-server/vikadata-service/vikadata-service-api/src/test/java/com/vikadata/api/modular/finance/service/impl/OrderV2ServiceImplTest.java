package com.vikadata.api.modular.finance.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.context.ClockManager;
import com.vikadata.api.mock.bean.MockUserSpace;
import com.vikadata.api.modular.finance.core.DefaultOrderArguments;
import com.vikadata.api.modular.finance.core.OrderArguments;
import com.vikadata.api.modular.finance.util.EntitlementChecker.ExpectedSubscriptionCheck;
import com.vikadata.api.util.billing.BillingConfigManager;
import com.vikadata.api.util.billing.model.BillingPlanPrice;
import com.vikadata.api.util.billing.model.ProductEnum;
import com.vikadata.system.config.billing.Price;

import static org.assertj.core.api.Assertions.assertThat;

public class OrderV2ServiceImplTest extends AbstractIntegrationTest {

    protected static final Logger log = LoggerFactory.getLogger(OrderV2ServiceImplTest.class);

    @Test
    public void testCreateOrderOnNewBuySenseWithTargetDate() {
        log.info("initial date on 2019-2-1 19:10:30 +08:00");
        final OffsetDateTime initialCreateDate = OffsetDateTime.of(2019, 2, 2, 19, 10, 30, 0, testTimeZone);
        getClock().setTime(initialCreateDate);

        log.info("initial user and space");
        final MockUserSpace mockUserSpace = createSingleUserAndSpace();
        // chose product to buy
        Price silverPrice = BillingConfigManager.getPriceBySeatAndMonths(ProductEnum.SILVER, 100, 12);
        assertThat(silverPrice).isNotNull();
        final OrderArguments orderArguments = new DefaultOrderArguments(mockUserSpace.getSpaceId(), silverPrice);
        // paid Time
        final OffsetDateTime paidTime = initialCreateDate.plusMinutes(5);
        autoOrderPayProcessor(mockUserSpace.getUserId(), orderArguments, paidTime);

        final LocalDate shouldExpireDate = LocalDate.of(2020, 2, 2);

        // check space entitlement
        entitlementChecker.checkSubscription(mockUserSpace.getSpaceId(),
                new ExpectedSubscriptionCheck(ProductEnum.SILVER, initialCreateDate.toLocalDate(), shouldExpireDate));

        // move clock to 2020-2-2, buy again should be renewal sense
        final OffsetDateTime ajTime = OffsetDateTime.of(2020, 2, 2, 20, 10, 30, 0, testTimeZone);
        getClock().setTime(ajTime);
        Price buyAgainPrice = BillingConfigManager.getPriceBySeatAndMonths(ProductEnum.SILVER, 100, 12);
        assertThat(buyAgainPrice).isNotNull();
        final OrderArguments buyAgainOrderArgs = new DefaultOrderArguments(mockUserSpace.getSpaceId(), buyAgainPrice);
        // paid Time
        final OffsetDateTime sendPaidTime = ajTime.plusMinutes(5);
        autoOrderPayProcessor(mockUserSpace.getUserId(), buyAgainOrderArgs, sendPaidTime);

        final LocalDate nowShouldExpireDate = LocalDate.of(2021, 2, 2);

        // check space entitlement
        entitlementChecker.checkSubscription(mockUserSpace.getSpaceId(),
                new ExpectedSubscriptionCheck(ProductEnum.SILVER, initialCreateDate.toLocalDate(), nowShouldExpireDate));
    }

    @Test
    public void testCreateOrderOnRenewSenseWithTargetDate() {
        log.info("initial date on 2019-2-1 00:00:00 +08:00");
        final OffsetDateTime initialCreateDate = OffsetDateTime.of(2019, 2, 1, 0, 0, 0, 0, testTimeZone);
        getClock().setTime(initialCreateDate);

        log.info("initial user and space");
        final MockUserSpace mockUserSpace = createSingleUserAndSpace();
        // chose product to buy
        Price silverPrice = BillingConfigManager.getPriceBySeatAndMonths(ProductEnum.SILVER, 100, 12);
        assertThat(silverPrice).isNotNull();
        final OrderArguments orderArguments = new DefaultOrderArguments(mockUserSpace.getSpaceId(), silverPrice);
        // paid Time
        final OffsetDateTime paidTime = initialCreateDate.plusMinutes(5);
        autoOrderPayProcessor(mockUserSpace.getUserId(), orderArguments, paidTime);

        final LocalDate shouldExpireDate = LocalDate.of(2020, 2, 1);
        entitlementChecker.checkSubscription(mockUserSpace.getSpaceId(),
                new ExpectedSubscriptionCheck(ProductEnum.SILVER, initialCreateDate.toLocalDate(), shouldExpireDate));

        // add 100 days in the future
        getClock().addDays(100);
        final OffsetDateTime renewOrderCreatedTime = getClock().getNow(testTimeZone);

        // assert renew order data is right
        final OffsetDateTime renewPaidTime = renewOrderCreatedTime.plusMinutes(5);
        autoOrderPayProcessor(mockUserSpace.getUserId(), orderArguments, renewPaidTime);

        final LocalDate nowShouldExpireDate = LocalDate.of(2021, 2, 1);
        entitlementChecker.checkSubscription(mockUserSpace.getSpaceId(),
                new ExpectedSubscriptionCheck(ProductEnum.SILVER, initialCreateDate.toLocalDate(), nowShouldExpireDate));
    }

    @Test
    public void testCreateOrderOnUpgradeSenseOnSameDay() {
        final OffsetDateTime initialCreateDate = OffsetDateTime.of(2022, 6, 9, 2, 0, 0, 0, testTimeZone);
        // Set clock to the initial start date - we implicitly assume here that the timezone is UTC
        getClock().setTime(initialCreateDate);

        log.info("initial user and space");
        final MockUserSpace mockUserSpace = createSingleUserAndSpace();
        // choose silver as first, we assume this plan paid amount is 4888
        Price silverPrice = BillingConfigManager.getPriceBySeatAndMonths(ProductEnum.SILVER, 100, 6);
        assertThat(silverPrice).isNotNull();
        BillingPlanPrice planPrice = BillingPlanPrice.of(silverPrice, ClockManager.me().getLocalDateNow());
        BigDecimal amount = planPrice.getActual();
        log.info("current plan amount is {}", amount);

        final OrderArguments orderArguments = new DefaultOrderArguments(mockUserSpace.getSpaceId(), silverPrice);
        // paid Time
        final OffsetDateTime paidTime = initialCreateDate.plusMinutes(1);
        autoOrderPayProcessor(mockUserSpace.getUserId(), orderArguments, paidTime);

        final LocalDate shouldExpireDate = LocalDate.of(2022, 12, 9);
        entitlementChecker.checkSubscription(mockUserSpace.getSpaceId(),
                new ExpectedSubscriptionCheck(ProductEnum.SILVER, initialCreateDate.toLocalDate(), shouldExpireDate));

        // now we take to operate upgrade request, we assume this plan
        Price upgradePrice = BillingConfigManager.getPriceBySeatAndMonths(ProductEnum.GOLD, 200, 6);
        assertThat(upgradePrice).isNotNull();
        final OrderArguments upgradeOrderArguments = new DefaultOrderArguments(mockUserSpace.getSpaceId(), upgradePrice);

        // assert upgrade order paid time
        final OffsetDateTime upgradePaidTime = initialCreateDate.plusMinutes(10);
        autoOrderPayProcessor(mockUserSpace.getUserId(), upgradeOrderArguments, upgradePaidTime);

        // the pro-rate piece
        entitlementChecker.checkSubscription(mockUserSpace.getSpaceId(),
                new ExpectedSubscriptionCheck(ProductEnum.GOLD, initialCreateDate.toLocalDate(), shouldExpireDate));
    }

    @Test
    public void testCreateOrderOnSimpleUpgradeSenseWithTargetDate() {
        log.info("initial date on 2019-4-1 00:00:00 +08:00");
        // We take april as it has 30 days (easier to play)
        final OffsetDateTime initialCreateDate = OffsetDateTime.of(2019, 4, 1, 0, 0, 0, 0, testTimeZone);
        // Set clock to the initial start date - we implicitly assume here that the timezone is UTC
        getClock().setTime(initialCreateDate);

        log.info("initial user and space");
        final MockUserSpace mockUserSpace = createSingleUserAndSpace();
        // chose product to buy
        ProductEnum toBuy = ProductEnum.SILVER;
        // choose silver as first, we assume this plan paid amount is 4888
        Price silverPrice = BillingConfigManager.getPriceBySeatAndMonths(toBuy, 100, 12);
        assertThat(silverPrice).isNotNull();
        BillingPlanPrice planPrice = BillingPlanPrice.of(silverPrice, ClockManager.me().getLocalDateNow());
        BigDecimal amount = planPrice.getActual();
        log.info("current plan amount is {}", amount);

        final OrderArguments orderArguments = new DefaultOrderArguments(mockUserSpace.getSpaceId(), silverPrice);
        // paid Time
        final OffsetDateTime paidTime = initialCreateDate.plusMinutes(5);
        autoOrderPayProcessor(mockUserSpace.getUserId(), orderArguments, paidTime);

        final LocalDate shouldExpireDate = LocalDate.of(2020, 4, 1);
        entitlementChecker.checkSubscription(mockUserSpace.getSpaceId(),
                new ExpectedSubscriptionCheck(toBuy, initialCreateDate.toLocalDate(), shouldExpireDate));

        // move clock to 2019-5-2
        getClock().addDays(31);
        final OffsetDateTime upgradeDate = getClock().getNow(testTimeZone);

        // upgrade product
        ProductEnum toUpgrade = ProductEnum.GOLD;
        // now we take to operate upgrade request, we assume this plan is 38888
        Price goldPrice = BillingConfigManager.getPriceBySeatAndMonths(toUpgrade, 200, 12);
        assertThat(goldPrice).isNotNull();
        final OrderArguments upgradeOrderArguments = new DefaultOrderArguments(mockUserSpace.getSpaceId(), goldPrice);

        // assert upgrade order paid time
        final OffsetDateTime upgradePaidTime = upgradeDate.plusMinutes(5);
        autoOrderPayProcessor(mockUserSpace.getUserId(), upgradeOrderArguments, upgradePaidTime);

        // the pro-rate piece
        final LocalDate nowShouldExpireDate = LocalDate.of(2020, 5, 2);
        entitlementChecker.checkSubscription(mockUserSpace.getSpaceId(),
                new ExpectedSubscriptionCheck(toUpgrade, upgradeDate.toLocalDate(), nowShouldExpireDate));
    }

    @Test
    public void testCreateOrderOnUpgradeSenseExpectProrated() {
        log.info("initial date on 2019-4-1 00:00:00 +08:00");
        // We take april as it has 30 days (easier to play)
        final OffsetDateTime initialCreateDate = OffsetDateTime.of(2019, 4, 1, 0, 0, 0, 0, testTimeZone);
        // Set clock to the initial start date - we implicitly assume here that the timezone is UTC
        getClock().setTime(initialCreateDate);

        log.info("initial user and space");
        final MockUserSpace mockUserSpace = createSingleUserAndSpace();
        // chose product to buy
        ProductEnum toBuy = ProductEnum.SILVER;
        // choose silver as first, we assume this plan paid amount is 288
        Price silverPrice = BillingConfigManager.getPriceBySeatAndMonths(toBuy, 100, 1);
        assertThat(silverPrice).isNotNull();
        BillingPlanPrice planPrice = BillingPlanPrice.of(silverPrice, ClockManager.me().getLocalDateNow());
        BigDecimal amount = planPrice.getActual();
        log.info("current plan amount is {}", amount);

        final OrderArguments orderArguments = new DefaultOrderArguments(mockUserSpace.getSpaceId(), silverPrice);
        // paid Time
        final OffsetDateTime paidTime = initialCreateDate.plusMinutes(5);
        autoOrderPayProcessor(mockUserSpace.getUserId(), orderArguments, paidTime);

        final LocalDate shouldExpireDate = LocalDate.of(2019, 5, 1);
        entitlementChecker.checkSubscription(mockUserSpace.getSpaceId(),
                new ExpectedSubscriptionCheck(toBuy, initialCreateDate.toLocalDate(), shouldExpireDate));

        // move clock to 2019-4-20
        getClock().addDays(20);
        final OffsetDateTime upgradeDate = getClock().getNow(testTimeZone);

        // now we take to operate upgrade request, we assume this plan is 588
        Price upgradePrice = BillingConfigManager.getPriceBySeatAndMonths(ProductEnum.GOLD, 200, 1);
        assertThat(upgradePrice).isNotNull();
        final OrderArguments upgradeOrderArguments = new DefaultOrderArguments(mockUserSpace.getSpaceId(), upgradePrice);

        // assert upgrade order paid time
        final OffsetDateTime upgradePaidTime = upgradeDate.plusMinutes(5);
        autoOrderPayProcessor(mockUserSpace.getUserId(), upgradeOrderArguments, upgradePaidTime);

        final LocalDate nowShouldExpireDate = LocalDate.of(2019, 5, 21);
        entitlementChecker.checkSubscription(mockUserSpace.getSpaceId(),
                new ExpectedSubscriptionCheck(ProductEnum.GOLD, upgradeDate.toLocalDate(), nowShouldExpireDate));
    }

    @Test
    public void testCreateOrderOnUpgradeComplexSense() {
        // 新购-升级-升级
        log.info("initial date on 2019-4-1 00:00:00 +08:00");
        // We take april as it has 30 days (easier to play)
        final OffsetDateTime initialCreateDate = OffsetDateTime.of(2019, 4, 1, 0, 0, 0, 0, testTimeZone);
        // Set clock to the initial start date - we implicitly assume here that the timezone is UTC
        getClock().setTime(initialCreateDate);

        log.info("initial user and space");
        final MockUserSpace mockUserSpace = createSingleUserAndSpace();
        // choose silver as first, we assume this plan paid amount is 288
        Price silverPrice = BillingConfigManager.getPriceBySeatAndMonths(ProductEnum.SILVER, 100, 1);
        assertThat(silverPrice).isNotNull();
        BillingPlanPrice planPrice = BillingPlanPrice.of(silverPrice, ClockManager.me().getLocalDateNow());
        BigDecimal amount = planPrice.getActual();
        log.info("current plan amount is {}", amount);

        final OrderArguments orderArguments = new DefaultOrderArguments(mockUserSpace.getSpaceId(), silverPrice);
        // paid Time
        final OffsetDateTime paidTime = initialCreateDate.plusMinutes(5);
        autoOrderPayProcessor(mockUserSpace.getUserId(), orderArguments, paidTime);

        final LocalDate shouldExpireDate = LocalDate.of(2019, 5, 1);
        entitlementChecker.checkSubscription(mockUserSpace.getSpaceId(),
                new ExpectedSubscriptionCheck(ProductEnum.SILVER, initialCreateDate.toLocalDate(), shouldExpireDate));

        // move clock to 2019-4-21
        getClock().addDays(20);
        final OffsetDateTime upgradeDate = getClock().getNow(testTimeZone);

        // now we take to operate upgrade request, we assume this plan is 588
        Price upgradePrice = BillingConfigManager.getPriceBySeatAndMonths(ProductEnum.GOLD, 200, 1);
        assertThat(upgradePrice).isNotNull();
        final OrderArguments upgradeOrderArguments = new DefaultOrderArguments(mockUserSpace.getSpaceId(), upgradePrice);

        // assert upgrade order paid time
        final OffsetDateTime upgradePaidTime = upgradeDate.plusMinutes(5);
        autoOrderPayProcessor(mockUserSpace.getUserId(), upgradeOrderArguments, upgradePaidTime);

        final LocalDate nowShouldExpireDate = LocalDate.of(2019, 5, 21);
        entitlementChecker.checkSubscription(mockUserSpace.getSpaceId(),
                new ExpectedSubscriptionCheck(ProductEnum.GOLD, upgradeDate.toLocalDate(), nowShouldExpireDate));

        // move clock to 2019-5-11
        // getClock().addDays(20);
        // final OffsetDateTime againUpgradeDate = getClock().getNow(testTimeZone);

        // now we take to operate upgrade request, we assume this plan is 888
        // Price upgradeAgainPrice = BillingConfigManager.getPriceBySeatAndMonths(toBuy, 100, 1);
        // assertThat(upgradeAgainPrice).isNotNull();
        // final OrderArguments upgradeAgainOrderArguments = new DefaultOrderArguments(mockUserSpace.getSpaceId(), upgradeAgainPrice);

        // assert upgrade order paid time
        // final OffsetDateTime upgradeAgainPaidTime = againUpgradeDate.plusMinutes(5);
        // autoOrderPayProcessor(mockUserSpace.getUserId(), upgradeAgainOrderArguments, upgradeAgainPaidTime);

        // final LocalDate nowAgainShouldExpireDate = LocalDate.of(2019, 6, 11);
        // entitlementChecker.checkSubscription(mockUserSpace.getSpaceId(),
        //         new ExpectedSubscriptionCheck(toBuy, againUpgradeDate.toLocalDate(), nowAgainShouldExpireDate));
    }
}
