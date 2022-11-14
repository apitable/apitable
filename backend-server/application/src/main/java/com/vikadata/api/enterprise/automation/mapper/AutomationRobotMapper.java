package com.vikadata.api.enterprise.automation.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.enterprise.automation.model.AutomationRobotDto;
import com.vikadata.entity.AutomationRobotEntity;


public interface AutomationRobotMapper extends BaseMapper<AutomationRobotEntity> {

    List<AutomationRobotDto> getRobotsByResourceId(@Param("resourceId") String resourceId);

    void updateRobotById(@Param("robotId") String robotId, @Param("name") String name, @Param("description") String description, @Param("resourceId") String resourceId);

    void deleteByRobotId(@Param("robotIds") List<String> robotIds);
}
