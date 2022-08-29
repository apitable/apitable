package com.vikadata.api.modular.social.mapper;

import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.modular.social.model.TenantDepartmentBindDTO;
import com.vikadata.entity.SocialTenantDepartmentEntity;

/**
 * 第三方平台集成-租户部门 Mapper
 *
 * @author Shawn Deng
 * @date 2020-12-09 14:58:06
 */
public interface SocialTenantDepartmentMapper extends BaseMapper<SocialTenantDepartmentEntity> {

    /**
     * 快速批量插入
     *
     * @param entities 成员列表
     * @return 执行结果数
     * @author Shawn Deng
     * @date 2019/12/17 20:34
     */
    int insertBatch(@Param("entities") List<SocialTenantDepartmentEntity> entities);

    /**
     * 根据租户的部门ID查询行ID
     *
     * @param tenantId 租户ID
     * @param departmentId 租户的部门ID
     * @return ID
     * @author Shawn Deng
     * @date 2020/12/18 16:21
     */
    Long selectIdByDepartmentId(@Param("spaceId") String spaceId, @Param("tenantId") String tenantId, @Param("departmentId") String departmentId);

    /**
     * 根据租户的部门ID查询
     *
     * @param tenantId 租户ID
     * @param departmentId 租户的部门ID
     * @return SocialTenantDepartmentEntity
     * @author Shawn Deng
     * @date 2020/12/18 16:21
     */
    SocialTenantDepartmentEntity selectByDepartmentId(@Param("spaceId") String spaceId, @Param("tenantId") String tenantId, @Param("departmentId") String departmentId);

    /**
     * 批量查询租户部门
     *
     * @param tenantId 租户ID
     * @param spaceId 空间ID
     * @return department id List
     * @author Shawn Deng
     * @date 2020/12/25 13:01
     */
    List<String> selectDepartmentIdsByTenantId(@Param("tenantId") String tenantId, @Param("spaceId") String spaceId);

    /**
     * 根据租户部门自定义ID删除
     *
     * @param departmentId 租户的部门ID
     * @return 执行结果
     * @author Shawn Deng
     * @date 2020/12/18 15:50
     */
    int deleteByDepartmentId(@Param("spaceId") String spaceId, @Param("tenantId") String tenantId, @Param("departmentId") String departmentId);

    /**
     * 根据租户部门自定义ID批量删除
     *
     * @param departmentIds 租户的部门ID
     * @return 执行结果
     * @author Shawn Deng
     * @date 2020/12/18 15:50
     */
    int deleteBatchByDepartmentId(@Param("spaceId") String spaceId, @Param("tenantId") String tenantId, @Param("departmentIds") Collection<String> departmentIds);

    /**
     * 删除租户的部门记录
     *
     * @param tenantId 租户ID
     * @return 执行结果数
     * @author Shawn Deng
     * @date 2020/12/15 10:16
     */
    int deleteByTenantId(@Param("tenantId") String tenantId, @Param("spaceId") String spaceId);

    /**
     * 根据租户ID和租户部门ID查询部门信息
     *
     * @param spaceId 空间站ID
     * @param tenantId 租户ID
     * @param deptId 企业部门ID
     * @return SocialTenantDepartmentEntity
     * @author zoe zheng
     * @date 2021/5/17 12:00 下午
     */
    SocialTenantDepartmentEntity selectByTenantIdAndDeptId(@Param("spaceId") String spaceId,
            @Param("tenantId") String tenantId, @Param("deptId") String deptId);

    /**
     * 根据租户Id和部门ID删除
     *
     * @param spaceId 空间站ID
     * @param departmentId 租户的部门ID
     * @param tenantId 租户标识
     * @return 执行结果
     * @author Shawn Deng
     * @date 2020/12/18 15:50
     */
    int deleteBySpaceIdAndTenantIdAndDepartmentId(@Param("spaceId") String spaceId, @Param("tenantId") String tenantId,
            @Param("departmentId") String departmentId);

    /**
     * 根据租户ID和空间ID删除部门
     *
     * @param tenantId 租户ID
     * @param spaceId 空间站ID
     * @return 执行结果
     * @author zoe zheng
     * @date 2021/5/17 9:20 下午
     */
    int deleteByTenantIdAndSpaceId(@Param("tenantId") String tenantId, @Param("spaceId") String spaceId);

    /**
     * 根据空间站Id查询第三方组织绑定部门集合
     *
     * @param spaceId 空间站Id
     * @return 第三方组织绑定部门集合
     * @author Pengap
     * @date 2021/9/6 15:45:57
     */
    List<TenantDepartmentBindDTO> selectTenantBindTeamListBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 批量查询租户的部门
     *
     * @param tenantId 租户ID
     * @param spaceId 空间ID
     * @return Entity List
     */
    List<SocialTenantDepartmentEntity> selectByTenantId(@Param("tenantId") String tenantId, @Param("spaceId") String spaceId);
}
