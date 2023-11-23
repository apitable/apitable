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

package com.apitable.organization.mapper;

import com.apitable.organization.dto.RoleMemberDTO;
import com.apitable.organization.dto.RoleMemberInfoDTO;
import com.apitable.organization.entity.RoleMemberEntity;
import com.apitable.organization.enums.UnitType;
import com.apitable.shared.util.ibatis.ExpandBaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import org.apache.ibatis.annotations.Param;

/**
 * role member mapper.
 */
public interface RoleMemberMapper extends ExpandBaseMapper<RoleMemberEntity> {

    /**
     * get role members' id by role's id.
     *
     * @param roleId the role's id
     * @return the role members' id
     */
    Set<Long> selectUnitRefIdsByRoleId(@Param("roleId") Long roleId);

    /**
     * delete rows by the role's id and the role member's id.
     *
     * @param roleId     the role's id
     * @param unitRefIds the role members' id
     * @return deleted rows number
     */
    Integer deleteByRoleIdAndUnitRefIds(@Param("roleId") Long roleId,
                                        @Param("unitRefIds") List<Long> unitRefIds);

    /**
     * delete rows by the role's id.
     *
     * @param roleId the role's id
     * @return deleted rows number
     */
    Integer deleteByRoleId(@Param("roleId") Long roleId);

    /**
     * get roles' role members' information.
     *
     * @param roleIds the roles' id
     * @return the role members' information.
     */
    List<RoleMemberInfoDTO> selectRoleMembersByRoleIds(@Param("roleIds") List<Long> roleIds);

    /**
     * page query roles' role members' information.
     *
     * @param roleId the role's id
     * @param page   page parameter
     * @return role members' information
     */
    IPage<RoleMemberInfoDTO> selectRoleMembersByRoleId(@Param("roleId") Long roleId,
                                                       Page<Void> page);

    /**
     * delete rows by the role members' id.
     *
     * @param unitRefIds the role members' id
     * @return deleted rows number
     */
    Integer deleteByUnitRefIds(@Param("unitRefIds") Collection<Long> unitRefIds);

    /**
     * get roles' id by role member id.
     *
     * @param unitRefId the role member's id
     * @return the roles' id of the member's ref.
     */
    List<Long> selectRoleIdsByUnitRefId(@Param("unitRefId") Long unitRefId);

    /**
     * get role members' information by role's id and role members' id.
     *
     * @param roleId     the role's id
     * @param unitRefIds the role members' id
     * @return role members information
     */
    List<RoleMemberInfoDTO> selectRoleMembersByRoleIdAndUnitRefIds(@Param("roleId") Long roleId,
                                                                   @Param("unitRefIds")
                                                                   List<Long> unitRefIds);

    /**
     * count rows by role's id.
     *
     * @param roleId the roles' id
     * @return number of rows
     */
    Integer selectCountByRoleId(@Param("roleId") Long roleId);

    /**
     * get role's member by role member id.
     *
     * @param unitRefIds the role member's id
     * @param unitType   the type of unit
     * @return the roles' id of the member's ref.
     */
    List<RoleMemberDTO> selectByUnitRefIdAnUnitType(@Param("unitRefIds") List<Long> unitRefIds,
                                                    @Param("unitType") UnitType unitType);

    /**
     * get role's member by role member id.
     *
     * @param roleIds the role's id
     * @return the role member info
     */
    List<RoleMemberDTO> selectByRoleIds(@Param("roleIds") List<Long> roleIds);
}
