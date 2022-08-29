package com.vikadata.api.modular.automation.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.vikadata.api.modular.automation.model.AutomationApiTriggerCreateRo;
import com.vikadata.api.modular.automation.model.AutomationRobotDto;
import com.vikadata.api.modular.automation.model.AutomationRobotVo;
import com.vikadata.api.modular.automation.model.AutomationTriggerCreateVo;
import com.vikadata.core.support.ResponseData;
import com.vikadata.entity.AutomationRobotEntity;

import java.util.List;

public interface IAutomationRobotService extends IService<AutomationRobotEntity> {
    /**
     * 通过资源 ID 查询该资源下的 automation 列表
     *
     * @param resourceId
     */
    List<AutomationRobotDto> getRobotListByResourceId(String resourceId);

    /**
     * 批量删除机器人
     * @param robotIds 机器人ID列表
     */
    void delete(List<String> robotIds);

    void updateByRobotId(AutomationRobotEntity robot);

    /**
     * 创建或更新机器人信息
     * @param data
     * @param xServiceToken
     * @return
     */
    ResponseData<AutomationTriggerCreateVo> upsert(AutomationApiTriggerCreateRo data,String xServiceToken );

}
