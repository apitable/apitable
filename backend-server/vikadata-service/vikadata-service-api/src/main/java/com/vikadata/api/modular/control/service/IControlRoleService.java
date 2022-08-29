package com.vikadata.api.modular.control.service;

import java.util.List;
import java.util.Map;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.modular.workspace.model.ControlRoleInfo;
import com.vikadata.api.modular.workspace.model.ControlRoleUnitDTO;
import com.vikadata.entity.ControlRoleEntity;

/**
 * <p>
 * 权限控制单元角色 服务接口
 * </p>
 *
 * @author Chambers
 * @date 2021/4/27
 */
public interface IControlRoleService extends IService<ControlRoleEntity> {

    /**
     * 获取指定控制单元的所有角色信息
     *
     * @param controlId 控制单元ID
     * @return entities
     * @author Chambers
     * @date 2021/4/27
     */
    List<ControlRoleEntity> getByControlId(String controlId);

    /**
     * 获取指定控制单元、指定组织单元的所有角色信息
     *
     * @param controlId     控制单元ID
     * @param unitId        组织单元ID
     * @return entities
     * @author Chambers
     * @date 2021/5/24
     */
    List<ControlRoleEntity> getByControlIdAndUnitId(String controlId, Long unitId);

    /**
     * 获取指定控制单元、指定角色编码的组织单元ID
     *
     * @param controlId 控制单元ID
     * @param roleCode  角色编码
     * @return unitId
     * @author Chambers
     * @date 2021/5/25
     */
    Long getUnitIdByControlIdAndRoleCode(String controlId, String roleCode);

    /**
     * 获取指定控制单元、指定组织单元的角色编码
     *
     * @param controlId 控制单元ID
     * @param unitId    组织单元ID
     * @return RoleCode
     * @author Chambers
     * @date 2021/4/27
     */
    String getRoleCodeByControlIdAndUnitId(String controlId, Long unitId);

    /**
     * 获取指定控制单元、指定组织单元集的角色编码
     *
     * @param controlId 控制单元ID
     * @param unitIds   组织单元ID集
     * @return ControlRoleInfo
     */
    List<ControlRoleInfo> getUnitRoleByControlIdAndUnitIds(String controlId, List<Long> unitIds);

    /**
     * 获取指定控制单元角色信息
     *
     * @param controlId 控制单元ID
     * @return ControlRoleInfo
     * @author Chambers
     * @date 2021/5/25
     */
    List<ControlRoleInfo> getUnitRoleByControlId(String controlId);

    /**
     * 获取指定控制单元的角色及组织单元信息
     *
     * @param controlId 控制单元ID
     * @return ControlRoleUnitDTO
     * @author Chambers
     * @date 2021/4/28
     */
    List<ControlRoleUnitDTO> getControlRolesUnitDtoByControlId(String controlId);

    /**
     * 新增控制单元角色
     *
     * @param userId    用户ID
     * @param controlId 控制单元ID
     * @param unitIds   组织单元ID 列表
     * @param role      添加的角色
     * @author Chambers
     * @date 2021/4/27
     */
    void addControlRole(Long userId, String controlId, List<Long> unitIds, String role);

    /**
     * 新增控制单元角色
     *
     * @param userId        用户ID
     * @param controlId     控制单元ID
     * @param unitRoleMap   组织单元角色集
     * @author Chambers
     * @date 2021/4/27
     */
    void addControlRole(Long userId, String controlId, Map<Long, String> unitRoleMap);

    /**
     * 修改控制单元角色
     *
     * @param userId    用户ID
     * @param controlRoleIds       表ID 列表
     * @param role      修改后的角色
     * @author Chambers
     * @date 2021/5/24
     */
    void editControlRole(Long userId, List<Long> controlRoleIds, String role);

    /**
     * 修改控制单元角色
     * @param userId    用户ID
     * @param controlId 控制单元ID
     * @param unitIds   组织单元ID 列表
     * @param role      修改后的角色
     * @author Chambers
     * @date 2021/4/27
     */
    void editControlRole(Long userId, String controlId, List<Long> unitIds, String role);

    /**
     * 删除指定控制单元的所有角色
     *
     * @param controlIds 控制单元ID 集合
     * @author Chambers
     * @date 2021/4/27
     */
    void removeByControlIds(Long userId, List<String> controlIds);

    /**
     * 删除组织单元的所有角色
     *
     * @param unitIds 组织单元ID 集合
     * @author Chambers
     * @date 2021/4/27
     */
    void removeByUnitIds(List<Long> unitIds);

    /**
     * 删除指定控制单元、指定组织单元的角色
     *
     * @param controlId 控制单元ID
     * @param unitId    组织单元ID
     * @author Chambers
     * @date 2021/4/27
     */
    void removeByControlIdAndUnitId(String controlId, Long unitId);

    /**
     * 删除指定控制单元、指定组织单元的角色
     *
     * @param controlId 控制单元ID
     * @param unitIds   组织单元ID集
     */
    void removeByControlIdAndUnitIds(String controlId, List<Long> unitIds);

    /**
     * 根据权限获取组织单元ID
     *
     * @param controlId 控制单元ID
     * @param unitId    组织单元ID
     * @param roleCode 角色编码
     * @param ignoreDeleted 忽略删除标志
     * @return 组织单元ID
     * @author zoe zheng
     * @date 2022/4/13 20:05
     */
    ControlRoleEntity getByControlIdAndUnitIdAndRoleCode(String controlId, Long unitId, String roleCode,
            boolean ignoreDeleted);

    /**
     * 更新权限是否删除的状态
     *
     * @param ids 主键ID
     * @param userId 修改用户ID
     * @param isDeleted 删除状态
     * @author zoe zheng
     * @date 2022/4/12 14:55
     */
    void editIsDeletedByIds(List<Long> ids, Long userId, boolean isDeleted);

    /**
     * 获取指定控制单元、指定组织单元的非owner角色信息
     *
     * @param controlId     控制单元ID
     * @param unitIds        组织单元ID
     * @return
     */
    Map<Long, String> getUnitIdToRoleCodeMapWithoutOwnerRole(String controlId, List<Long> unitIds);
}
