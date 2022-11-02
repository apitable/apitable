package com.vikadata.api.modular.automation.service;

import java.util.List;

import com.vikadata.api.modular.automation.model.AutomationTriggerDto;
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
