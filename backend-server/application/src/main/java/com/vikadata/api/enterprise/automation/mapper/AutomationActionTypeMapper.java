package com.vikadata.api.enterprise.automation.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.AutomationActionTypeEntity;

public interface AutomationActionTypeMapper extends BaseMapper<AutomationActionTypeEntity> {

    /**
     * Get action type by endpoint
     *
     * @param endpoint  invocation interface
     * @return action type
     */
    String getActionTypeIdByEndpoint(@Param("endpoint") String endpoint);

    Long selectIdByActionTypeId(@Param("actionTypeId") String actionTypeId);
}
