package com.vikadata.scheduler.space.mapper.workspace;

import java.util.Collection;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.vikadata.scheduler.space.model.DataSheetRecordDto;

/**
 * <p>
 * Datasheet Record Mapper
 * </p>
 */
public interface DatasheetRecordMapper {

    /**
     * Get datasheet id and data
     *
     * @param nodeIds node id list
     * @return DataSheetRecordDto List
     */
    List<DataSheetRecordDto> selectDtoByNodeIds(@Param("nodeIds") Collection<String> nodeIds);
}
