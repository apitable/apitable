package com.vikadata.api.modular.social.service;

import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.modular.social.model.TenantDepartmentBindDTO;
import com.vikadata.entity.SocialTenantDepartmentEntity;

/**
 * 第三方平台集成-租户部门 服务接口
 *
 * @author Shawn Deng
 * @date 2020-12-09 14:57:01
 */
public interface ISocialTenantDepartmentService extends IService<SocialTenantDepartmentEntity> {

    /**
     * 获取行ID
     *
     * @param departmentId 租户部门ID
     * @return 行ID
     * @author Shawn Deng
     * @date 2020/12/18 16:22
     */
    Long getIdByDepartmentId(String spaceId, String tenantId, String departmentId);

    /**
     * 根据租户部门自定义ID获取
     *
     * @param departmentId 租户部门ID
     * @return SocialTenantDepartmentEntity
     * @author Shawn Deng
     * @date 2020/12/18 16:22
     */
    SocialTenantDepartmentEntity getByDepartmentId(String spaceId, String tenantId, String departmentId);

    /**
     * 获取租户的部门ID列表
     *
     * @param tenantId 租户ID
     * @param spaceId 空间ID
     * @return DepartmentId 列表
     * @author Shawn Deng
     * @date 2020/12/25 13:03
     */
    List<String> getDepartmentIdsByTenantId(String tenantId, String spaceId);

    /**
     * 获取租户的部门列表
     * @param tenantId 租户ID
     * @param spaceId 空间ID
     * @return SocialTenantDepartmentEntity List
     */
    List<SocialTenantDepartmentEntity> getByTenantId(String tenantId, String spaceId);

    /**
     * 批量创建租户部门
     *
     * @param entities 实体列表
     * @author Shawn Deng
     * @date 2020/12/14 14:55
     */
    void createBatch(List<SocialTenantDepartmentEntity> entities);

    /**
     * 删除租户部门记录
     * @param tenantId 租户标识
     * @param departmentId 租户的部门id
     * @author Shawn Deng
     * @date 2020/12/18 15:55
     */
    void deleteTenantDepartment(String spaceId, String tenantId, String departmentId);

    /**
     * 删除租户部门记录
     * @param tenantId 租户标识
     * @param departmentIds 租户的部门ID集合
     * @author Shawn Deng
     * @date 2020/12/18 15:55
     */
    void deleteBatchByDepartmentId(String spaceId, String tenantId, Collection<String> departmentIds);

    /**
     * 删除租户的部门记录
     *
     * @param tenantId 租户标识
     * @author Shawn Deng
     * @date 2020/12/15 10:29
     */
    void deleteByTenantId(String spaceId, String tenantId);

    /**
     *
     * 根据租户部门自定义ID获取
     *
     * @param spaceId 空间id
     * @param tenantId 企业标识
     * @param departmentId 租户部门ID
     * @return SocialTenantDepartmentEntity
     * @author zoe zheng
     * @date 2021/5/17 11:58 上午
     */
    SocialTenantDepartmentEntity getByTenantIdAndDepartmentId(String spaceId, String tenantId, String departmentId);

    /**
     * 删除租户部门记录
     *
     * @param spaceId 空间站ID
     * @param tenantId 租户企业标识
     * @param departmentId 租户的部门OPENID
     * @author zoe zheng
     * @date 2021/5/17 12:15 下午
     */
    void deleteSpaceTenantDepartment(String spaceId, String tenantId, String departmentId);

    /**
     * 根据spaceId和租户ID删除绑定关系
     *
     * @param spaceId 空间站ID
     * @param tenantId 租户ID
     * @author zoe zheng
     * @date 2021/5/17 9:18 下午
     */
    void deleteByTenantIdAndSpaceId(String tenantId, String spaceId);

    /**
     * 获取第三方组织绑定部门集合
     *
     * @param spaceId 空间站Id
     * @return 第三方组织绑定部门集合
     * @author Pengap
     * @date 2021/9/6 15:38:54
     */
    List<TenantDepartmentBindDTO> getTenantBindTeamListBySpaceId(String spaceId);
}
