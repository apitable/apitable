package com.vikadata.api.modular.automation.service.impl;

import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import com.vikadata.api.modular.automation.mapper.AutomationTriggerMapper;
import com.vikadata.api.modular.automation.model.AutomationTriggerDto;
import com.vikadata.api.modular.automation.service.IAutomationTriggerService;
import com.vikadata.entity.AutomationTriggerEntity;

import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class AutomationTriggerServiceImpl extends ServiceImpl<AutomationTriggerMapper, AutomationTriggerEntity> implements IAutomationTriggerService {

    @Override
    public List<AutomationTriggerDto> getTriggersBySeqId(String seqId, String resourceId) {
        return baseMapper.getTriggersBySeqId(seqId, resourceId);
    }

    @Override
    public void updateTriggerById(AutomationTriggerEntity trigger) {
        baseMapper.updateInput(trigger.getTriggerId(),trigger.getTriggerTypeId(),trigger.getInput());
    }

    /**
     * Convert content to the trigger format.
     *
     * @param input input data
     * @return json object
     */
    @Override
    public JSONObject transformInput(JSONObject input) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.putOnce("type", "Expression");
        JSONObject jsonValue = new JSONObject();
        JSONArray operands = new JSONArray();
        input.forEach((k, v) -> {
            operands.put(k);
            operands.put(v);
        });
        jsonValue.putOnce("operands", operands);
        jsonValue.putOnce("operator", "newObject");
        jsonObject.putOnce("value", jsonValue);
        return jsonObject;
    }

}
