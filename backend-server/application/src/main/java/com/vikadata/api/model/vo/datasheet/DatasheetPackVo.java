package com.vikadata.api.model.vo.datasheet;

import cn.hutool.json.JSONObject;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.vikadata.api.model.ro.datasheet.SnapshotMapRo;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.util.Map;

/**
 * <p>
 * Initialize data table operation return parameters
 * </p>
 */
@ApiModel("Return parameters of data table operation")
@Data
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Accessors(chain = true)
@Builder(toBuilder = true)
public class DatasheetPackVo implements Serializable {

    @ApiModelProperty(value = "Datasheet Snapshot Collection", position = 2)
    private SnapshotMapRo snapshot;

    @ApiModelProperty(value = "Basic information of digital meter", position = 3)
    private DataSheetInfoVo datasheet;

    @ApiModelProperty(value = "Data set of related number table", position = 4)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private JSONObject foreignDatasheetMap;

    @ApiModelProperty(value = "Organization Unit Map", position = 5)
    private Map unitMap;
}
