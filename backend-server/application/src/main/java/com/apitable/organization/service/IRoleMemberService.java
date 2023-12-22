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

import com.apitable.organization.dto.RoleMemberDTO;
import com.apitable.organization.dto.RoleMemberInfoDTO;
import com.apitable.organization.enums.UnitType;
import com.apitable.organization.ro.RoleMemberUnitRo;
import com.apitable.organization.vo.RoleMemberVo;
import com.apitable.organization.vo.UnitRoleInfoVo;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

/**
 * role member service.
 */
public interface IRoleMemberService {

    /**
     * add role members.
     *
     * @param roleId          role id
     * @param roleMemberUnits the unit information about role members
     * @return the ref row ids of role and role members.
     */
    List<Long> addRoleMembers(Long roleId, List<RoleMemberUnitRo> roleMemberUnits);

    /**
     * remove role members.
     *
     * @param roleId        role id
     * @param roleMemberIds role members' id
     * @return the removed ref row ids of role and role members.
     */
    List<Long> removeByRoleIdAndRoleMemberIds(Long roleId, List<Long> roleMemberIds);

    /**
     * remove role members by role id.
     *
     * @param roleId role id
     */
    void removeByRoleId(Long roleId);

    /**
     * get the role's base information by role id.
     *
     * @param roleIds roles' id
     * @return the roles' base information.
     */
    List<RoleMemberInfoDTO> getRoleMembersByRoleIds(List<Long> roleIds);

    /**
     * get page vo about role members.
     *
     * @param spaceId space id
     * @param roleId  role id
     * @param page    page parameter
     * @return page vo about role members.
     */
    IPage<RoleMemberVo> getRoleMembersPage(String spaceId, Long roleId, Page<Void> page);

    /**
     * remove role members by member id.
     *
     * @param roleMemberIds role members' id
     */
    void removeByRoleMemberIds(Collection<Long> roleMemberIds);

    /**
     * get roles' id by role member id.
     *
     * @param roleMemberId role members' id
     * @return roles' id
     */
    List<Long> getRoleIdsByRoleMemberId(Long roleMemberId);

    /**
     * get members' id in roles.
     *
     * @param roleIds the roles' id
     * @return the members' id
     */
    List<Long> getMemberIdsByRoleIds(List<Long> roleIds);

    /**
     * check whether role has members.
     *
     * @param roleId   the role's id
     * @param consumer the result callback
     */
    void checkRoleMemberExistByRoleId(Long roleId, Consumer<Boolean> consumer);

    /**
     * get role's member by unit_ref_id.
     *
     * @param unitRefIds list of unitRefId
     * @param unitType   type of unit
     * @return list of RoleMemberDTO
     */
    List<RoleMemberDTO> getByUnitRefIdsAndUnitType(List<Long> unitRefIds, UnitType unitType);

    /**
     * get role's member by unit_ref_id.
     *
     * @param roleIds list of unitRefId
     * @return list of RoleMemberDTO
     */
    List<RoleMemberDTO> getByRoleIds(List<Long> roleIds);

    /**
     * get unit's members.
     *
     * @param unitRefIds list of unitRefId
     * @param unitType   type of unit
     * @return map of RoleMemberDTO
     */
    Map<Long, List<UnitRoleInfoVo>> getRefUnitRoles(List<Long> unitRefIds, UnitType unitType);
}
