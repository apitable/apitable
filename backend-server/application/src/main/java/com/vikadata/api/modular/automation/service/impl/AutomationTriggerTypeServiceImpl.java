package com.vikadata.api.modular.automation.service.impl;

import java.util.Optional;

import javax.annotation.Resource;

import cn.hutool.core.bean.BeanUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.modular.automation.mapper.AutomationTriggerTypeMapper;
import com.vikadata.api.modular.automation.model.TriggerTypeCreateRO;
import com.vikadata.api.modular.automation.model.TriggerTypeEditRO;
import com.vikadata.api.modular.automation.service.IAutomationService;
import com.vikadata.api.modular.automation.service.IAutomationTriggerTypeService;
import com.vikadata.api.util.IdUtil;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.AutomationTriggerTypeEntity;

import org.springframework.stereotype.Service;

@Service
@Slf4j
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
        String triggerTypeId = IdUtil.createAutomationTriggerTypeId();
        AutomationTriggerTypeEntity entity = BeanUtil.copyProperties(ro, AutomationTriggerTypeEntity.class);
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
        AutomationTriggerTypeEntity entity = BeanUtil.copyProperties(ro, AutomationTriggerTypeEntity.class);
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
        return Optional.ofNullable(id).orElseThrow(() -> new BusinessException("Trigger Type not exist."));
    }
}
