package com.vikadata.api.enterprise.automation.service;

import java.util.List;

import com.vikadata.api.enterprise.automation.model.AutomationTriggerDto;
import com.vikadata.entity.AutomationTriggerEntity;

public interface IAutomationTriggerService {

    List<AutomationTriggerDto> getTriggersBySeqId(String seqId, String resourceId);

    void create(AutomationTriggerEntity entity);

    /**
     * Update trigger by trigger id
     *
     * @param trigger trigger
     */
    void updateTriggerById(AutomationTriggerEntity trigger);

}
