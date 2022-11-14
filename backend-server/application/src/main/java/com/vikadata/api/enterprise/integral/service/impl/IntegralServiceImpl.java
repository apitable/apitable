package com.vikadata.api.enterprise.integral.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.lang.Dict;
import cn.hutool.core.lang.Validator;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;

import com.apitable.starter.vika.core.VikaOperations;
import com.apitable.starter.vika.core.model.IntegralRewardInfo;
import com.vikadata.api.shared.component.TaskManager;
import com.vikadata.api.shared.component.notification.NotificationManager;
import com.vikadata.api.shared.component.notification.NotificationTemplateId;
import com.vikadata.api.shared.config.properties.ConstProperties;
import com.vikadata.api.enterprise.integral.mapper.IntegralHistoryMapper;
import com.vikadata.api.enterprise.billing.enums.BillingException;
import com.vikadata.api.user.vo.IntegralRecordVO;
import com.vikadata.api.enterprise.integral.enums.IntegralAlterType;
import com.vikadata.api.enterprise.integral.service.IIntegralService;
import com.vikadata.api.user.service.IUserService;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.SqlTool;
import com.vikadata.entity.IntegralHistoryEntity;
import com.vikadata.api.user.entity.UserEntity;
import com.vikadata.system.config.SystemConfigManager;
import com.vikadata.system.config.integral.IntegralRule;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.integration.redis.util.RedisLockRegistry;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.shared.constants.IntegralActionCodeConstants.WALLET_ACTIVITY_REWARD;
import static com.vikadata.api.shared.constants.NotificationConstants.ACTION_NAME;
import static com.vikadata.api.shared.constants.NotificationConstants.ACTIVITY_NAME;
import static com.vikadata.api.shared.constants.NotificationConstants.COUNT;

@Service
@Slf4j
public class IntegralServiceImpl implements IIntegralService {

    @Resource
    private IntegralHistoryMapper integralHistoryMapper;

    @Resource
    private IUserService iUserService;

    @Autowired(required = false)
    private VikaOperations vikaOperations;

    @Resource
    private ConstProperties constProperties;

    @Resource
    private RedisLockRegistry redisLockRegistry;

    @Override
    public BigDecimal getCreditByActionCode(String actionCode) {
        int rewardIntegralValue = SystemConfigManager.getConfig().getIntegral().getRule().get(actionCode).getIntegralValue();
        return rewardIntegralValue == 0 ? BigDecimal.ZERO :
                BigDecimal.valueOf(rewardIntegralValue).divide(new BigDecimal(100), 2, RoundingMode.HALF_UP);
    }

    @Override
    public int getTotalIntegralValueByUserId(Long userId) {
        return SqlTool.retCount(integralHistoryMapper.selectTotalIntegralValueByUserId(userId));
    }

