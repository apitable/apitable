package com.vikadata.api.internal.service;

import com.vikadata.api.internal.vo.InternalSpaceApiUsageVo;
import com.vikadata.api.internal.vo.InternalSpaceSubscriptionVo;

public interface InternalSpaceService {

    /**
     * get space entitlement view
     * @param spaceId space id
     * @return InternalSpaceSubscriptionVo
     */
    InternalSpaceSubscriptionVo getSpaceEntitlementVo(String spaceId);

    /**
     * get space api usage in entitlement
     * @param spaceId space id
     * @return InternalSpaceApiUsageVo
     */
    InternalSpaceApiUsageVo getSpaceEntitlementApiUsageVo(String spaceId);
}
