package com.vikadata.api.enterprise.automation.service.impl;

import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enterprise.automation.mapper.AutomationRobotMapper;
import com.vikadata.api.enterprise.automation.model.AutomationApiTriggerCreateRo;
import com.vikadata.api.enterprise.automation.model.AutomationRobotDto;
import com.vikadata.api.enterprise.automation.model.AutomationTriggerCreateVo;
import com.vikadata.api.enterprise.automation.model.AutomationTriggerDto;
import com.vikadata.api.enterprise.automation.service.IAutomationActionService;
import com.vikadata.api.enterprise.automation.service.IAutomationRobotService;
import com.vikadata.api.enterprise.automation.service.IAutomationTriggerService;
import com.vikadata.api.enterprise.automation.service.IAutomationTriggerTypeService;
import com.vikadata.api.shared.util.IdUtil;
import com.vikadata.core.support.ResponseData;
import com.vikadata.entity.AutomationRobotEntity;
import com.vikadata.entity.AutomationTriggerEntity;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
public class AutomationRobotServiceImpl implements IAutomationRobotService {

    @Resource
    private IAutomationTriggerService iAutomationTriggerService;

    @Resource
    private IAutomationTriggerTypeService iAutomationTriggerTypeService;

    @Resource
    private IAutomationActionService iAutomationActionService;

    @Resource
    private AutomationRobotMapper robotMapper;

    @Override
    public List<AutomationRobotDto> getRobotListByResourceId(String resourceId) {
        return robotMapper.getRobotsByResourceId(resourceId);
    }

    @Override
    public void delete(List<String> robotIds) {
        robotMapper.deleteByRobotId(robotIds);
    }

    @Override
    public void updateByRobotId(AutomationRobotEntity robot) {
        robotMapper.updateRobotById(robot.getRobotId(), robot.getName(), robot.getDescription(), robot.getResourceId());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ResponseData<AutomationTriggerCreateVo> upsert(AutomationApiTriggerCreateRo data, String xServiceToken) {
        AutomationTriggerCreateVo automationTriggerCreateVo = new AutomationTriggerCreateVo();

        // 1、Creating a robot
        String robotId = IdUtil.createAutomationRobotId();
        AutomationRobotEntity robot = AutomationRobotEntity.builder()
                .name(data.getRobot().getName())
                .description(data.getRobot().getDescription())
                .robotId(robotId)
                .resourceId(data.getRobot().getResourceId())
                .seqId(data.getSeqId())
                .xServiceToken(xServiceToken)
                .isActive(1)
                .build();
        String[] typeNameId = StrUtil.split(data.getTrigger().getTypeName(), "@");
        String triggerTypeId = iAutomationTriggerTypeService.getTriggerTypeByEndpoint(typeNameId[0]);
        AutomationTriggerEntity trigger = AutomationTriggerEntity.builder()
                .robotId(robotId)
                .triggerTypeId(triggerTypeId)
                .input(this.transformInput(data.getTrigger().getInput()))
                .build();
        try {
            robotMapper.insert(robot);
        }
        catch (Exception e) {
            // When an insert is performed, adjust to update form.
            List<AutomationTriggerDto> automationTriggerDtoList = iAutomationTriggerService.getTriggersBySeqId(data.getSeqId(), data.getRobot().getResourceId());
            if (automationTriggerDtoList.size() > 0) {
                // Update existing robots.
                automationTriggerDtoList.forEach(i -> {
                    automationTriggerCreateVo.setTriggerId(i.getTriggerId());
                    automationTriggerCreateVo.setRobotId(i.getRobotId());
                });
                robot.setRobotId(automationTriggerCreateVo.getRobotId());
                this.updateByRobotId(robot);
                trigger.setRobotId(automationTriggerCreateVo.getRobotId());
                trigger.setTriggerId(automationTriggerCreateVo.getTriggerId());
                iAutomationTriggerService.updateTriggerById(trigger);
                iAutomationActionService.updateRequestAction(automationTriggerCreateVo.getRobotId(), automationTriggerCreateVo.getTriggerId(), "POST", "Content-Type: application/json", data.getWebhookUrl());
                return ResponseData.success(automationTriggerCreateVo);
            }
            log.info("create robot fail , err:{}", e.getMessage());
            return ResponseData.status(false, 602, "Do not repeat the creation.").data(automationTriggerCreateVo);
        }

        // 2、Creating a trigger
        String triggerId = IdUtil.createAutomationTriggerId();
        trigger.setTriggerId(triggerId);
        iAutomationTriggerService.create(trigger);

        // 3、Create an action to perform the action
        iAutomationActionService.createRequestAction(robotId, triggerId, "POST", "Content-Type: application/json", data.getWebhookUrl());
        automationTriggerCreateVo.setRobotId(robotId);
        automationTriggerCreateVo.setTriggerId(triggerId);
        return ResponseData.success(automationTriggerCreateVo);
    }

    /**
     * Convert content to the trigger format.
     *
     * @param input input data
     * @return json object
     */
    private String transformInput(JSONObject input) {
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
        return StrUtil.toString(jsonObject);
    }

}
