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

package com.apitable.control.mapper;

import com.apitable.control.entity.ControlEntity;
import com.apitable.control.infrastructure.ControlType;
import com.apitable.control.model.ControlTypeDTO;
import com.apitable.control.model.ControlUnitDTO;
import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 * Permission control table mapper.
 */
public interface ControlMapper extends BaseMapper<ControlEntity> {

    /**
     * Query space id.
     *
     * @param controlId Control Unit ID
     * @return spaceId
     * @author Chambers
     */
    String selectSpaceIdByControlId(@Param("controlId") String controlId);

    /**
     * Query entity according to control ID.
     *
     * @param controlId Control unit ID
     * @return ControlEntity
     */
    ControlEntity selectByControlId(@Param("controlId") String controlId);

    /**
     * Batch query entities according to control IDs.
     *
     * @param controlIds List of control unit IDs
     * @return ControlEntity List
     */
    List<ControlEntity> selectByControlIds(@Param("controlIds") List<String> controlIds);

    /**
     * Query the number of specified control units.
     *
     * @param controlId Control unit ID
     * @return count
     */
    Integer selectCountByControlId(@Param("controlId") String controlId);

    /**
     * Query permission control unit ID.
     *
     * @param prefix Control unit ID prefix
     * @param type   Control unit type
     * @return Control unit ID
     */
    List<String> selectControlIdByControlIdPrefixAndType(@Param("prefix") String prefix,
                                                         @Param("type") Integer type);

    /**
     * Query control unit ID.
     *
     * @param controlIds Control unit ID set
     * @return Control unit ID
     */
    List<String> selectControlIdByControlIds(@Param("controlIds") List<String> controlIds);

    /**
     * Query permission control unit and organization unit information.
     *
     * @param controlIds Control unit ID set
     * @return ControlUnitDTO
     */
    @InterceptorIgnore(illegalSql = "true")
    List<ControlUnitDTO> selectOwnerControlUnitDTO(@Param("controlIds") List<String> controlIds);

    /**
     * Query authority control unit and type DTO.
     *
     * @param spaceId Space ID
     * @return ControlTypeDTO
     */
    List<ControlTypeDTO> selectControlTypeDTO(@Param("spaceId") String spaceId);

    /**
     * Bulk Insert.
     *
     * @param entities Entity Collection
     * @return Number of execution results
     */
    int insertBatch(@Param("entities") List<ControlEntity> entities);

    /**
     * Delete the specified control unit.
     *
     * @param controlIds Control unit ID set
     * @return Number of execution results
     */
    int deleteByControlIds(@Param("userId") Long userId,
                           @Param("controlIds") List<String> controlIds);

    /**
     * Query space control.
     *
     * @param controlId   Control unit ID
     * @param spaceId     Space ID
     * @param controlType Permission Type
     * @return ControlEntity
     */
    ControlEntity selectDeletedByControlIdAndSpaceId(@Param("controlId") String controlId,
                                                     @Param("spaceId") String spaceId,
                                                     @Param("controlType") ControlType controlType);

    /**
     * Update deletion status.
     *
     * @param userId    Modify User ID
     * @param ids       Primary key ID
     * @param isDeleted Deleted state
     * @return Integer
     */
    Integer updateIsDeletedByIds(@Param("ids") List<Long> ids, @Param("userId") Long userId,
                                 @Param("isDeleted") Boolean isDeleted);
}
