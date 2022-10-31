package com.vikadata.api.modular.automation.service;

import cn.hutool.json.JSONObject;
import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.modular.automation.model.AutomationTriggerDto;
import com.vikadata.entity.AutomationTriggerEntity;

import java.util.List;

public interface IAutomationTriggerService extends IService<AutomationTriggerEntity> {


    List<AutomationTriggerDto> getTriggersBySeqId(String seqId, String resourceId);

    /**
     *  Update trigger by trigger id.
     * @param trigger trigger
     */
    void updateTriggerById(AutomationTriggerEntity trigger);

    JSONObject transformInput(JSONObject input);
}
