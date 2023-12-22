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


import com.apitable.space.entity.SpaceRoleResourceRelEntity;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 * space role resource rel mapper.
 */
public interface SpaceRoleResourceRelMapper extends BaseMapper<SpaceRoleResourceRelEntity> {

    /**
     * insert batch.
     *
     * @param entities rel
     * @return affected rows
     */
    int insertBatch(@Param("entities") List<SpaceRoleResourceRelEntity> entities);

    /**
     * delete by role code.
     *
     * @param roleCode role code
     * @return affected rows
     */
    int deleteByRoleCode(@Param("roleCode") String roleCode);

    /**
     * delete by role code and resource codes.
     *
     * @param roleCode      role code
     * @param resourceCodes resource codes
     * @return affected rows
     */
    int deleteByRoleCodeAndResourceCodes(@Param("roleCode") String roleCode,
                                         @Param("resourceCodes") List<String> resourceCodes);

    /**
     * select role code by resource codes.
     *
     * @param resourceCodes resource codes
     * @return RoleCode
     */
    List<String> selectRoleCodeByResourceCodes(@Param("resourceCodes") List<String> resourceCodes);

    /**
     * batch delete by role codes.
     *
     * @param roleCodes role codes
     * @return affected rows
     */
    int batchDeleteByRoleCodes(@Param("roleCodes") List<String> roleCodes);

    /**
     * select resource codes by role code.
     *
     * @param roleCode role code
     * @return ResourceCodes
     */
    List<String> selectResourceCodesByRoleCode(@Param("roleCode") String roleCode);
}
