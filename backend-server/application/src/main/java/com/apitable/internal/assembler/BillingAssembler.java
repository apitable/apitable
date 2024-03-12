/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.internal.assembler;

import com.apitable.interfaces.billing.model.SubscriptionFeature;
import com.apitable.interfaces.billing.model.SubscriptionInfo;
import com.apitable.internal.vo.InternalSpaceApiRateLimitVo;
import com.apitable.internal.vo.InternalSpaceApiUsageVo;
import com.apitable.internal.vo.InternalSpaceSubscriptionVo;

/**
 * Billing Assembler.
 *
 * @author Shawn Deng
 */
public class BillingAssembler {

    /**
     * convert SubscriptionInfo to InternalSpaceSubscriptionVo.
     *
     * @param subscriptionInfo subscription info
     * @return InternalSpaceSubscriptionVo
     */
    public InternalSpaceSubscriptionVo toVo(SubscriptionInfo subscriptionInfo) {
        SubscriptionFeature billingPlanFeature = subscriptionInfo.getFeature();
        InternalSpaceSubscriptionVo subscriptionVo = new InternalSpaceSubscriptionVo();
        subscriptionVo.setMaxCalendarViewsInSpace(
            billingPlanFeature.getCalendarViewNums().getValue());
        subscriptionVo.setMaxGalleryViewsInSpace(
            billingPlanFeature.getGalleryViewNums().getValue());
        subscriptionVo.setMaxGanttViewsInSpace(billingPlanFeature.getGanttViewNums().getValue());
        subscriptionVo.setMaxKanbanViewsInSpace(billingPlanFeature.getKanbanViewNums().getValue());
        subscriptionVo.setMaxRowsInSpace(billingPlanFeature.getTotalRows().getValue());
        subscriptionVo.setMaxRowsPerSheet(billingPlanFeature.getRowsPerSheet().getValue());
        subscriptionVo.setMaxArchivedRowsPerSheet(
            billingPlanFeature.getArchivedRowsPerSheet().getValue());
        subscriptionVo.setMaxMessageCredits(billingPlanFeature.getMessageCreditNums().getValue());
        subscriptionVo.setMaxWidgetNums(billingPlanFeature.getWidgetNums().getValue());
        subscriptionVo.setMaxAutomationRunsNums(
            billingPlanFeature.getAutomationRunNumsPerMonth().getValue());
        subscriptionVo.setAllowEmbed(billingPlanFeature.getAllowEmbed().getValue());
        subscriptionVo.setAllowOrgApi(billingPlanFeature.getAllowOrgApi().getValue());
        return subscriptionVo;
    }

    /**
     * convert SubscriptionFeature to InternalSpaceCapacityVo.
     *
     * @param planFeature billing plan feature
     * @return InternalSpaceCapacityVo
     */
    public InternalSpaceApiUsageVo toApiUsageVo(SubscriptionFeature planFeature) {
        InternalSpaceApiUsageVo vo = new InternalSpaceApiUsageVo();
        vo.setMaxApiUsageCount(planFeature.getApiCallNumsPerMonth().getValue());
        vo.setApiCallNumsPerMonth(planFeature.getApiCallNumsPerMonth().getValue());
        vo.setIsAllowOverLimit(true);
        return vo;
    }

    /**
     * convert SubscriptionFeature to InternalSpaceCapacityVo.
     *
     * @param planFeature billing plan feature
     * @return InternalSpaceCapacityVo
     */
    public InternalSpaceApiRateLimitVo toApiRateLimitVo(SubscriptionFeature planFeature) {
        InternalSpaceApiRateLimitVo vo = new InternalSpaceApiRateLimitVo();
        vo.setQps(planFeature.getApiQpsNums().getValue());
        return vo;
    }
}
