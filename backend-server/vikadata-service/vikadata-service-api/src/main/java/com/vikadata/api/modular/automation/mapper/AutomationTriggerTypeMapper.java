package com.vikadata.api.modular.automation.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import com.vikadata.entity.AutomationTriggerTypeEntity;

public interface AutomationTriggerTypeMapper extends BaseMapper<AutomationTriggerTypeEntity> {

    public String getTriggerTypeByEndpoint(String endpoint);
}
