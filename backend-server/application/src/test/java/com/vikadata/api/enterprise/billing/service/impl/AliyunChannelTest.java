package com.vikadata.api.enterprise.billing.service.impl;

import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.interfaces.billing.model.SubscriptionInfo;
import com.vikadata.api.mock.bean.MockUserSpace;

import org.springframework.test.context.TestPropertySource;

import static org.assertj.core.api.Assertions.assertThat;

@TestPropertySource(properties = "vikadata.billing.channel=aliyun")
public class AliyunChannelTest extends AbstractIntegrationTest {

    @Test
    public void testFreeEntitlement() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        SubscriptionInfo planInfo = iSpaceSubscriptionService.getPlanInfoBySpaceId(userSpace.getSpaceId());
        assertThat(planInfo).isNotNull();
        assertThat(planInfo.getBasePlan()).isEqualTo("atlas_unlimited");
    }

    @Test
    public void testUnLimitCapacityNotCreateGiftCapacityOrder(){
        MockUserSpace mockUserSpace = createSingleUserAndSpace();
        SubscriptionInfo planInfo = iSpaceSubscriptionService.getPlanInfoBySpaceId(mockUserSpace.getSpaceId());
        assertThat(planInfo.getBasePlan()).isEqualTo("atlas_unlimited");
        iSpaceSubscriptionService.createAddOnWithGiftCapacity(IdWorker.getId(), "testUser", mockUserSpace.getSpaceId());
        Long number = iSpaceSubscriptionService.getSpaceUnExpireGiftCapacity(mockUserSpace.getSpaceId());
        assertThat(number).isEqualTo(0L);
    }
}
