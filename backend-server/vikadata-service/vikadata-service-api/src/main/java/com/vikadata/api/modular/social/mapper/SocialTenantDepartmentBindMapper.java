package com.vikadata.api.modular.social.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.SocialTenantDepartmentBindEntity;

/**
 * 第三方平台集成-企业租户部门关联表 Mapper
 *
 * @author Shawn Deng
 * @date 2020-12-09 14:59:03
 */
public interface SocialTenantDepartmentBindMapper extends BaseMapper<SocialTenantDepartmentBindEntity> {

    /**
     * 快速批量插入
     *
     * @param entities 成员列表
     * @return 执行结果数
     * @author Shawn Deng
     * @date 2019/12/17 20:34
     */
    int insertBatch(@Param("entities") List<SocialTenantDepartmentBindEntity> entities);

    /**
     * 查询租户部门ID绑定的空间站小组ID
     *
     * @param tenantId 租户标识
     * @param tenantDepartmentId 租户的部门ID
     * @return 空间站部门ID
     * @author Shawn Deng
     * @date 2020/12/18 15:05
     */
    Long selectTeamIdByTenantDepartmentId(@Param("spaceId") String spaceId, @Param("tenantId") String tenantId, @Param("tenantDepartmentId") String tenantDepartmentId);

    /**
     * 查询租户部门ID绑定的空间站小组ID
     *
     * @param tenantId 租户标识
     * @param tenantDepartmentIds 租户的部门ID
     * @return 空间站部门ID
     * @author Shawn Deng
     * @date 2020/12/18 15:05
     */
    List<Long> selectTeamIdsByTenantDepartmentId(@Param("spaceId") String spaceId, @Param("tenantId") String tenantId, @Param("tenantDepartmentIds") List<String> tenantDepartmentIds);

    /**
     * 查询租户绑定的部门列表
     *
     * @param tenantId 租户标识
     * @return SocialTenantDepartmentBindEntity List
     * @author Shawn Deng
     * @date 2020/12/28 12:09
     */
    List<SocialTenantDepartmentBindEntity> selectByTenantId(@Param("tenantId") String tenantId, @Param("spaceId") String spaceId);

    /**
     * 根据租户部门ID删除绑定
     * @param tenantId 租户标识
     * @param tenantDepartmentId 租户的部门ID
     * @return 执行结果
     * @author Shawn Deng
     * @date 2020/12/18 15:52
     */
    int deleteByTenantDepartmentId(@Param("spaceId") String spaceId, @Param("tenantId") String tenantId, @Param("tenantDepartmentId") String tenantDepartmentId);

    /**
     * 根据租户部门ID批量删除绑定
     * @param tenantId 租户标识
     * @param tenantDepartmentIds 租户的部门ID
     * @return 执行结果
     * @author Shawn Deng
     * @date 2020/12/18 15:52
     */
    int deleteBatchByTenantDepartmentId(@Param("spaceId") String spaceId, @Param("tenantId") String tenantId, @Param("tenantDepartmentIds") List<String> tenantDepartmentIds);

    /**
     * 根据租户标识批量删除
     *
     * @param tenantId 租户标识
     * @return 执行结果
     * @author Shawn Deng
     * @date 2020/12/15 10:25
     */
    int deleteByTenantId(@Param("spaceId") String spaceId, @Param("tenantId") String tenantId);

    /**
     *
     * 查询租户部门ID绑定的空间站小组ID
     *
     * @param spaceId 空间站ID
     * @param tenantId 企业标识
     * @param tenantDepartmentId 租户的部门ID
     * @return 空间站部门ID
     * @author zoe zheng
     * @date 2021/5/17 3:22 下午
     */
    Long selectSpaceTeamIdByTenantIdAndDepartmentId(@Param("spaceId") String spaceId, @Param("tenantId") String tenantId,
            @Param("tenantDepartmentId") String tenantDepartmentId);


    /**
     * 根据租户Id和部门ID删除绑定
     *
     * @param spaceId 空间站ID
     * @param tenantId 租户企业标识
     * @param tenantDepartmentId 租户的部门ID
     * @return 执行结果
     * @author zoe zheng
     * @date 2021/5/17 12:17 下午
     */
    int deleteBySpaceIdAndTenantIdAndDepartmentId(@Param("spaceId") String spaceId, @Param("tenantId") String tenantId,
            @Param("tenantDepartmentId") String tenantDepartmentId);

    /**
     * 查询租户部门ID绑定的空间站小组ID
     *
     * @param spaceId 空间站ID
     * @param tenantDepartmentIds 租户的部门ID
     * @param tenantId 租户企业ID
     * @return 空间站部门ID
     * @author zoe zheng
     * @date 2021/5/17 5:17 下午
     */
    List<Long> selectSpaceTeamIdsByTenantIdAndDepartmentId(@Param("spaceId") String spaceId,
            @Param("tenantId") String tenantId, @Param("tenantDepartmentIds") List<String> tenantDepartmentIds);

    /**
     * 根据租户标和空间ID识批量删除
     *
     * @param tenantId 租户标识
     * @param spaceId 空间站ID
     * @return 空间站部门ID
     * @author zoe zheng
     * @date 2021/5/17 5:17 下午
     */
    int deleteByTenantIdAndSpaceId(@Param("tenantId") String tenantId, @Param("spaceId") String spaceId);
}
