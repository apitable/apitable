package com.vikadata.api.organization.mapper;

import java.util.Collection;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.vikadata.api.organization.enums.UnitType;
import com.vikadata.api.shared.util.ibatis.ExpandBaseMapper;
import com.vikadata.api.user.entity.UnitEntity;

public interface UnitMapper extends ExpandBaseMapper<UnitEntity> {

    /**
     * the amount of unit exist in the space.
     *
     * @param spaceId space id
     * @param unitIds unit ids
     * @return the amount of unit
     */
    Integer selectCountBySpaceIdAndIds(@Param("spaceId") String spaceId, @Param("unitIds") List<Long> unitIds);

    /**
     * @param entities units
     * @return affected rows
     */
    int insertBatch(@Param("entities") List<UnitEntity> entities);

    /**
     * @param refId ref id
     * @return unit id
     */
    Long selectUnitIdByRefId(@Param("refId") Long refId);

    /**
     * @param unitId unit id
     * @return unit's ref id
     */
    Long selectRefIdById(@Param("unitId") Long unitId);

    /**
     * @param refId ref id
     * @return UnitEntity
     */
    UnitEntity selectByRefId(@Param("refId") Long refId);

    /**
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
     * @param unitIds unit ids
     * @return unit's ref id
     */
    List<Long> selectRefIdsByUnitIds(@Param("unitIds") Collection<Long> unitIds);

    /**
     * @param spaceId space id
     * @param refId ref id
     * @return unit id
     */
    Long selectBySpaceIdAndRefId(@Param("spaceId") String spaceId, @Param("refId") Long refId);

    /**
     * @param spaceId space id
     * @param ids     unit ids
     * @return affected rows
     */
    int deleteBySpaceIdAndId(@Param("spaceId") String spaceId, @Param("ids") List<Long> ids);

    /**
     * logically delete an organizational unit
     *
     * @param unitRefIds unit ref ids
     * @return affected rows
     */
    int deleteByUnitRefIds(@Param("list") List<Long> unitRefIds);

    /**
     * batch restore deleted units
     *
     * @param ids unit ids
     * @return  affected rows
     */
    int batchRestoreByIds(@Param("ids") Collection<Long> ids);

    /**
     * @param refIds ref ids
     * @return UnitEntities
     */
    List<UnitEntity> selectByRefIds(@Param("refIds") Collection<Long> refIds);

    /**
     * @param unitIds unit ids
     * @return UnitEntities
     */
    List<UnitEntity> selectByUnitIds(@Param("unitIds") Collection<Long> unitIds);

    /**
     * true to delete
     *
     * @param refId ref id
     * @return affected rows
     */
    int deleteActualByRefId(@Param("refId") Long refId);

    /**
     * @param spaceId space id
     * @param refIds ref ids
     * @param unitType unit type
     * @param isDeleted isDeleted
     * @return affected rows
     */
    Integer batchUpdateIsDeletedBySpaceIdAndRefId(@Param("spaceId") String spaceId, @Param("refIds") List<Long> refIds,
            @Param("unitType") UnitType unitType, @Param("isDeleted") Boolean isDeleted);
}
