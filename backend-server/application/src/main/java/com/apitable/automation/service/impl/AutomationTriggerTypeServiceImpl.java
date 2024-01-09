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

import com.apitable.automation.entity.AutomationTriggerTypeEntity;
import com.apitable.automation.mapper.AutomationTriggerTypeMapper;
import com.apitable.automation.service.IAutomationTriggerTypeService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * AutomationTriggerTypeServiceImpl.
 */
@Slf4j
@Service
public class AutomationTriggerTypeServiceImpl
    extends ServiceImpl<AutomationTriggerTypeMapper, AutomationTriggerTypeEntity>
    implements IAutomationTriggerTypeService {

    @Resource
    private AutomationTriggerTypeMapper triggerTypeMapper;

    @Override
    public String getTriggerTypeByEndpoint(String endpoint) {
        return triggerTypeMapper.getTriggerTypeByEndpoint(endpoint);
    }
}
