package com.vikadata.api.modular.automation.service;

import com.vikadata.api.modular.automation.model.TriggerTypeCreateRO;
import com.vikadata.api.modular.automation.model.TriggerTypeEditRO;

public interface IAutomationTriggerTypeService {

    String getTriggerTypeByEndpoint(String endpoint);

    String create(Long userId, TriggerTypeCreateRO ro);

    void edit(Long userId, String triggerTypeId, TriggerTypeEditRO ro);

    void delete(Long userId, String triggerTypeId);
}
