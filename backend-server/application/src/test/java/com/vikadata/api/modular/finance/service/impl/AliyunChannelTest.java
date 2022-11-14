package com.vikadata.api.modular.finance.service.impl;

import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.mock.bean.MockUserSpace;
import com.vikadata.api.util.billing.model.SubscribePlanInfo;

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

    @Test
    public void testUnLimitCapacityNotCreateGiftCapacityOrder(){
        MockUserSpace mockUserSpace = createSingleUserAndSpace();
        SubscribePlanInfo planInfo = iSpaceSubscriptionService.getPlanInfoBySpaceId(mockUserSpace.getSpaceId());
        assertThat(planInfo.getBasePlan().getId()).isEqualTo("atlas_unlimited");
        iBillingOfflineService.createGiftCapacityOrder(IdWorker.getId(), "testUser", mockUserSpace.getSpaceId());
        Long number = iSpaceSubscriptionService.getSpaceUnExpireGiftCapacity(mockUserSpace.getSpaceId());
        assertThat(number).isEqualTo(0L);
    }
}
