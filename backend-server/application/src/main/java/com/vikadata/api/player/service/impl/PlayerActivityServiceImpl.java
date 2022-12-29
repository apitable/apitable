package com.vikadata.api.player.service.impl;

import java.util.Collections;

import javax.annotation.Resource;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.base.enums.DatabaseException;
import com.vikadata.api.base.enums.ParameterException;
import com.vikadata.api.interfaces.user.facade.UserServiceFacade;
import com.vikadata.api.interfaces.user.model.RewardWizardAction;
import com.vikadata.api.player.entity.PlayerActivityEntity;
import com.vikadata.api.player.mapper.PlayerActivityMapper;
import com.vikadata.api.player.service.IPlayerActivityService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.SqlTool;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * Player Activity Service Implement Class
 * </p>
 */
@Slf4j
@Service
public class PlayerActivityServiceImpl implements IPlayerActivityService {

    @Resource
    private PlayerActivityMapper playerActivityMapper;

    @Resource
    private UserServiceFacade userServiceFacade;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void changeStatus(Long userId, Integer wizardId) {
        log.info("User「{}」 change wizard 「{}」 status.", userId, wizardId);
        ExceptionUtil.isNotNull(wizardId, ParameterException.NO_ARG);
        boolean exist = SqlTool.retCount(playerActivityMapper.countByUserId(userId)) > 0;
        if (exist) {
            // Because it is a digital reason, if it is directly used as a key, the database will think that it is marked under the query
            String key = StrUtil.format("\"{}\"", wizardId);
            boolean flag;
            Object val = playerActivityMapper.selectActionsVal(userId, key);
            if (val == null) {
                // The state is not in the action collection, do the insert operation
                flag = SqlHelper.retBool(playerActivityMapper.updateActionsByJsonSet(Collections.singletonList(userId), key, 1));
            }
            else {
                // Already in the action set, accumulating the quantity
                flag = SqlHelper.retBool(playerActivityMapper.updateActionsReplaceByUserId(userId, key, Integer.parseInt(val.toString()) + 1));
            }
            ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        }
        else {
            // Add data
            JSONObject actions = new JSONObject();
            actions.putOnce(wizardId.toString(), 1);
            PlayerActivityEntity entity = PlayerActivityEntity.builder().userId(userId).actions(actions.toString()).build();
            boolean flag = SqlHelper.retBool(playerActivityMapper.insert(entity));
            ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        }
        userServiceFacade.rewardWizardAction(new RewardWizardAction(userId, wizardId.toString()));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void createUserActivityRecord(Long userId) {
        log.info("Create user 「{}」 activity record.", userId);
        PlayerActivityEntity entity = PlayerActivityEntity.builder().userId(userId).actions(new JSONObject().toString()).build();
        boolean flag = SqlHelper.retBool(playerActivityMapper.insert(entity));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
    }
}
