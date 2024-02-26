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

import cn.hutool.core.util.NumberUtil;
import cn.hutool.core.util.StrUtil;
import com.apitable.automation.service.impl.AutomationRobotServiceImpl;
import com.apitable.core.constants.RedisConstants;
import com.apitable.interfaces.ai.facade.AiServiceFacade;
import com.apitable.interfaces.billing.model.CycleDateRange;
import com.apitable.interfaces.billing.model.SubscriptionFeature;
import com.apitable.interfaces.billing.model.SubscriptionFeatures;
import com.apitable.interfaces.billing.model.SubscriptionInfo;
import com.apitable.internal.assembler.BillingAssembler;
import com.apitable.internal.ro.SpaceStatisticsRo;
import com.apitable.internal.service.InternalSpaceService;
import com.apitable.internal.vo.InternalCreditUsageVo;
import com.apitable.internal.vo.InternalSpaceApiRateLimitVo;
import com.apitable.internal.vo.InternalSpaceApiUsageVo;
import com.apitable.internal.vo.InternalSpaceAutomationRunMessageV0;
import com.apitable.internal.vo.InternalSpaceInfoVo;
import com.apitable.internal.vo.InternalSpaceSubscriptionVo;
import com.apitable.shared.clock.spring.ClockManager;
import com.apitable.shared.util.SubscriptionDateRange;
import com.apitable.space.enums.LabsFeatureEnum;
import com.apitable.space.service.ILabsApplicantService;
import com.apitable.space.service.ISpaceService;
import com.apitable.space.service.IStaticsService;
import com.apitable.space.vo.LabsFeatureVo;
import jakarta.annotation.Resource;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.integration.redis.util.RedisLockRegistry;
import org.springframework.stereotype.Service;

/**
 * internal space service implement.
 */
@Service
public class InternalSpaceServiceImpl implements InternalSpaceService {

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private IStaticsService iStaticsService;

    @Resource
    private ILabsApplicantService iLabsApplicantService;

    @Resource
    private RedisLockRegistry redisLockRegistry;

    @Resource
    private AiServiceFacade aiServiceFacade;

    @Resource
    private AutomationRobotServiceImpl automationRobotService;

    @Resource
    RedisTemplate<String, Object> redisTemplate;

    @Value("${SKIP_AUTOMATION_RUN_NUM_VALIDATE:false}")
    private Boolean skipAutomationRunNumValidate;

    @Override
    public InternalSpaceSubscriptionVo getSpaceEntitlementVo(String spaceId) {
        SubscriptionInfo subscriptionInfo = iSpaceService.getSpaceSubscription(spaceId);
        BillingAssembler assembler = new BillingAssembler();
        return assembler.toVo(subscriptionInfo);
    }

    @Override
    public InternalCreditUsageVo getSpaceCreditUsageVo(String spaceId) {
        SubscriptionInfo subscriptionInfo = iSpaceService.getSpaceSubscription(spaceId);
        InternalCreditUsageVo vo = new InternalCreditUsageVo();
        vo.setAllowOverLimit(subscriptionInfo.getConfig().isAllowCreditOverLimit());
        vo.setMaxMessageCredits(subscriptionInfo.getFeature().getMessageCreditNums().getValue());
        LocalDate now = ClockManager.me().getLocalDateNow();
        CycleDateRange dateRange = SubscriptionDateRange.calculateCycleDate(subscriptionInfo, now);
        vo.setUsedCredit(aiServiceFacade.getUsedCreditCount(spaceId, dateRange.getCycleStartDate(),
            dateRange.getCycleEndDate()));
        return vo;
    }

    @Override
    public InternalSpaceAutomationRunMessageV0 getAutomationRunMessageV0(String spaceId) {
        SubscriptionInfo subscriptionInfo = iSpaceService.getSpaceSubscription(spaceId);
        InternalSpaceAutomationRunMessageV0 vo = new InternalSpaceAutomationRunMessageV0();
        String redisKey = RedisConstants.getSpaceAutomationRunCountKey(spaceId);
        long count;
        if (Boolean.TRUE.equals(redisTemplate.hasKey(redisKey))) {
            BoundValueOperations<String, Object> valueOps = redisTemplate.boundValueOps(redisKey);
            count = NumberUtil.parseLong(Objects.requireNonNull(valueOps.get()).toString());
        } else {
            count = automationRobotService.getRobotRunsCountBySpaceId(spaceId);
            redisTemplate.boundValueOps(redisKey).setIfAbsent(count, 31, TimeUnit.DAYS);
        }
        SubscriptionFeatures.ConsumeFeatures.AutomationRunNumsPerMonth automationRunNumsPerMonth =
            subscriptionInfo.getFeature().getAutomationRunNumsPerMonth();
        vo.setMaxAutomationRunNums(automationRunNumsPerMonth.getValue());
        vo.setAutomationRunNums(count);
        if (Boolean.TRUE.equals(skipAutomationRunNumValidate)) {
            vo.setAllowRun(true);
        } else {
            vo.setAllowRun(
                automationRunNumsPerMonth.isUnlimited()
                    || count < automationRunNumsPerMonth.getValue());
        }
        return vo;
    }


    @Override
    public InternalSpaceApiUsageVo getSpaceEntitlementApiUsageVo(String spaceId) {
        SubscriptionInfo subscriptionInfo = iSpaceService.getSpaceSubscription(spaceId);
        SubscriptionFeature planFeature = subscriptionInfo.getFeature();
        BillingAssembler assembler = new BillingAssembler();
        InternalSpaceApiUsageVo vo = assembler.toApiUsageVo(planFeature);
        LocalDate now = ClockManager.me().getLocalDateNow();
        CycleDateRange dateRange = SubscriptionDateRange.calculateCycleDate(subscriptionInfo, now);
        vo.setApiUsageUsedCount(
            iStaticsService.getCurrentMonthApiUsage(spaceId, dateRange.getCycleEndDate()));
        vo.setApiCallUsedNumsCurrentMonth(
            iStaticsService.getCurrentMonthApiUsage(spaceId, dateRange.getCycleEndDate()));
        vo.setIsAllowOverLimit(true);
        return vo;
    }

    @Override
    public InternalSpaceApiRateLimitVo getSpaceEntitlementApiRateLimitVo(String spaceId) {
        SubscriptionInfo subscriptionInfo = iSpaceService.getSpaceSubscription(spaceId);
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
