package com.vikadata.api.enterprise.gm.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

/**
 * <p>
 * Request object for opening experimental internal test function
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("Request object for opening experimental internal test function")
public class GmApplyFeatureRo {

    @ApiModelProperty(value = "The space station ID of the experimental function to be enabled, optional, allowed to be empty", dataType = "java.lang.String", example = "spchhRu3xQqt9", position = 1)
    private String spaceId;

    @NotBlank(message = "Applicant user cannot be blank")
    @ApiModelProperty(value = "ID of the user who applies for opening the experimental function", dataType = "java.lang.String", required = true, example = "a83ec20f15c9459893d133c2c369eff6", position = 2)
    private String applyUserId;

    @NotBlank(message = "Laboratory function ID cannot be empty")
    @ApiModelProperty(value = "Unique identification of experimental function", dataType = "java.lang.String", required = true, example = "render_prompt|async_compute|robot|widget_center", position = 3)
    private String featureKey;

    @ApiModelProperty(value = "Whether to open", dataType = "java.lang.Boolean", required = true, example = "true", position = 4)
    private Boolean enable;
}
