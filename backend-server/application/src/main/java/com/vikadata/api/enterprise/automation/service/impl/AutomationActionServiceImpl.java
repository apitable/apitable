package com.vikadata.api.enterprise.automation.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enterprise.automation.mapper.AutomationActionMapper;
import com.vikadata.api.enterprise.automation.service.IAutomationActionService;
import com.vikadata.api.enterprise.automation.service.IAutomationActionTypeService;
import com.vikadata.api.shared.util.IdUtil;
import com.vikadata.entity.AutomationActionEntity;

import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AutomationActionServiceImpl implements IAutomationActionService {

    @Resource
    private IAutomationActionTypeService iAutomationActionTypeService;

    @Resource
    private AutomationActionMapper actionMapper;

    @Override
    public void createRequestAction(String robotId, String triggerId, String method, String headers, String webhookUrl) {
        String actionId = IdUtil.createAutomationActionId();
        String input = this.buildAutomationApiAction(triggerId, method, webhookUrl);

        String actionTypeId = iAutomationActionTypeService.getActionTypeIdByEndpoint("sendRequest");
        AutomationActionEntity action = AutomationActionEntity.builder()
                .actionId(actionId)
                .robotId(robotId)
                .actionTypeId(actionTypeId)
                .input(input)
                .build();
        actionMapper.insert(action);
    }

    @Override
    public void updateRequestAction(String robotId, String triggerId, String method, String headers, String webhookUrl) {
        String input = this.buildAutomationApiAction(triggerId, method, webhookUrl);
        String actionTypeId = iAutomationActionTypeService.getActionTypeIdByEndpoint("sendRequest");
        actionMapper.updateActionTypeIdAndInputByRobotId(actionTypeId, input, robotId);
    }


    /**
     * Create the action request body.
     */
    private String buildAutomationApiAction(String triggerId, String method, String webhookUrl) {
        JSONObject actionObject = new JSONObject();
        actionObject.putOnce("type", "Expression");
        JSONObject valueObject = new JSONObject();
        JSONObject dataObject = new JSONObject();
        dataObject.putAll(new HashMap<String, Object>() {
            {
                put("type", "Expression");
                put("value", new JSONObject() {
                    {
                        putOnce("operator", "JSONStringify")
                                .putOnce("operands", new ArrayList<Object>() {{
                                    add(new HashMap<String, Object>() {{
                                        put("type", "Expression");
                                        put("value", new HashMap<String, Object>() {{
                                            put("operands", new ArrayList<Map<String, Object>>() {
                                                {
                                                    add(new HashMap<String, Object>() {{
                                                        put("type", "Literal");
                                                        put("value", triggerId);
                                                    }});
                                                }
                                            });
                                            put("operator", "getNodeOutput");
                                        }});
                                    }});
                                }});
                    }
                });
            }
        });
        valueObject.putOnce("operator", "newObject");
        valueObject.putOnce("operands", new JSONArray().put("body")
                .put(new JSONObject().
                        putOnce("type", "Expression").
                        putOnce("value", new JSONObject().
                                putOnce("operator", "newObject").
                                putOnce("operands", new JSONArray()
                                        .put("type")
                                        .put(new JSONObject().putOnce("type", "Literal").putOnce("value", "json"))
                                        .put("data")
                                        .put(dataObject)
                                )))
                .put("method")
                .put(new JSONObject().putOnce("type", "Literal").putOnce("value", method))
                .put("url")
                .put(new JSONObject().putOnce("type", "Literal").putOnce("value", webhookUrl))
        );
        actionObject.putOnce("value", valueObject);
        return JSONUtil.toJsonStr(actionObject);
    }

}
