package com.vikadata.scheduler.bill.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import com.xxl.job.core.context.XxlJobHelper;

import com.vikadata.core.util.SqlTool;
import com.vikadata.entity.IntegralHistoryEntity;
import com.vikadata.entity.PlayerNotificationEntity;
import com.vikadata.scheduler.bill.mapper.PlayerNotificationMapper;
import com.vikadata.scheduler.bill.mapper.UserIntegralMapper;
import com.vikadata.scheduler.bill.model.UserDTO;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 *
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/9/17 19:09
 */
@Service
public class UserIntegralService {

    @Resource
    private UserIntegralMapper userIntegralMapper;

    @Resource
    private PlayerNotificationMapper playerNotificationMapper;

    public void activityIntegral(String params) {
        // 解析参数
        JSONArray jsonArray = JSONUtil.parseArray(params);
        // 遍历参数
        for (JSONObject jsonObject : jsonArray.jsonIter()) {
            XxlJobHelper.log(jsonObject.toString());
            // 活动名称
            String activityName = jsonObject.getStr("activityName");
            if (StrUtil.isBlank(activityName)) {
                XxlJobHelper.log("活动名称未配置");
                continue;
            }
            // 赠送 V 币数量
            Integer count = jsonObject.getInt("count");
            if (count == null || count == 0) {
                XxlJobHelper.log("赠送 V 币数量未配置");
                continue;
            }
            // 目标对象值
            JSONArray targets = jsonObject.getJSONArray("targets");
            if (targets == null || targets.size() == 0) {
                XxlJobHelper.log("目标对象值未配置");
                continue;
            }
            // 目标对象类型
            String type = jsonObject.getStr("type");
            if (StrUtil.isBlank(activityName)) {
                XxlJobHelper.log("目标对象类型未配置");
                continue;
            }
            Map<String, Long> targetToUserIdMap;
            switch (type) {
                case "phone":
                    List<String> phones = CollectionUtil.distinct(targets.toList(String.class));
                    List<UserDTO> userDTOS = userIntegralMapper.selectDTOByMobilePhone(phones);
                    targetToUserIdMap = userDTOS.stream().collect(Collectors.toMap(UserDTO::getMobilePhone, UserDTO::getUserId));
                    break;
                case "email":
                    List<String> emails = CollectionUtil.distinct(targets.toList(String.class));
                    userDTOS = userIntegralMapper.selectDTOByEmail(emails);
                    targetToUserIdMap = userDTOS.stream().collect(Collectors.toMap(UserDTO::getEmail, UserDTO::getUserId));
                    break;
                default:
                    XxlJobHelper.log("目标对象类型有误");
                    continue;
            }

            List<IntegralHistoryEntity> integralHistories = new ArrayList<>();
            String historyParameter = JSONUtil.createObj().set("name", activityName).toString();

            List<PlayerNotificationEntity> notifications = new ArrayList<>();
            String notifyBody = JSONUtil.createObj()
                    .set("extras", JSONUtil.createObj().set("activityName", activityName).set("count", count)).toString();

            for (String target : CollectionUtil.distinct(targets.toList(String.class))) {
                Long userId = targetToUserIdMap.get(target);
                if (userId == null) {
                    XxlJobHelper.log("目标对象值为[" + target + "]的用户不存在");
                    continue;
                }
                int beforeTotalIntegralValue = SqlTool.retCount(userIntegralMapper.selectTotalIntegralValueByUserId(userId));
                IntegralHistoryEntity historyEntity = new IntegralHistoryEntity();
                historyEntity.setId(IdWorker.getId());
                historyEntity.setUserId(userId);
                historyEntity.setActionCode("wallet_activity_reward");
                historyEntity.setAlterType(0);
                historyEntity.setOriginIntegral(beforeTotalIntegralValue);
                historyEntity.setAlterIntegral(count);
                historyEntity.setTotalIntegral(beforeTotalIntegralValue + count);
                historyEntity.setParameter(historyParameter);
                historyEntity.setCreatedBy(userId);
                historyEntity.setUpdatedBy(userId);
                integralHistories.add(historyEntity);

                PlayerNotificationEntity notificationEntity = PlayerNotificationEntity.builder()
                        .id(IdWorker.getId())
                        .fromUser(0L)
                        .toUser(userId)
                        .templateId("activity_integral_income_notify")
                        .notifyBody(notifyBody)
                        .notifyType("system")
                        .build();
                notifications.add(notificationEntity);
            }
            try {
                boolean flag = SqlHelper.retBool(userIntegralMapper.insertBatch(integralHistories));
                if (!flag) {
                    XxlJobHelper.log("「{}」 活动新增积分「{}」 失败！！", activityName, count);
                    continue;
                }
                XxlJobHelper.log("「{}」 活动新增积分「{}」 成功。", activityName, count);
                playerNotificationMapper.insertBatch(notifications);
                XxlJobHelper.log("「{}」 活动通知结束。", activityName);
            }
            catch (Exception e) {
                XxlJobHelper.log("「{}」 活动处理异常。msg: {}", activityName, e.getMessage());
            }
        }
    }

    @Transactional(rollbackFor = Throwable.class)
    public void addIntegral(Long userId, int integral) {
        XxlJobHelper.log("赠送积分");
        int beforeTotalIntegralValue = SqlTool.retCount(userIntegralMapper.selectTotalIntegralValueByUserId(userId));
        this.createHistory(userId, "official_gift", 0, beforeTotalIntegralValue, integral, JSONUtil.createObj());
    }

    @Transactional(rollbackFor = Throwable.class)
    public void reduceIntegral(Long userId, int integral) {
        XxlJobHelper.log("扣减积分");
        int beforeTotalIntegralValue = SqlTool.retCount(userIntegralMapper.selectTotalIntegralValueByUserId(userId));
        this.createHistory(userId, "official_adjustment", 1, beforeTotalIntegralValue, integral, JSONUtil.createObj());
    }

    private void createHistory(Long userId, String actionCode, int alterType, Integer oldIntegralValue, Integer alterIntegralValue, JSONObject parameter) {
        IntegralHistoryEntity historyEntity = new IntegralHistoryEntity();
        historyEntity.setId(IdWorker.getId());
        historyEntity.setUserId(userId);
        historyEntity.setActionCode(actionCode);
        historyEntity.setAlterType(alterType);
        historyEntity.setOriginIntegral(oldIntegralValue);
        historyEntity.setAlterIntegral(alterIntegralValue);
        historyEntity.setTotalIntegral(determineIntegralValue(alterType, oldIntegralValue, alterIntegralValue));
        historyEntity.setParameter(parameter.toString());
        historyEntity.setCreatedBy(userId);
        historyEntity.setUpdatedBy(userId);
        userIntegralMapper.insertHistory(historyEntity);
    }

    private Integer determineIntegralValue(int alterType, Integer oldIntegralValue, Integer alterIntegralValue) {
        if (alterType == 0) {
            // 收入类型，增加
            return oldIntegralValue + alterIntegralValue;
        }
        if (alterType == 1) {
            return oldIntegralValue - alterIntegralValue;
        }
        throw new IllegalArgumentException("Unknown Integral Alter Type, Please Check Your Code....");
    }
}
