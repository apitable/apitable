package com.vikadata.api.modular.workspace.service;

import java.util.List;
import java.util.Map;

import com.vikadata.api.model.vo.datasheet.FieldCollaboratorVO;
import com.vikadata.api.model.vo.node.FieldPermissionInfo;
import com.vikadata.api.model.vo.node.FieldPermissionView;
import com.vikadata.api.modular.control.model.FieldControlProp;

/**
 * 字段角色服务接口
 * @author Shawn Deng
 * @date 2021-04-01 19:27:46
 */
public interface IFieldRoleService {

    /**
     * 操作列权限的前置检查
     * 1. 字段必须存在
     * 2. 字段不能是首列
     * @param dstId 数表ID
     * @param fieldId 字段ID
     * @author Shawn Deng
     * @date 2021/4/2 17:42
     */
    void checkFieldPermissionBeforeEnable(String dstId, String fieldId);

    /**
     * 字段角色权限变更之前的检查
     * @param controlId 检查控制单元ID
     * @param memberId 成员ID
     * @author Shawn Deng
     * @date 2021/6/9 21:37
     */
    void checkFieldHasOperation(String controlId, Long memberId);

    /**
     * 获取字段角色：
     * 如果字段没有开启权限，默认角色组织单元列表。
     * 默认角色组织单元列表：所在数表，或所在数表父级节点，或根部门的角色组织单元。
     *
     * @param datasheetId   数表ID
     * @param fieldId       字段ID
     * @return FieldCollaboratorVO
     * @author Chambers
     * @date 2021/4/27
     */
    FieldCollaboratorVO getFieldRoles(String datasheetId, String fieldId);

    /**
     * 开启字段权限
     *
     * includeExtend 开启字段权限后，是否继承默认角色组织单元列表。
     * 默认角色组织单元列表：所在数表，或所在数表父级节点，或根部门的角色组织单元。
     *
     * @param userId        用户ID
     * @param dstId         数表ID
     * @param fldId         字段ID
     * @param includeExtend 是否继承默认角色组织单元列表
     * @author Chambers
     * @date 2021/4/27
     */
    void enableFieldRole(Long userId, String dstId, String fldId, boolean includeExtend);

    /**
     * 添加字段权限角色
     *
     * @param userId        用户ID
     * @param controlId     控制单元ID
     * @param unitIds       组织单元ID 列表
     * @param role          添加的角色
     * @author Chambers
     * @date 2021/4/27
     */
    void addFieldRole(Long userId, String controlId, List<Long> unitIds, String role);

    /**
     * 修改字段权限角色
     *
     * @param userId    用户ID
     * @param controlId 控制单元ID
     * @param unitIds    组织单元ID
     * @param role      修改后的角色
     * @author Chambers
     * @date 2021/4/27
     */
    void editFieldRole(Long userId, String controlId, List<Long> unitIds, String role);

    /**
     * 删除字段角色
     *
     * @param controlId     控制单元ID
     * @param datasheetId   数表ID
     * @param unitId        组织单元ID
     * @return 角色编码
     * @author Chambers
     * @date 2021/4/17
     */
    String deleteFieldRole(String controlId, String datasheetId, Long unitId);

    /**
     * 修改字段权限设置
     *
     * @param userId    用户ID
     * @param controlId 控制单元ID
     * @param prop      修改后的属性
     * @author Chambers
     * @date 2021/4/27
     */
    void updateFieldRoleProp(Long userId, String controlId, FieldControlProp prop);

    /**
     * 获取字段权限视图信息
     *
     * @param memberId      成员ID
     * @param nodeId        节点ID
     * @param shareId       分享ID
     * @return FieldPermissionView
     * @author Chambers
     * @date 2021/12/13
     */
    FieldPermissionView getFieldPermissionView(Long memberId, String nodeId, String shareId);

    /**
     * 获取数表所有字段的权限
     *
     * @param memberId      成员ID
     * @param nodeId        节点ID
     * @param shareId       分享ID
     * @return FieldId -> FieldPermissionInfo Map
     * @author Chambers
     * @date 2021/4/19
     */
    Map<String, FieldPermissionInfo> getFieldPermissionMap(Long memberId, String nodeId, String shareId);

    /**
     * 获取开启列权限的字段ID
     *
     * @param datasheetId 数表ID
     * @return fieldIds
     * @author Chambers
     * @date 2021/5/6
     */
    List<String> getPermissionFieldIds(String datasheetId);

    /**
     * 批量删除字段角色
     *
     * @param controlId     控制单元ID
     * @param unitIds        组织单元ID集
     * @return 角色编码对应单元集
     */
    Map<String, List<Long>> deleteFieldRoles(String controlId, List<Long> unitIds);
}
