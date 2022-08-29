package com.vikadata.api.modular.automation.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.vikadata.entity.AutomationActionTypeEntity;

import java.util.List;


/**
 * <p>
 * Automation 机器人 Mapper 接口
 * </p>
 */
public interface AutomationActionTypeMapper extends BaseMapper<AutomationActionTypeEntity> {

    String getActionTypeIdByEndpoint(String endpoint);
}
