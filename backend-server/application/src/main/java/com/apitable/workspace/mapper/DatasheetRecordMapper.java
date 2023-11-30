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

package com.apitable.workspace.mapper;

import com.apitable.workspace.dto.DataSheetRecordDTO;
import com.apitable.workspace.dto.DataSheetRecordGroupDTO;
import com.apitable.workspace.entity.DatasheetRecordEntity;
import com.apitable.workspace.vo.DatasheetRecordVo;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import org.apache.ibatis.annotations.Param;

/**
 * datasheet record mapper.
 */
public interface DatasheetRecordMapper extends BaseMapper<DatasheetRecordEntity> {

    /**
     * query by datasheet id.
     *
     * @param dstId datasheet id
     * @return DatasheetRecordVos
     */
    List<DatasheetRecordVo> selectListByDstId(@Param("dstId") String dstId);

    /**
     * query by datasheet id and record id.
     *
     * @param dstId datasheet id
     * @param ids   record id
     * @return records
     */
    List<DatasheetRecordVo> selectListByIds(@Param("dstId") String dstId,
                                            @Param("recordList") Set<String> ids);

    /**
     * query count by space id.
     *
     * @param spaceId space id
     * @return the records' total amount in the space
     */
    Long countBySpaceId(@Param("spaceId") String spaceId);

    /**
     * query count by datasheet id.
     *
     * @param dstId datasheet id
     * @return the records' total amount in the datasheet
     */
    Integer countByDstId(@Param("dstId") String dstId);

    /**
     * insert batch.
     *
     * @param entities records
     * @return affected rows
     */
    int insertBatch(@Param("entities") List<DatasheetRecordEntity> entities);

    /**
     * it can query deleted record
     * Scenario: used to restore record data after deleting records.
     *
     * @param dstId    datasheet id
     * @param recordId record id
     * @return DatasheetRecordEntity
     */
    DatasheetRecordEntity selectByConditionAndDeleted(@Param("dstId") String dstId,
                                                      @Param("recordId") String recordId);

    /**
     * query record by datasheet id and record id.
     *
     * @param dstId    datasheet id
     * @param recordId record id
     * @return DatasheetRecordEntity
     */
    List<DatasheetRecordVo> selectRecordVoByConditions(@Param("dstId") String dstId,
                                                       @Param("recordId") String recordId);

    /**
     * Update a single table record and support that pass in the is_deleted parameter to restore data.
     *
     * @param userId user id
     * @param record record
     * @return boolean
     */
    boolean updateByConditions(@Param("userId") Long userId,
                               @Param("record") DatasheetRecordEntity record);

    /**
     * query count by datasheet id.
     *
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

    /**
     * get archived record ids.
     *
     * @param dstId datasheet id
     * @return archived record ids
     */
    Set<String> selectArchivedRecordIdsByDstId(@Param("dstId") String dstId);
}
