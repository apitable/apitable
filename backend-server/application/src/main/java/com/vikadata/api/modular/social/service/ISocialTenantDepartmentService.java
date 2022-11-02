package com.vikadata.api.modular.social.service;

import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.modular.social.model.TenantDepartmentBindDTO;
import com.vikadata.entity.SocialTenantDepartmentEntity;

/**
 * Third party platform integration - tenant department service interface
 */
public interface ISocialTenantDepartmentService extends IService<SocialTenantDepartmentEntity> {

    /**
     * Get Row ID
     *
     * @param departmentId Tenant Department ID
     * @return Row ID
     */
    Long getIdByDepartmentId(String spaceId, String tenantId, String departmentId);

    /**
     * Acquired according to the customized ID of the tenant department
     *
     * @param departmentId Tenant Department ID
     * @return SocialTenantDepartmentEntity
     */
    SocialTenantDepartmentEntity getByDepartmentId(String spaceId, String tenantId, String departmentId);

    /**
     * Get the tenant's department ID list
     *
     * @param tenantId Tenant ID
     * @param spaceId Space ID
     * @return DepartmentId List
     */
    List<String> getDepartmentIdsByTenantId(String tenantId, String spaceId);

    /**
     * Get the tenant's department list
     *
     * @param tenantId Tenant ID
     * @param spaceId Space ID
     * @return SocialTenantDepartmentEntity List
     */
    List<SocialTenantDepartmentEntity> getByTenantId(String tenantId, String spaceId);

    /**
     * Batch Create Tenant Departments
     *
     * @param entities Entity List
     */
    void createBatch(List<SocialTenantDepartmentEntity> entities);

    /**
     * Delete Tenant Department Record
     *
     * @param tenantId Tenant ID
     * @param departmentId Tenant's department ID
     */
    void deleteTenantDepartment(String spaceId, String tenantId, String departmentId);

    /**
     * Delete Tenant Department Record
     *
     * @param tenantId Tenant ID
     * @param departmentIds Tenant's Department ID Collection
     */
    void deleteBatchByDepartmentId(String spaceId, String tenantId, Collection<String> departmentIds);

    /**
     * Delete tenant's department record
     *
     * @param tenantId Tenant ID
     */
    void deleteByTenantId(String spaceId, String tenantId);

    /**
     *
     * Acquired according to the customized ID of the tenant department
     *
     * @param spaceId Space ID
     * @param tenantId Enterprise ID
     * @param departmentId Tenant Department ID
     * @return SocialTenantDepartmentEntity
     */
    SocialTenantDepartmentEntity getByTenantIdAndDepartmentId(String spaceId, String tenantId, String departmentId);

    /**
     * Delete Tenant Department Record
     *
     * @param spaceId Space ID
     * @param tenantId Tenant Enterprise ID
     * @param departmentId Tenant's department OPENID
     */
    void deleteSpaceTenantDepartment(String spaceId, String tenantId, String departmentId);

    /**
     * Delete binding relationship according to spaceId and Tenant ID
     *
     * @param spaceId Space ID
     * @param tenantId Tenant ID
     */
    void deleteByTenantIdAndSpaceId(String tenantId, String spaceId);

    /**
     * Get the collection of departments bound by the third party organization
     *
     * @param spaceId Space ID
     * @return Third party organization binding department collection
     */
    List<TenantDepartmentBindDTO> getTenantBindTeamListBySpaceId(String spaceId);
}
