package com.vikadata.api.workspace.service;

import java.util.List;
import java.util.Map;

import com.vikadata.api.workspace.vo.FieldCollaboratorVO;
import com.vikadata.api.workspace.vo.FieldPermissionInfo;
import com.vikadata.api.workspace.vo.FieldPermissionView;
import com.vikadata.api.enterprise.control.model.FieldControlProp;

public interface IFieldRoleService {

    /**
     * pre check of operation column permissions
     * 1. field must exist
     * 2. the field cannot be the first column
     * @param dstId datasheet id
     * @param fieldId field id
     */
    void checkFieldPermissionBeforeEnable(String dstId, String fieldId);

    /**
     * check before field role permission change
     * @param controlId controlId
     * @param memberId member id
     */
    void checkFieldHasOperation(String controlId, Long memberId);

    /**
     * get field role：
     * If the field is not enabled, the default role organization unit list.
     * Default role organization unit list: the datasheet, the parent node of the datasheet, or the role organization unit of the root department.
     *
     * @param datasheetId   datasheet id
     * @param fieldId       file id
     * @return FieldCollaboratorVO
     * 
     * 
     */
    FieldCollaboratorVO getFieldRoles(String datasheetId, String fieldId);

    /**
     * open field permissions
     *
     * includeExtend Whether to inherit the default role organization unit list after field permissions are enabled.
     * Default role organization unit list: the datasheet, the parent node of the datasheet, or the role organization unit of the root department.
     *
     * @param userId user id
     * @param dstId datasheet id
     * @param fldId         field id
     * @param includeExtend Whether to inherit the list of default role organization units
     */
    void enableFieldRole(Long userId, String dstId, String fldId, boolean includeExtend);

    /**
     * add field permission role
     *
     * @param userId user id
     * @param controlId     controlId
     * @param unitIds       unitIds
     * @param role          role
     */
    void addFieldRole(Long userId, String controlId, List<Long> unitIds, String role);

    /**
     * modify field permission role
     *
     * @param userId user id
     * @param controlId controlId
     * @param unitIds    unitIds
     * @param role      role
     */
    void editFieldRole(Long userId, String controlId, List<Long> unitIds, String role);

    /**
     * delete field role
     *
     * @param controlId     controlId
     * @param datasheetId   datasheetId
     * @param unitId        unitId
     * @return role code
     */
    String deleteFieldRole(String controlId, String datasheetId, Long unitId);

    /**
     * modify field permission settings
     *
     * @param userId user id
     * @param controlId controlId
     * @param prop      update prop
     */
    void updateFieldRoleProp(Long userId, String controlId, FieldControlProp prop);

    /**
     * get field permission view information
     *
     * @param memberId member id
     * @param nodeId node id
     * @param shareId       shareId
     * @return FieldPermissionView
     */
    FieldPermissionView getFieldPermissionView(Long memberId, String nodeId, String shareId);

    /**
     * get permissions for all fields in a table
     *
     * @param memberId member id
     * @param nodeId node id
     * @param shareId       shareId
     * @return FieldId -> FieldPermissionInfo Map
     */
    Map<String, FieldPermissionInfo> getFieldPermissionMap(Long memberId, String nodeId, String shareId);

    /**
     * obtain the field id of the column permission
     *
     * @param datasheetId datasheetId
     * @return fieldIds
     */
    List<String> getPermissionFieldIds(String datasheetId);

    /**
     * @param controlId     controlId
     * @param unitIds        unitIds
     * @return role code corresponding unit
     */
    Map<String, List<Long>> deleteFieldRoles(String controlId, List<Long> unitIds);
}
