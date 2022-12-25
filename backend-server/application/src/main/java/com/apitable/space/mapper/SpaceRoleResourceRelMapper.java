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

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.apitable.space.entity.SpaceRoleResourceRelEntity;

public interface SpaceRoleResourceRelMapper extends BaseMapper<SpaceRoleResourceRelEntity> {

    /**
     * @param entities rel
     * @return affected rows
     */
    int insertBatch(@Param("entities") List<SpaceRoleResourceRelEntity> entities);

    /**
     * @param roleCode role code
     * @return affected rows
     */
    int deleteByRoleCode(@Param("roleCode") String roleCode);

    /**
     * @param roleCode      role code
     * @param resourceCodes resource codes
     * @return affected rows
     */
    int deleteByRoleCodeAndResourceCodes(@Param("roleCode") String roleCode, @Param("resourceCodes") List<String> resourceCodes);

    /**
     * @param resourceCodes resource codes
     * @return RoleCode
     */
    List<String> selectRoleCodeByResourceCodes(@Param("resourceCodes") List<String> resourceCodes);

    /**
     * @param roleCodes role codes
     * @return affected rows
     */
    int batchDeleteByRoleCodes(@Param("roleCodes") List<String> roleCodes);

    /**
     * @param roleCode role code
     * @return ResourceCodes
     */
    List<String> selectResourceCodesByRoleCode(@Param("roleCode") String roleCode);
}
