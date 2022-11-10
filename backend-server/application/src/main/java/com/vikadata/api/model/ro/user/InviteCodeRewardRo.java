package com.vikadata.api.model.ro.user;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p> 
 * Invitation code reward request parameters
 * </p>
 */
@Data
@ApiModel("Invitation code reward request parameters")
public class InviteCodeRewardRo {

    @NotBlank(message = "The invitation code cannot be empty")
    @Size(min = 8, max = 8, message = "The invitation code can only be 8 digits long")
    @ApiModelProperty(value = "Invitation code", example = "12345678", position = 1, required = true)
    private String inviteCode;
}
