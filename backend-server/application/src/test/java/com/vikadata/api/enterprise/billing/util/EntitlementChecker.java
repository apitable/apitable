package com.vikadata.api.enterprise.billing.util;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import com.vikadata.api.enterprise.billing.core.Bundle;
import com.vikadata.api.enterprise.billing.core.Subscription;
import com.vikadata.api.enterprise.billing.enums.ProductEnum;
import com.vikadata.api.enterprise.billing.service.IBundleService;
import com.vikadata.api.enterprise.billing.service.ISpaceSubscriptionService;
import com.vikadata.api.interfaces.billing.model.SubscriptionInfo;
import com.vikadata.api.shared.sysconfig.billing.Plan;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;

public class EntitlementChecker {

    private final IBundleService iBundleService;

    private final ISpaceSubscriptionService iSpaceSubscriptionService;

    public EntitlementChecker(IBundleService iBundleService, ISpaceSubscriptionService iSpaceSubscriptionService) {
        this.iBundleService = iBundleService;
        this.iSpaceSubscriptionService = iSpaceSubscriptionService;
    }

    public void checkSpaceEntitlement(String spaceId, ExpectedSpaceEntitlementCheck expected) {
        SubscriptionInfo planInfo = iSpaceSubscriptionService.getPlanInfoBySpaceId(spaceId);
        assertThat(planInfo).isNotNull();
        assertThat(planInfo.getProduct()).isEqualTo(expected.getProduct());
        assertThat(planInfo.getEndDate()).isEqualTo(expected.getExpireDate());
        assertThat(planInfo.getBasePlan()).isEqualTo(expected.getBasePlan().getId());
        assertThat(planInfo.getAddOnPlans()).containsExactlyInAnyOrderElementsOf(expected.getAddOnPlans().stream().map(Plan::getId).collect(Collectors.toList()));
    }

    public void checkBundle(String spaceId, ExpectedBundleCheck bundleCheck) {
        List<Bundle> bundles = iBundleService.getBundlesBySpaceId(spaceId);
        assertThat(bundles).isNotEmpty().hasSizeGreaterThanOrEqualTo(1);
        boolean checkBundle = bundles.stream().anyMatch(bundle -> {
            if (bundle.getBundleStartDate().toLocalDate().compareTo(bundleCheck.getStartDate()) != 0) {
                return false;
            }
            return (bundleCheck.getExpireDate() == null && bundle.getBaseSubscription().getExpireDate() == null) ||
                    (bundleCheck.getExpireDate() != null && bundle.getBaseSubscription().getExpireDate() != null && bundleCheck.getExpireDate().compareTo(bundle.getBaseSubscription().getExpireDate().toLocalDate()) == 0);
        });
        if (!checkBundle) {
            fail(String.format("expect Bundle startDate=[%s], endDate=[%s]", bundleCheck.getStartDate(), bundleCheck.getExpireDate()));
        }
    }

    public void checkSubscription(String spaceId, ExpectedSubscriptionCheck... expected) {
        checkSubscription(spaceId, Arrays.asList(expected));
    }

    public void checkSubscription(String spaceId, List<ExpectedSubscriptionCheck> subscriptionChecks) {
        Bundle bundle = iBundleService.getActivatedBundleBySpaceId(spaceId);
        if (subscriptionChecks == null || subscriptionChecks.isEmpty()) {
            assertThat(bundle).isNull();
            return;
        }
        assertThat(bundle).isNotNull();
        List<Subscription> subscriptions = bundle.getSubscriptions();
        assertThat(subscriptions.size()).isEqualTo(subscriptionChecks.size());
        // assertEquals(subscriptions.size(), subscriptionChecks.size(), String.format("Expected items: %s, actual items: %s", subscriptionChecks, subscriptionChecks));
        for (ExpectedSubscriptionCheck expect : subscriptionChecks) {
            boolean found = subscriptions.stream().anyMatch(subscription -> {
                if (expect.getProduct() != null && !expect.getProduct().name().equalsIgnoreCase(subscription.getProductName())) {
                    return false;
                }
                if (subscription.getStartDate().toLocalDate().compareTo(expect.getStartDate()) != 0) {
                    return false;
                }
                return (expect.getExpireDate() == null && subscription.getExpireDate() == null) ||
                        (expect.getExpireDate() != null && subscription.getExpireDate() != null && expect.getExpireDate().compareTo(subscription.getExpireDate().toLocalDate()) == 0);
            });
            if (!found) {
                final StringBuilder debugBuilder = new StringBuilder();
                debugBuilder.append(String.format("Bundle id=[%s]", bundle.getBundleId()));
                for (final Subscription subscription : subscriptions) {
                    debugBuilder.append(String.format("\n  subscription startDate=[%s] endDate=[%s]", subscription.getStartDate(), subscription.getExpireDate()));
                }

                final String failureMessage = String.format("expect subscription startDate = %s, endDate = %s\n because actual is %s",
                        expect.getStartDate(), expect.getExpireDate(), debugBuilder);
                fail(failureMessage);
            }
        }
    }

    public static class ExpectedSpaceEntitlementCheck {

        private final String product;

        private final LocalDate expireDate;

        private final Plan basePlan;

        private final List<Plan> addOnPlans;

        public ExpectedSpaceEntitlementCheck(String product, LocalDate expireDate, Plan basePlan, List<Plan> addOnPlans) {
            this.product = product;
            this.expireDate = expireDate;
            this.basePlan = basePlan;
            this.addOnPlans = addOnPlans;
        }

        public String getProduct() {
            return product;
        }

        public LocalDate getExpireDate() {
            return expireDate;
        }

        public Plan getBasePlan() {
            return basePlan;
        }

        public List<Plan> getAddOnPlans() {
            return addOnPlans;
        }
    }

    public static class ExpectedBundleCheck {

        private final LocalDate startDate;

        private final LocalDate expireDate;

        public ExpectedBundleCheck(LocalDate startDate, LocalDate expireDate) {
            this.startDate = startDate;
            this.expireDate = expireDate;
        }

        public LocalDate getStartDate() {
            return startDate;
        }

        public LocalDate getExpireDate() {
            return expireDate;
        }
    }

    public static class ExpectedSubscriptionCheck {

        private final ProductEnum product;

        private final LocalDate startDate;

        private final LocalDate expireDate;

        public ExpectedSubscriptionCheck(ProductEnum product, LocalDate startDate, LocalDate expireDate) {
            this.product = product;
            this.startDate = startDate;
            this.expireDate = expireDate;
        }

        public ProductEnum getProduct() {
            return product;
        }

        public LocalDate getStartDate() {
            return startDate;
        }

        public LocalDate getExpireDate() {
            return expireDate;
        }
    }
}
