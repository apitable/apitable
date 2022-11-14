package com.vikadata.api.enterprise.social.mapper;

import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.enterprise.social.model.TenantDepartmentBindDTO;
import com.vikadata.entity.SocialTenantDepartmentEntity;

/**
 * Third party platform integration - tenant department mapper
 */
public interface SocialTenantDepartmentMapper extends BaseMapper<SocialTenantDepartmentEntity> {

    /**
     * Quick Bulk Insert
     *
     * @param entities Member List
     * @return Number of execution results
     */
    int insertBatch(@Param("entities") List<SocialTenantDepartmentEntity> entities);

    /**
     * Query row ID according to tenant's department ID
     *
     * @param tenantId Tenant ID
     * @param departmentId Tenant's department ID
     * @return ID
     */
    Long selectIdByDepartmentId(@Param("spaceId") String spaceId, @Param("tenantId") String tenantId, @Param("departmentId") String departmentId);

    /**
     * Query according to the tenant's department ID
     *
     * @param tenantId Tenant ID
     * @param departmentId Tenant's department ID
     * @return SocialTenantDepartmentEntity
     */
    SocialTenantDepartmentEntity selectByDepartmentId(@Param("spaceId") String spaceId, @Param("tenantId") String tenantId, @Param("departmentId") String departmentId);

    /**
     * Batch query of tenant departments
     *
     * @param tenantId Tenant ID
     * @param spaceId Space ID
     * @return department id List
     */
    List<String> selectDepartmentIdsByTenantId(@Param("tenantId") String tenantId, @Param("spaceId") String spaceId);

    /**
     * Delete according to the customized ID of the tenant department
     *
     * @param departmentId Tenant's department ID
     * @return Results of enforcement
     */
    int deleteByDepartmentId(@Param("spaceId") String spaceId, @Param("tenantId") String tenantId, @Param("departmentId") String departmentId);

    /**
     * Batch deletion according to the customized ID of the tenant department
     *
     * @param departmentIds Tenant's department ID
     * @return Results of enforcement
     */
    int deleteBatchByDepartmentId(@Param("spaceId") String spaceId, @Param("tenantId") String tenantId, @Param("departmentIds") Collection<String> departmentIds);

    /**
     * Delete tenant's department record
     *
     * @param tenantId Tenant ID
     * @return Number of execution results
     */
    int deleteByTenantId(@Param("tenantId") String tenantId, @Param("spaceId") String spaceId);

    /**
     * Query department information according to tenant ID and tenant department ID
     *
     * @param spaceId Space ID
     * @param tenantId Tenant ID
     * @param deptId Enterprise department ID
     * @return SocialTenantDepartmentEntity
     */
    SocialTenantDepartmentEntity selectByTenantIdAndDeptId(@Param("spaceId") String spaceId,
            @Param("tenantId") String tenantId, @Param("deptId") String deptId);

    /**
     * Delete according to tenant ID and department ID
     *
     * @param spaceId Space ID
     * @param departmentId Tenant's department ID
     * @param tenantId Tenant ID
     * @return Results of enforcement
     */
    int deleteBySpaceIdAndTenantIdAndDepartmentId(@Param("spaceId") String spaceId, @Param("tenantId") String tenantId,
            @Param("departmentId") String departmentId);

    /**
     * Delete department according to tenant ID and space ID
     *
     * @param tenantId Tenant ID
     * @param spaceId Space station ID
     * @return Results of enforcement
     */
    int deleteByTenantIdAndSpaceId(@Param("tenantId") String tenantId, @Param("spaceId") String spaceId);

    /**
     * Query the collection of departments bound by the third party organization according to the space station ID
     *
     * @param spaceId Space Id
     * @return Third party organization binding department collection
     */
    List<TenantDepartmentBindDTO> selectTenantBindTeamListBySpaceId(@Param("spaceId") String spaceId);

    /**
     * Batch query tenants' departments
     *
     * @param tenantId Tenant ID
     * @param spaceId Space ID
     * @return Entity List
     */
    List<SocialTenantDepartmentEntity> selectByTenantId(@Param("tenantId") String tenantId, @Param("spaceId") String spaceId);
}
