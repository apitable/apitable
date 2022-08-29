package com.vikadata.api.modular.automation.service.impl;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.automation.mapper.AutomationTriggerTypeMapper;
import com.vikadata.api.modular.automation.service.IAutomationTriggerTypeService;
import com.vikadata.api.util.IdUtil;
import com.vikadata.entity.AutomationTriggerTypeEntity;

import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AutomationTriggerTypeServiceImpl extends ServiceImpl<AutomationTriggerTypeMapper, AutomationTriggerTypeEntity> implements IAutomationTriggerTypeService {

    @Override
    public String getTriggerTypeByEndpoint(String endpoint) {
        return baseMapper.getTriggerTypeByEndpoint(endpoint);
    }

}
