package com.vikadata.api.organization.ro;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 *    add role request parameter
 * </p>
 *
 * @author wuyitao
 */
@Data
@ApiModel("add role request")
public class CreateRoleRo {

    @NotBlank
    @Size(min = 1, max = 100, message = "The role name cannot exceed 100 characters")
    @ApiModelProperty(value = "role name", required = true, example = "Finance", position = 1)
    private String roleName;

}
