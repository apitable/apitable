package com.vikadata.api.modular.automation.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.vikadata.entity.AutomationActionTypeEntity;

import java.util.List;

public interface AutomationActionTypeMapper extends BaseMapper<AutomationActionTypeEntity> {

    /**
     * get action type by endpoint.
     * @param endpoint  invocation interface
     * @return action type
     */
    String getActionTypeIdByEndpoint(String endpoint);

}
