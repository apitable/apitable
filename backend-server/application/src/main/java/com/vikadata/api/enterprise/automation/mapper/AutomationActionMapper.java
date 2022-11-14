package com.vikadata.api.enterprise.automation.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.AutomationActionEntity;

public interface AutomationActionMapper extends BaseMapper<AutomationActionEntity> {

    int updateActionTypeIdAndInputByRobotId(@Param("updatedActionTypeId") String updatedActionTypeId, @Param("updatedInput") String updatedInput, @Param("robotId") String robotId);

}
