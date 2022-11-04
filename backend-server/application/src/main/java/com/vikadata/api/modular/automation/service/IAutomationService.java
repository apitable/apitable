package com.vikadata.api.modular.automation.service;

import com.vikadata.api.modular.automation.model.AutomationServiceCreateRO;
import com.vikadata.api.modular.automation.model.AutomationServiceEditRO;

public interface IAutomationService {

    void checkServiceIfExist(String serviceId);

    String createService(Long userId, AutomationServiceCreateRO ro);

    void editService(Long userId, String serviceId, AutomationServiceEditRO ro);

    void deleteService(Long userId, String serviceId);
}
