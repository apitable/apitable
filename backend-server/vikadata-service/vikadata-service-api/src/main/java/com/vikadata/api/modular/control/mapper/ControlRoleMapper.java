package com.vikadata.api.modular.control.mapper;

import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.modular.workspace.model.ControlRoleInfo;
import com.vikadata.api.modular.workspace.model.ControlRoleUnitDTO;
import com.vikadata.entity.ControlRoleEntity;

/**
 * <p>
 * 权限控制单元角色 Mapper
 * </p>
 *
 * @author Chambers
 * @date 2021/4/27
 */
public interface ControlRoleMapper extends BaseMapper<ControlRoleEntity> {

    /**
     * 查询指定控制单元的所有角色
     *
     * @param controlId 控制单元ID
     * @return entities
     * @author Chambers
     * @date 2021/4/27
     */
    List<ControlRoleEntity> selectByControlId(@Param("controlId") String controlId);

    /**
     * 查询多个控制单元的所有角色
     *
     * @param controlIds 控制单元ID 集合
     * @return entities
     * @author Chambers
     * @date 2021/4/27
     */
    List<ControlRoleEntity> selectByControlIds(@Param("controlIds") List<String> controlIds);

    /**
     * 查询指定控制单元、指定组织单元的所有角色
     *
     * @param controlId     控制单元ID
     * @param unitId        组织单元ID
     * @return entities
     * @author Chambers
     * @date 2021/5/24
     */
    List<ControlRoleEntity> selectByControlIdAndUnitId(@Param("controlId") String controlId, @Param("unitId") Long unitId);

    /**
     * 查询组织单元ID
     *
     * @param controlId 控制单元ID
     * @param roleCode  角色编码
     * @return unitId
     * @author Chambers
     * @date 2021/5/25
     */
    Long selectUnitIdAndControlIdAndRoleCode(@Param("controlId") String controlId, @Param("roleCode") String roleCode);

    /**
     * 查询角色编码
     *
     * @param controlId 控制单元ID
     * @param unitId    组织单元ID
     * @return RoleCode
     * @author Chambers
     * @date 2021/4/27
     */
    String selectRoleCodeByControlIdAndUnitId(@Param("controlId") String controlId, @Param("unitId") Long unitId);

    /**
     * 批量查询角色编码
     *
     * @param controlId 控制单元ID
     * @param unitIds    组织单元ID
     * @return RoleCode
     */
    List<ControlRoleInfo> selectControlRoleInfoByControlIdAndUnitIds(@Param("controlId") String controlId, @Param("unitIds") List<Long> unitIds);


    /**
     * 查询控制单元的角色和组织单元ID
     *
     * @param controlIds 控制单元ID 集合
     * @return NodeUnitRole
     * @author Chambers
     * @date 2021/5/25
     */
    List<ControlRoleInfo> selectControlRoleInfoByControlIds(@Param("controlIds") Collection<String> controlIds);

    /**
     * 查询控制单元的角色及组织单元信息
     *
     * @param controlId 控制单元ID
     * @return ControlRoleUnitDTO
     * @author Chambers
     * @date 2021/4/27
     */
    @InterceptorIgnore(illegalSql = "true")
    List<ControlRoleUnitDTO> selectControlRoleUnitDtoByControlId(@Param("controlId") String controlId);

    /**
     * 批量插入
     *
     * @param entities 实体集合
     * @return 执行结果数
     * @author Chambers
     * @date 2021/4/27
     */
    int insertBatch(@Param("entities") List<ControlRoleEntity> entities);

    /**
     * 更改指定控制单元的多个组织单元角色
     *
     * @param userId    用户ID
     * @param controlId 控制单元ID
     * @param unitIds   组织单元ID 列表
     * @param role      修改后的角色
     * @return 执行结果数
     * @author Chambers
     * @date 2021/4/27
     */
    @Deprecated
    int updateRoleCodeByControlIdAndUnitIds(@Param("userId") Long userId, @Param("controlId") String controlId, @Param("unitIds") List<Long> unitIds, @Param("role") String role);

    /**
     * 更改指定表ID 的角色
     *
     * @param userId    用户ID
     * @param ids       表ID 列表
     * @param role      修改后的角色
     * @return 执行结果数
     * @author Chambers
     * @date 2021/5/24
     */
    int updateRoleCodeByIds(@Param("userId") Long userId, @Param("ids") List<Long> ids, @Param("role") String role);

    /**
     * 删除指定表ID的角色
     *
     * @param ids 表ID 列表
     * @return 执行结果数
     * @author Chambers
     * @date 2021/5/24
     */
    @Deprecated
    int deleteByIds(@Param("ids") List<Long> ids);

