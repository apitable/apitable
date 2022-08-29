package com.vikadata.api.modular.social.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.SocialTenantDepartmentBindEntity;

/**
 * @author Shawn Deng
 * @date 2020-12-09 15:00:00
 */
public interface ISocialTenantDepartmentBindService extends IService<SocialTenantDepartmentBindEntity> {

    /**
     * 批量创建
     *
     * @param entities 实体列表
     * @author Shawn Deng
     * @date 2020/12/14 14:55
     */
    void createBatch(List<SocialTenantDepartmentBindEntity> entities);

    /**
     * 获取绑定部门列表
     * @param tenantKey 租户
     * @param spaceId 空间
     * @return SocialTenantDepartmentBindEntity List
     */
    List<SocialTenantDepartmentBindEntity> getBindDepartmentList(String tenantKey, String spaceId);

    /**
     * 查询租户绑定所有部门
     *
     * @param tenantId 租户标识
     * @param spaceId 空间标识
     * @return SocialTenantDepartmentBindEntity List
     * @author Shawn Deng
     * @date 2020/12/28 12:10
     */
    List<SocialTenantDepartmentBindEntity> getBindListByTenantId(String tenantId, String spaceId);

    /**
     * 获取租户部门ID绑定的空间站小组ID
     * @param tenantId 租户标识
     * @param tenantDepartmentId 租户企业的部门ID
     * @return 空间站小组ID
     * @author Shawn Deng
     * @date 2020/12/18 15:15
     */
    Long getBindSpaceTeamId(String spaceId, String tenantId, String tenantDepartmentId);

    /**
     * 获取租户部门ID绑定的空间站小组ID
     *
     * @param tenantId 企业标识
     * @param tenantDepartmentId 租户企业的部门ID
     * @return teamId
     * @author zoe zheng
     * @date 2021/5/17 11:31 上午
     */
    Long getBindSpaceTeamIdBySpaceId(String spaceId, String tenantId, String tenantDepartmentId);

    /**
     * 获取租户部门ID绑定的空间站小组ID
     * @param tenantId 企业标识
     * @param tenantDepartmentIds 租户企业的部门ID
     * @return 空间站小组ID
     * @author Shawn Deng
     * @date 2020/12/18 15:15
     */
    List<Long> getBindSpaceTeamIds(String spaceId, String tenantId, List<String> tenantDepartmentIds);

    /**
     * 删除租户部门的绑定
     * @param tenantId 租户标识
     * @param tenantDepartmentId 租户企业的部门ID
     * @author Shawn Deng
     * @date 2020/12/18 15:53
     */
    void deleteByTenantDepartmentId(String spaceId, String tenantId, String tenantDepartmentId);

    /**
     * 批量删除租户部门的绑定
     *
     * @param tenantId 租户标识
     * @param tenantDepartmentIds 租户企业的部门ID
     * @author Shawn Deng
     * @date 2020/12/18 15:53
     */
    void deleteBatchByTenantDepartmentId(String spaceId, String tenantId, List<String> tenantDepartmentIds);

    /**
     * 删除租户的部门绑定信息
     *
     * @param tenantId 租户标识
     * @author Shawn Deng
     * @date 2020/12/15 10:26
     */
    void deleteByTenantId(String spaceId, String tenantId);

    /**
     * 根据企业ID和企业部门ID删除记录
     *
     * @param spaceId 空间站ID
     * @param tenantId 租户企业标识
     * @param departmentId 租户企业部门标识
     * @author zoe zheng
     * @date 2021/5/17 12:19 下午
     */
    void deleteSpaceBindTenantDepartment(String spaceId, String tenantId, String departmentId);

    /**
     * 获取租户部门ID绑定的空间站小组ID
     *
     * @param spaceId 空间ID
     * @param tenantId 租户企业ID
     * @param tenantDepartmentIds 租户企业的部门ID
     * @return 空间站小组ID
     * @author zoe zheng
     * @date 2021/5/17 5:14 下午
     */
    List<Long> getBindSpaceTeamIdsByTenantId(String spaceId, String tenantId, List<String> tenantDepartmentIds);
}
