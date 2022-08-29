package com.vikadata.api.modular.workspace.mapper;

import java.util.Collection;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.ResourceMetaEntity;

/**
 * <p>
 * 工作台-资源元数据表 Mapper 接口
 * </p>
 *
 * @author Chambers
 * @date 2020/12/18
 */
public interface ResourceMetaMapper {

    /**
     * 查询实体列表
     *
     * @param resourceIds 资源 ID 列表
     * @return entities
     * @author Chambers
     * @date 2020/12/18
     */
    List<ResourceMetaEntity> selectByResourceIds(@Param("list") Collection<String> resourceIds);

    /**
     * 查询元数据
     *
     * @param resourceId 资源ID
     * @return meta
     * @author Chambers
     * @date 2021/1/27
     */
    String selectMetaDataByResourceId(@Param("resourceId") String resourceId);

    /**
     * 批量新增资源元数据
     *
     * @param entities 实体列表
     * @return 执行结果数
     * @author Chambers
     * @date 2020/12/18
     */
    int insertBatch(@Param("entities") Collection<ResourceMetaEntity> entities);
}
