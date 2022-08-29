package com.vikadata.api.modular.automation.service;

import cn.hutool.json.JSONObject;
import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.modular.automation.model.AutomationTriggerDto;
import com.vikadata.entity.AutomationTriggerEntity;

import java.util.List;

public interface IAutomationTriggerService extends IService<AutomationTriggerEntity> {


    List<AutomationTriggerDto> getTriggersBySeqId(String seqId, String resourceId);

    /**
     *  通过triggerId 更新trigger
     * @param trigger
     */
    void updateTriggerById(AutomationTriggerEntity trigger);

    JSONObject transformInput(JSONObject input);
}
