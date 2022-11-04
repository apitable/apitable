package com.vikadata.api.modular.automation.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.AutomationTriggerTypeEntity;

public interface AutomationTriggerTypeMapper extends BaseMapper<AutomationTriggerTypeEntity> {

    Long selectIdByTriggerTypeId(@Param("triggerTypeId") String triggerTypeId);

    String getTriggerTypeByEndpoint(String endpoint);
}
