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

import com.apitable.organization.dto.UnitInfoDTO;
import com.apitable.organization.entity.UnitEntity;
import com.apitable.organization.enums.UnitType;
import com.apitable.organization.vo.UnitInfoVo;
import com.baomidou.mybatisplus.extension.service.IService;
import java.util.Collection;
import java.util.List;

public interface IUnitService extends IService<UnitEntity> {

    /**
     * @param refId unit's ref id
     * @return unitId
     */
    Long getUnitIdByRefId(Long refId);

    /**
     * @param refIds unit's ref ids
     * @return unit ids
     */
    List<Long> getUnitIdsByRefIds(Collection<Long> refIds);

    /**
     * @param refIds unit's ref ids
     * @return units
     */
    List<UnitEntity> getByRefIds(Collection<Long> refIds);

    /**
     * check if the unit is in space
     *
     * @param spaceId space id
     * @param unitIds unit ids
     */
    void checkInSpace(String spaceId, List<Long> unitIds);

    /**
     * @param spaceId space id
     * @param unitType unit type
     * @param unitRefId unit's ref id
     * @return unit id
     */
    Long create(String spaceId, UnitType unitType, Long unitRefId);

    /**
     * @param unitEntities units
     * @return yes no create successfully
     */
    boolean createBatch(List<UnitEntity> unitEntities);

    /**
     * batch recovery unit
     *
     * @param spaceId space id
     * @param memberIds member ids
     */
    void restoreMemberUnit(String spaceId, Collection<Long> memberIds);

    /**
     * @param teamId team id
     */
    void removeByTeamId(Long teamId);

    /**
     * @param memberIds member ids
     */
    void removeByMemberId(List<Long> memberIds);

    /**
     * @param spaceId space id
     * @param unitIds unit ids
     * @return UnitInfoVo List
     */
    List<UnitInfoVo> getUnitInfoList(String spaceId, List<Long> unitIds);

    /**
     * get the unit's ref members.
     *
     * @param unitIds unit ids
     * @return MemberIds
     */
    List<Long> getMembersIdByUnitIds(Collection<Long> unitIds);

    /**
     * @param spaceId space id
     * @param refIds unit's ref ids
     * @param unitType unit type
     * @param isDeleted isDeleted
     */
    void batchUpdateIsDeletedBySpaceIdAndRefId(String spaceId, List<Long> refIds, UnitType unitType,
        Boolean isDeleted);

    /**
     * @param unitIds unit ids
     * @return UnitInfoDTO
     */
    List<UnitInfoDTO> getUnitInfoDTOByUnitIds(List<Long> unitIds);

    /**
     * gets all the user ids associated with the units
     *
     * @param unitIds unit ids
     * @return userIds
     */
    List<Long> getRelUserIdsByUnitIds(List<Long> unitIds);

    /**
     *  Delete the unit by team id / role id / member id
     *
     * @param refId unit's ref id
     */
    void removeByRefId(Long refId);

    /**
     * get unit entity by refs' id
     *
     * @param refIds unit's ref ids
     * @return the unit entities
     */
    List<UnitEntity> getUnitEntitiesByUnitRefIds(List<Long> refIds);
}
