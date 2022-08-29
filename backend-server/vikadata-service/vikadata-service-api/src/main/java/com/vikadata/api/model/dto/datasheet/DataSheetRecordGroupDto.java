package com.vikadata.api.model.dto.datasheet;

import com.vikadata.api.model.vo.datasheet.DatasheetRecordVo;
import lombok.Data;

import java.util.List;

/**
 * <p>
 * 数表记录dto
 * </p>
 *
 * @author Chambers
 * @date 2020/4/30
 */
@Data
public class DataSheetRecordGroupDto {

    /**
     * 数表ID
     */
    private String dstId;

    /**
     * 记录ID、数据列表
     */
    private List<DatasheetRecordVo> recordVoList;
}
