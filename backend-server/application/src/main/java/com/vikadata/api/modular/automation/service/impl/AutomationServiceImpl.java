package com.vikadata.api.modular.automation.service.impl;

import java.util.Optional;

import javax.annotation.Resource;

import cn.hutool.core.bean.BeanUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.modular.automation.mapper.AutomationServiceMapper;
import com.vikadata.api.modular.automation.model.AutomationServiceCreateRO;
import com.vikadata.api.modular.automation.model.AutomationServiceEditRO;
import com.vikadata.api.modular.automation.service.IAutomationService;
import com.vikadata.api.util.IdUtil;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.AutomationServiceEntity;

import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AutomationServiceImpl implements IAutomationService {

    @Resource
    private AutomationServiceMapper serviceMapper;

    @Override
    public void checkServiceIfExist(String serviceId) {
        this.getIdByServiceId(serviceId);
    }

    @Override
    public String createService(Long userId, AutomationServiceCreateRO ro) {
        this.checkServicePlugIfExist(ro.getSlug());
        String serviceId = IdUtil.createAutomationServiceId();
        AutomationServiceEntity entity = BeanUtil.copyProperties(ro, AutomationServiceEntity.class);
        entity.setId(IdWorker.getId());
        entity.setServiceId(serviceId);
        entity.setCreatedBy(userId);
        entity.setUpdatedBy(userId);
        boolean flag = SqlHelper.retBool(serviceMapper.insert(entity));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        return serviceId;
    }

    @Override
    public void editService(Long userId, String serviceId, AutomationServiceEditRO ro) {
        Long id = this.getIdByServiceId(serviceId);
        AutomationServiceEntity entity = BeanUtil.copyProperties(ro, AutomationServiceEntity.class);
        entity.setId(id);
        entity.setUpdatedBy(userId);
        boolean flag = SqlHelper.retBool(serviceMapper.updateById(entity));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
    }

    @Override
    public void deleteService(Long userId, String serviceId) {
        Long id = this.getIdByServiceId(serviceId);
        boolean flag = SqlHelper.retBool(serviceMapper.deleteById(id));
        ExceptionUtil.isTrue(flag, DatabaseException.DELETE_ERROR);
    }

    private Long getIdByServiceId(String serviceId) {
        Long id = serviceMapper.selectIdByServiceId(serviceId);
        return Optional.ofNullable(id).orElseThrow(() -> new BusinessException("Automation Service not exist."));
    }

    private void checkServicePlugIfExist(String slug) {
        Long id = serviceMapper.selectIdBySlugIncludeDeleted(slug);
        if (id != null) {
            throw new BusinessException("Slug have been existed.");
        }
    }

}
