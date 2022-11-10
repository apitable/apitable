package com.vikadata.api.model.ro.organization;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * Add tag request parameters
 */
@Data
@ApiModel("Add tag request parameters")
public class CreateTagRo {

    @NotNull(message = "Space ID cannot be empty")
    @ApiModelProperty(value = "Space unique ID", example = "r4Arzo4YydiwsgAV", required = true, position = 1)
    private String spaceId;

    @NotBlank
    @Size(min = 1, max = 100, message = "Limit 1 to 100 characters and input special characters")
    @ApiModelProperty(value = "Label Name", dataType = "string", example = "New label", required = true, position = 2)
    private String tagName;
}
