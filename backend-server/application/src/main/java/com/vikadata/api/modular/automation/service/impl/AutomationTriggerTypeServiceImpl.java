package com.vikadata.api.modular.automation.service.impl;

import javax.annotation.Resource;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.automation.mapper.AutomationTriggerTypeMapper;
import com.vikadata.api.modular.automation.service.IAutomationTriggerTypeService;

import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AutomationTriggerTypeServiceImpl implements IAutomationTriggerTypeService {

    @Resource
    private AutomationTriggerTypeMapper triggerTypeMapper;

    @Override
    public String getTriggerTypeByEndpoint(String endpoint) {
        return triggerTypeMapper.getTriggerTypeByEndpoint(endpoint);
    }

}
