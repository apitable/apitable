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

package com.apitable.internal.service.impl;

import com.apitable.interfaces.billing.facade.EntitlementServiceFacade;
import com.apitable.interfaces.billing.model.SubscriptionFeature;
import com.apitable.interfaces.billing.model.SubscriptionInfo;
import com.apitable.internal.assembler.BillingAssembler;
import com.apitable.internal.service.InternalSpaceService;
import com.apitable.internal.vo.InternalSpaceApiUsageVo;
import com.apitable.internal.vo.InternalSpaceInfoVo;
import com.apitable.internal.vo.InternalSpaceSubscriptionVo;
import com.apitable.space.entity.LabsApplicantEntity;
import com.apitable.space.enums.LabsFeatureEnum;
import com.apitable.space.service.ILabsApplicantService;
import com.apitable.space.service.IStaticsService;
import java.util.Objects;
import javax.annotation.Resource;
import org.springframework.stereotype.Service;

/**
 * internal space service implement.
 */
@Service
public class InternalSpaceServiceImpl implements InternalSpaceService {

    @Resource
    private EntitlementServiceFacade entitlementServiceFacade;

    @Resource
    private IStaticsService iStaticsService;

    @Resource
    private ILabsApplicantService iLabsApplicantService;

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

    @Override
    public InternalSpaceInfoVo getSpaceInfo(String spaceId) {
        InternalSpaceInfoVo spaceInfo = new InternalSpaceInfoVo();
        InternalSpaceInfoVo.SpaceLabs labs = new InternalSpaceInfoVo.SpaceLabs();
        // At present, there is only one, which directly queries a single one, and there are multiple requirements behind it. Expand it
        LabsApplicantEntity applicant =
            iLabsApplicantService.getApplicantByApplicantAndFeatureKey(spaceId,
                LabsFeatureEnum.VIEW_MANUAL_SAVE.name());
        labs.setViewManualSave(Objects.nonNull(applicant));
        spaceInfo.setLabs(labs);
        spaceInfo.setSpaceId(spaceId);
        return spaceInfo;
    }
}
