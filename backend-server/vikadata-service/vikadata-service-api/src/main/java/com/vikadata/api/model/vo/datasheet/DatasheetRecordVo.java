package com.vikadata.api.model.vo.datasheet;

import cn.hutool.json.JSONObject;
import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;


/**
 * <p>
 * 数表记录Record返回参数
 * </p>
 *
 * @author Benson Cheung
 * @date 2019/09/20 11:36
 */
@ApiModel("数表记录Record返回参数")
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class DatasheetRecordVo {

    @ApiModelProperty(value = "记录ID", position = 1)
    private String id;

    @ApiModelProperty(value = "一行记录的数据（对应每个字段Field）", position = 3)
    private JSONObject data;

    @ApiModelProperty(value = "按排序的历史版本号，是原 Operation 的revision，数组下标是当前 record 的 revision", position = 4)
    private int[] revisionHistory;

    @ApiModelProperty(value = "版本号", position = 6)
    private Long revision;

    @ApiModelProperty(value = "recordMeta", hidden = true)
    @JsonIgnore
    private String recordMeta;
}
