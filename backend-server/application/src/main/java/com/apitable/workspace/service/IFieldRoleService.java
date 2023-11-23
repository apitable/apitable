/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.workspace.service;

import com.apitable.shared.util.page.PageInfo;
import com.apitable.workspace.ro.FieldControlProp;
import com.apitable.workspace.vo.FieldCollaboratorVO;
import com.apitable.workspace.vo.FieldPermissionInfo;
import com.apitable.workspace.vo.FieldPermissionView;
import com.apitable.workspace.vo.FieldRoleMemberVo;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import java.util.List;
import java.util.Map;

/**
 * field role service.
 */
public interface IFieldRoleService {

    /**
     * Gets whether the field permission mode is the specified mode.
     *
     * @param dstId   datasheet id
     * @param fieldId field id
     * @return true | false
     */
    boolean getFieldRoleEnabledStatus(String dstId, String fieldId);

    /**
     * pre check of operation column permissions.
     * 1. field must exist
     * 2. the field cannot be the first column
     *
     * @param dstId   datasheet id
     * @param fieldId field id
     */
    void checkFieldPermissionBeforeEnable(String dstId, String fieldId);

    /**
     * check before field role permission change.
     *
     * @param controlId controlId
     * @param memberId  member id
     */
    void checkFieldHasOperation(String controlId, Long memberId);

    /**
     * GetFieldRoleMembersPageInfo.
     *
     * @param page        page param
     * @param datasheetId datasheet id
     * @param fieldId     file id
     * @return PageInfo
     * @author Chambers
     */
    PageInfo<FieldRoleMemberVo> getFieldRoleMembersPageInfo(Page<FieldRoleMemberVo> page,
                                                            String datasheetId, String fieldId);

    /**
     * get field role：
     * If the field is not enabled, the default role organization unit list.
     * Default role organization unit list: the datasheet, the parent node of the datasheet, or the role organization unit of the root department.
     *
     * @param datasheetId datasheet id
     * @param fieldId     file id
     * @return FieldCollaboratorVO
     */
    FieldCollaboratorVO getFieldRoles(String datasheetId, String fieldId);

    /**
     * open field permissions.
     * </p>
     * includeExtend Whether to inherit the default role organization unit list after field permissions are enabled.
     * Default role organization unit list: the datasheet, the parent node of the datasheet, or the role organization unit of the root department.
     *
     * @param userId        user id
     * @param dstId         datasheet id
     * @param fldId         field id
     * @param includeExtend Whether to inherit the list of default role organization units
     */
    void enableFieldRole(Long userId, String dstId, String fldId, boolean includeExtend);

    /**
     * add field permission role.
     *
     * @param userId    user id
     * @param controlId controlId
     * @param unitIds   unitIds
     * @param role      role
     */
    void addFieldRole(Long userId, String controlId, List<Long> unitIds, String role);

    /**
     * modify field permission role.
     *
     * @param userId    user id
     * @param controlId controlId
     * @param unitIds   unitIds
     * @param role      role
     */
    void editFieldRole(Long userId, String controlId, List<Long> unitIds, String role);

    /**
     * delete field role.
     *
     * @param controlId   controlId
     * @param datasheetId datasheetId
     * @param unitId      unitId
     * @return role code
     */
    String deleteFieldRole(String controlId, String datasheetId, Long unitId);

    /**
     * modify field permission settings.
     *
     * @param userId    user id
     * @param controlId controlId
     * @param prop      update prop
     */
    void updateFieldRoleProp(Long userId, String controlId, FieldControlProp prop);

    /**
     * get field permission view information.
     *
     * @param memberId member id
     * @param nodeId   node id
     * @param shareId  shareId
     * @return FieldPermissionView
     */
    FieldPermissionView getFieldPermissionView(Long memberId, String nodeId, String shareId);

    /**
     * get permissions for all fields in a table.
     *
     * @param memberId member id
     * @param nodeId   node id
     * @param shareId  shareId
     * @return FieldId -> FieldPermissionInfo Map
     */
    Map<String, FieldPermissionInfo> getFieldPermissionMap(Long memberId, String nodeId,
                                                           String shareId);

    /**
     * obtain the field id of the column permission.
     *
     * @param datasheetId datasheetId
     * @return fieldIds
     */
    List<String> getPermissionFieldIds(String datasheetId);

    /**
     * delete field roles.
     *
     * @param controlId controlId
     * @param unitIds   unitIds
     * @return role code corresponding unit
     */
    Map<String, List<Long>> deleteFieldRoles(String controlId, List<Long> unitIds);
}
