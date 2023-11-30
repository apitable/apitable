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

package com.apitable.automation.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.StrUtil;
import com.apitable.automation.entity.AutomationTriggerTypeEntity;
import com.apitable.automation.mapper.AutomationTriggerTypeMapper;
import com.apitable.automation.model.TriggerTypeCreateRO;
import com.apitable.automation.model.TriggerTypeEditRO;
import com.apitable.automation.service.IAutomationService;
import com.apitable.automation.service.IAutomationTriggerTypeService;
import com.apitable.base.enums.DatabaseException;
import com.apitable.core.exception.BusinessException;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.shared.util.IdUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import java.util.Optional;
import javax.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * AutomationTriggerTypeServiceImpl.
 */
@Slf4j
@Service
public class AutomationTriggerTypeServiceImpl implements IAutomationTriggerTypeService {

    @Resource
    private IAutomationService iAutomationService;

    @Resource
    private AutomationTriggerTypeMapper triggerTypeMapper;

    @Override
    public String getTriggerTypeByEndpoint(String endpoint) {
        return triggerTypeMapper.getTriggerTypeByEndpoint(endpoint);
    }

    @Override
    public String create(Long userId, TriggerTypeCreateRO ro) {
        iAutomationService.checkServiceIfExist(ro.getServiceId());
        String triggerTypeId = StrUtil.isNotBlank(ro.getTriggerTypeId())
            ? ro.getTriggerTypeId() : IdUtil.createAutomationTriggerTypeId();
        AutomationTriggerTypeEntity entity =
            BeanUtil.copyProperties(ro, AutomationTriggerTypeEntity.class);
        entity.setId(IdWorker.getId());
        entity.setTriggerTypeId(triggerTypeId);
        entity.setCreatedBy(userId);
        entity.setUpdatedBy(userId);
        boolean flag = SqlHelper.retBool(triggerTypeMapper.insert(entity));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        return triggerTypeId;
    }

    @Override
    public void edit(Long userId, String triggerTypeId, TriggerTypeEditRO ro) {
        Long id = this.getIdByTriggerTypeId(triggerTypeId);
        AutomationTriggerTypeEntity entity =
            BeanUtil.copyProperties(ro, AutomationTriggerTypeEntity.class);
        entity.setId(id);
        entity.setUpdatedBy(userId);
        boolean flag = SqlHelper.retBool(triggerTypeMapper.updateById(entity));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
    }

    @Override
    public void delete(Long userId, String triggerTypeId) {
        Long id = this.getIdByTriggerTypeId(triggerTypeId);
        boolean flag = SqlHelper.retBool(triggerTypeMapper.deleteById(id));
        ExceptionUtil.isTrue(flag, DatabaseException.DELETE_ERROR);
    }

    private Long getIdByTriggerTypeId(String triggerTypeId) {
        Long id = triggerTypeMapper.selectIdByTriggerTypeId(triggerTypeId);
        return Optional.ofNullable(id)
            .orElseThrow(() -> new BusinessException("Trigger Type not exist."));
    }
}