    @Override
    public IPage<IntegralRecordVO> getIntegralRecordPageByUserId(Page<IntegralRecordVO> page, Long userId) {
        return integralHistoryMapper.selectPageByUserId(page, userId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void trigger(String action, IntegralAlterType alterType, Long by, JSONObject parameter) {
        log.info("trigger integral operation：{}", action);
        log.info("============ init user integral reward lock ============");
        Lock lock = redisLockRegistry.obtain(by.toString());
        try {
            log.info("============ try get user integral reward lock ============");
            // get lock return true. if failure, waiting 2 seconds. if timeout, return false.
            if (lock.tryLock(100, TimeUnit.MILLISECONDS)) {
                try {
                    log.info("============ lock in successfully ============");
                    // find the original integral value of the trigger
                    int beforeTotalIntegralValue = getTotalIntegralValueByUserId(by);
                    // find integral rule
                    IntegralRule rule = SystemConfigManager.getConfig().getIntegral().getRule().get(action);
                    // change integral value
                    int alterIntegralValue = rule.getIntegralValue();
                    // record integral value
                    this.createHistory(by, action, alterType, beforeTotalIntegralValue, alterIntegralValue, parameter);
                    if (rule.isNotify()) {
                        TaskManager.me().execute(() -> NotificationManager.me().playerNotify(NotificationTemplateId.INTEGRAL_INCOME_NOTIFY, Collections.singletonList(by),
                                0L, null, Dict.create().set(COUNT, rule.getIntegralValue()).set(ACTION_NAME, rule.getActionName())));
                    }
                }
                catch (Exception e) {
                    log.error("failed to reward the user integral", e);
                    throw e;
                }
                finally {
                    log.info("============ unlock ============");
                    lock.unlock();
                }
            }
            else {
                log.error("the user operates integral are too frequent");
                throw new BusinessException(BillingException.ACCOUNT_CREDIT_ALTER_FREQUENTLY);
            }
        }
        catch (InterruptedException e) {
            log.error("users operates integral are too frequent", e);
            // acquire lock was interrupted
            throw new BusinessException(BillingException.ACCOUNT_CREDIT_ALTER_FREQUENTLY);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void alterIntegral(String actionCode, IntegralAlterType alterType, int alterIntegral, Long by, JSONObject parameter) {
        log.info("Change integral");
        log.info("============ init user integral lock ============");
        Lock lock = redisLockRegistry.obtain(by.toString());
        try {
            // get lock return true. if failure, waiting 2 seconds. if timeout, return false.
            log.info("============ try get user integral lock ============");
            if (lock.tryLock(100, TimeUnit.MILLISECONDS)) {
                try {
                    log.info("============ get user integral lock ============");
                    // find the original integral value of the trigger
                    int beforeTotalIntegralValue = getTotalIntegralValueByUserId(by);
                    // record integral value
                    this.createHistory(by, actionCode, alterType, beforeTotalIntegralValue, alterIntegral, parameter);
                }
                catch (Exception e) {
                    log.error("failed to reward the user「{}」 integral", by, e);
                    throw e;
                }
                finally {
                    log.info("============ unlocking ============");
                    lock.unlock();
                }
            }
            else {
                log.error("User「{}」operate integral too frequently", by);
                throw new BusinessException(BillingException.ACCOUNT_CREDIT_ALTER_FREQUENTLY);
            }
        }
        catch (InterruptedException e) {
            log.error("User「{}」operate integral too frequently", by, e);
            // acquire lock was interrupted
            throw new BusinessException(BillingException.ACCOUNT_CREDIT_ALTER_FREQUENTLY);
        }
    }

    @Override
    public Long createHistory(Long userId, String actionCode, IntegralAlterType alterType, Integer oldIntegralValue, Integer alterIntegralValue, JSONObject parameter) {
        // create integral, stands for calculating user integral.
        IntegralHistoryEntity historyEntity = new IntegralHistoryEntity();
        historyEntity.setUserId(userId);
        historyEntity.setActionCode(actionCode);
        historyEntity.setAlterType(alterType.getState());
        historyEntity.setOriginIntegral(oldIntegralValue);
        historyEntity.setAlterIntegral(alterIntegralValue);
        historyEntity.setTotalIntegral(determineIntegralValue(alterType, oldIntegralValue, alterIntegralValue));
        historyEntity.setParameter(parameter.toString());
        historyEntity.setCreatedBy(userId);
        historyEntity.setUpdatedBy(userId);
        integralHistoryMapper.insert(historyEntity);
        return historyEntity.getId();
    }

    @Override
    public void updateParameterById(Long recordId, String parameter) {
        integralHistoryMapper.updateParameterById(recordId, parameter);
    }

    @Override
    public int getCountByUserIdAndActionCode(Long userId, String actionCode) {
        return SqlTool.retCount(integralHistoryMapper.selectCountByUserIdAndActionCode(userId, actionCode));
    }

    @Override
    public boolean checkByUserIdAndActionCodes(Long userId, Collection<String> actionCodes) {
        return SqlTool.retCount(integralHistoryMapper.selectCountByUserIdAndActionCodes(userId, actionCodes)) > 0;
    }

    @Override
    public void activityReward(String processor) {
        String[] split = constProperties.getIntegralRewardConfig().split(",");
        List<IntegralRewardInfo> rewardInfos = vikaOperations.getIntegralRewardInfo(split[0], split[1], split[2], split[3]);
        if (rewardInfos.isEmpty()) {
            throw new BusinessException("There are no records that meet the conditions.");
        }
        // collect different types of method targets
        Map<String, IntegralRewardInfo> emailTargetMap = new HashMap<>();
        Map<String, List<IntegralRewardInfo>> areaCodeToInfosMap = new HashMap<>();
        for (IntegralRewardInfo info : rewardInfos) {
            // target is email address
            if (Validator.isEmail(info.getTarget())) {
                emailTargetMap.put(info.getTarget(), info);
                continue;
            }
            // target is phone number. if area code is null, info is lack.
            if (info.getAreaCode() == null) {
                vikaOperations.updateIntegralRewardResult(split[0], split[1], split[2], info.getRecordId(), "Incorrect information filled in", processor);
                continue;
            }
            // group by area code.
            if (areaCodeToInfosMap.containsKey(info.getAreaCode())) {
                areaCodeToInfosMap.get(info.getAreaCode()).add(info);
            }
            else {
                List<IntegralRewardInfo> targets = new ArrayList<>();
                targets.add(info);
                areaCodeToInfosMap.put(info.getAreaCode(), targets);
            }
        }
        // deliver integral
        if (!emailTargetMap.isEmpty()) {
            List<UserEntity> userEntities = iUserService.getByEmails(emailTargetMap.keySet());
            Map<String, Long> emailToUserIdMap = userEntities.stream().collect(Collectors.toMap(UserEntity::getEmail, UserEntity::getId));
            for (Entry<String, IntegralRewardInfo> entry : emailTargetMap.entrySet()) {
                // deliver integral
                this.deliver(entry.getValue(), emailToUserIdMap, processor, split);
            }
        }
        for (Entry<String, List<IntegralRewardInfo>> entry : areaCodeToInfosMap.entrySet()) {
            List<String> mobilePhones = entry.getValue().stream().map(IntegralRewardInfo::getTarget).collect(Collectors.toList());
            List<UserEntity> userEntities = iUserService.getByCodeAndMobilePhones(entry.getKey(), mobilePhones);
            Map<String, Long> mobileToUserIdMap = userEntities.stream().collect(Collectors.toMap(UserEntity::getMobilePhone, UserEntity::getId));
            for (IntegralRewardInfo info : entry.getValue()) {
                // deliver integral
                this.deliver(info, mobileToUserIdMap, processor, split);
            }
        }
    }

    private void deliver(IntegralRewardInfo info, Map<String, Long> targetToUserIdMap, String processor, String[] split) {
        // the email user does not exist
        if (!targetToUserIdMap.containsKey(info.getTarget())) {
            vikaOperations.updateIntegralRewardResult(split[0], split[1], split[2], info.getRecordId(), "not to deliver，because the account is not registered.", processor);
            return;
        }
        Long userId = targetToUserIdMap.get(info.getTarget());
        this.alterIntegral(WALLET_ACTIVITY_REWARD, IntegralAlterType.INCOME, info.getCount(), userId, JSONUtil.createObj().set("name", info.getActivityName()));
        try {
            vikaOperations.updateIntegralRewardResult(split[0], split[1], split[2], info.getRecordId(), "delivered", processor);
        }
        catch (Exception e) {
            throw new BusinessException(StrUtil.format("「{}」integral was delivered，rewrite datasheet failure. msg:{}", info.getTarget(), e.getMessage()));
        }
        // send notification
        TaskManager.me().execute(() -> NotificationManager.me().playerNotify(NotificationTemplateId.ACTIVITY_INTEGRAL_INCOME_NOTIFY,
                Collections.singletonList(userId), 0L, null, Dict.create().set(COUNT, info.getCount()).set(ACTIVITY_NAME, info.getActivityName())));
    }

    /**
     * calculate integral by alter type.
     *
     * @param alterType          alterType（INCOME、EXPENSES）
     * @param oldIntegralValue   oldIntegralValue
     * @param alterIntegralValue alterIntegralValue
     * @return the calculated integral value
     */
    private Integer determineIntegralValue(IntegralAlterType alterType, Integer oldIntegralValue, Integer alterIntegralValue) {
        if (alterType == IntegralAlterType.INCOME) {
            // type income，increase the integral
            return oldIntegralValue + alterIntegralValue;
        }
        if (alterType == IntegralAlterType.EXPENSES) {
            // type expense，deducting the integral
            int integral = oldIntegralValue - alterIntegralValue;
            if (integral < 0) {
                throw new BusinessException("Not enough integral.");
            }
            return integral;
        }
        throw new IllegalArgumentException("Unknown Integral Alter Type, Please Check Your Code....");
    }
}
