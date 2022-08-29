package com.vikadata.api.modular.automation.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.vikadata.entity.AutomationActionTypeEntity;

public interface IAutomationActionTypeService extends IService<AutomationActionTypeEntity> {

    String getActionTypeIdByEndpoint(String endpoint);
}
