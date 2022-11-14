package com.vikadata.api.workspace.ro;

import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

/**
 * <p>
 * DataSheet meta set parameter
 * </p>
 */
@ApiModel("DataSheet meta set parameter")
@Data
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder(toBuilder = true)
public class MetaMapRo {

    @ApiModelProperty(value = "DataSheet field set", position = 2)
    private JSONObject fieldMap;

    @ApiModelProperty(value = "View array（Save viewId）", position = 3)
    private JSONArray views;

    @ApiModelProperty(value = "Component panel", position = 4)
    private JSONArray widgetPanels;
}
