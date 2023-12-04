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

package com.apitable.player.service.impl;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import com.apitable.base.enums.DatabaseException;
import com.apitable.base.enums.ParameterException;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.SqlTool;
import com.apitable.interfaces.eventbus.facade.EventBusFacade;
import com.apitable.interfaces.eventbus.model.WizardActionEvent;
import com.apitable.player.entity.PlayerActivityEntity;
import com.apitable.player.mapper.PlayerActivityMapper;
import com.apitable.player.service.IPlayerActivityService;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import jakarta.annotation.Resource;
import java.util.Collections;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * Player Activity Service Implement Class.
 * </p>
 */
@Slf4j
@Service
public class PlayerActivityServiceImpl implements IPlayerActivityService {

    @Resource
    private PlayerActivityMapper playerActivityMapper;

    @Resource
    private EventBusFacade eventBusFacade;

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
                flag = SqlHelper.retBool(
                    playerActivityMapper.updateActionsByJsonSet(Collections.singletonList(userId),
                        key, 1));
            } else {
                // Already in the action set, accumulating the quantity
                flag = SqlHelper.retBool(
                    playerActivityMapper.updateActionsReplaceByUserId(userId, key,
                        Integer.parseInt(val.toString()) + 1));
            }
            ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        } else {
            // Add data
            JSONObject actions = new JSONObject();
            actions.putOnce(wizardId.toString(), 1);
            PlayerActivityEntity entity =
                PlayerActivityEntity.builder().userId(userId).actions(actions.toString()).build();
            boolean flag = SqlHelper.retBool(playerActivityMapper.insert(entity));
            ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        }
        eventBusFacade.onEvent(new WizardActionEvent(userId, wizardId.toString()));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void createUserActivityRecord(Long userId) {
        log.info("Create user 「{}」 activity record.", userId);
        PlayerActivityEntity entity =
            PlayerActivityEntity.builder().userId(userId).actions(new JSONObject().toString())
                .build();
        boolean flag = SqlHelper.retBool(playerActivityMapper.insert(entity));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
    }
}
