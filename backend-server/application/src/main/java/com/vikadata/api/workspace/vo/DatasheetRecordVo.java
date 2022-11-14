package com.vikadata.api.workspace.vo;

import cn.hutool.json.JSONObject;
import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;


/**
 * <p>
 * Data Table Record Return Parameter
 * </p>
 */
@ApiModel("Data Table Record Return Parameter")
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class DatasheetRecordVo {

    @ApiModelProperty(value = "Record ID", position = 1)
    private String id;

    @ApiModelProperty(value = "Data recorded in one row (corresponding to each field)", position = 3)
    private JSONObject data;

    @ApiModelProperty(value = "The historical version number sorted is the revision of the original operation, and the array subscript is the revision of the current record", position = 4)
    private int[] revisionHistory;

    @ApiModelProperty(value = "Version No", position = 6)
    private Long revision;

    @ApiModelProperty(value = "recordMeta", hidden = true)
    @JsonIgnore
    private String recordMeta;
}
