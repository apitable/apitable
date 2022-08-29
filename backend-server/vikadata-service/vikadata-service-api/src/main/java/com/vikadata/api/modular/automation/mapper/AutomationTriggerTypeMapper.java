package com.vikadata.api.modular.automation.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import com.vikadata.entity.AutomationTriggerTypeEntity;


/**
 * <p>
 * Automation 机器人 Mapper 接口
 * </p>
 */
public interface AutomationTriggerTypeMapper extends BaseMapper<AutomationTriggerTypeEntity> {

    public String getTriggerTypeByEndpoint(String endpoint);
}
