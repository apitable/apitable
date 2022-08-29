package com.vikadata.api.modular.player.service.impl;

import java.util.Collections;
import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;

import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.integral.enums.IntegralAlterType;
import com.vikadata.api.modular.integral.mapper.IntegralHistoryMapper;
import com.vikadata.api.modular.integral.service.IIntegralService;
import com.vikadata.api.modular.player.mapper.PlayerActivityMapper;
import com.vikadata.api.modular.player.service.IPlayerActivityService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.SqlTool;
import com.vikadata.entity.PlayerActivityEntity;
import com.vikadata.system.config.SystemConfigManager;
import com.vikadata.system.config.wizard.Wizard;

import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.enums.exception.DatabaseException.EDIT_ERROR;
import static com.vikadata.api.enums.exception.DatabaseException.INSERT_ERROR;
import static com.vikadata.api.enums.exception.ParameterException.NO_ARG;
import static com.vikadata.define.constants.RedisConstants.GENERAL_LOCKED;

/**
 * <p>
 * Player - Activity 服务实现类
 * </p>
 *
 * @author Chambers
 * @date 2020/6/8
 */
@Slf4j
@Service
public class PlayerActivityServiceImpl implements IPlayerActivityService {

    @Resource
    private PlayerActivityMapper playerActivityMapper;

    @Resource
    private IIntegralService iIntegralService;

    @Resource
    private IntegralHistoryMapper integralHistoryMapper;

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void changeStatus(Long userId, Integer wizardId) {
        log.info("修改状态值");
        ExceptionUtil.isNotNull(wizardId, NO_ARG);
        boolean exist = SqlTool.retCount(playerActivityMapper.countByUserId(userId)) > 0;
        if (exist) {
            // 由于是数字原因，若直接当成key，数据库会以为是在查询下标志
            String key = StrUtil.format("\"{}\"", wizardId);
            boolean flag;
            Object val = playerActivityMapper.selectActionsVal(userId, key);
            if (val == null) {
                // 状态不在动作集合体中，做插入操作
                flag = SqlHelper.retBool(playerActivityMapper.updateActionsByJsonSet(Collections.singletonList(userId), key, 1));
            }
            else {
                // 已在动作集合体中，累加数量
                flag = SqlHelper.retBool(playerActivityMapper.updateActionsReplaceByUserId(userId, key, Integer.parseInt(val.toString()) + 1));
            }
            ExceptionUtil.isTrue(flag, EDIT_ERROR);
        }
        else {
            // 新增数据
            JSONObject actions = new JSONObject();
            actions.putOnce(wizardId.toString(), 1);
            PlayerActivityEntity entity = PlayerActivityEntity.builder().userId(userId).actions(actions.toString()).build();
            boolean flag = SqlHelper.retBool(playerActivityMapper.insert(entity));
            ExceptionUtil.isTrue(flag, INSERT_ERROR);
        }
        // 判断是否触发新手引导奖励
        Wizard wizard = SystemConfigManager.getConfig().getGuide().getWizard().get(wizardId.toString());
        if (wizard == null || wizard.getIntegralAction() == null) {
            return;
        }
        // 避免并发请求造成多次奖励
        String lockKey = StrUtil.format(GENERAL_LOCKED, "user:wizard:award", StrUtil.format("{}-{}", userId, wizardId));
        BoundValueOperations<String, Object> ops = redisTemplate.boundValueOps(lockKey);
        Boolean result = ops.setIfAbsent("", 10, TimeUnit.SECONDS);
        if (BooleanUtil.isFalse(result)) {
            return;
        }
        // 仅第一次触发后发送奖励
        String key = "wizardId";
        int count = SqlTool.retCount(integralHistoryMapper.selectCountByUserIdAndKeyValue(userId, key, wizardId));
        if (count > 0) {
            return;
        }
        iIntegralService.trigger(wizard.getIntegralAction(), IntegralAlterType.INCOME, userId,
                JSONUtil.createObj().putOnce(key, wizardId));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void createUserActivityRecord(Long userId) {
        log.info("创建用户活动记录，userId:{}", userId);
        PlayerActivityEntity entity = PlayerActivityEntity.builder().userId(userId).actions(new JSONObject().toString()).build();
        boolean flag = SqlHelper.retBool(playerActivityMapper.insert(entity));
        ExceptionUtil.isTrue(flag, INSERT_ERROR);
    }
}
