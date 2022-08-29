package com.vikadata.api.modular.automation.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.vikadata.api.modular.automation.model.AutomationRobotDto;
import com.vikadata.entity.AutomationRobotEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;


/**
 * <p>
 * Automation 机器人 Mapper 接口
 * </p>
 */
public interface AutomationRobotMapper extends BaseMapper<AutomationRobotEntity> {

    List<AutomationRobotDto> getRobotsByResourceId(@Param("resourceId") String resourceId);

    void updateRobotById(String robotId,String name,String description,String resourceId);

    void deleteByRobotId(@Param("robotIds") List<String> robotIds);
}
