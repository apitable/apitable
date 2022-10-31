package com.vikadata.api.modular.organization.service;

import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.enums.organization.UnitType;
import com.vikadata.api.model.vo.organization.UnitInfoVo;
import com.vikadata.api.modular.organization.model.UnitInfoDTO;
import com.vikadata.entity.UnitEntity;

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
     * @param teamIds team ids
     */
    void batchRemoveByTeamId(List<Long> teamIds);

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
     * @return boolean
     */
    boolean batchUpdateIsDeletedBySpaceIdAndRefId(String spaceId, List<Long> refIds, UnitType unitType, Boolean isDeleted);

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
