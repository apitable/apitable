package com.vikadata.api.modular.integral.service.impl;

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

import com.vikadata.api.component.TaskManager;
import com.vikadata.api.component.notification.NotificationManager;
import com.vikadata.api.component.notification.NotificationTemplateId;
import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.enums.exception.BillingException;
import com.vikadata.api.model.vo.integral.IntegralRecordVO;
import com.vikadata.api.modular.integral.enums.IntegralAlterType;
import com.vikadata.api.modular.integral.mapper.IntegralHistoryMapper;
import com.vikadata.api.modular.integral.service.IIntegralService;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.SqlTool;
import com.vikadata.entity.IntegralHistoryEntity;
import com.vikadata.entity.UserEntity;
import com.vikadata.integration.vika.VikaOperations;
import com.vikadata.integration.vika.model.IntegralRewardInfo;
import com.vikadata.system.config.SystemConfigManager;
import com.vikadata.system.config.integral.IntegralRule;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.integration.redis.util.RedisLockRegistry;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.constants.IntegralActionCodeConstants.WALLET_ACTIVITY_REWARD;
import static com.vikadata.api.constants.NotificationConstants.ACTION_NAME;
import static com.vikadata.api.constants.NotificationConstants.ACTIVITY_NAME;
import static com.vikadata.api.constants.NotificationConstants.COUNT;

