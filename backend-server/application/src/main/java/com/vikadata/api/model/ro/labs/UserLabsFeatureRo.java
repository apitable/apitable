package com.vikadata.api.model.ro.labs;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("Laboratory function setting request object")
public class UserLabsFeatureRo {

    @ApiModelProperty(value = "Space ID, if left blank, identify the user level function", dataType = "java.lang.String", example = "spc6e2CeZLBFN", position = 1)
    private String spaceId;

    @ApiModelProperty(value = "Unique identification of the laboratory function to be operated", dataType = "java.lang.String", example = "render_prompt", position = 2)
    private String key;

    @ApiModelProperty(value = "Whether to open", dataType = "java.lang.Boolean", example = "true", position = 3)
    private Boolean isEnabled;
}
