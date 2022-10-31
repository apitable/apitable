package com.vikadata.api.modular.automation.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.vikadata.entity.AutomationActionEntity;
import org.apache.ibatis.annotations.Param;

public interface AutomationActionMapper extends BaseMapper<AutomationActionEntity> {

    /**
     * Update the data(json) that action input.
     *
     * @param actionId  custom action id
     * @param input     data that action input
     */
    void updateInput(@Param("actionId") String actionId, @Param("input") String input);

}
