package com.vikadata.api.enterprise.automation.service;

public interface IAutomationActionService {

    void createRequestAction(String robotId, String triggerId, String method, String headers, String webhookUrl);

    void updateRequestAction(String robotId, String triggerId, String method, String headers, String webhookUrl);

}
