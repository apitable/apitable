package com.vikadata.api.workspace.ro;

import cn.hutool.json.JSONObject;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

/**
 * <p>
 * DataSheet record request parameters
 * </p>
 */
@ApiModel("DataSheet record request parameters")
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class RecordMapRo {

    @ApiModelProperty(value = "Record ID", position = 2)
    private String id;

    @ApiModelProperty(value = "Data recorded in one row (corresponding to each field)", position = 3)
    private JSONObject data;

    @ApiModelProperty(value = "The historical version number sorted is the revision of the original operation, and the array subscript is the revision of the current record", position = 5)
    private String revisionHistory;

    @ApiModelProperty(value = "Version No", position = 6)
    private Long revision;

    @JsonIgnore
    @TableLogic
    @ApiModelProperty(value = "Delete tag (0: No, 1: Yes)", position = 7)
    private Boolean isDeleted;

    @ApiModelProperty(value = "recordMeta fieldUpdatedMap", position = 8)
    private JSONObject fieldUpdatedMap;
}
