package com.vikadata.api.model.vo.datasheet;

import cn.hutool.json.JSONObject;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;


/**
 * <p>
 * 数表与N条记录RecordMap返回结果值
 * </p>
 *
 * @author Benson Cheung
 * @date 2020/03/10 11:36
 */
@ApiModel("数表与N条记录RecordMap返回结果值")
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class DatasheetRecordPackVo {

	@ApiModelProperty(value = "数表基本信息", position = 1)
	DataSheetInfoVo datasheet;

    @ApiModelProperty(value = "N条记录recordMap集合", position = 2)
    JSONObject recordMap;

}
