package com.vikadata.api.workspace.ro;

import cn.hutool.json.JSONObject;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * DataSheet field request parameters
 * </p>
 */
@ApiModel("DataSheet field request parameters")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
public class FieldMapRo {

    @ApiModelProperty(value = "Field Custom Id", position = 2)
    private String id;

    @ApiModelProperty(value = "Field Name", position = 3)
    private String name;

    @ApiModelProperty(value = "Describe", position = 4)
    private String desc;

    @ApiModelProperty(value = "Field Type 1-Text「Text」2-Number「NUMBER」 3-Single choice 「SINGLESELECT」4-Multiple choice「MULTISELECT」 5-Date「DATETIME」 6-Enclosure「ATTACHMENT」 7-Relation「LINK」", position = 5)
    private Integer type;

    @ApiModelProperty(value = "Attribute", position = 6)
    private JSONObject property;

    @ApiModelProperty(value = "Set as required in the form", position = 7)
    private Boolean required;
}
