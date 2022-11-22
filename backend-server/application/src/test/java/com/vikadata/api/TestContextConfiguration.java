package com.vikadata.api;

import com.vikadata.api.enterprise.billing.service.IBundleService;
import com.vikadata.api.enterprise.billing.service.IOrderV2Service;
import com.vikadata.api.enterprise.billing.service.ISpaceSubscriptionService;
import com.vikadata.api.enterprise.billing.util.EntitlementChecker;
import com.vikadata.api.enterprise.billing.util.OrderChecker;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

@TestConfiguration
public class TestContextConfiguration {

    private final IBundleService iBundleService;

    private final IOrderV2Service iOrderV2Service;

    private final ISpaceSubscriptionService iSpaceSubscriptionService;

    public TestContextConfiguration(IBundleService iBundleService, IOrderV2Service iOrderV2Service, ISpaceSubscriptionService iSpaceSubscriptionService) {
        this.iBundleService = iBundleService;
        this.iOrderV2Service = iOrderV2Service;
        this.iSpaceSubscriptionService = iSpaceSubscriptionService;
    }

    @Bean
    public EntitlementChecker entitlementChecker() {
        return new EntitlementChecker(iBundleService, iSpaceSubscriptionService);
    }

    @Bean
    public OrderChecker orderChecker() {
        return new OrderChecker(iOrderV2Service);
    }
}
