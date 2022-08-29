package com.vikadata.api.modular.organization.mapper;

import java.util.Collection;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.vikadata.api.enums.organization.UnitType;
import com.vikadata.api.modular.mapper.ExpandBaseMapper;
import com.vikadata.entity.UnitEntity;

/**
 * <p>
 *
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/1/10 14:17
 */
public interface UnitMapper extends ExpandBaseMapper<UnitEntity> {

    /**
     * 批量查询空间内的指定组织单元的数量
     *
     * @param spaceId 空间ID
     * @param unitIds 组织单元ID集合
     * @return 数量
     * @author Shawn Deng
     * @date 2020/3/5 20:20
     */
    Integer selectCountBySpaceIdAndIds(@Param("spaceId") String spaceId, @Param("unitIds") List<Long> unitIds);

    /**
     * 真实批量添加
     *
     * @param entities 实体类集合
     * @return 成功添加数量
     * @author Shawn Deng
     * @date 2020/1/14 13:00
     */
    int insertBatch(@Param("entities") List<UnitEntity> entities);

    /**
     * 根据关联ID查询组织单元ID
     *
     * @param refId 关联ID
     * @return 组织单元ID
     * @author Shawn Deng
     * @date 2020/1/10 15:23
     */
    Long selectUnitIdByRefId(@Param("refId") Long refId);

    /**
     * 根据ID查询关联ID
     *
     * @param unitId ID
     * @return 组织单元ID
     * @author Shawn Deng
     * @date 2020/1/10 15:23
     */
    Long selectRefIdById(@Param("unitId") Long unitId);

    /**
     * 根据关联ID查询
     *
     * @param refId 关联ID
     * @return UnitEntity
     * @author Shawn Deng
     * @date 2020/2/28 14:20
     */
    UnitEntity selectByRefId(@Param("refId") Long refId);

    /**
     * 查询指定空间的组织单元ID
     *
     * @param spaceId 空间ID
     * @return 组织单元ID集合
     * @author Chambers
     * @date 2020/6/17
     */
    List<Long> selectIdBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 批量查询组织单元ID
     *
     * @param refIds 关联ID
     * @return 组织单元ID集合
     * @author Shawn Deng
     * @date 2020/2/20 21:52
     */
    List<Long> selectIdsByRefIds(@Param("refIds") Collection<Long> refIds);

    /**
     * 批量查询关联ID
     *
     * @param unitIds 关联ID
     * @return 组织单元ID集合
     * @author Shawn Deng
     * @date 2020/2/20 21:52
     */
    List<Long> selectRefIdsByUnitIds(@Param("unitIds") Collection<Long> unitIds);

    /**
     * 查询空间内的根部门ID
     *
     * @param spaceId 空间ID
     * @param refId   关联ID
     * @return 部门ID
     * @author Shawn Deng
     * @date 2020/1/10 15:23
     */
    Long selectBySpaceIdAndRefId(@Param("spaceId") String spaceId, @Param("refId") Long refId);

    /**
     * 删除空间内的组织单元
     *
     * @param spaceId 空间ID
     * @param ids     关联ID
     * @return 影响行数
     * @author Shawn Deng
     * @date 2020/1/10 15:23
     */
    int deleteBySpaceIdAndId(@Param("spaceId") String spaceId, @Param("ids") List<Long> ids);

    /**
     * 逻辑删除组织单元
     *
     * @param unitRefIds 组织单元关联ID 列表
     * @return 执行结果数
     * @author Chambers
     * @date 2020/12/18
     */
    int deleteByUnitRefIds(@Param("list") List<Long> unitRefIds);

    /**
     * 批量恢复成员组织单元
     *
     * @param ids ID列表
     * @return 执行结果
     * @author Shawn Deng
     * @date 2020/6/19 20:53
     */
    int batchRestoreByIds(@Param("ids") Collection<Long> ids);

    /**
     * 根据关联ID查询
     *
     * @param refIds 关联ID列表
     * @return UnitEntity List
     * @author Shawn Deng
     * @date 2020/6/19 23:06
     */
    List<UnitEntity> selectByRefIds(@Param("refIds") Collection<Long> refIds);

    /**
     * 批量查询组织单元列表
     *
     * @param unitIds 组织单元ID 列表
     * @return UnitEntities
     * @author Chambers
     * @date 2020/7/13
     */
    List<UnitEntity> selectByUnitIds(@Param("unitIds") Collection<Long> unitIds);

    /**
     * 真实删除
     * @param refId 关联ID
     * @return 执行结果
     */
    int deleteActualByRefId(@Param("refId") Long refId);

    /**
     * 批量更新组织的isDeleted单元
     * @param spaceId 空间站ID
     * @param refIds 关联ID
     * @param unitType 组织单元类型
     * @param isDeleted 是否删除
     * @return boolean
     * @author zoe zheng
     * @date 2022/4/26 10:34
     */
    Integer batchUpdateIsDeletedBySpaceIdAndRefId(@Param("spaceId") String spaceId, @Param("refIds") List<Long> refIds,
            @Param("unitType") UnitType unitType, @Param("isDeleted") Boolean isDeleted);
}
