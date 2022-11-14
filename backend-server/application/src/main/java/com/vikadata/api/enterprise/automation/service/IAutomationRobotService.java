package com.vikadata.api.enterprise.automation.service;

import java.util.List;

import com.vikadata.api.enterprise.automation.model.AutomationApiTriggerCreateRo;
import com.vikadata.api.enterprise.automation.model.AutomationRobotDto;
import com.vikadata.api.enterprise.automation.model.AutomationTriggerCreateVo;
import com.vikadata.core.support.ResponseData;
import com.vikadata.entity.AutomationRobotEntity;

public interface IAutomationRobotService {
    /**
     * Query the automation list under the resource by the resource id.
     *
     * @param resourceId    resource id
     */
    List<AutomationRobotDto> getRobotListByResourceId(String resourceId);

    /**
     * Batch delete robot.
     *
     * @param robotIds  robot ids
     */
    void delete(List<String> robotIds);

    void updateByRobotId(AutomationRobotEntity robot);

    /**
     * Create or update robot info.
     *
     * @param data          trigger info
     * @param xServiceToken service token
     * @return automation trigger
     */
    ResponseData<AutomationTriggerCreateVo> upsert(AutomationApiTriggerCreateRo data, String xServiceToken);

}
