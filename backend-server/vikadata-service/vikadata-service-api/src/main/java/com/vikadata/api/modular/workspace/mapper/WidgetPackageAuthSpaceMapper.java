package com.vikadata.api.modular.workspace.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.WidgetPackageAuthSpaceEntity;

public interface WidgetPackageAuthSpaceMapper extends BaseMapper<WidgetPackageAuthSpaceEntity> {

    /**
     * @param packageId widget package id
     * @return the space id bound by the widget package id
     */
    String selectSpaceIdByPackageId(@Param("packageId") String packageId);

}
