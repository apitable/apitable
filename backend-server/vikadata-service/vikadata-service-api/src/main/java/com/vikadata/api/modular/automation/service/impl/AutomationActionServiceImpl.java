package com.vikadata.api.modular.automation.service.impl;

import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.vikadata.api.modular.automation.mapper.AutomationActionMapper;
import com.vikadata.api.modular.automation.service.IAutomationActionService;
import com.vikadata.api.modular.automation.service.IAutomationActionTypeService;
import com.vikadata.api.util.IdUtil;
import com.vikadata.entity.AutomationActionEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class AutomationActionServiceImpl extends ServiceImpl<AutomationActionMapper,AutomationActionEntity> implements IAutomationActionService {

    @Resource
    private IAutomationActionTypeService iAutomationActionTypeService;


    @Override
    public boolean createRequestAction(String robotId,String triggerId,String method,String headers, String webhookUrl) {
        String actionId = IdUtil.createAutomationActionId();
        JSONObject actionObject = buildAutomationApiAction(triggerId,method,webhookUrl);

        String actionTypeId = iAutomationActionTypeService.getActionTypeIdByEndpoint("sendRequest");
        AutomationActionEntity action = AutomationActionEntity.builder()
            .actionId(actionId)
            .robotId(robotId)
            .actionTypeId(actionTypeId)
            .input(JSONUtil.toJsonStr(actionObject))
            .build();
        return this.save(action);
    }

    @Override
    public boolean updateRequestAction(String robotId, String triggerId, String method, String headers, String webhookUrl) {
        JSONObject actionObject = buildAutomationApiAction(triggerId,method,webhookUrl);
        String actionTypeId = iAutomationActionTypeService.getActionTypeIdByEndpoint("sendRequest");
        AutomationActionEntity action = AutomationActionEntity.builder()
            .robotId(robotId)
            .actionTypeId(actionTypeId)
            .input(JSONUtil.toJsonStr(actionObject))
            .build();
        UpdateWrapper<AutomationActionEntity> updateWrapper = new UpdateWrapper<>();
        updateWrapper.eq("robot_id",robotId);
        return this.update(action,updateWrapper);
    }


    /**
     * 创建 Action 请求体
     * @return
     */
    private JSONObject buildAutomationApiAction(String triggerId,String method,String webhookUrl){
        JSONObject actionObject = new JSONObject();
        actionObject.putOnce("type","Expression");
        JSONObject valueObject = new JSONObject();
        JSONObject dataObject = new JSONObject();
        dataObject.putAll(new HashMap<String,Object>(){
            {
                put("type","Expression");
                put("value",new JSONObject(){
                    {
                        putOnce("operator","JSONStringify")
                        .putOnce("operands",new ArrayList<Object>(){{
                              add(new HashMap<String,Object>(){{
                                    put("type","Expression");
                                    put("value",new HashMap<String,Object>(){{
                                        put("operands",new ArrayList<Map<String,Object>>(){
                                            {
                                                add(new HashMap<String, Object>(){{
                                                    put("type", "Literal");
                                                    put("value", triggerId);
                                                }});
                                            }});
                                        put("operator","getNodeOutput");
                              }});
                         }});
                    }});
                }});
            }});
        valueObject.putOnce("operator","newObject");
        valueObject.putOnce("operands",new JSONArray().put("body")
            .put(new JSONObject().
                putOnce("type","Expression").
                putOnce("value",new JSONObject().
                    putOnce("operator","newObject").
                    putOnce("operands",new JSONArray()
                        .put("type")
                        .put(new JSONObject().putOnce("type","Literal").putOnce("value","json"))
                        .put("data")
                        .put(dataObject)
                    )))
            .put("method")
            .put(new JSONObject().putOnce("type","Literal").putOnce("value",method))
            .put("url")
            .put(new JSONObject().putOnce("type","Literal").putOnce("value",webhookUrl))
        );
        actionObject.putOnce("value",valueObject);
        return actionObject;
    }

}
