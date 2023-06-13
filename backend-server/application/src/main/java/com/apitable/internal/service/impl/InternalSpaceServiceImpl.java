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

import static com.apitable.core.constants.RedisConstants.GENERAL_LOCKED;

import cn.hutool.core.util.StrUtil;
import com.apitable.interfaces.billing.facade.EntitlementServiceFacade;
import com.apitable.interfaces.billing.model.SubscriptionFeature;
import com.apitable.interfaces.billing.model.SubscriptionInfo;
import com.apitable.internal.assembler.BillingAssembler;
import com.apitable.internal.ro.SpaceStatisticsRo;
import com.apitable.internal.service.InternalSpaceService;
import com.apitable.internal.vo.InternalSpaceApiRateLimitVo;
import com.apitable.internal.vo.InternalSpaceApiUsageVo;
import com.apitable.internal.vo.InternalSpaceInfoVo;
import com.apitable.internal.vo.InternalSpaceSubscriptionVo;
import com.apitable.space.enums.LabsFeatureEnum;
import com.apitable.space.service.ILabsApplicantService;
import com.apitable.space.service.IStaticsService;
import com.apitable.space.vo.LabsFeatureVo;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import javax.annotation.Resource;
import org.springframework.integration.redis.util.RedisLockRegistry;
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

    @Resource
    private RedisLockRegistry redisLockRegistry;

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
    public InternalSpaceApiRateLimitVo getSpaceEntitlementApiRateLimitVo(String spaceId) {
        SubscriptionInfo subscriptionInfo = entitlementServiceFacade.getSpaceSubscription(spaceId);
        SubscriptionFeature planFeature = subscriptionInfo.getFeature();
        BillingAssembler assembler = new BillingAssembler();
        return assembler.toApiRateLimitVo(planFeature);
    }

    @Override
    public InternalSpaceInfoVo getSpaceInfo(String spaceId) {
        InternalSpaceInfoVo spaceInfo = new InternalSpaceInfoVo();
        InternalSpaceInfoVo.SpaceLabs labs = new InternalSpaceInfoVo.SpaceLabs();
        List<String> applicants = new ArrayList<>(Collections.singleton(spaceId));
        LabsFeatureVo feature =
            iLabsApplicantService.getUserCurrentFeatureApplicants(applicants);
        labs.setViewManualSave(
            feature.getKeys().contains(LabsFeatureEnum.VIEW_MANUAL_SAVE.getFeatureName()));
        labs.setRobot(feature.getKeys().contains(LabsFeatureEnum.ROBOT.getFeatureName()));
        spaceInfo.setLabs(labs);
        spaceInfo.setSpaceId(spaceId);
        return spaceInfo;
    }

    @Override
    public void updateSpaceStatisticsInCache(String spaceId, SpaceStatisticsRo data) {
        if (null == data) {
            return;
        }
        String lockKey = StrUtil.format(GENERAL_LOCKED, "space:statistics", spaceId);
        // lock for space
        Lock lock = redisLockRegistry.obtain(lockKey);
        try {
            if (lock.tryLock(1, TimeUnit.SECONDS)) {
                iStaticsService.updateDatasheetViewCountStaticsBySpaceId(spaceId,
                    data.getViewCount());
                iStaticsService.updateDatasheetRecordCountStaticsBySpaceId(spaceId,
                    data.getRecordCount());
            }
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } finally {
            lock.unlock();
        }
    }
}
