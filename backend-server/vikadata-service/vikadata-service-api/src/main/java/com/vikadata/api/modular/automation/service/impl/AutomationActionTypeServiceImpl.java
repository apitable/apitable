package com.vikadata.api.modular.automation.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.vikadata.api.modular.automation.mapper.AutomationActionTypeMapper;
import com.vikadata.api.modular.automation.service.IAutomationActionTypeService;
import com.vikadata.entity.AutomationActionTypeEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AutomationActionTypeServiceImpl extends ServiceImpl<AutomationActionTypeMapper, AutomationActionTypeEntity> implements IAutomationActionTypeService {

    @Override
    public String getActionTypeIdByEndpoint(String endpoint) {
        return baseMapper.getActionTypeIdByEndpoint(endpoint);
    }

}
