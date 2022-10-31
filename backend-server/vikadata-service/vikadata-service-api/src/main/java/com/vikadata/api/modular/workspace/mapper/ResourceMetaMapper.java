package com.vikadata.api.modular.workspace.mapper;

import java.util.Collection;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.ResourceMetaEntity;

public interface ResourceMetaMapper {

    /**
     * @param resourceIds resource ids
     * @return metas
     */
    List<ResourceMetaEntity> selectByResourceIds(@Param("list") Collection<String> resourceIds);

    /**
     * @param resourceId resource id
     * @return meta
     */
    String selectMetaDataByResourceId(@Param("resourceId") String resourceId);

    /**
     * @param entities resource metas
     * @return affected rows
     */
    int insertBatch(@Param("entities") Collection<ResourceMetaEntity> entities);

    /**
     * count the number of dashboard widget
     *
     * @param dashboardId
     */
    Integer countDashboardWidgetNumber(@Param("dashboardId") String dashboardId);
}
