package com.vikadata.api.modular.finance.service.impl;

import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.mock.bean.MockUserSpace;
import com.vikadata.api.enterprise.billing.util.model.SubscribePlanInfo;

import org.springframework.test.context.TestPropertySource;

import static org.assertj.core.api.Assertions.assertThat;

@TestPropertySource(properties = "vikadata.billing.channel=aliyun")
public class AliyunChannelTest extends AbstractIntegrationTest {

    @Test
    public void testFreeEntitlement() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        SubscribePlanInfo planInfo = iSpaceSubscriptionService.getPlanInfoBySpaceId(userSpace.getSpaceId());
        assertThat(planInfo).isNotNull();
        assertThat(planInfo.getBasePlan().getId()).isEqualTo("atlas_unlimited");
    }
}
