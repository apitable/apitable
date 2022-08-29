package com.vikadata.api.model.vo.datasheet;

import cn.hutool.json.JSONObject;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;


/**
 * <p>
 * 数表多条记录RecordMap返回结果值
 * </p>
 *
 * @author Benson Cheung
 * @date 2019/09/20 11:36
 */
@ApiModel("数表多条记录RecordMap返回结果值")
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class DatasheetRecordMapVo {

    @ApiModelProperty(value = "数表ID", hidden = true)
    String dstId;

    @ApiModelProperty(value = "记录recordMap集合", position = 1)
    JSONObject recordMap;

}
