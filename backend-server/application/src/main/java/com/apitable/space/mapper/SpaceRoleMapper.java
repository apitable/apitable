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

import com.apitable.space.entity.SpaceRoleEntity;
import com.apitable.space.vo.SpaceRoleVo;
import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 * space role mapper.
 */
public interface SpaceRoleMapper extends BaseMapper<SpaceRoleEntity> {

    /**
     * query page by space id.
     *
     * @param page    page object
     * @param spaceId space id
     * @return space role page
     */
    @InterceptorIgnore(illegalSql = "true")
    IPage<SpaceRoleVo> selectSpaceRolePage(IPage<SpaceRoleVo> page,
                                           @Param("spaceId") String spaceId);

    /**
     * delete a role based on the role code.
     *
     * @param roleCode role code
     * @return affected rows
     */
    int deleteByRoleCode(@Param("roleCode") String roleCode);

    /**
     * Query the resource code set corresponding to a role.
     *
     * @param id id
     * @return resource codes
     */
    List<String> selectResourceCodesById(@Param("id") Long id);

    /**
     * batch delete by role codes.
     *
     * @param roleCodes role codes
     * @return affected rows
     */
    int batchDeleteByRoleCode(@Param("roleCodes") List<String> roleCodes);

    /**
     * query member's resource codes in space.
     *
     * @param spaceId  space id
     * @param memberId member id
     * @return resource codes
     */
    List<String> selectResourceCodesBySpaceIdAndMemberId(@Param("spaceId") String spaceId,
                                                         @Param("memberId") Long memberId);

}
