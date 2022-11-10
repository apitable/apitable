package com.vikadata.api.model.vo.datasheet;

import cn.hutool.json.JSONObject;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;


/**
 * <p>
 * Data table and N records Record Map returns the result value
 * </p>
 */
@ApiModel("Data table and N records Record Map returns the result value")
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class DatasheetRecordPackVo {

	@ApiModelProperty(value = "Basic information of datasheet", position = 1)
	DataSheetInfoVo datasheet;

    @ApiModelProperty(value = "Record Map Set of N Records", position = 2)
    JSONObject recordMap;

}
