package com.vikadata.api.modular.control.mapper;

import java.util.List;

import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.control.ControlType;
import com.vikadata.api.modular.control.model.ControlTypeDTO;
import com.vikadata.api.modular.control.model.ControlUnitDTO;
import com.vikadata.entity.ControlEntity;

/**
 * Permission control table mapper
 */
public interface ControlMapper extends BaseMapper<ControlEntity> {

    /**
     * Query entity according to control ID
     *
     * @param controlId Control unit ID
     * @return ControlEntity
     */
    ControlEntity selectByControlId(@Param("controlId") String controlId);

    /**
     * Batch query entities according to control IDs
     *
     * @param controlIds List of control unit IDs
     * @return ControlEntity List
     */
    List<ControlEntity> selectByControlIds(@Param("controlIds") List<String> controlIds);

    /**
     * Query the number of specified control units
     *
     * @param controlId Control unit ID
     * @return count
     */
    Integer selectCountByControlId(@Param("controlId") String controlId);

    /**
     * Query permission control unit ID
     *
     * @param prefix    Control unit ID prefix
     * @param type      Control unit type
     * @return Control unit ID
     */
    List<String> selectControlIdByControlIdPrefixAndType(@Param("prefix") String prefix, @Param("type") Integer type);

    /**
     * Query control unit ID
     *
     * @param controlIds Control unit ID set
     * @return Control unit ID
     */
    List<String> selectControlIdByControlIds(@Param("controlIds") List<String> controlIds);

    /**
     * Query permission control unit and organization unit information
     *
     * @param controlIds Control unit ID set
     * @return ControlUnitDTO
     */
    @InterceptorIgnore(illegalSql = "true")
    List<ControlUnitDTO> selectOwnerControlUnitDTO(@Param("controlIds") List<String> controlIds);

    /**
     * Query authority control unit and type DTO
     *
     * @param spaceId   Space ID
     * @return ControlTypeDTO
     */
    List<ControlTypeDTO> selectControlTypeDTO(@Param("spaceId") String spaceId);

    /**
     * Bulk Insert
     *
     * @param entities Entity Collection
     * @return Number of execution results
     */
    int insertBatch(@Param("entities") List<ControlEntity> entities);

    /**
     * Delete the specified control unit
     *
     * @param controlIds Control unit ID set
     * @return Number of execution results
     */
    int deleteByControlIds(@Param("userId") Long userId, @Param("controlIds") List<String> controlIds);

    /**
     * Query space control
     *
     * @param controlId Control unit ID
     * @param spaceId Space ID
     * @param controlType Permission Type
     * @return ControlEntity
     */
    ControlEntity selectDeletedByControlIdAndSpaceId(@Param("controlId") String controlId, @Param("spaceId") String spaceId,
            @Param("controlType") ControlType controlType);

    /**
     * Update deletion status
     *
     * @param userId Modify User ID
     * @param ids Primary key ID
     * @param isDeleted Deleted state
     * @return Integer
     */
    Integer updateIsDeletedByIds(@Param("ids") List<Long> ids, @Param("userId") Long userId, @Param("isDeleted") Boolean isDeleted);
}
