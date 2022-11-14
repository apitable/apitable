package com.vikadata.api.enterprise.automation.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.enterprise.automation.model.AutomationTriggerDto;
import com.vikadata.entity.AutomationTriggerEntity;

public interface AutomationTriggerMapper extends BaseMapper<AutomationTriggerEntity> {

    /**
     * update trigger input data(json)
     *
     * @param triggerId trigger id
     * @param input     input data
     */
    void updateInput(@Param("triggerId") String triggerId, @Param("triggerTypeId") String triggerTypeId, @Param("input") String input);

    /**
     * @param seqId         seq
     * @param resourceId    resource id
     * @return automation trigger
     */
    List<AutomationTriggerDto> getTriggersBySeqId(@Param("seqId") String seqId, @Param("resourceId") String resourceId);

}
