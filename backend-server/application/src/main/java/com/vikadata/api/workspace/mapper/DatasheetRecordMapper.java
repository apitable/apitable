package com.vikadata.api.workspace.mapper;

import java.util.Collection;
import java.util.List;
import java.util.Set;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.workspace.dto.DataSheetRecordDTO;
import com.vikadata.api.workspace.dto.DataSheetRecordGroupDTO;
import com.vikadata.api.workspace.vo.DatasheetRecordVo;
import com.vikadata.entity.DatasheetRecordEntity;

public interface DatasheetRecordMapper extends BaseMapper<DatasheetRecordEntity> {

    /**
     * @param dstId datasheet id
     * @return DatasheetRecordVos
     */
    List<DatasheetRecordVo> selectListByDstId(@Param("dstId") String dstId);

    /**
     * @param dstId datasheet id
     * @param ids   record id
     * @return records
     */
    List<DatasheetRecordVo> selectListByIds(@Param("dstId") String dstId, @Param("recordList") Set<String> ids);

    /**
     * @param spaceId space id
     * @return the records' total amount in the space
     */
    Long countBySpaceId(@Param("spaceId") String spaceId);

    /**
     * @param dstId datasheet id
     * @return the records' total amount in the datasheet
     */
    Integer countByDstId(@Param("dstId") String dstId);

    /**
     * @param entities records
     * @return affected rows
     */
    int insertBatch(@Param("entities") List<DatasheetRecordEntity> entities);

    /**
     * it can query deleted record
     * Scenario: used to restore record data after deleting records.
     *
     * @param dstId datasheet id
     * @param recordId record id
     * @return DatasheetRecordEntity
     */
    DatasheetRecordEntity selectByConditionAndDeleted(@Param("dstId") String dstId, @Param("recordId") String recordId);

    /**
     * @param dstId datasheet id
     * @param recordId record id
     * @return DatasheetRecordEntity
     */
    List<DatasheetRecordVo> selectRecordVoByConditions(@Param("dstId") String dstId, @Param("recordId") String recordId);

    /**
     * Update a single table record and support that pass in the is_deleted parameter to restore data.
     *
     * @param userId user id
     * @param record record
     * @return boolean
     */
    boolean updateByConditions(@Param("userId") Long userId, @Param("record") DatasheetRecordEntity record);

    /**
     * @param dstId datasheet id
     * @return datasheet records amount
     */
    Integer selectCountByDstId(@Param("dstId") String dstId);

    /**
     * get datasheet records.
     *
     * @param dstId datasheet id
     * @return DataSheetRecordDto
     */
    List<DataSheetRecordDTO> selectDtoByDstId(@Param("dstId") String dstId);

    /**
     * get datasheet records.
     *
     * @param dstIds datasheet ids
     * @return DataSheetRecordDtos
     */
    List<DataSheetRecordDTO> selectDtoByDstIds(@Param("list") Collection<String> dstIds);

    /**
     * get datasheet records.
     *
     * @param dstIds datasheet ids
     * @return DataSheetRecordGroupDto
     */
    List<DataSheetRecordGroupDTO> selectGroupDtoByDstIds(@Param("list") Collection<String> dstIds);
}
