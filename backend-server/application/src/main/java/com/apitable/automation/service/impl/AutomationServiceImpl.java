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
import com.apitable.automation.entity.AutomationServiceEntity;
import com.apitable.automation.mapper.AutomationServiceMapper;
import com.apitable.automation.model.AutomationServiceCreateRO;
import com.apitable.automation.model.AutomationServiceEditRO;
import com.apitable.automation.service.IAutomationService;
import com.apitable.base.enums.DatabaseException;
import com.apitable.core.exception.BusinessException;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.shared.util.IdUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import jakarta.annotation.Resource;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * AutomationServiceImpl.
 */
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
        String serviceId = StrUtil.isNotBlank(ro.getServiceId())
            ? ro.getServiceId() : IdUtil.createAutomationServiceId();
        AutomationServiceEntity entity =
            BeanUtil.copyProperties(ro, AutomationServiceEntity.class);
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
        AutomationServiceEntity entity =
            BeanUtil.copyProperties(ro, AutomationServiceEntity.class);
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
        return Optional.ofNullable(id)
            .orElseThrow(() -> new BusinessException("Automation Service not exist."));
    }

    private void checkServicePlugIfExist(String slug) {
        Long id = serviceMapper.selectIdBySlugIncludeDeleted(slug);
        if (id != null) {
            throw new BusinessException("Slug have been existed.");
        }
    }

}