/**
 * <p>
 * 积分 接口实现类
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/9/16 11:24
 */
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
        log.info("触发积分操作：{}", action);
        log.info("============ 初始化用户积分奖励锁 ============");
        Lock lock = redisLockRegistry.obtain(by.toString());
        try {
            // 获取锁成功返回true，如果获取失败，等待2秒，规定时间内还是没有获得锁，那么就返回false
            log.info("============ 尝试用户积分奖励锁 ============");
            if (lock.tryLock(100, TimeUnit.MILLISECONDS)) {
                try {
                    log.info("============ 锁住用户积分奖励成功 ============");
                    // 查找触发者的原积分值
                    int beforeTotalIntegralValue = getTotalIntegralValueByUserId(by);
                    // 查找积分规则
                    IntegralRule rule = SystemConfigManager.getConfig().getIntegral().getRule().get(action);
                    // 变更积分值
                    int alterIntegralValue = rule.getIntegralValue();
                    // 记录积分值
                    this.createHistory(by, action, alterType, beforeTotalIntegralValue, alterIntegralValue, parameter);
                    if (rule.isNotify()) {
                        TaskManager.me().execute(() -> NotificationManager.me().playerNotify(NotificationTemplateId.INTEGRAL_INCOME_NOTIFY, Collections.singletonList(by),
                                0L, null, Dict.create().set(COUNT, rule.getIntegralValue()).set(ACTION_NAME, rule.getActionName())));
                    }
                }
                catch (Exception e) {
                    log.error("用户奖励积分失败", e);
                    throw e;
                }
                finally {
                    log.info("============ 用户积分解锁 ============");
                    lock.unlock();
                }
            }
            else {
                log.error("用户操作积分太频繁");
                throw new BusinessException(BillingException.ACCOUNT_CREDIT_ALTER_FREQUENTLY);
            }
        }
        catch (InterruptedException e) {
            log.error("用户操作积分太频繁", e);
            // 获取锁被中断
            throw new BusinessException(BillingException.ACCOUNT_CREDIT_ALTER_FREQUENTLY);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void alterIntegral(String actionCode, IntegralAlterType alterType, int alterIntegral, Long by, JSONObject parameter) {
        log.info("变更积分");
        log.info("============ 初始化用户积分锁 ============");
        Lock lock = redisLockRegistry.obtain(by.toString());
        try {
            // 获取锁成功返回true，如果获取失败，等待2秒，规定时间内还是没有获得锁，那么就返回false
            log.info("============ 尝试用户积分锁 ============");
            if (lock.tryLock(100, TimeUnit.MILLISECONDS)) {
                try {
                    log.info("============ 锁住用户积分奖励成功 ============");
                    // 查找触发者的原积分值
                    int beforeTotalIntegralValue = getTotalIntegralValueByUserId(by);
                    // 记录积分值
                    this.createHistory(by, actionCode, alterType, beforeTotalIntegralValue, alterIntegral, parameter);
                }
                catch (Exception e) {
                    log.error("用户「{}」奖励积分失败", by, e);
                    throw e;
                }
                finally {
                    log.info("============ 用户积分解锁 ============");
                    lock.unlock();
                }
            }
            else {
                log.error("用户「{}」操作积分太频繁", by);
                throw new BusinessException(BillingException.ACCOUNT_CREDIT_ALTER_FREQUENTLY);
            }
        }
        catch (InterruptedException e) {
            log.error("用户「{}」操作积分太频繁", by, e);
            // 获取锁被中断
            throw new BusinessException(BillingException.ACCOUNT_CREDIT_ALTER_FREQUENTLY);
        }
    }

    @Override
    public Long createHistory(Long userId, String actionCode, IntegralAlterType alterType, Integer oldIntegralValue, Integer alterIntegralValue, JSONObject parameter) {
        // 创建积分记录，代表计算用户积分
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
        // 收集不同类型的方法目标
        Map<String, IntegralRewardInfo> emailTargetMap = new HashMap<>();
        Map<String, List<IntegralRewardInfo>> areaCodeToInfosMap = new HashMap<>();
        for (IntegralRewardInfo info : rewardInfos) {
            // 邮箱目标对象
            if (Validator.isEmail(info.getTarget())) {
                emailTargetMap.put(info.getTarget(), info);
                continue;
            }
            // 手机号目标对象。若不存在区号，信息不正确
            if (info.getAreaCode() == null) {
                vikaOperations.updateIntegralRewardResult(split[0], split[1], split[2], info.getRecordId(), "填写信息有误", processor);
                continue;
            }
            // 以区号分组
            if (areaCodeToInfosMap.containsKey(info.getAreaCode())) {
                areaCodeToInfosMap.get(info.getAreaCode()).add(info);
            }
            else {
                List<IntegralRewardInfo> targets = new ArrayList<>();
                targets.add(info);
                areaCodeToInfosMap.put(info.getAreaCode(), targets);
            }
        }
        // 积分发放
        if (!emailTargetMap.isEmpty()) {
            List<UserEntity> userEntities = iUserService.getByEmails(emailTargetMap.keySet());
            Map<String, Long> emailToUserIdMap = userEntities.stream().collect(Collectors.toMap(UserEntity::getEmail, UserEntity::getId));
            for (Entry<String, IntegralRewardInfo> entry : emailTargetMap.entrySet()) {
                // 发放奖励
                this.deliver(entry.getValue(), emailToUserIdMap, processor, split);
            }
        }
        for (Entry<String, List<IntegralRewardInfo>> entry : areaCodeToInfosMap.entrySet()) {
            List<String> mobilePhones = entry.getValue().stream().map(IntegralRewardInfo::getTarget).collect(Collectors.toList());
            List<UserEntity> userEntities = iUserService.getByCodeAndMobilePhones(entry.getKey(), mobilePhones);
            Map<String, Long> mobileToUserIdMap = userEntities.stream().collect(Collectors.toMap(UserEntity::getMobilePhone, UserEntity::getId));
            for (IntegralRewardInfo info : entry.getValue()) {
                // 发放奖励
                this.deliver(info, mobileToUserIdMap, processor, split);
            }
        }
    }

    private void deliver(IntegralRewardInfo info, Map<String, Long> targetToUserIdMap, String processor, String[] split) {
        // 邮箱用户不存在
        if (!targetToUserIdMap.containsKey(info.getTarget())) {
            vikaOperations.updateIntegralRewardResult(split[0], split[1], split[2], info.getRecordId(), "未发放，帐号未注册", processor);
            return;
        }
        Long userId = targetToUserIdMap.get(info.getTarget());
        this.alterIntegral(WALLET_ACTIVITY_REWARD, IntegralAlterType.INCOME, info.getCount(), userId, JSONUtil.createObj().set("name", info.getActivityName()));
        try {
            vikaOperations.updateIntegralRewardResult(split[0], split[1], split[2], info.getRecordId(), "已发放", processor);
        }
        catch (Exception e) {
            throw new BusinessException(StrUtil.format("「{}」奖励已发放，回写维格表失败。msg:{}", info.getTarget(), e.getMessage()));
        }
        // 发送通知
        TaskManager.me().execute(() -> NotificationManager.me().playerNotify(NotificationTemplateId.ACTIVITY_INTEGRAL_INCOME_NOTIFY,
                Collections.singletonList(userId), 0L, null, Dict.create().set(COUNT, info.getCount()).set(ACTIVITY_NAME, info.getActivityName())));
    }

    /**
     * 根据变更类型计算积分值
     *
     * @param alterType          变更类型（收入、支出）
     * @param oldIntegralValue   原积分值
     * @param alterIntegralValue 变更积分值
     * @return 计算后的积分值
     */
    private Integer determineIntegralValue(IntegralAlterType alterType, Integer oldIntegralValue, Integer alterIntegralValue) {
        if (alterType == IntegralAlterType.INCOME) {
            // 收入类型，增加积分
            return oldIntegralValue + alterIntegralValue;
        }
        if (alterType == IntegralAlterType.EXPENSES) {
            // 支出类型，扣减积分
            int integral = oldIntegralValue - alterIntegralValue;
            if (integral < 0) {
                throw new BusinessException("Not enough integral.");
            }
            return integral;
        }
        throw new IllegalArgumentException("Unknown Integral Alter Type, Please Check Your Code....");
    }
}
