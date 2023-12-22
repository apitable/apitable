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

package com.apitable.organization.service;

import com.apitable.organization.dto.RoleBaseInfoDto;
import com.apitable.organization.dto.UnitRoleInfoDTO;
import com.apitable.organization.vo.RoleInfoVo;
import com.apitable.organization.vo.RoleVo;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

/**
 * role service.
 */
public interface IRoleService {

    /**
     * check whether the role name already exists in the space
     * then the callback deal with the check result.
     *
     * @param spaceId  the space's id
     * @param roleName the role's name
     * @param consumer the callback function
     */
    void checkDuplicationRoleName(String spaceId, String roleName, Consumer<Boolean> consumer);

    /**
     * check whether the role name already exists in the space
     * then the callback deal with the check result.
     *
     * @param spaceId  the space's id
     * @param roleId   the current role id
     * @param roleName the role's name
     * @param consumer the callback function
     */
    void checkDuplicationRoleName(String spaceId, Long roleId, String roleName,
                                  Consumer<Boolean> consumer);

    /**
     * create role.
     *
     * @param userId   the user's id
     * @param spaceId  the space's id
     * @param roleName the role's name
     * @return the new role's id
     */
    Long createRole(Long userId, String spaceId, String roleName);


    /**
     * create role.
     *
     * @param userId   the user's id
     * @param spaceId  the space's id
     * @param roleName the role's name
     * @param position the role's position
     * @return the new role's id
     */
    UnitRoleInfoDTO createRole(Long userId, String spaceId, String roleName, Integer position);

    /**
     * update role's information.
     *
     * @param userId   the user's id
     * @param roleId   the role's id
     * @param roleName the role's name
     */
    void updateRole(Long userId, Long roleId, String roleName);


    /**
     * update role's information.
     *
     * @param userId   the user's id
     * @param roleId   the role's id
     * @param roleName the role's name
     * @param position the role's position
     */
    void updateRole(Long userId, Long roleId, String roleName, Integer position);

    /**
     * delete role.
     *
     * @param roleId the role's id
     */
    void deleteRole(Long roleId);

    /**
     * check whether role exist in the space
     * then the callback deal with the check result.
     *
     * @param spaceId  the space's id
     * @param roleId   the role's id
     * @param consumer the callback function
     */
    void checkRoleExistBySpaceIdAndRoleId(String spaceId, Long roleId, Consumer<Boolean> consumer);

    /**
     * query the space's roles list.
     *
     * @param spaceId the space's id
     * @return role's information RolesVo
     */
    List<RoleInfoVo> getRoles(String spaceId);

    /**
     * query the role's name.
     *
     * @param roleId roleId
     * @return the role's name.
     */
    String getRoleNameByRoleId(Long roleId);

    /**
     * query what role belong to member.
     *
     * @param memberId the member's id
     * @return the member's role.
     */
    List<RoleVo> getRoleVosByMemberId(Long memberId);

    /**
     * fuzzy search by keyword in the space.
     *
     * @param spaceId the space's id
     * @param keyword fuzzy search's keyword
     * @return the search result of roles.
     */
    List<Long> getRoleIdsByKeyWord(String spaceId, String keyword);

    /**
     * get the roles' base information by role ids.
     *
     * @param roleIds the roles' id
     * @return the roles' base information.
     */
    List<RoleBaseInfoDto> getBaseInfoDtoByRoleIds(List<Long> roleIds);

    /**
     * the role flat to role members' unit.
     *
     * @param roleIds the roles' id
     * @return get map about role's unit id to the role members' unit ids.
     */
    Map<Long, List<Long>> flatMapToRoleMemberUnitIds(List<Long> roleIds);

    /**
     * query role info by the space's id and roles' id.
     *
     * @param spaceId the space's id
     * @param roleIds the roles' id
     * @return the role information.
     */
    List<RoleInfoVo> getRoleVos(String spaceId, List<Long> roleIds);

    /**
     * init the space's role list.
     *
     * @param userId  the user's id
     * @param spaceId the space's id
     */
    void initRoleList(Long userId, String spaceId);

    /**
     * check whether roles exist in the space
     * then the callback deal with the check result.
     *
     * @param spaceId  the space's id
     * @param consumer the callback function
     */
    void checkRoleExistBySpaceId(String spaceId, Consumer<Boolean> consumer);

    /**
     * get role id.
     *
     * @param spaceId space id
     * @param unitIds role unit id
     * @return role id list
     */
    List<Long> getRoleIdsByUnitIds(String spaceId, List<String> unitIds);

    /**
     * get role id.
     *
     * @param spaceId space id
     * @param unitId  role unit id
     * @return role id
     */
    Long getRoleIdByUnitId(String spaceId, String unitId);
}
