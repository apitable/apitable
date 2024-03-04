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

import com.apitable.organization.dto.RoleBaseInfoDto;
import com.apitable.organization.dto.UnitBaseInfoDTO;
import com.apitable.organization.dto.UnitInfoDTO;
import com.apitable.organization.dto.UnitMemberDTO;
import com.apitable.organization.dto.UnitTeamDTO;
import com.apitable.organization.entity.UnitEntity;
import com.apitable.organization.enums.UnitType;
import com.apitable.organization.vo.UnitInfoVo;
import com.apitable.organization.vo.UnitMemberInfoVo;
import com.apitable.organization.vo.UnitRoleInfoVo;
import com.apitable.organization.vo.UnitRoleMemberVo;
import com.apitable.organization.vo.UnitTeamInfoVo;
import com.apitable.shared.util.page.PageInfo;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import java.util.Collection;
import java.util.List;

/**
 * unit service interface.
 */
public interface IUnitService extends IService<UnitEntity> {

    /**
     * Get ref id.
     *
     * @param id table id
     * @return refId
     * @author Chambers
     */
    Long getUnitRefIdById(Long id);

    /**
     * get unit primary id by ref id.
     *
     * @param refId unit's ref id
     * @return unitId
     */
    Long getUnitIdByRefId(Long refId);

    /**
     * get unit primary id list by ref id list.
     *
     * @param refIds unit's ref ids
     * @return unit ids
     */
    List<Long> getUnitIdsByRefIds(Collection<Long> refIds);

    /**
     * get by ref id list.
     *
     * @param refIds unit's ref ids
     * @return units
     */
    List<UnitEntity> getByRefIds(Collection<Long> refIds);

    /**
     * check if the unit is in space.
     *
     * @param spaceId space id
     * @param unitIds unit ids
     */
    void checkInSpace(String spaceId, List<Long> unitIds);

    /**
     * create.
     *
     * @param spaceId   space id
     * @param unitType  unit type
     * @param unitRefId unit's ref id
     * @return unit id
     */
    UnitEntity create(String spaceId, UnitType unitType, Long unitRefId);

    /**
     * create batch.
     *
     * @param unitEntities units
     * @return yes no create successfully
     */
    boolean createBatch(List<UnitEntity> unitEntities);

    /**
     * batch recovery unit.
     *
     * @param spaceId   space id
     * @param memberIds member ids
     */
    void restoreMemberUnit(String spaceId, Collection<Long> memberIds);

    /**
     * delete by team id.
     *
     * @param teamId team id
     */
    void removeByTeamId(Long teamId);

    /**
     * delete by member id list.
     *
     * @param memberIds member ids
     */
    void removeByMemberId(List<Long> memberIds);

    /**
     * get unit info list.
     *
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
     * batch update.
     *
     * @param spaceId   space id
     * @param refIds    unit's ref ids
     * @param unitType  unit type
     * @param isDeleted isDeleted
     */
    void batchUpdateIsDeletedBySpaceIdAndRefId(String spaceId, List<Long> refIds, UnitType unitType,
                                               Boolean isDeleted);

    /**
     * get unit info.
     *
     * @param unitIds unit ids
     * @return UnitInfoDTO
     */
    List<UnitInfoDTO> getUnitInfoDTOByUnitIds(List<Long> unitIds);

    /**
     * gets all the user ids associated with the units.
     *
     * @param unitIds unit ids
     * @return userIds
     */
    List<Long> getRelUserIdsByUnitIds(List<Long> unitIds);

    /**
     * Delete the unit by team id / role id / member id.
     *
     * @param refId unit's ref id
     */
    void removeByRefId(Long refId);

    /**
     * get unit entity by refs' id.
     *
     * @param refIds unit's ref ids
     * @return the unit entities
     */
    List<UnitEntity> getUnitEntitiesByUnitRefIds(List<Long> refIds);

    /**
     * get unit ref id.
     *
     * @param unitId   unit show id
     * @param spaceId  space id
     * @param unitType unit type
     * @return Long
     */
    Long getUnitRefIdByUnitIdAndSpaceIdAndUnitType(String unitId, String spaceId,
                                                   UnitType unitType);

    /**
     * get unit ref id list.
     *
     * @param unitIds  unit show id list
     * @param spaceId  space id
     * @param unitType unit type
     * @return Long
     */
    List<UnitBaseInfoDTO> getUnitBaseInfoBySpaceIdAndUnitTypeAndUnitIds(String spaceId,
                                                                        UnitType unitType,
                                                                        List<String> unitIds);


    /**
     * get by ref id list.
     *
     * @param refIds ref id list
     * @return UnitBaseInfoDTO
     */
    List<UnitBaseInfoDTO> getUnitBaseInfoByRefIds(List<Long> refIds);

    /**
     * get unit team info.
     *
     * @param teamIds team id list
     * @return list of UnitTeamInfoVo
     */
    List<UnitTeamDTO> getUnitTeamBaseInfoByTeamIds(List<Long> teamIds);

    /**
     * get unit member info without teams and roles.
     *
     * @param memberIds member id list
     * @return list of UnitTeamInfoVo
     */
    List<UnitMemberDTO> getUnitMemberBaseInfoByMemberIds(List<Long> memberIds);


    /**
     * get unit member info without teams and roles.
     *
     * @param memberIds        member id list
     * @param includeSensitive weather return sensitive information
     * @return list of UnitMemberVo
     */
    List<UnitMemberInfoVo> getUnitMemberByMemberIds(List<Long> memberIds,
                                                    boolean includeSensitive);

    /**
     * get unit team info.
     *
     * @param teamIds team ids
     * @return UnitTeamInfoVo
     */
    List<UnitTeamInfoVo> getUnitTeamByTeamIds(List<Long> teamIds);

    /**
     * get unit role info.
     *
     * @param roleIds role ids
     * @return UnitRoleInfoVo
     */
    List<UnitRoleInfoVo> getUnitRoleByRoleIds(List<Long> roleIds);

    /**
     * get team page info.
     *
     * @param spaceId      space id
     * @param parentTeamId parent team id
     * @param page         page
     * @return UnitTeamInfoVo
     */
    PageInfo<UnitTeamInfoVo> getUnitSubTeamsWithPage(String spaceId, Long parentTeamId,
                                                     Page<Long> page);

    /**
     * get role page info.
     *
     * @param spaceId space id
     * @param page    page
     * @return UnitRoleInfoVo
     */
    PageInfo<UnitRoleInfoVo> getUnitRolesWithPage(String spaceId, Page<RoleBaseInfoDto> page);

    /**
     * get team page info.
     *
     * @param spaceId       space id
     * @param parentTeamId  parent team id
     * @param sensitiveData weather to return email and mobile
     * @param page          page
     * @return UnitTeamInfoVo
     */
    PageInfo<UnitMemberInfoVo> getMembersByTeamId(String spaceId, Long parentTeamId,
                                                  boolean sensitiveData, Page<Long> page);

    /**
     * get role members.
     *
     * @param spaceId       space id
     * @param roleId        role id
     * @param sensitiveData include member email or mobile
     * @return UnitRoleMemberVo
     */
    UnitRoleMemberVo getRoleMembers(String spaceId, Long roleId, Boolean sensitiveData);

    /**
     * check current member whether match unit.
     *
     * @param memberId current member id
     * @param unitId   unit id
     */
    void checkUnit(Long memberId, String unitId);

}
