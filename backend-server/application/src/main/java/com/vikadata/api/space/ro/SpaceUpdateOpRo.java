package com.vikadata.api.space.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Size;

/**
 * Space Edit Request Parameters
 */
@ApiModel("Space Edit Request Parameters")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class SpaceUpdateOpRo {

    @ApiModelProperty(value = "Name", example = "This is a new space name", position = 1)
    @Size(max = 100, message = "The space name must be 2-100 characters in length")
    private String name;

    @ApiModelProperty(value = "Icon", example = "https://...", position = 2)
    private String logo;
}
