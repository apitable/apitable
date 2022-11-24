package com.vikadata.api.internal.assembler;

import java.util.Arrays;
import java.util.List;

import com.vikadata.api.interfaces.billing.model.SubscriptionFeature;
import com.vikadata.api.interfaces.billing.model.SubscriptionInfo;
import com.vikadata.api.internal.model.InternalSpaceApiUsageVo;
import com.vikadata.api.internal.model.InternalSpaceSubscriptionVo;

public class BillingAssembler {
    protected static final List<String> ENTERPRISE_MARK = Arrays.asList("Dingtalk_Enterprise", "Enterprise",
            "Feishu_Enterprise", "Wecom_Enterprise", "Private_Cloud");

    public InternalSpaceSubscriptionVo toVo(SubscriptionInfo subscriptionInfo) {
        SubscriptionFeature billingPlanFeature = subscriptionInfo.getFeature();
        InternalSpaceSubscriptionVo subscriptionVo = new InternalSpaceSubscriptionVo();
        subscriptionVo.setMaxCalendarViewsInSpace(billingPlanFeature.getCalendarViews().getValue());
        subscriptionVo.setMaxGalleryViewsInSpace(billingPlanFeature.getGalleryViews().getValue());
        subscriptionVo.setMaxGanttViewsInSpace(billingPlanFeature.getGanttViews().getValue());
        subscriptionVo.setMaxKanbanViewsInSpace(billingPlanFeature.getKanbanViews().getValue());
        subscriptionVo.setMaxRowsInSpace(billingPlanFeature.getRowNums().getValue());
        subscriptionVo.setMaxRowsPerSheet(billingPlanFeature.getRowsPerSheet().getValue());
        if (ENTERPRISE_MARK.contains(subscriptionInfo.getProduct())) {
            subscriptionVo.setCanCallEnterpriseApi(true);
        }
        return subscriptionVo;
    }

    public InternalSpaceApiUsageVo toApiUsageVo(SubscriptionFeature planFeature) {
        InternalSpaceApiUsageVo vo = new InternalSpaceApiUsageVo();
        vo.setMaxApiUsageCount(planFeature.getApiCallNums().getValue());
        vo.setIsAllowOverLimit(true);
        return vo;
    }
}
