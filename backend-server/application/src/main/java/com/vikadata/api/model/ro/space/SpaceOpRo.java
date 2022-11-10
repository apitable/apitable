package com.vikadata.api.model.ro.space;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/**
 * Space request parameters
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("Space request parameters")
public class SpaceOpRo {

    @ApiModelProperty(value = "Name", example = "This is a space", position = 1, required = true)
    @NotBlank(message = "Name cannot be empty")
    @Size(min = 2, max = 100, message = "The space name must be 2-100 characters in length")
    private String name;

}
