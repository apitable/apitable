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

package com.apitable.space.mapper;

import com.apitable.shared.cache.bean.SpaceResourceDto;
import com.apitable.space.dto.SpaceGroupResourceDto;
import com.apitable.space.dto.SpaceMemberResourceDto;
import com.apitable.space.dto.SpaceMenuResourceDto;
import com.apitable.space.entity.SpaceResourceEntity;
import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 * space resource mapper.
 */
public interface SpaceResourceMapper extends BaseMapper<SpaceResourceEntity> {

    /**
     * query all space resources.
     *
     * @return all space resources
     */
    @InterceptorIgnore(illegalSql = "true")
    List<SpaceResourceDto> selectAllResource();

    /**
     * query all space resources by member id.
     *
     * @param memberId member id
     * @return space resources
     */
    @InterceptorIgnore(illegalSql = "true")
    List<SpaceResourceDto> selectResourceByMemberId(@Param("memberId") Long memberId);

    /**
     * Query the resource code amount that can be assigned.
     *
     * @param resourceCodes resource codes
     * @return amount resource code
     */
    Integer selectAssignableCountInResourceCode(@Param("resourceCodes") List<String> resourceCodes);

    /**
     * Query all resource groups that can be allocated.
     *
     * @return resource groups
     */
    @InterceptorIgnore(illegalSql = "true")
    List<SpaceGroupResourceDto> selectGroupResource();

    /**
     * query all menu resources.
     *
     * @return space menu resources
     */
    @InterceptorIgnore(illegalSql = "true")
    List<SpaceMenuResourceDto> selectMenuResource();

    /**
     * query resource code by group code.
     *
     * @param groupCodes group codes
     * @return resource codes
     */
    List<String> selectResourceCodesByGroupCode(@Param("groupCodes") List<String> groupCodes);

    /**
     * Query the resource code set corresponding to the role of a member.
     *
     * @param memberId member ids
     * @return resource codes
     */
    List<String> selectResourceCodesByMemberId(@Param("memberId") Long memberId);

    /**
     * Gets a collection of resource codes corresponding to a member and its role.
     *
     * @param memberIds member ids
     * @return space member resources
     */
    List<SpaceMemberResourceDto> selectMemberResource(@Param("list") List<Long> memberIds);
}
