package com.vikadata.api.modular.automation.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.vikadata.entity.AutomationActionEntity;

public interface IAutomationActionService extends IService<AutomationActionEntity> {

    boolean createRequestAction(String robotId,String triggerId,String method,String headers,String webhookUrl);

    boolean updateRequestAction(String robotId,String triggerId,String method,String headers,String webhookUrl);

}
