package com.vikadata.api.modular.automation.service;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.AutomationTriggerTypeEntity;

public interface IAutomationTriggerTypeService extends IService<AutomationTriggerTypeEntity> {

    String getTriggerTypeByEndpoint(String endpoint);
}
