package com.vikadata.api.internal.service.impl;

import javax.annotation.Resource;

import com.vikadata.api.interfaces.billing.facade.EntitlementServiceFacade;
import com.vikadata.api.interfaces.billing.model.SubscriptionFeature;
import com.vikadata.api.interfaces.billing.model.SubscriptionInfo;
import com.vikadata.api.internal.assembler.BillingAssembler;
import com.vikadata.api.internal.vo.InternalSpaceApiUsageVo;
import com.vikadata.api.internal.vo.InternalSpaceSubscriptionVo;
import com.vikadata.api.internal.service.InternalSpaceService;
import com.vikadata.api.space.service.IStaticsService;

import org.springframework.stereotype.Service;

@Service
public class InternalSpaceServiceImpl implements InternalSpaceService {

    @Resource
    private EntitlementServiceFacade entitlementServiceFacade;

    @Resource
    private IStaticsService iStaticsService;

    @Override
    public InternalSpaceSubscriptionVo getSpaceEntitlementVo(String spaceId) {
        SubscriptionInfo subscriptionInfo = entitlementServiceFacade.getSpaceSubscription(spaceId);
        BillingAssembler assembler = new BillingAssembler();
        return assembler.toVo(subscriptionInfo);
    }

    @Override
    public InternalSpaceApiUsageVo getSpaceEntitlementApiUsageVo(String spaceId) {
        SubscriptionInfo subscriptionInfo = entitlementServiceFacade.getSpaceSubscription(spaceId);
        SubscriptionFeature planFeature = subscriptionInfo.getFeature();
        BillingAssembler assembler = new BillingAssembler();
        InternalSpaceApiUsageVo vo = assembler.toApiUsageVo(planFeature);
        vo.setApiUsageUsedCount(iStaticsService.getCurrentMonthApiUsage(spaceId));
        vo.setIsAllowOverLimit(true);
        return vo;
    }
}
