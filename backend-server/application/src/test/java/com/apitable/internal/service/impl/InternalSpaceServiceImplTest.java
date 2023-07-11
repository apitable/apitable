package com.apitable.internal.service.impl;

import static org.assertj.core.api.Assertions.assertThat;

import com.apitable.AbstractIntegrationTest;
import com.apitable.internal.vo.InternalSpaceSubscriptionVo;
import com.apitable.mock.bean.MockUserSpace;
import org.junit.jupiter.api.Test;

public class InternalSpaceServiceImplTest extends AbstractIntegrationTest {

    @Test
    public void testGetSpaceEntitlementVo() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        InternalSpaceSubscriptionVo subscriptionVo = internalSpaceService.getSpaceEntitlementVo(
            userSpace.getSpaceId());
        assertThat(subscriptionVo).isNotNull();
    }
}
