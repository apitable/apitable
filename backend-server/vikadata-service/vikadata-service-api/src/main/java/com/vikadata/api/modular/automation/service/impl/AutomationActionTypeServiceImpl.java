package com.vikadata.api.modular.automation.service.impl;

import javax.annotation.Resource;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.automation.mapper.AutomationActionTypeMapper;
import com.vikadata.api.modular.automation.service.IAutomationActionTypeService;

import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AutomationActionTypeServiceImpl implements IAutomationActionTypeService {

    @Resource
    private AutomationActionTypeMapper actionTypeMapper;

    @Override
    public String getActionTypeIdByEndpoint(String endpoint) {
        return actionTypeMapper.getActionTypeIdByEndpoint(endpoint);
    }

}
