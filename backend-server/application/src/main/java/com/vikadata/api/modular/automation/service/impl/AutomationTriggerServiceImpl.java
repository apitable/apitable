package com.vikadata.api.modular.automation.service.impl;

import java.util.List;

import javax.annotation.Resource;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.automation.mapper.AutomationTriggerMapper;
import com.vikadata.api.modular.automation.model.AutomationTriggerDto;
import com.vikadata.api.modular.automation.service.IAutomationTriggerService;
import com.vikadata.entity.AutomationTriggerEntity;

import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AutomationTriggerServiceImpl implements IAutomationTriggerService {

    @Resource
    private AutomationTriggerMapper triggerMapper;

    @Override
    public List<AutomationTriggerDto> getTriggersBySeqId(String seqId, String resourceId) {
        return triggerMapper.getTriggersBySeqId(seqId, resourceId);
    }

    @Override
    public void create(AutomationTriggerEntity entity) {
        triggerMapper.insert(entity);
    }

    @Override
    public void updateTriggerById(AutomationTriggerEntity trigger) {
        triggerMapper.updateInput(trigger.getTriggerId(), trigger.getTriggerTypeId(), trigger.getInput());
    }

}
