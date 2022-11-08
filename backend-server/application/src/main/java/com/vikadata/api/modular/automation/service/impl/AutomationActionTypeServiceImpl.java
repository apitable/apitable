package com.vikadata.api.modular.automation.service.impl;

import java.util.Optional;

import javax.annotation.Resource;

import cn.hutool.core.bean.BeanUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.modular.automation.mapper.AutomationActionTypeMapper;
import com.vikadata.api.modular.automation.model.ActionTypeCreateRO;
import com.vikadata.api.modular.automation.model.ActionTypeEditRO;
import com.vikadata.api.modular.automation.service.IAutomationActionTypeService;
import com.vikadata.api.modular.automation.service.IAutomationService;
import com.vikadata.api.util.IdUtil;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.AutomationActionTypeEntity;

import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AutomationActionTypeServiceImpl implements IAutomationActionTypeService {

    @Resource
    private IAutomationService iAutomationService;

    @Resource
    private AutomationActionTypeMapper actionTypeMapper;

    @Override
    public String getActionTypeIdByEndpoint(String endpoint) {
        return actionTypeMapper.getActionTypeIdByEndpoint(endpoint);
    }

    @Override
    public String create(Long userId, ActionTypeCreateRO ro) {
        iAutomationService.checkServiceIfExist(ro.getServiceId());
        String actionTypeId = IdUtil.createAutomationActionTypeId();
        AutomationActionTypeEntity entity = BeanUtil.copyProperties(ro, AutomationActionTypeEntity.class);
        entity.setId(IdWorker.getId());
        entity.setActionTypeId(actionTypeId);
        entity.setCreatedBy(userId);
        entity.setUpdatedBy(userId);
        boolean flag = SqlHelper.retBool(actionTypeMapper.insert(entity));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        return actionTypeId;
    }

    @Override
    public void edit(Long userId, String actionTypeId, ActionTypeEditRO ro) {
        Long id = this.getIdByActionTypeId(actionTypeId);
        AutomationActionTypeEntity entity = BeanUtil.copyProperties(ro, AutomationActionTypeEntity.class);
        entity.setId(id);
        entity.setUpdatedBy(userId);
        boolean flag = SqlHelper.retBool(actionTypeMapper.updateById(entity));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
    }

    @Override
    public void delete(Long userId, String actionTypeId) {
        Long id = this.getIdByActionTypeId(actionTypeId);
        boolean flag = SqlHelper.retBool(actionTypeMapper.deleteById(id));
        ExceptionUtil.isTrue(flag, DatabaseException.DELETE_ERROR);
    }

    private Long getIdByActionTypeId(String actionTypeId) {
        Long id = actionTypeMapper.selectIdByActionTypeId(actionTypeId);
        return Optional.ofNullable(id).orElseThrow(() -> new BusinessException("Action Type not exist."));
    }

}
