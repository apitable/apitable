package com.vikadata.api.internal.assembler;

import com.vikadata.api.interfaces.billing.model.SubscriptionFeature;
import com.vikadata.api.internal.model.InternalSpaceApiUsageVo;
import com.vikadata.api.internal.model.InternalSpaceSubscriptionVo;

public class BillingAssembler {

    public InternalSpaceSubscriptionVo toVo(SubscriptionFeature billingPlanFeature) {
        InternalSpaceSubscriptionVo subscriptionVo = new InternalSpaceSubscriptionVo();
        subscriptionVo.setMaxCalendarViewsInSpace(billingPlanFeature.getCalendarViews().getValue());
        subscriptionVo.setMaxGalleryViewsInSpace(billingPlanFeature.getGalleryViews().getValue());
        subscriptionVo.setMaxGanttViewsInSpace(billingPlanFeature.getGanttViews().getValue());
        subscriptionVo.setMaxKanbanViewsInSpace(billingPlanFeature.getKanbanViews().getValue());
        subscriptionVo.setMaxRowsInSpace(billingPlanFeature.getRowNums().getValue());
        subscriptionVo.setMaxRowsPerSheet(billingPlanFeature.getRowsPerSheet().getValue());
        return subscriptionVo;
    }

    public InternalSpaceApiUsageVo toApiUsageVo(SubscriptionFeature planFeature) {
        InternalSpaceApiUsageVo vo = new InternalSpaceApiUsageVo();
        vo.setMaxApiUsageCount(planFeature.getApiCallNums().getValue());
        vo.setIsAllowOverLimit(true);
        return vo;
    }
}
