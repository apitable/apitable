package com.vikadata.api.modular.automation.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.vikadata.api.modular.automation.model.AutomationTriggerDto;
import com.vikadata.entity.AutomationTriggerEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface AutomationTriggerMapper extends BaseMapper<AutomationTriggerEntity> {

    /**
     * update trigger input data(json)
     *
     * @param triggerId trigger id
     * @param input     input data
     */
    void updateInput(@Param("triggerId") String triggerId,@Param("triggerTypeId") String triggerTypeId,@Param("input") String input);

    /**
     * @param resourceId    resource id
     * @return automation trigger
     */
    List<AutomationTriggerDto> getTriggersByResourceId(@Param("resourceId") String resourceId);

    /**
     * @param seqId         seq
     * @param resourceId    resource id
     * @return  automation trigger
     */
    List<AutomationTriggerDto> getTriggersBySeqId(@Param("seqId") String seqId,@Param("resourceId") String resourceId);

    /***
     * Delete trigger by trigger id.
     * @param triggerId trigger id
     */
    void deleteTriggerById(@Param("triggerId")String triggerId);

    /***
     * Delete trigger by robot id.
     * @param robotId   robot id
     */
    void deleteTriggerByRobotId(@Param("robotId")String robotId);

}
