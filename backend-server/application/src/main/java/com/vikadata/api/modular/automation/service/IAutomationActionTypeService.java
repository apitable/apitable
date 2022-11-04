package com.vikadata.api.modular.automation.service;

import com.vikadata.api.modular.automation.model.ActionTypeCreateRO;
import com.vikadata.api.modular.automation.model.ActionTypeEditRO;

public interface IAutomationActionTypeService {

    String getActionTypeIdByEndpoint(String endpoint);

    String create(Long userId, ActionTypeCreateRO ro);

    void edit(Long userId, String actionTypeId, ActionTypeEditRO ro);

    void delete(Long userId, String actionTypeId);
}
