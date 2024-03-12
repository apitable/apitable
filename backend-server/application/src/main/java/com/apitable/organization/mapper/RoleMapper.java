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

import com.apitable.organization.dto.RoleBaseInfoDto;
import com.apitable.organization.dto.RoleInfoDTO;
import com.apitable.organization.entity.RoleEntity;
import com.apitable.shared.util.ibatis.ExpandBaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 * role mapper.
 */
public interface RoleMapper extends ExpandBaseMapper<RoleEntity> {

    /**
     * count rows by space's id and role's name.
     *
     * @param spaceId  the space's id
     * @param roleName the role's name
     * @return number of rows
     */
    Integer selectCountBySpaceIdAndRoleName(@Param("spaceId") String spaceId,
                                            @Param("roleName") String roleName);

    /**
     * get the space's max sequence of roles.
     *
     * @param spaceId the space's id
     * @return sequence
     */
    Integer selectMaxSequenceBySpaceId(@Param("spaceId") String spaceId);

    /**
     * count rows by row's id and space's id.
     *
     * @param id      id
     * @param spaceId the space's id
     * @return number of rows
     */
    Integer selectCountByIdAndSpaceId(@Param("id") Long id, @Param("spaceId") String spaceId);

    /**
     * count rows by space's id.
     *
     * @param spaceId the space's id
     * @return number of rows
     */
    Integer selectCountBySpaceId(@Param("spaceId") String spaceId);

    /**
     * query the space's roles list.
     *
     * @param spaceId the space's id
     * @return role info
     */
    List<RoleInfoDTO> selectBySpaceId(@Param("spaceId") String spaceId);

    /**
     * get the role's name.
     *
     * @param id ID
     * @return the role's name
     */
    String selectRoleNameById(@Param("id") Long id);

    /**
     * query roles list.
     *
     * @param ids rows' id
     * @return role info
     */
    List<RoleInfoDTO> selectRoleInfoDtoByIds(@Param("ids") List<Long> ids);

    /**
     * fuzzy search role's id by keyword.
     *
     * @param spaceId the space's id
     * @param keyword fuzzy search's keyword
     * @return the search result of role.
     */
    List<Long> selectIdsBySpaceIdAndLikeRoleName(@Param("spaceId") String spaceId,
                                                 @Param("keyword") String keyword);

    /**
     * get the roles' base information by ids.
     *
     * @param ids the roles' id
     * @return the roles' base information.
     */
    List<RoleBaseInfoDto> selectRoleBaseInfoDtoByIds(@Param("ids") List<Long> ids);

    /**
     * query role info by ids and space id.
     *
     * @param ids     the rows' id
     * @param spaceId the space's id
     * @return role info
     */
    List<RoleInfoDTO> selectRoleInfoDtoByIdsAndSpaceId(@Param("ids") List<Long> ids,
                                                       @Param("spaceId") String spaceId);

    /**
     * Query page of the directly role Id.
     *
     * @param spaceId space id
     * @return page of sub role ids
     */
    IPage<RoleBaseInfoDto> selectBySpaceIdAndPage(Page<RoleBaseInfoDto> page,
                                                  @Param("spaceId") String spaceId);

    /**
     * count rows by space's id and role's name.
     *
     * @param spaceId  the space's id
     * @param roleId   the current role's id
     * @param roleName the role's name
     * @return number of rows
     */
    Integer selectCountBySpaceIdAndRoleNameWithExceptId(@Param("spaceId") String spaceId,
                                                        @Param("roleId") Long roleId,
                                                        @Param("roleName") String roleName);

}
