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
import com.apitable.internal.vo.InternalSpaceApiUsageVo;
import com.apitable.internal.vo.InternalSpaceSubscriptionVo;

public class BillingAssembler {

    public InternalSpaceSubscriptionVo toVo(SubscriptionInfo subscriptionInfo) {
        SubscriptionFeature billingPlanFeature = subscriptionInfo.getFeature();
        InternalSpaceSubscriptionVo subscriptionVo = new InternalSpaceSubscriptionVo();
        subscriptionVo.setMaxCalendarViewsInSpace(billingPlanFeature.getCalendarViews().getValue());
        subscriptionVo.setMaxGalleryViewsInSpace(billingPlanFeature.getGalleryViews().getValue());
        subscriptionVo.setMaxGanttViewsInSpace(billingPlanFeature.getGanttViews().getValue());
        subscriptionVo.setMaxKanbanViewsInSpace(billingPlanFeature.getKanbanViews().getValue());
        subscriptionVo.setMaxRowsInSpace(billingPlanFeature.getRowNums().getValue());
        subscriptionVo.setMaxRowsPerSheet(billingPlanFeature.getRowsPerSheet().getValue());
        subscriptionVo.setAllowEmbed(billingPlanFeature.getAllowEmbed().getValue());
        return subscriptionVo;
    }

    public InternalSpaceApiUsageVo toApiUsageVo(SubscriptionFeature planFeature) {
        InternalSpaceApiUsageVo vo = new InternalSpaceApiUsageVo();
        vo.setMaxApiUsageCount(planFeature.getApiCallNums().getValue());
        vo.setIsAllowOverLimit(true);
        return vo;
    }
}