    /**
     * 删除指定控制单元所有角色
     *
     * @param controlIds 控制单元ID 集合
     * @return 执行结果数
     * @author Chambers
     * @date 2021/4/27
     */
    @Deprecated
    int deleteByControlIds(@Param("userId") Long userId, @Param("controlIds") List<String> controlIds);

    /**
     * 删除指定组织单元所有角色
     *
     * @param unitIds 组织单元ID 集合
     * @return 执行结果数
     * @author Chambers
     * @date 2021/4/30
     */
    @Deprecated
    int deleteByUnitIds(@Param("unitIds") List<Long> unitIds);

    /**
     * 删除指定控制单元、指定组织单元的角色
     *
     * @param controlId 控制单元ID
     * @param unitId    组织单元ID
     * @return 执行结果数
     * @author Chambers
     * @date 2021/4/27
     */
    @Deprecated
    int deleteByControlIdAndUnitId(@Param("controlId") String controlId, @Param("unitId") Long unitId);

    /**
     * 通过权限ID和组织ID查找权限
     *
     * @param controlId 权限ID
     * @param unitIds 组织单元ID
     * @return List<ControlRoleEntity>
     * @author zoe zheng
     * @date 2022/2/28 15:30
     */
    List<ControlRoleEntity> selectDeletedRole(@Param("controlId") String controlId,
            @Param("unitIds") List<Long> unitIds, @Param("roleCode") String roleCode);

    /**
     * 修改删除字段
     *
     * @param ids 主键ID
     * @param userId 修改用户ID
     * @param isDeleted 是否删除
     * @return 影响记录行数
     * @author zoe zheng
     * @date 2022/2/28 16:08
     */
    Integer updateIsDeletedByIds(@Param("userId") Long userId, @Param("ids") List<Long> ids,
            @Param("isDeleted") Boolean isDeleted);

    /**
     * 查找删除的集合
     *
     * @param controlId 权限ID
     * @param unitIds 组织单元ID
     * @param roleCodes 角色编码
     * @return List<ControlRoleEntity>
     * @author zoe zheng
     * @date 2022/3/1 00:21
     */
    List<ControlRoleEntity> selectDeletedRoleByRoleCodes(@Param("controlId") String controlId,
            @Param("unitIds") List<Long> unitIds, @Param("roleCodes") List<String> roleCodes);

    /**
     * 查询组织单元ID
     *
     * @param controlId 控制单元ID
     * @param roleCode  角色编码
     * @param ignoreDeleted 忽略删除
     * @return unitId
     * @author zoe zheng
     * @date 2022/4/13 20:09
     */
    ControlRoleEntity selectByControlIdAndUnitIdAndRoleCode(@Param("controlId") String controlId, @Param("unitId") Long unitId,
            @Param("roleCode") String roleCode, @Param("ignoreDeleted") boolean ignoreDeleted);

    /**
     * 查询指定控制单元的所有角色
     *
     * @param controlId 控制单元ID
     * @param unitIds    组织单元ID
     * @param ignoreDeleted 忽略删除标志
     * @return entities
     * @author zoe zheng
     * @date 2022/4/13 21:09
     */
    List<ControlRoleEntity> selectByControlIdAndUnitIds(@Param("controlId") String controlId,
            @Param("unitIds") List<Long> unitIds, @Param("ignoreDeleted") boolean ignoreDeleted);

    /**
     * 查询指定控制单元的所有角色
     *
     * @param controlIds     控制单元ID列表
     * @return id List
     */
    List<Long> selectIdByControlIds(@Param("controlIds") List<String> controlIds);

    /**
     * 查询指定组织单元的所有角色
     *
     * @param unitIds        组织单元ID列表¬
     * @return id List
     */
    List<Long> selectIdByUnitIds(@Param("unitIds") List<Long> unitIds);

    /**
     * 查询指定控制单元、指定多个组织单元的所有角色
     *
     * @param controlId     控制单元ID
     * @param unitIds        组织单元ID列表
     * @return id List
     */
    List<Long> selectIdByControlIdAndUnitIds(@Param("controlId") String controlId, @Param("unitIds") List<Long> unitIds);

    /**
     * 查询指定控制单元、指定组织单元的所有角色
     *
     * @param controlId     控制单元ID
     * @param unitId        组织单元ID
     * @return id List
     */
    List<Long> selectIdByControlIdAndUnitId(@Param("controlId") String controlId, @Param("unitId") Long unitId);
}
