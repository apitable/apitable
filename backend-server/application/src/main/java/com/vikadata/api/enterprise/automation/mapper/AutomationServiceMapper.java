package com.vikadata.api.enterprise.automation.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.AutomationServiceEntity;

public interface AutomationServiceMapper extends BaseMapper<AutomationServiceEntity> {

    Long selectIdByServiceId(@Param("serviceId") String serviceId);

    Long selectIdBySlugIncludeDeleted(@Param("slug") String slug);
}
