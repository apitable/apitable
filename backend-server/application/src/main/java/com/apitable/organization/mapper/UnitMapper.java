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

import com.apitable.organization.dto.UnitBaseInfoDTO;
import com.apitable.organization.entity.UnitEntity;
import com.apitable.organization.enums.UnitType;
import com.apitable.shared.util.ibatis.ExpandBaseMapper;
import java.util.Collection;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 * Unit Mapper.
 */
public interface UnitMapper extends ExpandBaseMapper<UnitEntity> {

    /**
     * the amount of unit exist in the space.
     *
     * @param spaceId space id
     * @param unitIds unit ids
     * @return the amount of unit
     */
    Integer selectCountBySpaceIdAndIds(@Param("spaceId") String spaceId,
                                       @Param("unitIds") List<Long> unitIds);

    /**
     * insert batch.
     *
     * @param entities units
     * @return affected rows
     */
    int insertBatch(@Param("entities") List<UnitEntity> entities);

    /**
     * get id.
     *
     * @param refId ref id
     * @return unit id
     */
    Long selectUnitIdByRefId(@Param("refId") Long refId);

    /**
     * get unit_ref_id.
     *
     * @param unitId unit id
     * @return unit's ref id
     */
    Long selectRefIdById(@Param("unitId") Long unitId);

    /**
     * get by unit_ref_id.
     *
     * @param refId ref id
     * @return UnitEntity
     */
    UnitEntity selectByRefId(@Param("refId") Long refId);

    /**
     * get id by space id.
     *
     * @param spaceId space id
     * @return unit ids
     */
    List<Long> selectIdBySpaceId(@Param("spaceId") String spaceId);

    /**
     * query the unit which no deleted in the space.
     *
     * @param refIds ref ids
     * @return unit ids
     */
    List<Long> selectIdsByRefIds(@Param("refIds") Collection<Long> refIds);

    /**
     * get unit ref id list.
     *
     * @param unitIds unit ids
     * @return unit's ref id
     */
    List<Long> selectRefIdsByUnitIds(@Param("unitIds") Collection<Long> unitIds);

    /**
     * get id.
     *
     * @param spaceId space id
     * @param refId   ref id
     * @return unit id
     */
    Long selectBySpaceIdAndRefId(@Param("spaceId") String spaceId, @Param("refId") Long refId);

    /**
     * delete by space id and ids.
     *
     * @param spaceId space id
     * @param ids     unit ids
     * @return affected rows
     */
    int deleteBySpaceIdAndId(@Param("spaceId") String spaceId, @Param("ids") List<Long> ids);

    /**
     * logically delete an organizational unit.
     *
     * @param unitRefIds unit ref ids
     * @return affected rows
     */
    int deleteByUnitRefIds(@Param("list") List<Long> unitRefIds);

    /**
     * batch restore deleted units.
     *
     * @param ids unit ids
     * @return affected rows
     */
    int batchRestoreByIds(@Param("ids") Collection<Long> ids);

    /**
     * get by uint ref id list.
     *
     * @param refIds ref ids
     * @return UnitEntities
     */
    List<UnitEntity> selectByRefIds(@Param("refIds") Collection<Long> refIds);

    /**
     * get by id list.
     *
     * @param unitIds unit ids
     * @return UnitEntities
     */
    List<UnitEntity> selectByUnitIds(@Param("unitIds") Collection<Long> unitIds);

    /**
     * true to delete.
     *
     * @param refId ref id
     * @return affected rows
     */
    int deleteActualByRefId(@Param("refId") Long refId);

    /**
     * batch update.
     *
     * @param spaceId   space id
     * @param refIds    ref ids
     * @param unitType  unit type
     * @param isDeleted isDeleted
     * @return affected rows
     */
    Integer batchUpdateIsDeletedBySpaceIdAndRefId(@Param("spaceId") String spaceId,
                                                  @Param("refIds") List<Long> refIds,
                                                  @Param("unitType") UnitType unitType,
                                                  @Param("isDeleted") Boolean isDeleted);

    /**
     * get unit_ref_id.
     *
     * @param unitId   unit show id
     * @param spaceId  space id
     * @param unitType unit type
     * @return unitRefId
     */
    Long selectUnitRefIdByUnitIdAndSpaceIdAndUnitType(@Param("unitId") String unitId,
                                                      @Param("spaceId") String spaceId,
                                                      @Param("unitType") UnitType unitType);

    /**
     * query unit base info.
     *
     * @param unitRefIds unit ref id list
     * @return list of UnitBaseInfoDTO
     */
    List<UnitBaseInfoDTO> selectByUnitRefIds(@Param("unitRefIds") List<Long> unitRefIds);

    /**
     * query unit base info.
     *
     * @param unitIds  unit_id list
     * @param spaceId  space id
     * @param unitType unit type
     * @return list of UnitBaseInfoDTO
     */
    List<UnitBaseInfoDTO> selectBySpaceIdAndUnitTypeAndUnitIds(@Param("spaceId") String spaceId,
                                                               @Param("unitType") UnitType unitType,
                                                               @Param("unitIds")
                                                               List<String> unitIds);

}
